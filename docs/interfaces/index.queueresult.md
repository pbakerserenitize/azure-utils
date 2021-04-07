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

Defined in: [lib/Interfaces.ts:84](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/Interfaces.ts#L84)

___

### hasMessages

• **hasMessages**: *boolean*

Defined in: [lib/Interfaces.ts:85](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/Interfaces.ts#L85)

___

### messageItems

• **messageItems**: TItems[]

Defined in: [lib/Interfaces.ts:87](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/Interfaces.ts#L87)

___

### responses

• **responses**: TResponse[]

Defined in: [lib/Interfaces.ts:88](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/Interfaces.ts#L88)

___

### resultType

• **resultType**: TResultType

Defined in: [lib/Interfaces.ts:86](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/Interfaces.ts#L86)
