import { doesNotThrow, throws, strictEqual, doesNotReject } from 'assert'
import { TableWriter } from '../index'
import { connection, tableRows, validError } from './helpers'

describe('TableWriter', async () => {
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
      const partitionKey: any = rows[1].PartitionKey
      partitionKey._ = 'Throw'

      TableWriter.from({
        tableName: 'Test',
        tableRows: rows
      })
    })
  })

  it('should execute batch', async () => {
    const tableWriter = new TableWriter()
    tableWriter.tableName = 'Test'
    tableWriter.partitionKey = 'test'
    tableWriter.tableRows = tableRows

    await doesNotReject(async () => {
      try {
        await tableWriter.executeBatch(connection)
      } catch (error) {
        // Azurite V2 does not have complete support for batches; look for specific error.
        if (error.message !== validError) {
          throw error
        }
      }
    })
  })

  it('should handle to and from blob message', async () => {
    const tableWriter = new TableWriter()
    tableWriter.tableName = 'Test'
    tableWriter.partitionKey = 'test'
    tableWriter.tableRows = tableRows
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
