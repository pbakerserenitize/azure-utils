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

Defined in: [lib/Interfaces.ts:15](https://github.com/nhsllc/azure-utils/blob/a788737/lib/Interfaces.ts#L15)

___

### content

• **content**: *string* | *any*[] | *Buffer* | *Record*<*string* | *number*, *any*\>

Defined in: [lib/Interfaces.ts:39](https://github.com/nhsllc/azure-utils/blob/a788737/lib/Interfaces.ts#L39)

___

### name

• **name**: *string*

Inherited from: [BlobAllBase](index.bloballbase.md).[name](index.bloballbase.md#name)

Defined in: [lib/Interfaces.ts:16](https://github.com/nhsllc/azure-utils/blob/a788737/lib/Interfaces.ts#L16)

___

### operation

• **operation**: *write*

Overrides: [BlobAllBase](index.bloballbase.md).[operation](index.bloballbase.md#operation)

Defined in: [lib/Interfaces.ts:38](https://github.com/nhsllc/azure-utils/blob/a788737/lib/Interfaces.ts#L38)
