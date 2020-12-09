import { TableClient } from '@azure/data-tables'
import { v4 as uuidv4 } from 'uuid'
import { BlockBlobService } from './BlockBlobService'
import type { LegacyTableRow, QueueBlobMessage, TableRow } from './Interfaces'

/** Method for making a compliant table row from multiple variations.
 * For library internals only; not meant for external use.
 * @hidden
 */
export function safeTableRow (item: LegacyTableRow | TableRow): TableRow {
  const copy = { ...item }
  const { PartitionKey, RowKey, partitionKey, rowKey } = copy

  if (PartitionKey && RowKey) {
    delete copy.PartitionKey
    delete copy.RowKey

    return {
      ...copy,
      partitionKey: typeof PartitionKey === 'string' ? PartitionKey : PartitionKey._,
      rowKey: typeof RowKey === 'string' ? RowKey : RowKey._
    }
  }

  if (!partitionKey || !rowKey) throw new Error('Table row must contain both partitionKey and rowKey.')

  return {
    ...copy,
    partitionKey,
    rowKey
  }
}

export type TableWriterMessage = Partial<Omit<TableWriter, 'tableRows'>> & {
  tableRows?: Array<LegacyTableRow | TableRow>
}

/** Class for managing a complete round-trip of one or more table rows for upsert into Azure Table Storage.
 *
 * ```javascript
 * const { TableWriter } = require('@nhsllc/azure-utils')
 *
 * module.exports = async function example (context) {
 *   const tableRows = [] // Fill up this array with table rows of the same partition key
 *   const tableWriter = new TableWriter({
 *     tableName: 'ExampleTable',
 *     tableRows
 *   })
 *
 *   return {
 *     tableBatcher: await tableWriter.toQueueMessage(process.env.STORAGE_CONNECTION)
 *   }
 * }
 * ```
 * @category AzureUtility
 */
export class TableWriter {
  /** Class for managing a complete round-trip of one or more table rows for upsert into Azure Table Storage. */
  constructor (message: TableWriterMessage = {}) {
    this.partitionKey = message.partitionKey
    this.tableName = message.tableName
    this.blobName = message.blobName
    this.container = message.container
    this.connection = message.connection
    this._tableRowMap = new Map() // Using Map allows for easy deduplication of table rows.

    if (typeof this.blobName === 'undefined') {
      this.blobName = uuidv4() + '.json'
    }

    if (typeof this.container === 'undefined') {
      this.container = 'table-writer'
    }

    const isTableRowArray = Array.isArray(message.tableRows)

    if (typeof this.partitionKey === 'undefined' && isTableRowArray && message.tableRows.length > 0) {
      this.partitionKey =
        typeof message.tableRows[0].partitionKey === 'string'
          ? message.tableRows[0].partitionKey
          : typeof message.tableRows[0].PartitionKey === 'object'
          ? message.tableRows[0].PartitionKey._
          : message.tableRows[0].PartitionKey
    }

    if (isTableRowArray) {
      for (const tableRow of message.tableRows) {
        this.addTableRow(tableRow)
      }
    }
  }

  /** A blob name; one will be set dynamically, which is recommended. */
  blobName: string
  /** An Azure connection string. */
  connection?: string
  /** A blob container; defaults to `table-writer`, will be dynamically created. */
  container: string
  /** A partition key; will be determined from the first table row unless provided. */
  partitionKey: string
  /** A table name; table will be created dynamically when executing the batch. */
  tableName: string
  private _tableRowMap: Map<string, TableRow>

  get tableRows (): TableRow[] {
    return Array.from(this._tableRowMap.values())
  }

  set tableRows (rows: TableRow[]) {
    for (const tableRow of rows) {
      this.addTableRow(tableRow)
    }
  }

  get size (): number {
    return this._tableRowMap.size
  }

  /** Adds a single table row to this instance of writer. */
  addTableRow (tableRow: LegacyTableRow | TableRow): void {
    const safe = safeTableRow(tableRow)
    const { partitionKey, rowKey } = safe

    if (partitionKey !== this.partitionKey) {
      throw new Error(`PartitionKey ${partitionKey} does not match this writer's instance: ${this.partitionKey}`)
    }

    this._tableRowMap.set(`${partitionKey}::${rowKey}`, safe)
  }

  /** Executes a batch, creating the table if it does not exist. */
  async executeBatch (connection?: string): Promise<void> {
    if (this.tableRows.length > 0 && (typeof this.connection === 'string' || typeof connection === 'string')) {
      const tableClient = TableClient.fromConnectionString(this.connection || connection, this.tableName)
      const BATCH_LIMIT = 100

      await tableClient.create()

      let batch = tableClient.createBatch(this.partitionKey)
      let batchSize = 0

      for (const tableRow of this.tableRows) {
        if (batchSize === BATCH_LIMIT) {
          await batch.submitBatch()

          batch = tableClient.createBatch(this.partitionKey)
          batchSize = 0
        }

        batch.updateEntity(tableRow, 'Merge')
        batchSize += 1
      }

      if (batchSize > 0) await batch.submitBatch()
    }
  }

  /** Writes this instance of table writer to blob storage, and generates blob metadata intended to be a queue message. */
  async toQueueMessage (connection?: string): Promise<QueueBlobMessage> {
    if (this.tableRows.length > 0 && (typeof this.connection === 'string' || typeof connection === 'string')) {
      const blobService = new BlockBlobService(this.connection || connection)

      await blobService.write(this.container, this.blobName, this)

      return {
        blobName: this.blobName,
        container: this.container
      }
    }
  }

  /** Exports this instance as a plain JS object for `JSON.stringify`. */
  toJSON (): Partial<TableWriter> {
    return {
      blobName: this.blobName,
      container: this.container,
      partitionKey: this.partitionKey,
      tableName: this.tableName,
      tableRows: this.tableRows
    }
  }

  /** Creates an instance of table writer from valid JSON or from a plain JS object. */
  static from (json: string | TableWriterMessage, connection?: string): TableWriter {
    const options: TableWriterMessage = typeof json === 'string' ? JSON.parse(json) : json

    return new TableWriter({
      ...options,
      tableRows: options.tableRows,
      connection
    })
  }

  /** Creates an instance of table writer from blob metadata. */
  static async fromBlob (message: QueueBlobMessage, connection: string | BlockBlobService): Promise<TableWriter> {
    const blobService = typeof connection === 'string' ? new BlockBlobService(connection) : connection
    const options: TableWriterMessage = await blobService.read(message.container, message.blobName, true)

    return TableWriter.from(options)
  }
}
