[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / QueueResult

# Interface: QueueResult<TResultType, TItems, TResponse\>

[index](../modules/index.md).QueueResult

The queue result base.

## Type parameters

Name | Type | Default |
:------ | :------ | :------ |
`TResultType` | [*QueueResultType*](../modules/index.md#queueresulttype) | - |
`TItems` | - | *any* |
`TResponse` | - | *any* |

## Table of contents

### Properties

- [date](index.queueresult.md#date)
- [hasMessages](index.queueresult.md#hasmessages)
- [messageItems](index.queueresult.md#messageitems)
- [responses](index.queueresult.md#responses)
- [resultType](index.queueresult.md#resulttype)

## Properties

### date

• **date**: Date

Defined in: [lib/Interfaces.ts:88](https://github.com/nhsllc/azure-utils/blob/b48d4d0/lib/Interfaces.ts#L88)

___

### hasMessages

• **hasMessages**: *boolean*

Defined in: [lib/Interfaces.ts:89](https://github.com/nhsllc/azure-utils/blob/b48d4d0/lib/Interfaces.ts#L89)

___

### messageItems

• **messageItems**: TItems[]

Defined in: [lib/Interfaces.ts:91](https://github.com/nhsllc/azure-utils/blob/b48d4d0/lib/Interfaces.ts#L91)

___

### responses

• **responses**: TResponse[]

Defined in: [lib/Interfaces.ts:92](https://github.com/nhsllc/azure-utils/blob/b48d4d0/lib/Interfaces.ts#L92)

___

### resultType

• **resultType**: TResultType

Defined in: [lib/Interfaces.ts:90](https://github.com/nhsllc/azure-utils/blob/b48d4d0/lib/Interfaces.ts#L90)
