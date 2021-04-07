import type { BlobDeleteIfExistsResponse, BlockBlobUploadResponse } from '@azure/storage-blob'
import type { QueuePeekMessagesResponse, QueueReceiveMessageResponse } from '@azure/storage-queue'
import type { azure } from 'azure-table-promise'

/** @hidden */
type StringProperty = azure.TableUtilities.entityGenerator.EntityProperty<string>

/** @category AzureUtility */
export type BlobOperation = 'delete' | 'read' | 'write'
/** @category AzureUtility */
export type BlobAllResult = BlobDeleteIfExistsResponse | Buffer | Record<string, any> | any[] | null | BlockBlobUploadResponse
/** @category AzureUtility */
export type TableOperation = 'delete' | 'merge' | 'replace'

/** Helper interface for `BlockBlobService.all`.
 * @category AzureUtility
 */
export interface BlobAllBase {
  operation: BlobOperation
  container: string
  name: string
}

/** Helper interface for `BlockBlobService.all`.
 * @category AzureUtility
 */
export interface BlobAllDelete extends BlobAllBase {
  operation: 'delete'
}

/** Helper interface for `BlockBlobService.all`.
 * @category AzureUtility
 */
export interface BlobAllRead extends BlobAllBase {
  operation: 'read'
  json?: boolean
  encoding?: BufferEncoding
}

/** Helper interface for `BlockBlobService.all`.
 * @category AzureUtility
 */
export interface BlobAllWrite extends BlobAllBase {
  operation: 'write'
  content: string | Buffer | any[] | Record<string | number, any>
}

/** Helper union type for `BlockBlobService.all`.
 * @category AzureUtility
 */
export type BlobAllInput = BlobAllDelete | BlobAllRead | BlobAllWrite

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

/** The queue result type.
 * @category AzureUtility
 */
export type QueueResultType = 'peek' | 'receive'

/** The queue result base.
 * @category AzureUtility
 */
export interface QueueResult<TResultType extends QueueResultType, TItems = any, TResponse = any> {
  date: Date
  hasMessages: boolean
  resultType: TResultType
  messageItems: TItems[]
  responses: TResponse[]
}

/** The queue peek result.
 * @category AzureUtility
 */
export type QueuePeekResult<T = any> = QueueResult<'peek', T, QueuePeekMessagesResponse>

/** The queue receive result.
 * @category AzureUtility
 */
export type QueueReceiveResult<T = any> = QueueResult<'receive', T, QueueReceiveMessageResponse>

/** Valid queue message types.
 * @category AzureUtility
 */
export type QueueMessageContent = string | number | Record<string, any> | any[]
