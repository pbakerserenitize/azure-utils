import type { BlockBlobService } from './BlockBlobService'
import type { QueueBlobMessage } from './Interfaces'
import { TableWriter } from './TableWriter'

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
    this._tableWriterMap = new Map()

    if (Array.isArray(batchMessage.tableWriters)) {
      for (const tableWriter of batchMessage.tableWriters) {
        this.addTableWriter(tableWriter)
      }
    }

  }

  connection?: string
  private _tableWriterMap: Map<string, TableWriter>

  get tableWriters (): TableWriter[] {
    return Array.from(this._tableWriterMap.values())
  }

  /** Adds a single table writer to this instance; merges writers with same table name/partition key combination. */
  addTableWriter (writer: Partial<TableWriter>, connection?: string): void {
    const key = `${writer.tableName}::${writer.partitionKey}`
    const merged = this._tableWriterMap.get(key)

    if (typeof merged === 'undefined') {
      this._tableWriterMap.set(key, TableWriter.from(writer, connection || this.connection))
    } else {
      for (const tableRow of writer.tableRows) {
        merged.addTableRow(tableRow)
      }
    }
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
    const options = typeof json === 'string'
      ? JSON.parse(json) as Partial<TableWriterBatch>
      : json

    return new TableWriterBatch({
      ...options,
      tableWriters: options.tableWriters,
      connection
    })
  }

  /** Creates a table writer batch instance from an array of blob metadata. */
  static async fromBlobs (messages: QueueBlobMessage[], connection: string | BlockBlobService): Promise<TableWriterBatch> {
    const tableWriters: TableWriter[] = []

    for (const message of messages) {
      tableWriters.push(await TableWriter.fromBlob(message, connection))
    }

    return TableWriterBatch.from({ tableWriters })
  }
}
