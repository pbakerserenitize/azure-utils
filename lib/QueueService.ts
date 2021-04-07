import { QueueClient, QueueServiceClient, StorageSharedKeyCredential as QueueCredential } from '@azure/storage-queue'

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

  async peek (queueName: string, count: number = 1) {
    const queueClient = await this.queues.add(queueName)
    const result = []

    for (const messageCount of this.splitCount(count)) {
      const response = await queueClient.peekMessages({ numberOfMessages: messageCount })
    }
  }

  retrieve (queueName: string, count: number) {}

  private * splitCount (count: number): Generator<number> {
    const MAX_MESSAGES = 32
    if (typeof count !== 'number' || Number.isNaN(count) || !Number.isFinite(count) || count < 1) return

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
