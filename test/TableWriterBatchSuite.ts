import { doesNotThrow, strictEqual, doesNotReject } from 'assert'
import { TableWriterBatch, TableWriter } from '../index'
import { connection, mockTableService, tableRows, unmockTableService } from './helpers'

describe('TableWriterBatch', () => {
  beforeEach(async () => {
    mockTableService()
  })

  afterEach(async () => {
    unmockTableService()
  })

  it('should manage table writers', async () => {
    const tableBatchWriter = TableWriterBatch.from({
      connection,
      tableWriters: [
        TableWriter.from({
          tableName: 'Test',
          tableRows,
          writeType: 'delete'
        })
      ]
    })
    const writers = tableBatchWriter.tableWriters
    const size = tableBatchWriter.size

    strictEqual(Array.isArray(writers), true)
    strictEqual(size, 1)
    strictEqual(typeof tableBatchWriter.toJSON(), 'object')
    await doesNotReject(async () => {
      await tableBatchWriter.executeBatches(connection)
    })

    const res = tableBatchWriter.removeTableRow('Test', 'test', 'test1')

    strictEqual(typeof res, 'boolean')

    const res2 = tableBatchWriter.removeTableRow('Nope', 'dumb', 'unreal')

    strictEqual(typeof res2, 'boolean')
  })

  it('should manage table writer size', async () => {
    const tableWriterBatch = new TableWriterBatch()
    tableWriterBatch.connection = connection
    tableWriterBatch.maxWriterSize = 2
    tableWriterBatch.tableWriters = [
      {
        tableName: 'Test',
        tableRows: tableRows as any
      }
    ]
    const size = tableWriterBatch.size

    strictEqual(size, 2)
    doesNotThrow(() => {
      const tableWriterBatch2 = new TableWriterBatch()

      tableWriterBatch2.addTableWriter(tableWriterBatch.tableWriters[0])
      tableWriterBatch2.addTableWriter(tableWriterBatch.tableWriters[1])

      strictEqual(tableWriterBatch2.size, 1)
    })

    const res = tableWriterBatch.removeTableRow('Test', 'test', 'test1')

    strictEqual(typeof res, 'boolean')
  })

  it('should handle to and from blob message', async () => {
    const tableWriterBatch = new TableWriterBatch()
    tableWriterBatch.connection = connection
    tableWriterBatch.maxWriterSize = 2
    tableWriterBatch.tableWriters = [
      {
        tableName: 'Test',
        tableRows: tableRows as any
      }
    ]
    let messages: any[]

    await doesNotReject(async () => {
      messages = await tableWriterBatch.toQueueMessages(connection)
    })
    await doesNotReject(async () => {
      const writerBatch = await TableWriterBatch.fromBlobs(messages, connection)

      strictEqual(writerBatch instanceof TableWriterBatch, true)
    })
  })
})
