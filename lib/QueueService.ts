import {
  DequeuedMessageItem,
  MessageIdDeleteResponse,
  PeekedMessageItem,
  QueueClient,
  QueueSendMessageResponse,
  QueueServiceClient,
  StorageSharedKeyCredential as QueueCredential
} from '@azure/storage-queue'
import { probablyBase64, probablyBinary, probablyJson, splitCount } from './Helpers'
import type { QueueMessageContent, QueuePeekResult, QueueReceiveResult } from './Interfaces'
import { RecontextError } from './RecontextError'

/** Wrapper for easy handling of queue messages returned by `receive` or `process` methods.
 * Not intended to be used directly; exported for type information.
 * @category AzureUtility
 */
export class DequeuedMessage<T = any> implements DequeuedMessageItem {
  constructor (dequeuedMessage: DequeuedMessageItem) {
    this.dequeueCount = dequeuedMessage.dequeueCount
    this.expiresOn = dequeuedMessage.expiresOn
    this.insertedOn = dequeuedMessage.insertedOn
    this.messageId = dequeuedMessage.messageId
    this.messageText = dequeuedMessage.messageText
    this.nextVisibleOn = dequeuedMessage.nextVisibleOn
    this.popReceipt = dequeuedMessage.popReceipt
  }

  dequeueCount: number
  expiresOn: Date
  insertedOn: Date
  messageId: string
  messageText: string
  nextVisibleOn: Date
  popReceipt: string
  /** If defined, should contain an instance of Error describing why `toBuffer` or `toJSObject` failed. */
  error?: Error

  /** Convert a base64 string to a Buffer. */
  toBuffer (): Buffer {
    try {
      if (probablyBase64(this.messageText)) {
        return Buffer.from(this.messageText, 'base64')
      } else {
        return Buffer.from(this.messageText, 'utf8')
      }
    } catch (error) {
      this.error = error

      return Buffer.alloc(0)
    }
  }

  /** Convert a base64 string to an object. */
  toJSObject (): T {
    const text = this.toBuffer().toString('utf8')

    if (typeof this.error === 'undefined') {
      if (!probablyBinary(text) && probablyJson(text)) {
        try {
          return JSON.parse(text)
        } catch (error) {
          this.error = error
        }
      } else {
        this.error = new Error('String did not open and close like an object or array; must be one of either to try parsing.')
      }
    }
  }
}

/** A helper class for processing a count of messages from a queue.
 * Not intended to be used directly; exported for type information.
 * @category AzureUtility
 */
export class ProcessQueue<T = any> implements AsyncIterable<DequeuedMessage<T>> {
  /** Constructs an instance of the ProcessQueue async iterator. */
  constructor (queueName: string, count: number, queueService: QueueService) {
    this.queueName = queueName
    this.poisonQueueName = queueName + '-poison'
    this.queueService = queueService
    this.count = count
    this._cancel = false
    this._skip = false
  }

  private readonly queueName: string
  private readonly poisonQueueName: string
  private readonly queueService: QueueService
  private readonly count: number
  private _skip: boolean
  private _cancel: boolean
  private _poison: boolean

  /** Skip deleting the current message off the queue and stop processing all remaining messages. */
  cancel (): void {
    this._cancel = true
    this._poison = false
    this._skip = false
  }

  /** Skip deleting the current message off the queue. */
  skip (): void {
    this._cancel = false
    this._poison = false
    this._skip = true
  }

  /** Send the message to a poison queue corresponding to the instance queue name. */
  poison (): void {
    this._cancel = false
    this._poison = true
    this._skip = false
  }

