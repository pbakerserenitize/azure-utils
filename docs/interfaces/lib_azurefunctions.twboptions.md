[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [lib/AzureFunctions](../modules/lib_azurefunctions.md) / TWBOptions

# Interface: TWBOptions

[lib/AzureFunctions](../modules/lib_azurefunctions.md).TWBOptions

Options for Azure Function helper `tableWriterBatch`.

## Table of contents

### Properties

- [allConnections](lib_azurefunctions.twboptions.md#allconnections)
- [blobConnection](lib_azurefunctions.twboptions.md#blobconnection)
- [queue](lib_azurefunctions.twboptions.md#queue)
- [tableConnection](lib_azurefunctions.twboptions.md#tableconnection)

## Properties

### allConnections

• `Optional` **allConnections**: *string*

Connection string override for all connections.

Defined in: [lib/AzureFunctions/Interfaces.ts:6](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/AzureFunctions/Interfaces.ts#L6)

___

### blobConnection

• `Optional` **blobConnection**: *string*

Connection string to use for blob storage.

Defined in: [lib/AzureFunctions/Interfaces.ts:8](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/AzureFunctions/Interfaces.ts#L8)

___

### queue

• **queue**: *object*

Options for retrieving messages from the queue.

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`connection`? | *string* | Connection string for the queue. May be overridden by property `allConnections`.   |
`name` | *string* | Name of the queue to read from, where TableWriter queue messages live.   |
`numberOfMessages`? | *number* | The number of messages to retrieve from the queue. Defaults to the max of 32.   |

Defined in: [lib/AzureFunctions/Interfaces.ts:10](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/AzureFunctions/Interfaces.ts#L10)

___

### tableConnection

• `Optional` **tableConnection**: *string*

Connection string to use for table storage.

Defined in: [lib/AzureFunctions/Interfaces.ts:19](https://github.com/nhsllc/azure-utils/blob/7c240ec/lib/AzureFunctions/Interfaces.ts#L19)
