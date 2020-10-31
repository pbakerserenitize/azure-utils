import * as AzureFunctions from './lib/AzureFunctions'

export * from './lib/BlockBlobService'
export * from './lib/Interfaces'
export * from './lib/TableWriter'
export * from './lib/TableWriterBatch'

/** Named export of all Azure Function helpers and interfaces.
 * @category AzureFunctionHelper
 */
export const FunctionHelpers = AzureFunctions