  /** Implements the AsyncIterable implicit function. */
  async * [Symbol.asyncIterator] (): AsyncGenerator<DequeuedMessage<T>> {
    const queueClient = await this.queueService.queues.add(this.queueName)

    for (const messageCount of splitCount(this.count)) {
      const response = await queueClient.receiveMessages({ numberOfMessages: messageCount })

      if (Array.isArray(response.receivedMessageItems) && response.receivedMessageItems.length > 0) {
        for (const messageItem of response.receivedMessageItems) {
          yield new DequeuedMessage<T>(messageItem)

          if (this._skip) {
            this._skip = false
            continue
          }

          if (this._cancel) {
            this._cancel = false
            break
          }

          if (this._poison) {
            this._poison = false
            const poisonQueueClient = await this.queueService.queues.add(this.poisonQueueName)

            await poisonQueueClient.sendMessage(messageItem.messageText)
          }

          await queueClient.deleteMessage(messageItem.messageId, messageItem.popReceipt)
        }
      } else {
        break
      }
    }
  }
}

/** @hidden */
class QueueReferenceManager {
  constructor (queueService: QueueServiceClient) {
    this.queueService = queueService
    this.references = new Map()
  }

  queueService: QueueServiceClient
  references: Map<string, QueueClient>

  /** Check to see if a queue reference exists. */
  has (queueName: string): boolean {
    return this.references.has(queueName)
  }

  /** Add a queue reference by name. */
  async add (queueName: string): Promise<QueueClient> {
    if (this.has(queueName)) return this.get(queueName)

    const queueClient = await this.createIfNotExist(queueName)

    this.references.set(queueName, queueClient)

    return queueClient
  }

  /** Get a queue reference by name. */
  get (queueName: string): QueueClient {
    return this.references.get(queueName)
  }

  private async createIfNotExist (queueName: string): Promise<QueueClient> {
    try {
      const queueClient = this.queueService.getQueueClient(queueName)

      try {
        await queueClient.create()
      } catch (error) {
        if (error.statusCode !== 409) throw new RecontextError(error)
      }

      return queueClient
    } catch (error) {
      throw new RecontextError(error)
    }
  }
}

/** Convenience wrapper for managing queue service instances gracefully.
 *
 * ```javascript
 * const { QueueService } = require('@nhsllc/azure-utils')
 *
 * module.exports = async function example (context) {
 *   const queueService = new QueueService(process.env.STORAGE_CONNECTION)
 *   const queue = queueService.process<MyObject[]>('my-queue-name', 100)
 *
 *   for await (const message of queue) {
 *     const obj = message.toJSObject()
 *
 *     if (typeof message.error !== 'undefined') {
 *       // The error state can be checked after using `toBuffer` or `toJSObject`.
 *       console.error(message.error)
 *       queue.poison()
 *     } else if (Array.isArray(obj)) {
 *       for (const item of obj) {
 *         console.log(item.message)
 *       }
 *     } else {
 *       // OH NO'S!! ME NO GOOD!
 *       console.error("I don't feel well.", message.messageId)
 *       // The message can be skipped, which will prevent its deletion from the storage queue.
 *       queue.skip()
 *     }
 *   }
 * }
 * ```
 * @category AzureUtility
 */
export class QueueService {
  /** Create an instance with a single connection string. */
  constructor (connectionString: string)
  /** Create an instance with an account name and key. */
  constructor (accountName: string, accountKey: string)
  constructor (accountNameOrConnectionString: string, accountKey?: string) {
    if (typeof accountKey === 'undefined' || accountKey === null || accountKey === '') {
      try {
        this.queueService = QueueServiceClient.fromConnectionString(accountNameOrConnectionString)
      } catch (error) {
        throw new RecontextError(error)
      }
    } else {
      this.queueService = new QueueServiceClient(
        `https://${accountNameOrConnectionString}.queue.core.windows.net`,
        new QueueCredential(accountNameOrConnectionString, accountKey)
      )
    }

    this.queues = new QueueReferenceManager(this.queueService)
  }

  queueService: QueueServiceClient
  queues: QueueReferenceManager

