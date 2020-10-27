import { azure, createTableService } from 'azure-table-promise'
import { v4 as uuidv4 } from 'uuid'
import { BlockBlobService } from './BlockBlobService'
import type { QueueBlobMessage } from './Interfaces'

type StringProperty = azure.TableUtilities.entityGenerator.EntityProperty<string>

const { String: StringEntity } = azure.TableUtilities.entityGenerator

export interface TableRow {
  PartitionKey: string | StringProperty
  RowKey: string | StringProperty
  [property: string]: any
}

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

export class TableWriter {
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

    if (typeof this.partitionKey === 'undefined' && message.tableRows.length > 0) {
      this.partitionKey = typeof message.tableRows[0].PartitionKey === 'string'
        ? message.tableRows[0].PartitionKey
        : message.tableRows[0].PartitionKey._
    }

    if (Array.isArray(message.tableRows)) {
      for (const tableRow of message.tableRows) {
        this.addTableRow(tableRow)
      }
    }
  }

  blobName: string
  connection?: string
  container: string
  partitionKey: string
  tableName: string
  private _tableRowMap: Map<string, TableRow>

  get tableRows (): TableRow[] {
    return Array.from(this._tableRowMap.values())
  }

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

  async executeBatch (connection?: string): Promise<void> {
    if (
      this.tableRows.length > 0 &&
      (typeof this.connection === 'string' || typeof connection === 'string')
    ) {
      const tableService = createTableService(this.connection || connection)
      const BATCH_LIMIT = 100

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

  toJSON (): Partial<TableWriter> {
    return {
      blobName: this.blobName,
      container: this.container,
      partitionKey: this.partitionKey,
      tableName: this.tableName,
      tableRows: this.tableRows
    }
  }

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

  static async fromBlob (message: QueueBlobMessage, connection: string | BlockBlobService): Promise<TableWriter> {
    const blobService = typeof connection === 'string'
      ? new BlockBlobService(connection)
      : connection
    const options: Partial<TableWriter> = await blobService.read(message.container, message.blobName, true)

    return TableWriter.from(options)
  }
}
