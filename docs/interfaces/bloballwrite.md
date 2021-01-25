[@nhsllc/azure-utils](../README.md) / [Exports](../modules.md) / BlobAllWrite

# Interface: BlobAllWrite

Helper interface for `BlockBlobService.all`.

## Hierarchy

* [*BlobAllBase*](bloballbase.md)

  ↳ **BlobAllWrite**

## Table of contents

### Properties

- [container](bloballwrite.md#container)
- [content](bloballwrite.md#content)
- [name](bloballwrite.md#name)
- [operation](bloballwrite.md#operation)

## Properties

### container

• **container**: *string*

Inherited from: [BlobAllBase](bloballbase.md).[container](bloballbase.md#container)

Defined in: [lib/Interfaces.ts:15](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L15)

___

### content

• **content**: *string* | *any*[] | *Buffer* | *Record*<*string* | *number*, *any*\>

Defined in: [lib/Interfaces.ts:39](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L39)

___

### name

• **name**: *string*

Inherited from: [BlobAllBase](bloballbase.md).[name](bloballbase.md#name)

Defined in: [lib/Interfaces.ts:16](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L16)

___

### operation

• **operation**: *write*

Overrides: [BlobAllBase](bloballbase.md).[operation](bloballbase.md#operation)

Defined in: [lib/Interfaces.ts:38](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L38)
