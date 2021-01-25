[@nhsllc/azure-utils](../README.md) / [Exports](../modules.md) / BlockBlobService

# Class: BlockBlobService

Convenience wrapper for managing blob service instances gracefully.

```javascript
const { BlockBlobService } = require('@nhsllc/azure-utils')

module.exports = async function example (context) {
  const blobService = new BlockBlobService(process.env.STORAGE_CONNECTION)
  const container = 'examples'
  const json = { hello: 'world' }
  const str = 'Hello, world!'
  const buf = Buffer.from([20, 30, 40, 50])

  await blobService.write(container, 'test.json', json)
  await blobService.write(container, 'test.txt', str)
  await blobService.write(container, 'test.bin', buf)
}
```

## Hierarchy

* **BlockBlobService**

## Table of contents

### Constructors

- [constructor](blockblobservice.md#constructor)

### Properties

- [blobService](blockblobservice.md#blobservice)
- [containers](blockblobservice.md#containers)

### Methods

- [all](blockblobservice.md#all)
- [delete](blockblobservice.md#delete)
- [has](blockblobservice.md#has)
- [read](blockblobservice.md#read)
- [readWithFallback](blockblobservice.md#readwithfallback)
- [write](blockblobservice.md#write)

## Constructors

### constructor

\+ **new BlockBlobService**(`accountNameOrConnectionString`: *string*, `accountKey?`: *string*): [*BlockBlobService*](blockblobservice.md)

Convenience wrapper for managing blob service instances gracefully.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`accountNameOrConnectionString` | *string* | The account name or the connection string.   |
`accountKey?` | *string* | - |

**Returns:** [*BlockBlobService*](blockblobservice.md)

Defined in: [lib/BlockBlobService.ts:81](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L81)

## Properties

### blobService

• **blobService**: *BlobServiceClient*

Defined in: [lib/BlockBlobService.ts:99](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L99)

___

### containers

• **containers**: *BlobContainerManager*

Defined in: [lib/BlockBlobService.ts:100](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L100)

## Methods

### all

▸ **all**(`inputs`: [*BlobAllDelete*](../interfaces/bloballdelete.md)[]): *Promise*<*BlobDeleteIfExistsResponse*[]\>

Takes an array of inputs, and returns them using Promise.all in the order they were given.

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllDelete*](../interfaces/bloballdelete.md)[] |

**Returns:** *Promise*<*BlobDeleteIfExistsResponse*[]\>

Defined in: [lib/BlockBlobService.ts:201](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L201)

▸ **all**(`inputs`: [*BlobAllRead*](../interfaces/bloballread.md)[]): *Promise*<(*any*[] | *Buffer* | *Record*<*string*, *any*\>)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllRead*](../interfaces/bloballread.md)[] |

**Returns:** *Promise*<(*any*[] | *Buffer* | *Record*<*string*, *any*\>)[]\>

Defined in: [lib/BlockBlobService.ts:202](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L202)

▸ **all**(`inputs`: [*BlobAllWrite*](../interfaces/bloballwrite.md)[]): *Promise*<BlockBlobUploadResponse[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllWrite*](../interfaces/bloballwrite.md)[] |

**Returns:** *Promise*<BlockBlobUploadResponse[]\>

Defined in: [lib/BlockBlobService.ts:203](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L203)

▸ **all**(`inputs`: [*BlobAllInput*](../modules.md#bloballinput)[]): *Promise*<[*BlobAllResult*](../modules.md#bloballresult)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllInput*](../modules.md#bloballinput)[] |

**Returns:** *Promise*<[*BlobAllResult*](../modules.md#bloballresult)[]\>

Defined in: [lib/BlockBlobService.ts:204](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L204)

___

### delete

▸ **delete**(`blobContainer`: *string*, `blobName`: *string*): *Promise*<*BlobDeleteIfExistsResponse*\>

Delete a blob from a container.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`blobContainer` | *string* | The container for the blob.   |
`blobName` | *string* | The name of the blob.    |

**Returns:** *Promise*<*BlobDeleteIfExistsResponse*\>

Defined in: [lib/BlockBlobService.ts:120](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L120)

___

### has

▸ **has**(`blobContainer`: *string*, `blobName`: *string*): *Promise*<*boolean*\>

Check if a blob exists in a container.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`blobContainer` | *string* | The container for the blob.   |
`blobName` | *string* | The name of the blob.   |

**Returns:** *Promise*<*boolean*\>

The contents of the blob; objects and arrays will be jsonified.

Defined in: [lib/BlockBlobService.ts:108](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L108)

___

### read

▸ **read**(`blobContainer`: *string*, `blobName`: *string*): *Promise*<*Buffer*\>

Read a blob from a container, optionally parsing JSON.
Always returns a value; receive an empty buffer, or 'null' for empty JSON.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`blobContainer` | *string* | The container for the blob.   |
`blobName` | *string* | The name of the blob.   |

**Returns:** *Promise*<*Buffer*\>

The blob contents as a buffer instance.

Defined in: [lib/BlockBlobService.ts:159](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L159)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *false*): *Promise*<*Buffer*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *false* |

**Returns:** *Promise*<*Buffer*\>

Defined in: [lib/BlockBlobService.ts:160](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L160)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *true*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *true* |

**Returns:** *Promise*<*any*\>

Defined in: [lib/BlockBlobService.ts:161](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L161)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *boolean*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *boolean* |

**Returns:** *Promise*<*any*\>

Defined in: [lib/BlockBlobService.ts:162](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L162)

___

### readWithFallback

▸ **readWithFallback**(`blobContainer`: *string*, `blobName`: *string*, `fallbackBlobName`: *string*): *Promise*<*Buffer*\>

Read a blob with a fallback blob name.
Always returns a value; receive an empty buffer, or 'null' for empty JSON.

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`fallbackBlobName` | *string* |

**Returns:** *Promise*<*Buffer*\>

Defined in: [lib/BlockBlobService.ts:192](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L192)

___

### write

▸ **write**(`blobContainer`: *string*, `blobName`: *string*, `blobContent`: *string* | *any*[] | *Buffer* | *Record*<*string* | *number*, *any*\>): *Promise*<BlockBlobUploadResponse\>

Write a blob to a container, serializing objects and arrays to JSON.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`blobContainer` | *string* | The container for the blob.   |
`blobName` | *string* | The name of the blob.   |
`blobContent` | *string* | *any*[] | *Buffer* | *Record*<*string* | *number*, *any*\> | The contents of the blob; objects and arrays will be jsonified.    |

**Returns:** *Promise*<BlockBlobUploadResponse\>

Defined in: [lib/BlockBlobService.ts:136](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/BlockBlobService.ts#L136)
