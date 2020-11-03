import { azure, createTableService } from 'azure-table-promise'
import { v4 as uuidv4 } from 'uuid'
import { BlockBlobService } from './BlockBlobService'
import type { QueueBlobMessage, TableRow } from './Interfaces'

const {
  /** @hidden */
  String: StringEntity
} = azure.TableUtilities.entityGenerator

/** @hidden */
function safeTableRow (item: TableRow): TableRow {
  return {
    ...item,
    PartitionKey: typeof item.PartitionKey === 'string'
      ? StringEntity(item.PartitionKey)
      : item.PartitionKey,
    RowKey: typeof item.RowKey === 'string'
      ? StringEntity(item.RowKey)
      : item.RowKey
  }
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
  constructor (message: Partial<TableWriter> = {}) {
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
      this.partitionKey = typeof message.tableRows[0].PartitionKey === 'string'
        ? message.tableRows[0].PartitionKey
        : message.tableRows[0].PartitionKey._
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
  addTableRow (tableRow: TableRow): void {
    const partitionKey = typeof tableRow.PartitionKey === 'string'
      ? tableRow.PartitionKey
      : tableRow.PartitionKey._
    const rowKey = typeof tableRow.RowKey === 'string'
      ? tableRow.RowKey
      : tableRow.RowKey._

    if (partitionKey !== this.partitionKey) {
      throw new Error(`PartitionKey ${partitionKey} does not match this writer's instance: ${this.partitionKey}`)
    }

    this._tableRowMap.set(`${partitionKey}::${rowKey}`, safeTableRow(tableRow))
  }

  /** Executes a batch, creating the table if it does not exist. */
  async executeBatch (connection?: string): Promise<void> {
    if (
      this.tableRows.length > 0 &&
      (typeof this.connection === 'string' || typeof connection === 'string')
    ) {
      const tableService = createTableService(this.connection || connection)
      const BATCH_LIMIT = 100

      await tableService.createTableIfNotExists(this.tableName)

      for (
        let start = 0, end = BATCH_LIMIT;
        start < this.tableRows.length;
        start += BATCH_LIMIT, end += BATCH_LIMIT
      ) {
        const batch = new azure.TableBatch()
        const tableRows = this.tableRows.slice(start, end)

        for (const tableRow of tableRows) batch.insertOrMergeEntity(tableRow)

        await tableService.executeBatch(this.tableName, batch)
      }
    }
  }

  /** Writes this instance of table writer to blob storage, and generates blob metadata intended to be a queue message. */
  async toQueueMessage (connection?: string): Promise<QueueBlobMessage> {
    if (
      this.tableRows.length > 0 &&
      (typeof this.connection === 'string' || typeof connection === 'string')
    ) {
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
  static from (json: string | Partial<TableWriter>, connection?: string): TableWriter {
    const options = typeof json === 'string'
      ? JSON.parse(json) as Partial<TableWriter>
      : json

    return new TableWriter({
      ...options,
      tableRows: options.tableRows,
      connection
    })
  }

  /** Creates an instance of table writer from blob metadata. */
  static async fromBlob (message: QueueBlobMessage, connection: string | BlockBlobService): Promise<TableWriter> {
    const blobService = typeof connection === 'string'
      ? new BlockBlobService(connection)
      : connection
    const options: Partial<TableWriter> = await blobService.read(message.container, message.blobName, true)

    return TableWriter.from(options)
  }
}
