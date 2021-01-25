[@nhsllc/azure-utils](../index.md) / [Exports](../modules.md) / BlockBlobService

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

Defined in: [lib/BlockBlobService.ts:99](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L99)

## Properties

### blobService

• **blobService**: *BlobServiceClient*

Defined in: [lib/BlockBlobService.ts:117](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L117)

___

### containers

• **containers**: *BlobContainerManager*

Defined in: [lib/BlockBlobService.ts:118](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L118)

## Methods

### all

▸ **all**(`inputs`: [*BlobAllDelete*](../interfaces/bloballdelete.md)[]): *Promise*<*BlobDeleteIfExistsResponse*[]\>

Takes an array of inputs, and returns them using Promise.all in the order they were given.

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllDelete*](../interfaces/bloballdelete.md)[] |

**Returns:** *Promise*<*BlobDeleteIfExistsResponse*[]\>

Defined in: [lib/BlockBlobService.ts:219](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L219)

▸ **all**(`inputs`: [*BlobAllRead*](../interfaces/bloballread.md)[]): *Promise*<(*any*[] | *Buffer* | *Record*<*string*, *any*\>)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllRead*](../interfaces/bloballread.md)[] |

**Returns:** *Promise*<(*any*[] | *Buffer* | *Record*<*string*, *any*\>)[]\>

Defined in: [lib/BlockBlobService.ts:220](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L220)

▸ **all**(`inputs`: [*BlobAllWrite*](../interfaces/bloballwrite.md)[]): *Promise*<BlockBlobUploadResponse[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllWrite*](../interfaces/bloballwrite.md)[] |

**Returns:** *Promise*<BlockBlobUploadResponse[]\>

Defined in: [lib/BlockBlobService.ts:221](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L221)

▸ **all**(`inputs`: [*BlobAllInput*](../modules.md#bloballinput)[]): *Promise*<[*BlobAllResult*](../modules.md#bloballresult)[]\>

#### Parameters:

Name | Type |
------ | ------ |
`inputs` | [*BlobAllInput*](../modules.md#bloballinput)[] |

**Returns:** *Promise*<[*BlobAllResult*](../modules.md#bloballresult)[]\>

Defined in: [lib/BlockBlobService.ts:222](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L222)

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

Defined in: [lib/BlockBlobService.ts:138](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L138)

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

Defined in: [lib/BlockBlobService.ts:126](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L126)

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

Defined in: [lib/BlockBlobService.ts:177](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L177)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *false*): *Promise*<*Buffer*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *false* |

**Returns:** *Promise*<*Buffer*\>

Defined in: [lib/BlockBlobService.ts:178](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L178)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *true*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *true* |

**Returns:** *Promise*<*any*\>

Defined in: [lib/BlockBlobService.ts:179](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L179)

▸ **read**(`blobContainer`: *string*, `blobName`: *string*, `json`: *boolean*): *Promise*<*any*\>

#### Parameters:

Name | Type |
------ | ------ |
`blobContainer` | *string* |
`blobName` | *string* |
`json` | *boolean* |

**Returns:** *Promise*<*any*\>

Defined in: [lib/BlockBlobService.ts:180](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L180)

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

Defined in: [lib/BlockBlobService.ts:210](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L210)

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

Defined in: [lib/BlockBlobService.ts:154](https://github.com/nhsllc/azure-utils/blob/ed89cf0/lib/BlockBlobService.ts#L154)
