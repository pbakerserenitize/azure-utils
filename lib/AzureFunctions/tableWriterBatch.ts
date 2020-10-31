import { QueueServiceClient } from '@azure/storage-queue'
import { BlockBlobService } from '../BlockBlobService'
import type { QueueBlobMessage } from '../Interfaces'
import type { TWBOptions } from './Interfaces'
import { TableWriterBatch } from '../TableWriterBatch'

/** Helper method which acts as the body of an Azure Function designed for batching table writer instances.
 * 
 * ```javascript
 * const { FunctionHelpers } = require('@nhsllc/azure-utils')
 * const { loggerWithDefaults } = require('../shared/rollbar')
 * 
 * const logger = loggerWithDefaults()
 * 
 * module.exports = logger.azureFunctionHandler(
 *   async function tableBatcher (context) {
 *     try {
 *       await FunctionHelpers.tableWriterBatch({
 *         allConnections: process.env.orderdataservice_STORAGE,
 *         queue: {
 *           name: 'table-batcher',
 *           numberOfMessages: 32
 *         }
 *       })
 *     } catch (error) {
 *       logger.error(error)
 *     }
 *   }
 * )
 * ```
 * @category AzureFunctionHelper
 */
export async function tableWriterBatch (options: TWBOptions) {
  const { allConnections, blobConnection, queue, tableConnection } = options
  const { name: queueName, connection: queueConnection, numberOfMessages } = queue
  const queueCount = typeof numberOfMessages === 'number' && numberOfMessages <= 32 ? numberOfMessages : 32
  const queueService = QueueServiceClient.fromConnectionString(allConnections || queueConnection)
  const queueClient = queueService.getQueueClient(queueName)
  const { receivedMessageItems } = await queueClient.receiveMessages({ numberOfMessages: queueCount })

  if (receivedMessageItems.length > 0) {
    const blobService = new BlockBlobService(allConnections || blobConnection)
    const messages = receivedMessageItems.map((item) => {
      const buffer =  Buffer.from(item.messageText, 'base64')
      const json = buffer.toString('utf8')

      if (json === '') return null

      return JSON.parse(json) as QueueBlobMessage
    }).filter(item => item !== null)
    const writerBatch = await TableWriterBatch.fromBlobs(messages, blobService)

    await writerBatch.executeBatches(allConnections || tableConnection)

    for (const item of receivedMessageItems) {
      await queueClient.deleteMessage(item.messageId, item.popReceipt)
    }
  }
}