  /** Peek to see if a queue has one or more messages. Retrieves no more than 1 message. */
  async peek (queueName: string): Promise<QueuePeekResult<PeekedMessageItem>> {
    const result: QueuePeekResult<PeekedMessageItem> = {
      date: new Date(),
      hasMessages: false,
      resultType: 'peek',
      messageItems: [],
      responses: []
    }
    const queueClient = await this.queues.add(queueName)
    try {
      const response = await queueClient.peekMessages({ numberOfMessages: 1 })

      result.responses.push(response)

      if (response.peekedMessageItems.length > 0) {
        for (const messageItem of response.peekedMessageItems) result.messageItems.push(messageItem)

        result.hasMessages = true
      }

      return result
    } catch (error) {
      throw new RecontextError(error)
    }
  }

  /** Receive one or more messages from a queue. */
  async receive<T = any> (queueName: string, count: number = 1): Promise<QueueReceiveResult<DequeuedMessage<T>>> {
    const result: QueueReceiveResult<DequeuedMessage<T>> = {
      date: new Date(),
      hasMessages: false,
      resultType: 'receive',
      messageItems: [],
      responses: []
    }
    const queueClient = await this.queues.add(queueName)

    for (const messageCount of splitCount(count)) {
      try {
        const response = await queueClient.receiveMessages({ numberOfMessages: messageCount })

        result.responses.push(response)

        // Break out of loop if received message items is not an array or has no messages.
        if (Array.isArray(response.receivedMessageItems) && response.receivedMessageItems.length > 0) {
          for (const messageItem of response.receivedMessageItems) {
            result.messageItems.push(new DequeuedMessage(messageItem))
          }

          if (response.receivedMessageItems.length < messageCount) {
            // Break out of loop early if the number of messages received is less than the number of messages requested.
            break
          }
        } else {
          break
        }
      } catch (error) {
        throw new RecontextError(error)
      }
    }

    result.hasMessages = result.messageItems.length > 0

    return result
  }

  /** Send multiple messages to a queue. Errors will bubble up to the array of results. */
  async sendAll (queueName: string, messages: QueueMessageContent[]): Promise<QueueSendMessageResponse[]> {
    const promises: Array<Promise<QueueSendMessageResponse>> = []

    if (Array.isArray(messages)) {
      for (const message of messages) {
        promises.push(this.send(queueName, message).catch(reason => reason))
      }
    }

    return await Promise.all(promises)
  }

  /** Send a single message to a queue. */
  async send (queueName: string, message: QueueMessageContent): Promise<QueueSendMessageResponse> {
    const queueClient = await this.queues.add(queueName)
    let messageText: string

    switch (typeof message) {
      case 'string':
        if (probablyJson(message)) {
          messageText = Buffer.from(message, 'utf8').toString('base64')
        } else {
          messageText = message
        }
        break
      case 'number':
        messageText = message.toString()
        break
      case 'object':
        if (message === null) {
          break
        }
        messageText = JSON.stringify(message)
        messageText = Buffer.from(messageText, 'utf8').toString('base64')
        break
    }

    // Should we throw an error if it's undefined?
    if (typeof messageText !== 'undefined') {
      try {
        return await queueClient.sendMessage(messageText)
      } catch (error) {
        throw new RecontextError(error)
      }
    }
  }

  /** Delete multiple messages from a queue. Errors will bubble up to the array of results. */
  async deleteAll (queueName: string, deletes: Array<[messageId: string, popReceipt: string]>): Promise<MessageIdDeleteResponse[]> {
    const promises: Array<Promise<MessageIdDeleteResponse>> = []

    if (Array.isArray(deletes)) {
      for (const [messageId, popReceipt] of deletes) {
        promises.push(this.delete(queueName, messageId, popReceipt).catch(reason => reason))
      }
    }

    return await Promise.all(promises)
  }

  /** Delete one message from a queue. */
  async delete (queueName: string, messageId: string, popReceipt: string): Promise<MessageIdDeleteResponse> {
    const queueClient = await this.queues.add(queueName)

    try {
      return await queueClient.deleteMessage(messageId, popReceipt)
    } catch (error) {
      throw new RecontextError(error)
    }
  }

  /** Mount a queue for processing and handling the lifecycle of each message. */
  process<T = any> (queueName: string, count: number = 1): ProcessQueue<T> {
    return new ProcessQueue(queueName, count, this)
  }
}
