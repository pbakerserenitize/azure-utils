import { deepStrictEqual, doesNotReject, doesNotThrow, rejects, strictEqual } from 'assert'
import { QueueService } from '../index'
import { connection } from './helpers'

describe('QueueService', () => {
  it('should send and receive queue messages', async () => {
    const queueService = new QueueService(connection)
    const queueService2 = new QueueService(connection)
    const queueName = 'test-queue'
    const messageCount = 1
    const payload = { hello: 'world!' }
    const payload2 = ['hello', 'world!']

    await doesNotReject(async () => {
      await queueService.send(queueName, payload)
    })

    const hello = await queueService2.receive<typeof payload>(queueName, 40)

    strictEqual(hello.hasMessages, true)
    strictEqual(hello.messageItems.length, messageCount)

    const [message] = hello.messageItems

    deepStrictEqual(message.toJSObject(), payload)

    await doesNotReject(async () => {
      await queueService2.delete(queueName, message.messageId, message.popReceipt)
    })

    const hello2 = await queueService.receive<typeof payload>(queueName, 1)

    strictEqual(hello2.hasMessages, false)
    strictEqual(hello2.messageItems.length, 0)

    const payloadAll = []
    const fourtyTwo = 42

    for (let i = 0; i < fourtyTwo; i += 1) {
      payloadAll.push(payload2)
    }

    await doesNotReject(async () => {
      await queueService.sendAll(queueName, payloadAll)
    })

    const hello3 = await queueService2.receive<typeof payload2>(queueName, fourtyTwo)

    strictEqual(hello3.hasMessages, true)
    strictEqual(hello3.messageItems.length, fourtyTwo)

    const message2 = hello3.messageItems[30]

    deepStrictEqual(message2.toJSObject(), payload2)

    await doesNotReject(async () => {
      await queueService.deleteAll(queueName, hello3.messageItems.map(message => [message.messageId, message.popReceipt]))
    })

    doesNotThrow(() => {
      const queueService3 = new QueueService(connection, connection)

      strictEqual(queueService3 instanceof QueueService, true)
    })
  })

  it('should process a queue up to the given number of messages', async () => {
    const queueService = new QueueService(connection)
    const queueService2 = new QueueService(connection)
    const queueName = 'process-queue'
    const payload = { hello: 'world!' }
    const smolWorld = 'It\'s a small world after all'
    const twentyThree = 23
    const payloadAll: any[] = []

    for (let i = 0; i < 90; i += 1) {
      switch(i) {
        case twentyThree:
          payloadAll.push(i)
          break
        case 55:
          payloadAll.push(smolWorld)
          break
        case 69:
          payloadAll.push(null)
          break
        case 84:
          payloadAll.push(JSON.stringify(payload))
          break
        default:
          payloadAll.push(payload)
          break
      }
    }

    await queueService.sendAll(queueName, payloadAll)

    const pikachu = await queueService2.peek(queueName)

    strictEqual(pikachu.hasMessages, true)

    const queue = queueService2.process<typeof payload>(queueName, 100)
    let counted = 0

    for await (const message of queue) {
      const object = message.toJSObject()
      counted += 1

      if (counted === 87) {
        // Arbitrarily cancelling early for test coverage purposes.
        doesNotThrow(() => {
          queue.cancel()
        })
      } else if (typeof message.error === 'undefined') {
        deepStrictEqual(object, payload)
      } else if (message.messageText === twentyThree.toString()) {
        doesNotThrow(() => {
          queue.skip()
        })
      } else if (message.messageText === smolWorld) {
        doesNotThrow(() => {
          queue.poison()
        })
      }
    }

    const poisonQueue = queueName + '-poison'
    const poison = await queueService.receive(poisonQueue, 1)
    const [message] = poison.messageItems

    strictEqual(message.messageText, smolWorld)
  })
})
