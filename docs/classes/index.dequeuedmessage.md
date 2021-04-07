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

Defined in: [lib/QueueService.ts:51](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L51)

## Properties

### dequeueCount

• **dequeueCount**: *number*

Implementation of: void

Defined in: [lib/QueueService.ts:62](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L62)

___

### error

• `Optional` **error**: Error

If defined, should contain an instance of Error describing why `toBuffer` or `toJSObject` failed.

Defined in: [lib/QueueService.ts:70](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L70)

___

### expiresOn

• **expiresOn**: Date

Implementation of: void

Defined in: [lib/QueueService.ts:63](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L63)

___

### insertedOn

• **insertedOn**: Date

Implementation of: void

Defined in: [lib/QueueService.ts:64](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L64)

___

### messageId

• **messageId**: *string*

Implementation of: void

Defined in: [lib/QueueService.ts:65](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L65)

___

### messageText

• **messageText**: *string*

Implementation of: void

Defined in: [lib/QueueService.ts:66](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L66)

___

### nextVisibleOn

• **nextVisibleOn**: Date

Implementation of: void

Defined in: [lib/QueueService.ts:67](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L67)

___

### popReceipt

• **popReceipt**: *string*

Implementation of: void

Defined in: [lib/QueueService.ts:68](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L68)

## Methods

### toBuffer

▸ **toBuffer**(): *Buffer*

Convert a base64 string to a Buffer.

**Returns:** *Buffer*

Defined in: [lib/QueueService.ts:73](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L73)

___

### toJSObject

▸ **toJSObject**(): T

Convert a base64 string to an object.

**Returns:** T

Defined in: [lib/QueueService.ts:84](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/QueueService.ts#L84)
