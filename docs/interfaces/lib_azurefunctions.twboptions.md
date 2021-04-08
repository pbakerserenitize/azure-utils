[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [lib/AzureFunctions](../modules/lib_azurefunctions.md) / TWBOptions

# Interface: TWBOptions

[lib/AzureFunctions](../modules/lib_azurefunctions.md).TWBOptions

Options for Azure Function helper `tableWriterBatch`.

## Table of contents

### Properties

- [allConnections](lib_azurefunctions.twboptions.md#allconnections)
- [blobConnection](lib_azurefunctions.twboptions.md#blobconnection)
- [logger](lib_azurefunctions.twboptions.md#logger)
- [queue](lib_azurefunctions.twboptions.md#queue)
- [tableConnection](lib_azurefunctions.twboptions.md#tableconnection)

## Properties

### allConnections

• `Optional` **allConnections**: *string*

Connection string override for all connections.

Defined in: [lib/AzureFunctions/Interfaces.ts:6](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/AzureFunctions/Interfaces.ts#L6)

___

### blobConnection

• `Optional` **blobConnection**: *string*

Connection string to use for blob storage.

Defined in: [lib/AzureFunctions/Interfaces.ts:8](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/AzureFunctions/Interfaces.ts#L8)

___

### logger

• `Optional` **logger**: *object*

A logger-like object with an `error` method.

#### Type declaration:

Name | Type |
:------ | :------ |
`error` | (...`args`: *any*[]) => *any* |

Defined in: [lib/AzureFunctions/Interfaces.ts:21](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/AzureFunctions/Interfaces.ts#L21)

___

### queue

• **queue**: *object*

Options for retrieving messages from the queue.

#### Type declaration:

Name | Type | Description |
:------ | :------ | :------ |
`connection`? | *string* | Connection string for the queue. May be overridden by property `allConnections`.   |
`name` | *string* | Name of the queue to read from, where TableWriter queue messages live.   |
`numberOfMessages`? | *number* | The number of messages to retrieve from the queue. Defaults to 32, will accept any number greater than zero.   |

Defined in: [lib/AzureFunctions/Interfaces.ts:10](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/AzureFunctions/Interfaces.ts#L10)

___

### tableConnection

• `Optional` **tableConnection**: *string*

Connection string to use for table storage.

Defined in: [lib/AzureFunctions/Interfaces.ts:19](https://github.com/nhsllc/azure-utils/blob/99cc53d/lib/AzureFunctions/Interfaces.ts#L19)
