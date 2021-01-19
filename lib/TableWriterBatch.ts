import { v4 as uuidv4 } from 'uuid'
import { TableWriter, TableWriterMessage } from './TableWriter'
import type { BlockBlobService } from './BlockBlobService'
import type { QueueBlobMessage } from './Interfaces'

/** Class for managing one or more TableWriter instances to round-trip into Azure Table Storage.
 *
 * ```javascript
 * const { TableWriterBatch } = require('@nhsllc/azure-utils')
 *
 * module.exports = async function example (context) {
 *   const data = [] // Perhaps some data to generate rows for different table/partition keys
 *   const tableWriterBatch = new TableWriterBatch()
 *
 *   for (const item of data) {
 *     const tableRows = [] // Fill up this array with table rows of the same partition key
 *     // Do some work generating rows
 *
 *     tableWriterBatch.addTableWriter({
 *       tableName: 'ExampleTable',
 *       tableRows
 *     })
 *   }
 *
 *   return {
 *     tableBatcher: await tableWriterBatch.toQueueMessages(process.env.STORAGE_CONNECTION)
 *   }
 * }
 * ```
 * @category AzureUtility
 */
export class TableWriterBatch {
  /** Class for managing one or more TableWriter instances to round-trip into Azure Table Storage. */
  constructor (batchMessage: Partial<TableWriterBatch> = {}) {
    this.connection = batchMessage.connection
    this.maxWriterSize = batchMessage.maxWriterSize
    this._sizeLimitCache = new Map()
    this._tableWriterMap = new Map()

    if (Array.isArray(batchMessage.tableWriters)) {
      for (const tableWriter of batchMessage.tableWriters) {
        this.addTableWriter(tableWriter)
      }
    }
  }

  /** An Azure connection string. */
  connection?: string
  /** Limit the size of table writer instances. */
  maxWriterSize?: number
  private _tableWriterMap: Map<string, TableWriter>
  private _sizeLimitCache: Map<string, string>

  get tableWriters (): Partial<TableWriter>[] {
    return Array.from(this._tableWriterMap.values())
  }

  set tableWriters (writers: Partial<TableWriter>[]) {
    for (const tableWriter of writers) {
      this.addTableWriter(tableWriter)
    }
  }

  get size (): number {
    return this._tableWriterMap.size
  }

  /** Adds a single table writer to this instance; merges writers with same table name/partition key combination. */
  addTableWriter (writer: TableWriterMessage, connection?: string): void {
    const inferPartitionKey = () => {
      if (Array.isArray(writer.tableRows) && writer.tableRows.length > 0) {
        return typeof writer.tableRows[0].partitionKey === 'string'
          ? writer.tableRows[0].partitionKey
          : typeof writer.tableRows[0].PartitionKey === 'object'
          ? writer.tableRows[0].PartitionKey._
          : writer.tableRows[0].PartitionKey
      }
    }
    const key = `${writer.tableName}::${writer.partitionKey || inferPartitionKey()}`

    if (typeof this.maxWriterSize === 'undefined' || this.maxWriterSize === 0) {
      const merged = this._tableWriterMap.get(key)

      if (typeof merged === 'undefined') {
        this._tableWriterMap.set(key, TableWriter.from(writer, connection || this.connection))
      } else {
        for (const tableRow of writer.tableRows) {
          merged.addTableRow(tableRow)
        }
      }
    } else {
      const setNewMerged = () => {
        return new TableWriter({
          tableName: writer.tableName,
          partitionKey: writer.partitionKey || inferPartitionKey(),
          container: writer.container,
          connection: writer.connection || connection || this.connection
        })
      }
      let uuidKey = this._sizeLimitCache.get(key) || uuidv4()
      let merged = this._tableWriterMap.get(uuidKey) || setNewMerged()

      for (const tableRow of writer.tableRows) {
        if (merged.size < this.maxWriterSize) {
          merged.addTableRow(tableRow)
        } else {
          // Ensure that the table writer is tracked.
          this._tableWriterMap.set(uuidKey, merged)

          // Create new references.
          uuidKey = uuidv4()
          merged = setNewMerged()

          // Add the table row to the new writer instance.
          merged.addTableRow(tableRow)

          // Track new references.
          this._sizeLimitCache.set(key, uuidKey)
          this._tableWriterMap.set(uuidKey, merged)
        }
      }

      this._sizeLimitCache.set(key, uuidKey)
      this._tableWriterMap.set(uuidKey, merged)
    }
  }

  /** Adds a single table row to this instance of writer. */
  removeTableRow (tableName: string, partitionKey: string, rowKey: string): boolean {
    const mapKey = `${tableName}::${partitionKey}`
    const remove = (writer: TableWriter): boolean => {
      if (typeof writer === 'object') {
        return writer.removeTableRow(partitionKey, rowKey)
      }

      return true
    }

    if (typeof this.maxWriterSize === 'undefined' || this.maxWriterSize === 0) {
      return remove(this._tableWriterMap.get(mapKey))
    }

    const uuidKey = this._sizeLimitCache.get(mapKey)

    return remove(this._tableWriterMap.get(uuidKey))
  }

  /** Executes batches on all table writers in this instance. */
  async executeBatches (connection?: string): Promise<void> {
    for (const writer of this.tableWriters) {
      await writer.executeBatch(connection || this.connection)
    }
  }

  /** Generates an array of all queue messages in this instance, committing table writer instances to Blob Storage. */
  async toQueueMessages (connection?: string): Promise<QueueBlobMessage[]> {
    const messages: QueueBlobMessage[] = []

    for (const writer of this.tableWriters) {
      messages.push(await writer.toQueueMessage(connection || this.connection))
    }

    return messages
  }

  toJSON (): Partial<TableWriterBatch> {
    return {
      tableWriters: this.tableWriters
    }
  }

  /** Creates a table writer batch instance from valid JSON or a JS object. */
  static from (json: string | Partial<TableWriterBatch>, connection?: string): TableWriterBatch {
    const options = typeof json === 'string' ? (JSON.parse(json) as Partial<TableWriterBatch>) : json

    return new TableWriterBatch({
      ...options,
      tableWriters: options.tableWriters,
      connection
    })
  }

  /** Creates a table writer batch instance from an array of blob metadata. */
  static async fromBlobs (
    messages: QueueBlobMessage[],
    connection: string | BlockBlobService
  ): Promise<TableWriterBatch> {
    const tableWriters: TableWriter[] = []

    for (const message of messages) {
      tableWriters.push(await TableWriter.fromBlob(message, connection))
    }

    return TableWriterBatch.from({ tableWriters })
  }
}
