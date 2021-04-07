[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / ProcessQueue

# Class: ProcessQueue<T\>

[index](../modules/index.md).ProcessQueue

A helper class for processing a count of messages from a queue.
Not intended to be used directly; exported for type information.

## Type parameters

Name | Default |
:------ | :------ |
`T` | *any* |

## Implements

* *AsyncIterable*<[*DequeuedMessage*](index.dequeuedmessage.md)<T\>\>

## Table of contents

### Constructors

- [constructor](index.processqueue.md#constructor)

### Properties

- [\_cancel](index.processqueue.md#_cancel)
- [\_poison](index.processqueue.md#_poison)
- [\_skip](index.processqueue.md#_skip)
- [count](index.processqueue.md#count)
- [poisonQueueName](index.processqueue.md#poisonqueuename)
- [queueName](index.processqueue.md#queuename)
- [queueService](index.processqueue.md#queueservice)

### Methods

- [[Symbol.asyncIterator]](index.processqueue.md#[symbol.asynciterator])
- [cancel](index.processqueue.md#cancel)
- [poison](index.processqueue.md#poison)
- [skip](index.processqueue.md#skip)

## Constructors

### constructor

\+ **new ProcessQueue**<T\>(`queueName`: *string*, `count`: *number*, `queueService`: [*QueueService*](index.queueservice.md)): [*ProcessQueue*](index.processqueue.md)<T\>

Constructs an instance of the ProcessQueue async iterator.

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`queueName` | *string* |
`count` | *number* |
`queueService` | [*QueueService*](index.queueservice.md) |

**Returns:** [*ProcessQueue*](index.processqueue.md)<T\>

Defined in: [lib/QueueService.ts:105](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L105)

## Properties

### \_cancel

• `Private` **\_cancel**: *boolean*

Defined in: [lib/QueueService.ts:121](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L121)

___

### \_poison

• `Private` **\_poison**: *boolean*

Defined in: [lib/QueueService.ts:122](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L122)

___

### \_skip

• `Private` **\_skip**: *boolean*

Defined in: [lib/QueueService.ts:120](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L120)

___

### count

• `Private` `Readonly` **count**: *number*

Defined in: [lib/QueueService.ts:119](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L119)

___

### poisonQueueName

• `Private` `Readonly` **poisonQueueName**: *string*

Defined in: [lib/QueueService.ts:117](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L117)

___

### queueName

• `Private` `Readonly` **queueName**: *string*

Defined in: [lib/QueueService.ts:116](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L116)

___

### queueService

• `Private` `Readonly` **queueService**: [*QueueService*](index.queueservice.md)

Defined in: [lib/QueueService.ts:118](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L118)

## Methods

### [Symbol.asyncIterator]

▸ **[Symbol.asyncIterator]**(): *AsyncGenerator*<[*DequeuedMessage*](index.dequeuedmessage.md)<T\>, any, unknown\>

**Returns:** *AsyncGenerator*<[*DequeuedMessage*](index.dequeuedmessage.md)<T\>, any, unknown\>

Implementation of: void

Defined in: [lib/QueueService.ts:145](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L145)

___

### cancel

▸ **cancel**(): *void*

Skip deleting the current message off the queue and stop processing all remaining messages.

**Returns:** *void*

Defined in: [lib/QueueService.ts:125](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L125)

___

### poison

▸ **poison**(): *void*

Send the message to a poison queue corresponding to the instance queue name.

**Returns:** *void*

Defined in: [lib/QueueService.ts:139](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L139)

___

### skip

▸ **skip**(): *void*

Skip deleting the current message off the queue.

**Returns:** *void*

Defined in: [lib/QueueService.ts:132](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/QueueService.ts#L132)
