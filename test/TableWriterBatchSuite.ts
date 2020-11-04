import { doesNotThrow, throws, strictEqual, doesNotReject } from 'assert'
import { TableWriterBatch, TableWriter } from '../index'
import { connection, tableRows, validError } from './helpers'

describe('TableWriterBatch', async () => {
  it('should manage table writers', async () => {
    const tableBatchWriter = TableWriterBatch.from({
      connection,
      tableWriters: [
        TableWriter.from({
          tableName: 'Test',
          tableRows
        })
      ]
    })
    const writers = tableBatchWriter.tableWriters
    const size = tableBatchWriter.size

    strictEqual(Array.isArray(writers), true)
    strictEqual(size, 1)
    strictEqual(typeof tableBatchWriter.toJSON(), 'object')
    await doesNotReject(async () => {
      try {
        await tableBatchWriter.executeBatches(connection)
      } catch (error) {
        // Azurite does not have complete support for batches; look for specific error.
        if (error.message !== validError) {
          throw error
        }
      }
    })
  })

  it('should manage table writer size', async () => {
    const tableWriterBatch = new TableWriterBatch()
    tableWriterBatch.connection = connection
    tableWriterBatch.maxWriterSize = 2
    tableWriterBatch.tableWriters = [
      {
        tableName: 'Test',
        tableRows
      }
    ]
    const size  = tableWriterBatch.size

    strictEqual(size, 2)
    doesNotThrow(() => {
      const tableWriterBatch2 = new TableWriterBatch()

      tableWriterBatch2.addTableWriter(tableWriterBatch.tableWriters[0])
      tableWriterBatch2.addTableWriter(tableWriterBatch.tableWriters[1])

      strictEqual(tableWriterBatch2.size, 1)
    })
  })

  it('should handle to and from blob message', async () => {
    const tableWriterBatch = new TableWriterBatch()
    tableWriterBatch.connection = connection
    tableWriterBatch.maxWriterSize = 2
    tableWriterBatch.tableWriters = [
      {
        tableName: 'Test',
        tableRows
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