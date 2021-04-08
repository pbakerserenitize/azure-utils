[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### AzureUtility Classes

- [BlockBlobService](../classes/index.blockblobservice.md)
- [DequeuedMessage](../classes/index.dequeuedmessage.md)
- [ProcessQueue](../classes/index.processqueue.md)
- [QueueService](../classes/index.queueservice.md)
- [TableWriter](../classes/index.tablewriter.md)
- [TableWriterBatch](../classes/index.tablewriterbatch.md)

### AzureUtility Interfaces

- [BlobAllBase](../interfaces/index.bloballbase.md)
- [BlobAllDelete](../interfaces/index.bloballdelete.md)
- [BlobAllRead](../interfaces/index.bloballread.md)
- [BlobAllWrite](../interfaces/index.bloballwrite.md)
- [LegacyTableRow](../interfaces/index.legacytablerow.md)
- [QueueBlobMessage](../interfaces/index.queueblobmessage.md)
- [QueueResult](../interfaces/index.queueresult.md)
- [TableRow](../interfaces/index.tablerow.md)

### AzureUtility Type aliases

- [BlobAllInput](index.md#bloballinput)
- [BlobAllResult](index.md#bloballresult)
- [BlobOperation](index.md#bloboperation)
- [QueueMessageContent](index.md#queuemessagecontent)
- [QueuePeekResult](index.md#queuepeekresult)
- [QueueReceiveResult](index.md#queuereceiveresult)
- [QueueResultType](index.md#queueresulttype)
- [TableOperation](index.md#tableoperation)
- [TableWriterMessage](index.md#tablewritermessage)

### AzureFunctionHelper Variables

- [FunctionHelpers](index.md#functionhelpers)

## AzureUtility Type aliases

### BlobAllInput

Ƭ **BlobAllInput**: [*BlobAllDelete*](../interfaces/index.bloballdelete.md) \| [*BlobAllRead*](../interfaces/index.bloballread.md) \| [*BlobAllWrite*](../interfaces/index.bloballwrite.md)

Helper union type for `BlockBlobService.all`.

Defined in: [lib/Interfaces.ts:51](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L51)

___

### BlobAllResult

Ƭ **BlobAllResult**: BlobDeleteIfExistsResponse \| Buffer \| *Record*<string, any\> \| *any*[] \| *null* \| BlockBlobUploadResponse

Defined in: [lib/Interfaces.ts:11](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L11)

___

### BlobOperation

Ƭ **BlobOperation**: *delete* \| *read* \| *write*

Defined in: [lib/Interfaces.ts:9](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L9)

___

### QueueMessageContent

Ƭ **QueueMessageContent**: *string* \| *number* \| *Record*<string, any\> \| *any*[]

Valid queue message types.

Defined in: [lib/Interfaces.ts:108](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L108)

___

### QueuePeekResult

Ƭ **QueuePeekResult**<T\>: [*QueueResult*](../interfaces/index.queueresult.md)<*peek*, T, QueuePeekMessagesResponse\>

The queue peek result.

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

Defined in: [lib/Interfaces.ts:98](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L98)

___

### QueueReceiveResult

Ƭ **QueueReceiveResult**<T\>: [*QueueResult*](../interfaces/index.queueresult.md)<*receive*, T, QueueReceiveMessageResponse\>

The queue receive result.

#### Type parameters:

Name | Default |
:------ | :------ |
`T` | *any* |

Defined in: [lib/Interfaces.ts:103](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L103)

___

### QueueResultType

Ƭ **QueueResultType**: *peek* \| *receive*

The queue result type.

Defined in: [lib/Interfaces.ts:82](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L82)

___

### TableOperation

Ƭ **TableOperation**: *delete* \| *merge* \| *replace*

Defined in: [lib/Interfaces.ts:13](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/Interfaces.ts#L13)

___

### TableWriterMessage

Ƭ **TableWriterMessage**: *Partial*<Omit<[*TableWriter*](../classes/index.tablewriter.md), *tableRows*\>\> & { `tableRows?`: ([*LegacyTableRow*](../interfaces/index.legacytablerow.md) \| [*TableRow*](../interfaces/index.tablerow.md))[] ; `writeType?`: [*TableOperation*](index.md#tableoperation)  }

Defined in: [lib/TableWriter.ts:8](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/TableWriter.ts#L8)

## AzureFunctionHelper Variables

### FunctionHelpers

• `Const` **FunctionHelpers**: [*lib/AzureFunctions*](lib_azurefunctions.md)

Named export of all Azure Function helpers and interfaces.

Defined in: [index.ts:12](https://github.com/nhsllc/azure-utils/blob/99cc53d/index.ts#L12)
