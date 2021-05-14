import * as AzureFunctions from './lib/AzureFunctions'

export * from './lib/BlockBlobService'
export * from './lib/QueueService'
export * from './lib/Interfaces'
export * from './lib/TableWriter'
export * from './lib/TableWriterBatch'
export * from './lib/RecontextError'

/** Named export of all Azure Function helpers and interfaces.
 * @category AzureFunctionHelper
 */
export const FunctionHelpers = AzureFunctions
