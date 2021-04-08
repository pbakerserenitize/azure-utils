[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / DequeuedMessage

# Class: DequeuedMessage<T\>

[index](../modules/index.md).DequeuedMessage

Wrapper for easy handling of queue messages returned by `receive` or `process` methods.
Not intended to be used directly; exported for type information.

## Type parameters

Name | Default |
:------ | :------ |
`T` | *any* |

## Implements

* *DequeuedMessageItem*

## Table of contents

### Constructors

- [constructor](index.dequeuedmessage.md#constructor)

### Properties

- [dequeueCount](index.dequeuedmessage.md#dequeuecount)
- [error](index.dequeuedmessage.md#error)
- [expiresOn](index.dequeuedmessage.md#expireson)
- [insertedOn](index.dequeuedmessage.md#insertedon)
- [messageId](index.dequeuedmessage.md#messageid)
- [messageText](index.dequeuedmessage.md#messagetext)
- [nextVisibleOn](index.dequeuedmessage.md#nextvisibleon)
- [popReceipt](index.dequeuedmessage.md#popreceipt)

### Methods

- [toBuffer](index.dequeuedmessage.md#tobuffer)
- [toJSObject](index.dequeuedmessage.md#tojsobject)

## Constructors

### constructor

\+ **new DequeuedMessage**<T\>(`dequeuedMessage`: DequeuedMessageItem): [*DequeuedMessage*](index.dequeuedmessage.md)<T\>

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

#### Parameters:

Name | Type |
:------ | :------ |
`dequeuedMessage` | DequeuedMessageItem |

**Returns:** [*DequeuedMessage*](index.dequeuedmessage.md)<T\>

Defined in: [lib/QueueService.ts:17](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L17)

## Properties

### dequeueCount

• **dequeueCount**: *number*

Implementation of: DequeuedMessageItem.dequeueCount

Defined in: [lib/QueueService.ts:28](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L28)

___

### error

• `Optional` **error**: Error

If defined, should contain an instance of Error describing why `toBuffer` or `toJSObject` failed.

Defined in: [lib/QueueService.ts:36](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L36)

___

### expiresOn

• **expiresOn**: Date

Implementation of: DequeuedMessageItem.expiresOn

Defined in: [lib/QueueService.ts:29](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L29)

___

### insertedOn

• **insertedOn**: Date

Implementation of: DequeuedMessageItem.insertedOn

Defined in: [lib/QueueService.ts:30](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L30)

___

### messageId

• **messageId**: *string*

Implementation of: DequeuedMessageItem.messageId

Defined in: [lib/QueueService.ts:31](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L31)

___

### messageText

• **messageText**: *string*

Implementation of: DequeuedMessageItem.messageText

Defined in: [lib/QueueService.ts:32](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L32)

___

### nextVisibleOn

• **nextVisibleOn**: Date

Implementation of: DequeuedMessageItem.nextVisibleOn

Defined in: [lib/QueueService.ts:33](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L33)

___

### popReceipt

• **popReceipt**: *string*

Implementation of: DequeuedMessageItem.popReceipt

Defined in: [lib/QueueService.ts:34](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L34)

## Methods

### toBuffer

▸ **toBuffer**(): *Buffer*

Convert a base64 string to a Buffer.

**Returns:** *Buffer*

Defined in: [lib/QueueService.ts:39](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L39)

___

### toJSObject

▸ **toJSObject**(): T

Convert a base64 string to an object.

**Returns:** T

Defined in: [lib/QueueService.ts:54](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/QueueService.ts#L54)
