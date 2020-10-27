import type { BlockBlobService } from './BlockBlobService'
import type { QueueBlobMessage } from './Interfaces'
import { TableWriter } from './TableWriter'

export class TableWriterBatch {
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

  async executeBatches (connection?: string): Promise<void> {
    for (const writer of this.tableWriters) {
      await writer.executeBatch(connection || this.connection)
    }
  }

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

  static async fromBlobs (messages: QueueBlobMessage[], connection: string | BlockBlobService): Promise<TableWriterBatch> {
    const tableWriters: TableWriter[] = []

    for (const message of messages) {
      tableWriters.push(await TableWriter.fromBlob(message, connection))
    }

    return TableWriterBatch.from({ tableWriters })
  }
}
