[@nhsllc/azure-utils](README.md) / Exports

# @nhsllc/azure-utils

## Table of contents

### AzureUtility Classes

- [BlockBlobService](classes/blockblobservice.md)
- [TableWriter](classes/tablewriter.md)
- [TableWriterBatch](classes/tablewriterbatch.md)

### AzureUtility Interfaces

- [LegacyTableRow](interfaces/legacytablerow.md)
- [QueueBlobMessage](interfaces/queueblobmessage.md)
- [TableRow](interfaces/tablerow.md)

### Other Interfaces

- [BlobAllBase](interfaces/bloballbase.md)
- [BlobAllDelete](interfaces/bloballdelete.md)
- [BlobAllRead](interfaces/bloballread.md)
- [BlobAllWrite](interfaces/bloballwrite.md)

### Type aliases

- [BlobAllInput](modules.md#bloballinput)
- [BlobAllResult](modules.md#bloballresult)
- [BlobOperation](modules.md#bloboperation)
- [TableWriterMessage](modules.md#tablewritermessage)

### AzureFunctionHelper Variables

- [FunctionHelpers](modules.md#functionhelpers)

## Type aliases

### BlobAllInput

Ƭ **BlobAllInput**: [*BlobAllDelete*](interfaces/bloballdelete.md) | [*BlobAllRead*](interfaces/bloballread.md) | [*BlobAllWrite*](interfaces/bloballwrite.md)

Defined in: [lib/BlockBlobService.ts:32](https://github.com/nhsllc/azure-utils/blob/6ef1e3a/lib/BlockBlobService.ts#L32)

___

### BlobAllResult

Ƭ **BlobAllResult**: BlobDeleteIfExistsResponse | Buffer | *Record*<*string*, *any*\> | *any*[] | *null* | BlockBlobUploadResponse

Defined in: [lib/BlockBlobService.ts:10](https://github.com/nhsllc/azure-utils/blob/6ef1e3a/lib/BlockBlobService.ts#L10)

___

### BlobOperation

Ƭ **BlobOperation**: *delete* | *read* | *write*

Defined in: [lib/BlockBlobService.ts:9](https://github.com/nhsllc/azure-utils/blob/6ef1e3a/lib/BlockBlobService.ts#L9)

___

### TableWriterMessage

Ƭ **TableWriterMessage**: *Partial*<*Omit*<[*TableWriter*](classes/tablewriter.md), *tableRows*\>\> & { `tableRows?`: ([*LegacyTableRow*](interfaces/legacytablerow.md) | [*TableRow*](interfaces/tablerow.md))[] ; `writeType?`: TableOperation  }

Defined in: [lib/TableWriter.ts:44](https://github.com/nhsllc/azure-utils/blob/6ef1e3a/lib/TableWriter.ts#L44)

## AzureFunctionHelper Variables

### FunctionHelpers

• `Const` **FunctionHelpers**: \_\_module

Named export of all Azure Function helpers and interfaces.

Defined in: [index.ts:11](https://github.com/nhsllc/azure-utils/blob/6ef1e3a/index.ts#L11)
