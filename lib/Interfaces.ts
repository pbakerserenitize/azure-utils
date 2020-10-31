import type { azure } from 'azure-table-promise'

/** @hidden */
type StringProperty = azure.TableUtilities.entityGenerator.EntityProperty<string>

/** Helper interface for queue-to-blob metadata.
 * @category AzureUtility
 */
export interface QueueBlobMessage {
  blobName: string
  container: string
}

/** Helper interface for table rows.
 * @category AzureUtility
 */
export interface TableRow {
  PartitionKey: string | StringProperty
  RowKey: string | StringProperty
  [property: string]: any
}
