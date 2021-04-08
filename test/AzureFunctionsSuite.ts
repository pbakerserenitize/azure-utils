import { QueueServiceClient } from '@azure/storage-queue'
import { doesNotReject } from 'assert'
import { FunctionHelpers, TableWriter } from '../index'
import { connection, mockTableService, tableRows, unmockTableService } from './helpers'

describe('AzureFunctions', () => {
  beforeEach(async () => {
    mockTableService()
  })

  afterEach(async () => {
    unmockTableService()
  })

  it('should process batch messages from queue', async () => {
    const queueService = QueueServiceClient.fromConnectionString(connection)
    const queueName = 'batch-queue'
    const queueClient = queueService.getQueueClient(queueName)
    const queueMessage = await TableWriter.from({
      tableName: 'Test',
      tableRows
    }).toQueueMessage(connection)

    await queueClient.createIfNotExists()
    await queueClient.sendMessage(Buffer.from(JSON.stringify(queueMessage)).toString('base64'))
    await queueClient.sendMessage('')

    await doesNotReject(async () => {
      await FunctionHelpers.tableWriterBatch({
        allConnections: connection,
        queue: { name: queueName },
        logger: { error: () => {} }
      })
    })
  })
})
