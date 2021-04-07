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
    // For this example only, deserializing the message results in an array.
    const obj = message.toJSObject()

    if (Array.isArray(obj)) {
      for (const item of obj) {
        console.log(item.message)
      }
    } else {
      // OH NO'S!! ME NO GOOD!
      console.error("I don't feel well.", message.messageId)
      // The following method call will create a poison queue if it does not exist,
      // and shuffles the message over to that queue
      queue.poison()
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

Defined in: [lib/QueueService.ts:254](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L254)

\+ **new QueueService**(`accountName`: *string*, `accountKey`: *string*): [*QueueService*](index.queueservice.md)

Create an instance with an account name and key.

#### Parameters:

Name | Type |
:------ | :------ |
`accountName` | *string* |
`accountKey` | *string* |

**Returns:** [*QueueService*](index.queueservice.md)

Defined in: [lib/QueueService.ts:256](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L256)

## Properties

### queueService

• **queueService**: *QueueServiceClient*

Defined in: [lib/QueueService.ts:272](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L272)

___

### queues

• **queues**: *QueueReferenceManager*

Defined in: [lib/QueueService.ts:273](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L273)

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

Defined in: [lib/QueueService.ts:385](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L385)

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

Defined in: [lib/QueueService.ts:372](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L372)

___

### peek

▸ **peek**(`queueName`: *string*): *Promise*<[*QueuePeekResult*](../modules/index.md#queuepeekresult)<PeekedMessageItem\>\>

Peek to see if a queue has one or more messages. Retrieves no more than 1 message.

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |

**Returns:** *Promise*<[*QueuePeekResult*](../modules/index.md#queuepeekresult)<PeekedMessageItem\>\>

Defined in: [lib/QueueService.ts:276](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L276)

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

Defined in: [lib/QueueService.ts:392](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L392)

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

Defined in: [lib/QueueService.ts:299](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L299)

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

Defined in: [lib/QueueService.ts:341](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L341)

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

Defined in: [lib/QueueService.ts:328](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L328)
