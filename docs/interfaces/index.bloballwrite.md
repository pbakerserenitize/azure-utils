[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / BlobAllWrite

# Interface: BlobAllWrite

[index](../modules/index.md).BlobAllWrite

Helper interface for `BlockBlobService.all`.

## Hierarchy

* [*BlobAllBase*](index.bloballbase.md)

  ↳ **BlobAllWrite**

## Table of contents

### Properties

- [container](index.bloballwrite.md#container)
- [content](index.bloballwrite.md#content)
- [name](index.bloballwrite.md#name)
- [operation](index.bloballwrite.md#operation)

## Properties

### container

• **container**: *string*

Inherited from: [BlobAllBase](index.bloballbase.md).[container](index.bloballbase.md#container)

Defined in: [lib/Interfaces.ts:16](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/Interfaces.ts#L16)

___

### content

• **content**: *string* \| *any*[] \| *Buffer* \| *Record*<string \| number, any\>

Defined in: [lib/Interfaces.ts:41](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/Interfaces.ts#L41)

___

### name

• **name**: *string*

Inherited from: [BlobAllBase](index.bloballbase.md).[name](index.bloballbase.md#name)

Defined in: [lib/Interfaces.ts:17](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/Interfaces.ts#L17)

___

### operation

• **operation**: *write*

Overrides: [BlobAllBase](index.bloballbase.md).[operation](index.bloballbase.md#operation)

Defined in: [lib/Interfaces.ts:40](https://github.com/nhsllc/azure-utils/blob/bc78d50/lib/Interfaces.ts#L40)
