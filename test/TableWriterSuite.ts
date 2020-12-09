import { doesNotThrow, throws, strictEqual, doesNotReject } from 'assert'
import { TableRow, TableWriter } from '../index'
import { connection, tableRows, mockTableService, unmockTableService } from './helpers'

describe('TableWriter', async () => {
  beforeEach(async () => {
    mockTableService()
  })

  afterEach(async () => {
    unmockTableService()
  })

  it('should manage table rows', () => {
    const tableWriter = TableWriter.from({
      tableName: 'Test',
      tableRows
    })
    const rows = tableWriter.tableRows

    strictEqual(Array.isArray(rows), true)
    strictEqual(tableWriter.size, 3)
    doesNotThrow(() => {
      TableWriter.from({
        tableName: 'Test',
        tableRows: rows
      })
    })
    throws(() => {
      const original: any = rows[1]
      original.partitionKey = 'Throw'

      TableWriter.from({
        tableName: 'Test',
        tableRows: rows
      })
    })
    throws(() => {
      const original: any = rows[1]
      original.partitionKey = null

      TableWriter.from({
        tableName: 'Test',
        tableRows: rows
      })
    })
  })

  it('should execute batch', async () => {
    const tableWriter = new TableWriter()
    const tableRows: TableRow[] = []

    for (let i = 0; i < 101; i += 1) {
      tableRows.push({
        partitionKey: 'test',
        rowKey: 'test' + i.toString(),
        data: i
      })
    }

    tableWriter.tableName = 'Test'
    tableWriter.partitionKey = 'test'
    tableWriter.tableRows = tableRows

    await doesNotReject(async () => {
      await tableWriter.executeBatch(connection)
    })
  })

  it('should handle to and from blob message', async () => {
    const tableWriter = new TableWriter()
    tableWriter.tableName = 'Test'
    tableWriter.partitionKey = 'test'
    tableWriter.tableRows = tableRows as any
    let message: any

    await doesNotReject(async () => {
      message = await tableWriter.toQueueMessage(connection)
    })
    await doesNotReject(async () => {
      const writer = await TableWriter.fromBlob(message, connection)

      strictEqual(writer instanceof TableWriter, true)
    })
  })
})
