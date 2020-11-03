import { doesNotThrow, throws, strictEqual, doesNotReject } from 'assert'
import { TableRow, TableWriter } from '../index'

const connection = 'UseDevelopmentStorage=true'
const tableRows: TableRow[] = [
  {
    PartitionKey: 'test',
    RowKey: 'test1',
    data: 1
  },
  {
    PartitionKey: 'test',
    RowKey: 'test2',
    data: 2
  },
  {
    PartitionKey: {
      _: 'test',
      $: 'Edm.String'
    },
    RowKey: {
      _: 'test3',
      $: 'Edm.String'
    },
    data: 3
  }
]

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
    const validError = 'Cannot read property \'tableName\' of undefined'

    await doesNotReject(async () => {
      try {
        await tableWriter.executeBatch(connection)
      } catch (error) {
        // Azurite does not have complete support for batches; look for specific error.
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
