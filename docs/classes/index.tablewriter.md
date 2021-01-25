[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / TableWriter

# Class: TableWriter

[index](../modules/index.md).TableWriter

Class for managing a complete round-trip of one or more table rows for upsert into Azure Table Storage.

```javascript
const { TableWriter } = require('@nhsllc/azure-utils')

module.exports = async function example (context) {
  const tableRows = [] // Fill up this array with table rows of the same partition key
  const tableWriter = new TableWriter({
    tableName: 'ExampleTable',
    tableRows
  })

  return {
    tableBatcher: await tableWriter.toQueueMessage(process.env.STORAGE_CONNECTION)
  }
}
```

## Hierarchy

* **TableWriter**

## Table of contents

### Constructors

- [constructor](index.tablewriter.md#constructor)

### Properties

- [\_operationMap](index.tablewriter.md#_operationmap)
- [\_tableRowMap](index.tablewriter.md#_tablerowmap)
- [blobName](index.tablewriter.md#blobname)
- [connection](index.tablewriter.md#connection)
- [container](index.tablewriter.md#container)
- [partitionKey](index.tablewriter.md#partitionkey)
- [tableName](index.tablewriter.md#tablename)

### Accessors

- [operations](index.tablewriter.md#operations)
- [size](index.tablewriter.md#size)
- [tableRows](index.tablewriter.md#tablerows)

### Methods

- [addTableRow](index.tablewriter.md#addtablerow)
- [executeBatch](index.tablewriter.md#executebatch)
- [removeTableRow](index.tablewriter.md#removetablerow)
- [toJSON](index.tablewriter.md#tojson)
- [toQueueMessage](index.tablewriter.md#toqueuemessage)
- [from](index.tablewriter.md#from)
- [fromBlob](index.tablewriter.md#fromblob)

## Constructors

### constructor

\+ **new TableWriter**(`message?`: [*TableWriterMessage*](../modules/index.md#tablewritermessage)): [*TableWriter*](index.tablewriter.md)

Class for managing a complete round-trip of one or more table rows for upsert into Azure Table Storage.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`message` | [*TableWriterMessage*](../modules/index.md#tablewritermessage) | ... |

**Returns:** [*TableWriter*](index.tablewriter.md)

Defined in: [lib/TableWriter.ts:68](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L68)

## Properties

### \_operationMap

• `Private` **\_operationMap**: *Record*<TableOperation, *Set*<*string*\>\>

Defined in: [lib/TableWriter.ts:168](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L168)

___

### \_tableRowMap

• `Private` **\_tableRowMap**: *Map*<*string*, [*LegacyTableRow*](../interfaces/index.legacytablerow.md)\>

Defined in: [lib/TableWriter.ts:167](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L167)

___

### blobName

• **blobName**: *string*

A blob name; one will be set dynamically, which is recommended.

Defined in: [lib/TableWriter.ts:158](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L158)

___

### connection

• `Optional` **connection**: *string*

An Azure connection string.

Defined in: [lib/TableWriter.ts:160](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L160)

___

### container

• **container**: *string*

A blob container; defaults to `table-writer`, will be dynamically created.

Defined in: [lib/TableWriter.ts:162](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L162)

___

### partitionKey

• **partitionKey**: *string*

A partition key; will be determined from the first table row unless provided.

Defined in: [lib/TableWriter.ts:164](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L164)

___

### tableName

• **tableName**: *string*

A table name; table will be created dynamically when executing the batch.

Defined in: [lib/TableWriter.ts:166](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L166)

## Accessors

### operations

• **operations**(): TableWriterOperations

**Returns:** TableWriterOperations

Defined in: [lib/TableWriter.ts:180](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L180)

___

### size

• **size**(): *number*

**Returns:** *number*

Defined in: [lib/TableWriter.ts:188](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L188)

___

### tableRows

• **tableRows**(): [*LegacyTableRow*](../interfaces/index.legacytablerow.md)[]

**Returns:** [*LegacyTableRow*](../interfaces/index.legacytablerow.md)[]

Defined in: [lib/TableWriter.ts:170](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L170)

• **tableRows**(`rows`: [*LegacyTableRow*](../interfaces/index.legacytablerow.md)[]): *void*

#### Parameters:

Name | Type |
------ | ------ |
`rows` | [*LegacyTableRow*](../interfaces/index.legacytablerow.md)[] |

**Returns:** *void*

Defined in: [lib/TableWriter.ts:174](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L174)

## Methods

### addTableRow

▸ **addTableRow**(`tableRow`: [*LegacyTableRow*](../interfaces/index.legacytablerow.md) | [*TableRow*](../interfaces/index.tablerow.md), `operation?`: TableOperation): *void*

Adds a single table row to this instance of writer.

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`tableRow` | [*LegacyTableRow*](../interfaces/index.legacytablerow.md) | [*TableRow*](../interfaces/index.tablerow.md) | - |
`operation` | TableOperation | 'merge' |

**Returns:** *void*

Defined in: [lib/TableWriter.ts:193](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L193)

___

### executeBatch

▸ **executeBatch**(`connection?`: *string*): *Promise*<*void*\>

Executes a batch, creating the table if it does not exist.

#### Parameters:

Name | Type |
------ | ------ |
`connection?` | *string* |

**Returns:** *Promise*<*void*\>

Defined in: [lib/TableWriter.ts:215](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L215)

___

### removeTableRow

▸ **removeTableRow**(`partitionKey`: *string*, `rowKey`: *string*): *boolean*

Removes a single table row from this isntance of writer.

#### Parameters:

Name | Type |
------ | ------ |
`partitionKey` | *string* |
`rowKey` | *string* |

**Returns:** *boolean*

Defined in: [lib/TableWriter.ts:208](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L208)

___

### toJSON

▸ **toJSON**(): *Partial*<[*TableWriter*](index.tablewriter.md)\>

Exports this instance as a plain JS object for `JSON.stringify`.

**Returns:** *Partial*<[*TableWriter*](index.tablewriter.md)\>

Defined in: [lib/TableWriter.ts:279](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L279)

___

### toQueueMessage

▸ **toQueueMessage**(`connection?`: *string*): *Promise*<[*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)\>

Writes this instance of table writer to blob storage, and generates blob metadata intended to be a queue message.

#### Parameters:

Name | Type |
------ | ------ |
`connection?` | *string* |

**Returns:** *Promise*<[*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)\>

Defined in: [lib/TableWriter.ts:265](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L265)

___

### from

▸ `Static`**from**(`json`: *string* | [*TableWriterMessage*](../modules/index.md#tablewritermessage), `connection?`: *string*): [*TableWriter*](index.tablewriter.md)

Creates an instance of table writer from valid JSON or from a plain JS object.

#### Parameters:

Name | Type |
------ | ------ |
`json` | *string* | [*TableWriterMessage*](../modules/index.md#tablewritermessage) |
`connection?` | *string* |

**Returns:** [*TableWriter*](index.tablewriter.md)

Defined in: [lib/TableWriter.ts:291](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L291)

___

### fromBlob

▸ `Static`**fromBlob**(`message`: [*QueueBlobMessage*](../interfaces/index.queueblobmessage.md), `connection`: *string* | [*BlockBlobService*](index.blockblobservice.md)): *Promise*<[*TableWriter*](index.tablewriter.md)\>

Creates an instance of table writer from blob metadata.

#### Parameters:

Name | Type |
------ | ------ |
`message` | [*QueueBlobMessage*](../interfaces/index.queueblobmessage.md) |
`connection` | *string* | [*BlockBlobService*](index.blockblobservice.md) |

**Returns:** *Promise*<[*TableWriter*](index.tablewriter.md)\>

Defined in: [lib/TableWriter.ts:302](https://github.com/nhsllc/azure-utils/blob/a788737/lib/TableWriter.ts#L302)
