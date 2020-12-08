import { QueueServiceClient } from '@azure/storage-queue'
import { doesNotReject } from 'assert'
import { FunctionHelpers, TableWriter } from '../index'
import { connection, tableRows, validError } from './helpers'

describe('AzureFunctions', async () => {
  it('should process batch messages from queue', async () => {
    const queueService = QueueServiceClient.fromConnectionString(connection)
    const queueName = 'test-queue'
    const queueClient = queueService.getQueueClient(queueName)
    const queueMessage = await TableWriter.from({
      tableName: 'Test',
      tableRows
    }).toQueueMessage(connection)

    await queueClient.createIfNotExists()
    await queueClient.sendMessage(Buffer.from(JSON.stringify(queueMessage)).toString('base64'))
    await queueClient.sendMessage('')

    await doesNotReject(async () => {
      try {
        await FunctionHelpers.tableWriterBatch({
          allConnections: connection,
          queue: { name: queueName }
        })
      } catch (error) {
        // Azurite V2 does not have complete support for batches; look for specific error.
        if (error.message !== validError) {
          throw error
        }
      }
    })
  })
})
