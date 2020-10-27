import {
  BlobServiceClient,
  BlockBlobUploadResponse,
  ContainerClient,
  StorageSharedKeyCredential as BlobCredential
} from '@azure/storage-blob'

class BlobContainerManager {
  /** @param {BlobServiceClient} blobService */
  constructor (blobService: BlobServiceClient) {
    this.blobService = blobService
    this.containers = new Map()
  }

  blobService: BlobServiceClient
  containers: Map<string, ContainerClient>

  has (blobContainer: string): boolean {
    return this.containers.has(blobContainer)
  }

  /**
   * @param {string} blobContainer - The name of the blob container.
   * @returns {Promise<ContainerClient>} - The container client instance.
   */
  async add (blobContainer: string): Promise<ContainerClient> {
    if (this.has(blobContainer)) {
      return this.get(blobContainer)
    }

    const containerClient = await this.createIfNotExist(blobContainer)

    this.containers.set(blobContainer, containerClient)

    return containerClient
  }

  /**
   * @param {string} blobContainer - The name of the blob container.
   * @returns {ContainerClient} - The container client instance.
   */
  get (blobContainer: string): ContainerClient {
    return this.containers.get(blobContainer)
  }

  private async createIfNotExist (blobContainer: string): Promise<ContainerClient> {
    const containerClient = this.blobService.getContainerClient(blobContainer)

    try {
      await containerClient.create()
    } catch (error) {
      if (error.statusCode !== 409) throw error
    }

    return containerClient
  }
}

export class BlockBlobService {
  /** Convenience wrapper for managing blob service instances gracefully.
   * @param {string} accountNameOrConnectionString - The account name or the connection string.
   * @param {string} [accountKey] - Only required for use with an account name.
   */
  constructor (accountNameOrConnectionString: string, accountKey?: string) {
    if (typeof accountKey === 'undefined' || accountKey === null || accountKey === '') {
      this.blobService = BlobServiceClient.fromConnectionString(accountNameOrConnectionString)
    } else {
      this.blobService = new BlobServiceClient(
        `https://${accountNameOrConnectionString}.blob.core.windows.net`,
        new BlobCredential(accountNameOrConnectionString, accountKey)
      )
    }

    this.containers = new BlobContainerManager(this.blobService)
  }

  blobService: BlobServiceClient
  containers: BlobContainerManager

  /**
   * Check if a blob exists in a container.
   * @param {string} blobContainer - The container for the blob.
   * @param {string} blobName - The name of the blob.
   * @returns {Promise<boolean>} The contents of the blob; objects and arrays will be jsonified.
   */
  async has (blobContainer: string, blobName: string): Promise<boolean> {
    const containerClient = await this.containers.add(blobContainer)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    return await blockBlobClient.exists()
  }

  /**
   * Write a blob to a container, serializing objects and arrays to JSON.
   * @param {string} blobContainer - The container for the blob.
   * @param {string} blobName - The name of the blob.
   * @param {string|Buffer|Array|object} blobContent - The contents of the blob; objects and arrays will be jsonified.
   */
  async write (
    blobContainer: string,
    blobName: string,
    blobContent: string|Buffer|any[]|Record<string|number,any>
  ): Promise<BlockBlobUploadResponse> {
    const containerClient = await this.containers.add(blobContainer)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    if (!Buffer.isBuffer(blobContent) && typeof blobContent === 'object') {
      blobContent = JSON.stringify(blobContent)
    }

    return await blockBlobClient.upload(blobContent, blobContent.length)
  }

  /**
   * Read a blob from a container, optionally parsing JSON.
   * @param {string} blobContainer - The container for the blob.
   * @param {string} blobName - The name of the blob.
   * @param {boolean} [json=false] - Parse the blob to JSON.
   * @returns {Promise<Buffer>} The blob contents as a buffer instance.
   */
  async read (blobContainer: string, blobName: string): Promise<Buffer>
  async read (blobContainer: string, blobName: string, json: false): Promise<Buffer>
  async read (blobContainer: string, blobName: string, json: true): Promise<any>
  async read (blobContainer: string, blobName: string, json: boolean): Promise<any>
  async read (blobContainer: string, blobName: string, json: boolean = false): Promise<any> {
    const containerClient = await this.containers.add(blobContainer)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    if (json) {
      const buffer = await blockBlobClient.downloadToBuffer()
      const content = buffer.toString('utf8')

      return JSON.parse(content)
    }

    try {
      return await blockBlobClient.downloadToBuffer()
    } catch (error) {
      return Buffer.alloc(0)
    }
  }

  /** Read a blob with a fallback blob name. */
  async readWithFallback (blobContainer: string, blobName: string, fallbackBlobName: string): Promise<Buffer> {
    const containerClient = await this.containers.add(blobContainer)

    if (this.has(blobContainer, blobName)) {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      return await blockBlobClient.downloadToBuffer()
    }

    const blockBlobFallback = containerClient.getBlockBlobClient(fallbackBlobName)

    return await blockBlobFallback.downloadToBuffer()
  }
}
