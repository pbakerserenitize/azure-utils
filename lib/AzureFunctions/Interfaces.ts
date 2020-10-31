/** Options for Azure Function helper `tableWriterBatch`.
 * @category AzureFunctionHelper
 */
export interface TWBOptions {
  /** Connection string override for all connections. */
  allConnections?: string
  /** Connection string to use for blob storage. */
  blobConnection?: string
  /** Options for retrieving messages from the queue. */
  queue: {
    /** Name of the queue to read from, where TableWriter queue messages live. */
    name: string
    /** Connection string for the queue. May be overridden by property `allConnections`. */
    connection?: string
    /** The number of messages to retrieve from the queue. Defaults to the max of 32. */
    numberOfMessages?: number
  }
  /** Connection string to use for table storage. */
  tableConnection?: string
}
