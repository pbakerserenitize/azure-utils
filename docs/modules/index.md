[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### AzureUtility Classes

- [BlockBlobService](../classes/index.blockblobservice.md)
- [TableWriter](../classes/index.tablewriter.md)
- [TableWriterBatch](../classes/index.tablewriterbatch.md)

### AzureUtility Interfaces

- [BlobAllBase](../interfaces/index.bloballbase.md)
- [BlobAllDelete](../interfaces/index.bloballdelete.md)
- [BlobAllRead](../interfaces/index.bloballread.md)
- [BlobAllWrite](../interfaces/index.bloballwrite.md)
- [LegacyTableRow](../interfaces/index.legacytablerow.md)
- [QueueBlobMessage](../interfaces/index.queueblobmessage.md)
- [TableRow](../interfaces/index.tablerow.md)

### AzureUtility Type aliases

- [BlobAllInput](index.md#bloballinput)

### Other Type aliases

- [BlobAllResult](index.md#bloballresult)
- [BlobOperation](index.md#bloboperation)
- [TableWriterMessage](index.md#tablewritermessage)

### AzureFunctionHelper Variables

- [FunctionHelpers](index.md#functionhelpers)

## AzureUtility Type aliases

### BlobAllInput

Ƭ **BlobAllInput**: [*BlobAllDelete*](../interfaces/index.bloballdelete.md) \| [*BlobAllRead*](../interfaces/index.bloballread.md) \| [*BlobAllWrite*](../interfaces/index.bloballwrite.md)

Helper union type for `BlockBlobService.all`.

Defined in: [lib/Interfaces.ts:46](https://github.com/nhsllc/azure-utils/blob/183635e/lib/Interfaces.ts#L46)

___

## Other Type aliases

### BlobAllResult

Ƭ **BlobAllResult**: BlobDeleteIfExistsResponse \| Buffer \| *Record*<string, any\> \| *any*[] \| *null* \| BlockBlobUploadResponse

Defined in: [lib/Interfaces.ts:8](https://github.com/nhsllc/azure-utils/blob/183635e/lib/Interfaces.ts#L8)

___

### BlobOperation

Ƭ **BlobOperation**: *delete* \| *read* \| *write*

Defined in: [lib/Interfaces.ts:7](https://github.com/nhsllc/azure-utils/blob/183635e/lib/Interfaces.ts#L7)

___

### TableWriterMessage

Ƭ **TableWriterMessage**: *Partial*<Omit<[*TableWriter*](../classes/index.tablewriter.md), *tableRows*\>\> & { `tableRows?`: ([*LegacyTableRow*](../interfaces/index.legacytablerow.md) \| [*TableRow*](../interfaces/index.tablerow.md))[] ; `writeType?`: TableOperation  }

Defined in: [lib/TableWriter.ts:44](https://github.com/nhsllc/azure-utils/blob/183635e/lib/TableWriter.ts#L44)

## AzureFunctionHelper Variables

### FunctionHelpers

• `Const` **FunctionHelpers**: [*lib/AzureFunctions*](lib_azurefunctions.md)

Named export of all Azure Function helpers and interfaces.

Defined in: [index.ts:11](https://github.com/nhsllc/azure-utils/blob/183635e/index.ts#L11)
