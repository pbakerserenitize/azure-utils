import { azure } from 'azure-table-promise'

/** @hidden */
type StringProperty = azure.TableUtilities.entityGenerator.EntityProperty<string>

/** Helper interface for queue-to-blob metadata.
 * @category AzureUtility
 */
export interface QueueBlobMessage {
  blobName: string
  container: string
}

/** Helper interface for legacy table rows.
 * @category AzureUtility
 */
export interface LegacyTableRow {
  PartitionKey: string | StringProperty
  RowKey: string | StringProperty
  [property: string]: any
}

/** Helper interface for table rows. This is the preferred object.
 * @category AzureUtility
 */
export interface TableRow {
  partitionKey: string
  rowKey: string
  [property: string]: any
}
