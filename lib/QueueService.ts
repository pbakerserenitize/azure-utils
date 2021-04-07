import {
  DequeuedMessageItem,
  PeekedMessageItem,
  QueueClient,
  QueuePeekMessagesResponse,
  QueueReceiveMessageResponse,
  QueueServiceClient,
  StorageSharedKeyCredential as QueueCredential
} from '@azure/storage-queue'

export type QueueResultType = 'peek' | 'receive'

export interface QueueResult<TResultType extends QueueResultType, TItems = any, TResponse = any> {
  date: Date
  hasMessages: boolean
  resultType: TResultType
  messageItems: TItems[]
  responses: TResponse[]
}

export type QueuePeekResult<T = any> = QueueResult<'peek', T, QueuePeekMessagesResponse>

export type QueueReceiveResult<T = any> = QueueResult<'receive', T, QueueReceiveMessageResponse>

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

  async add (queueName: string): Promise<QueueClient> {
    if (this.has(queueName)) return this.get(queueName)

    const queueClient = await this.createIfNotExist(queueName)

    this.references.set(queueName, queueClient)

    return queueClient
  }

  get (queueName: string): QueueClient {
    return this.references.get(queueName)
  }

  private async createIfNotExist (queueName: string): Promise<QueueClient> {
    const queueClient = this.queueService.getQueueClient(queueName)

    try {
      await queueClient.createIfNotExists()
    } catch (error) {
      if (error.statusCode !== 409) throw error
    }

    return queueClient
  }
}

export class QueueService {
  /** Create an instance with a single connection string. */
  constructor (connectionString: string)
  /** Create an instance with an accoutn name and key. */
  constructor (accountName: string, accountKey: string)
  constructor (accountNameOrConnectionString: string, accountKey?: string) {
    if (typeof accountKey === 'undefined' || accountKey === null || accountKey === '') {
      this.queueService = QueueServiceClient.fromConnectionString(accountNameOrConnectionString)
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
    const response = await queueClient.peekMessages({ numberOfMessages: 1 })

    if (response.peekedMessageItems.length > 0) {
      for (const messageItem of response.peekedMessageItems) result.messageItems.push(messageItem)

      result.hasMessages = true
    }

    result.responses.push(response)

    return result
  }

  /** Receive one or more messages from a queue. */
  async receive (queueName: string, count: number = 1) {
    const result: QueueReceiveResult<DequeuedMessageItem> = {
      date: new Date(),
      hasMessages: false,
      resultType: 'receive',
      messageItems: [],
      responses: []
    }
    const queueClient = await this.queues.add(queueName)

    for (const messageCount of this.splitCount(count)) {
      const response = await queueClient.receiveMessages({ numberOfMessages: messageCount })

      result.responses.push(response)

      // Break out of loop if 
      if (Array.isArray(response.receivedMessageItems) && response.receivedMessageItems.length > 0) {
        for (const messageItem of response.receivedMessageItems) result.messageItems.push(messageItem)
      } else {
        break
      }
    }

    return result
  }

  /** Send one or more messages to a queue. */
  async send (queueName: string) {}

  /** Delete one or more messages from a queue. */
  async delete (queueName: string) {}

  private * splitCount (count: number): Generator<number> {
    if (typeof count !== 'number' || Number.isNaN(count) || !Number.isFinite(count) || count < 1) return

    const MAX_MESSAGES = 32

    if (count < MAX_MESSAGES) {
      yield count
    } else {
      const result = Math.floor(count / MAX_MESSAGES)
      const remainder = Math.floor(count % MAX_MESSAGES)

      for (let i = 0; i < result; i += 1) {
        yield MAX_MESSAGES
      }

      if (remainder > 0) yield remainder
    }
  }
}
