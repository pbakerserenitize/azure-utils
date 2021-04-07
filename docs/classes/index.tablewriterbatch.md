[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / TableWriterBatch

# Class: TableWriterBatch

[index](../modules/index.md).TableWriterBatch

Class for managing one or more TableWriter instances to round-trip into Azure Table Storage.

```javascript
const { TableWriterBatch } = require('@nhsllc/azure-utils')

module.exports = async function example (context) {
  const data = [] // Perhaps some data to generate rows for different table/partition keys
  const tableWriterBatch = new TableWriterBatch()

  for (const item of data) {
    const tableRows = [] // Fill up this array with table rows of the same partition key
    // Do some work generating rows

    tableWriterBatch.addTableWriter({
      tableName: 'ExampleTable',
      tableRows
    })
  }

  return {
    tableBatcher: await tableWriterBatch.toQueueMessages(process.env.STORAGE_CONNECTION)
  }
}
```

## Table of contents

### Constructors

- [constructor](index.tablewriterbatch.md#constructor)

### Properties

- [\_sizeLimitCache](index.tablewriterbatch.md#_sizelimitcache)
- [\_tableWriterMap](index.tablewriterbatch.md#_tablewritermap)
- [connection](index.tablewriterbatch.md#connection)
- [maxWriterSize](index.tablewriterbatch.md#maxwritersize)

### Accessors

- [size](index.tablewriterbatch.md#size)
- [tableWriters](index.tablewriterbatch.md#tablewriters)

### Methods

- [addTableWriter](index.tablewriterbatch.md#addtablewriter)
- [executeBatches](index.tablewriterbatch.md#executebatches)
- [removeTableRow](index.tablewriterbatch.md#removetablerow)
- [toJSON](index.tablewriterbatch.md#tojson)
- [toQueueMessages](index.tablewriterbatch.md#toqueuemessages)
- [from](index.tablewriterbatch.md#from)
- [fromBlobs](index.tablewriterbatch.md#fromblobs)

## Constructors

### constructor

\+ **new TableWriterBatch**(`batchMessage?`: *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\>): [*TableWriterBatch*](index.tablewriterbatch.md)

Class for managing one or more TableWriter instances to round-trip into Azure Table Storage.

#### Parameters:

Name | Type |
:------ | :------ |
`batchMessage` | *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\> |

**Returns:** [*TableWriterBatch*](index.tablewriterbatch.md)

Defined in: [lib/TableWriterBatch.ts:32](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L32)

## Properties

### \_sizeLimitCache

• `Private` **\_sizeLimitCache**: *Map*<string, string\>

Defined in: [lib/TableWriterBatch.ts:52](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L52)

___

### \_tableWriterMap

• `Private` **\_tableWriterMap**: *Map*<string, [*TableWriter*](index.tablewriter.md)\>

Defined in: [lib/TableWriterBatch.ts:51](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L51)

___

### connection

• `Optional` **connection**: *string*

An Azure connection string.

Defined in: [lib/TableWriterBatch.ts:48](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L48)

___

### maxWriterSize

• `Optional` **maxWriterSize**: *number*

Limit the size of table writer instances.

Defined in: [lib/TableWriterBatch.ts:50](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L50)

## Accessors

### size

• get **size**(): *number*

**Returns:** *number*

Defined in: [lib/TableWriterBatch.ts:64](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L64)

___

### tableWriters

• get **tableWriters**(): *Partial*<[*TableWriter*](index.tablewriter.md)\>[]

**Returns:** *Partial*<[*TableWriter*](index.tablewriter.md)\>[]

Defined in: [lib/TableWriterBatch.ts:54](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L54)

• set **tableWriters**(`writers`: *Partial*<[*TableWriter*](index.tablewriter.md)\>[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`writers` | *Partial*<[*TableWriter*](index.tablewriter.md)\>[] |

**Returns:** *void*

Defined in: [lib/TableWriterBatch.ts:58](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L58)

## Methods

### addTableWriter

▸ **addTableWriter**(`writer`: [*TableWriterMessage*](../modules/index.md#tablewritermessage), `connection?`: *string*): *void*

Adds a single table writer to this instance; merges writers with same table name/partition key combination.

#### Parameters:

Name | Type |
:------ | :------ |
`writer` | [*TableWriterMessage*](../modules/index.md#tablewritermessage) |
`connection?` | *string* |

**Returns:** *void*

Defined in: [lib/TableWriterBatch.ts:69](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L69)

___

### executeBatches

▸ **executeBatches**(`connection?`: *string*): *Promise*<void\>

Executes batches on all table writers in this instance.

#### Parameters:

Name | Type |
:------ | :------ |
`connection?` | *string* |

**Returns:** *Promise*<void\>

Defined in: [lib/TableWriterBatch.ts:149](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L149)

___

### removeTableRow

▸ **removeTableRow**(`tableName`: *string*, `partitionKey`: *string*, `rowKey`: *string*): *boolean*

Adds a single table row to this instance of writer.

#### Parameters:

Name | Type |
:------ | :------ |
`tableName` | *string* |
`partitionKey` | *string* |
`rowKey` | *string* |

**Returns:** *boolean*

Defined in: [lib/TableWriterBatch.ts:129](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L129)

___

### toJSON

▸ **toJSON**(): *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\>

**Returns:** *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\>

Defined in: [lib/TableWriterBatch.ts:166](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L166)

___

### toQueueMessages

▸ **toQueueMessages**(`connection?`: *string*): *Promise*<[*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)[]\>

Generates an array of all queue messages in this instance, committing table writer instances to Blob Storage.

#### Parameters:

Name | Type |
:------ | :------ |
`connection?` | *string* |

**Returns:** *Promise*<[*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)[]\>

Defined in: [lib/TableWriterBatch.ts:156](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L156)

___

### from

▸ `Static`**from**(`json`: *string* \| *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\>, `connection?`: *string*): [*TableWriterBatch*](index.tablewriterbatch.md)

Creates a table writer batch instance from valid JSON or a JS object.

#### Parameters:

Name | Type |
:------ | :------ |
`json` | *string* \| *Partial*<[*TableWriterBatch*](index.tablewriterbatch.md)\> |
`connection?` | *string* |

**Returns:** [*TableWriterBatch*](index.tablewriterbatch.md)

Defined in: [lib/TableWriterBatch.ts:173](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L173)

___

### fromBlobs

▸ `Static`**fromBlobs**(`messages`: [*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)[], `connection`: *string* \| [*BlockBlobService*](index.blockblobservice.md)): *Promise*<[*TableWriterBatch*](index.tablewriterbatch.md)\>

Creates a table writer batch instance from an array of blob metadata.

#### Parameters:

Name | Type |
:------ | :------ |
`messages` | [*QueueBlobMessage*](../interfaces/index.queueblobmessage.md)[] |
`connection` | *string* \| [*BlockBlobService*](index.blockblobservice.md) |

**Returns:** *Promise*<[*TableWriterBatch*](index.tablewriterbatch.md)\>

Defined in: [lib/TableWriterBatch.ts:184](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/TableWriterBatch.ts#L184)
