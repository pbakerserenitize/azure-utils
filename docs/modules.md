[@nhsllc/azure-utils](README.md) / Exports

# @nhsllc/azure-utils

## Table of contents

### AzureUtility Classes

- [BlockBlobService](classes/blockblobservice.md)
- [TableWriter](classes/tablewriter.md)
- [TableWriterBatch](classes/tablewriterbatch.md)

### AzureUtility Interfaces

- [BlobAllBase](interfaces/bloballbase.md)
- [BlobAllDelete](interfaces/bloballdelete.md)
- [BlobAllRead](interfaces/bloballread.md)
- [BlobAllWrite](interfaces/bloballwrite.md)
- [LegacyTableRow](interfaces/legacytablerow.md)
- [QueueBlobMessage](interfaces/queueblobmessage.md)
- [TableRow](interfaces/tablerow.md)

### AzureUtility Type aliases

- [BlobAllInput](modules.md#bloballinput)

### Other Type aliases

- [BlobAllResult](modules.md#bloballresult)
- [BlobOperation](modules.md#bloboperation)
- [TableWriterMessage](modules.md#tablewritermessage)

### AzureFunctionHelper Variables

- [FunctionHelpers](modules.md#functionhelpers)

## AzureUtility Type aliases

### BlobAllInput

Ƭ **BlobAllInput**: [*BlobAllDelete*](interfaces/bloballdelete.md) | [*BlobAllRead*](interfaces/bloballread.md) | [*BlobAllWrite*](interfaces/bloballwrite.md)

Helper union type for `BlockBlobService.all`.

Defined in: [lib/Interfaces.ts:45](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L45)

___

## Other Type aliases

### BlobAllResult

Ƭ **BlobAllResult**: BlobDeleteIfExistsResponse | Buffer | *Record*<*string*, *any*\> | *any*[] | *null* | BlockBlobUploadResponse

Defined in: [lib/Interfaces.ts:8](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L8)

___

### BlobOperation

Ƭ **BlobOperation**: *delete* | *read* | *write*

Defined in: [lib/Interfaces.ts:7](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/Interfaces.ts#L7)

___

### TableWriterMessage

Ƭ **TableWriterMessage**: *Partial*<*Omit*<[*TableWriter*](classes/tablewriter.md), *tableRows*\>\> & { `tableRows?`: ([*LegacyTableRow*](interfaces/legacytablerow.md) | [*TableRow*](interfaces/tablerow.md))[] ; `writeType?`: TableOperation  }

Defined in: [lib/TableWriter.ts:44](https://github.com/nhsllc/azure-utils/blob/be2dce5/lib/TableWriter.ts#L44)

## AzureFunctionHelper Variables

### FunctionHelpers

• `Const` **FunctionHelpers**: \_\_module

Named export of all Azure Function helpers and interfaces.

Defined in: [index.ts:11](https://github.com/nhsllc/azure-utils/blob/be2dce5/index.ts#L11)
