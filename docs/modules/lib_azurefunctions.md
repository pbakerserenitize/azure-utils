[@nhsllc/azure-utils](../README.md) / [Modules](../modules.md) / lib/AzureFunctions

# Module: lib/AzureFunctions

## Table of contents

### AzureFunctionHelper Interfaces

- [TWBOptions](../interfaces/lib_azurefunctions.twboptions.md)

### AzureFunctionHelper Functions

- [tableWriterBatch](lib_azurefunctions.md#tablewriterbatch)

## AzureFunctionHelper Functions

### tableWriterBatch

▸ **tableWriterBatch**(`options`: [*TWBOptions*](../interfaces/lib_azurefunctions.twboptions.md)): *Promise*<void\>

Helper method which acts as the body of an Azure Function designed for batching table writer instances.

```javascript
const { FunctionHelpers } = require('@nhsllc/azure-utils')
const { loggerWithDefaults } = require('../shared/rollbar')

const logger = loggerWithDefaults()

module.exports = logger.azureFunctionHandler(
  async function tableBatcher (context) {
    try {
      await FunctionHelpers.tableWriterBatch({
        allConnections: process.env.orderdataservice_STORAGE,
        queue: {
          name: 'table-batcher',
          numberOfMessages: 32
        }
      })
    } catch (error) {
      logger.error(error)
    }
  }
)
```

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*TWBOptions*](../interfaces/lib_azurefunctions.twboptions.md) |

**Returns:** *Promise*<void\>

Defined in: [lib/AzureFunctions/tableWriterBatch.ts:33](https://github.com/nhsllc/azure-utils/blob/cab3408/lib/AzureFunctions/tableWriterBatch.ts#L33)
