[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / QueueService

# Class: QueueService

[index](../modules/index.md).QueueService

Convenience wrapper for managing blob service instances gracefully.

```javascript
const { QueueService } = require('@nhsllc/azure-utils')

module.exports = async function example (context) {
  const queueService = new QueueService(process.env.STORAGE_CONNECTION)
  const queue = queueService.process<MyObject[]>('my-queue-name', 100)

  for await (const message of queue) {
    const obj = message.toJSObject()

    if (typeof message.error !== 'undefined') {
      // The error state can be checked after using `toBuffer` or `toJSObject`.
      console.error(message.error)
      queue.poison()
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        console.log(item.message)
      }
    } else {
      // OH NO'S!! ME NO GOOD!
      console.error("I don't feel well.", message.messageId)
      // The message can be skipped, which will prevent its deletion from the storage queue.
      queue.skip()
    }
  }
}
```

## Table of contents

### Constructors

- [constructor](index.queueservice.md#constructor)

### Properties

- [queueService](index.queueservice.md#queueservice)
- [queues](index.queueservice.md#queues)

### Methods

- [delete](index.queueservice.md#delete)
- [deleteAll](index.queueservice.md#deleteall)
- [peek](index.queueservice.md#peek)
- [process](index.queueservice.md#process)
- [receive](index.queueservice.md#receive)
- [send](index.queueservice.md#send)
- [sendAll](index.queueservice.md#sendall)

## Constructors

### constructor

\+ **new QueueService**(`connectionString`: *string*): [*QueueService*](index.queueservice.md)

Create an instance with a single connection string.

#### Parameters:

Name | Type |
:------ | :------ |
`connectionString` | *string* |

**Returns:** [*QueueService*](index.queueservice.md)

Defined in: [lib/QueueService.ts:256](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L256)

\+ **new QueueService**(`accountName`: *string*, `accountKey`: *string*): [*QueueService*](index.queueservice.md)

Create an instance with an account name and key.

#### Parameters:

Name | Type |
:------ | :------ |
`accountName` | *string* |
`accountKey` | *string* |

**Returns:** [*QueueService*](index.queueservice.md)

Defined in: [lib/QueueService.ts:258](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L258)

## Properties

### queueService

• **queueService**: *QueueServiceClient*

Defined in: [lib/QueueService.ts:274](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L274)

___

### queues

• **queues**: *QueueReferenceManager*

Defined in: [lib/QueueService.ts:275](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L275)

## Methods

### delete

▸ **delete**(`queueName`: *string*, `messageId`: *string*, `popReceipt`: *string*): *Promise*<MessageIdDeleteResponse\>

Delete one message from a queue.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |
`messageId` | *string* |
`popReceipt` | *string* |

**Returns:** *Promise*<MessageIdDeleteResponse\>

Defined in: [lib/QueueService.ts:387](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L387)

___

### deleteAll

▸ **deleteAll**(`queueName`: *string*, `deletes`: [messageId: string, popReceipt: string][]): *Promise*<MessageIdDeleteResponse[]\>

Delete multiple messages from a queue. Errors will bubble up to the array of results.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |
`deletes` | [messageId: string, popReceipt: string][] |

**Returns:** *Promise*<MessageIdDeleteResponse[]\>

Defined in: [lib/QueueService.ts:374](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L374)

___

### peek

▸ **peek**(`queueName`: *string*): *Promise*<[*QueuePeekResult*](../modules/index.md#queuepeekresult)<PeekedMessageItem\>\>

Peek to see if a queue has one or more messages. Retrieves no more than 1 message.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |

**Returns:** *Promise*<[*QueuePeekResult*](../modules/index.md#queuepeekresult)<PeekedMessageItem\>\>

Defined in: [lib/QueueService.ts:278](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L278)

___

### process

▸ **process**<T\>(`queueName`: *string*, `count?`: *number*): [*ProcessQueue*](index.processqueue.md)<T\>

Mount a queue for processing and handling the lifecycle of each message.

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`queueName` | *string* | - |
`count` | *number* | 1 |

**Returns:** [*ProcessQueue*](index.processqueue.md)<T\>

Defined in: [lib/QueueService.ts:394](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L394)

___

### receive

▸ **receive**(`queueName`: *string*, `count?`: *number*): *Promise*<[*QueueReceiveResult*](../modules/index.md#queuereceiveresult)<DequeuedMessageItem\>\>

Receive one or more messages from a queue.

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`queueName` | *string* | - |
`count` | *number* | 1 |

**Returns:** *Promise*<[*QueueReceiveResult*](../modules/index.md#queuereceiveresult)<DequeuedMessageItem\>\>

Defined in: [lib/QueueService.ts:301](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L301)

___

### send

▸ **send**(`queueName`: *string*, `message`: [*QueueMessageContent*](../modules/index.md#queuemessagecontent)): *Promise*<QueueSendMessageResponse\>

Send a single message to a queue.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |
`message` | [*QueueMessageContent*](../modules/index.md#queuemessagecontent) |

**Returns:** *Promise*<QueueSendMessageResponse\>

Defined in: [lib/QueueService.ts:343](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L343)

___

### sendAll

▸ **sendAll**(`queueName`: *string*, `messages`: [*QueueMessageContent*](../modules/index.md#queuemessagecontent)[]): *Promise*<QueueSendMessageResponse[]\>

Send multiple messages to a queue. Errors will bubble up to the array of results.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |
`messages` | [*QueueMessageContent*](../modules/index.md#queuemessagecontent)[] |

**Returns:** *Promise*<QueueSendMessageResponse[]\>

Defined in: [lib/QueueService.ts:330](https://github.com/nhsllc/azure-utils/blob/1d75559/lib/QueueService.ts#L330)
