import { QueueService } from '../QueueService'
import { BlockBlobService } from '../BlockBlobService'
import { TableWriterBatch } from '../TableWriterBatch'
import type { QueueBlobMessage } from '../Interfaces'
import type { TWBOptions } from './Interfaces'

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
  const { allConnections, blobConnection, queue, tableConnection, logger = console } = options
  const { name: queueName, connection: queueConnection, numberOfMessages } = queue
  const queueCount = typeof numberOfMessages === 'number' ? numberOfMessages : 32
  const queueService = new QueueService(allConnections || queueConnection)
  const messages = queueService.process<QueueBlobMessage>(queueName, queueCount)
  const queueBlobs: QueueBlobMessage[] = []

  for await (const message of messages) {
    const item = message.toJSObject()

    if (typeof message.error === 'undefined') {
      queueBlobs.push(item)
    } else {
      logger.error(message.error)
      messages.poison()
    }
  }

  if (queueBlobs.length > 0) {
    const blobService = new BlockBlobService(allConnections || blobConnection)
    const writerBatch = await TableWriterBatch.fromBlobs(queueBlobs, blobService)

    await writerBatch.executeBatches(allConnections || tableConnection)
  }
}
