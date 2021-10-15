import {
  BlobDeleteIfExistsResponse,
  BlobServiceClient,
  BlockBlobUploadResponse,
  ContainerClient,
  StorageSharedKeyCredential as BlobCredential
} from '@azure/storage-blob'
import {
  BlobAllDelete,
  BlobAllInput,
  BlobAllRead,
  BlobAllResult,
  BlobAllWrite
} from './Interfaces'
import { RecontextError } from './RecontextError'

/** @hidden */
class BlobContainerManager {
  /** Class for managing blob containers, creating them if they don't exist. */
  constructor (blobService: BlobServiceClient) {
    this.blobService = blobService
    this.containers = new Map()
  }

  blobService: BlobServiceClient
  containers: Map<string, ContainerClient>

  has (blobContainer: string): boolean {
    return this.containers.has(blobContainer)
  }

  /** Add a blob container by name. */
  async add (blobContainer: string): Promise<ContainerClient> {
    if (this.has(blobContainer)) {
      return this.get(blobContainer)
    }

    const containerClient = await this.createIfNotExist(blobContainer)

    this.containers.set(blobContainer, containerClient)

    return containerClient
  }

  /** Get a blob container by name. */
  get (blobContainer: string): ContainerClient {
    return this.containers.get(blobContainer)
  }

  private async createIfNotExist (blobContainer: string): Promise<ContainerClient> {
    try {
      const containerClient = this.blobService.getContainerClient(blobContainer)

      try {
        await containerClient.create()
      } catch (error) {
        if (error.statusCode !== 409) throw new RecontextError (error)
      }

      return containerClient
    } catch (error) {
      throw new RecontextError (error)
    }
  }
}

export class BlockBlobService {
  constructor (accountNameOrConnectionString: string, accountKey?: string) {
    if (typeof accountKey === 'undefined' || accountKey === null || accountKey === '') {
      try {
        this.blobService = BlobServiceClient.fromConnectionString(accountNameOrConnectionString)
      } catch (error) {
        throw new RecontextError(error)
      }
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

  async has (blobContainer: string, blobName: string): Promise<boolean> {
    const containerClient = await this.containers.add(blobContainer)
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      return await blockBlobClient.exists()
    } catch (error) {
      throw new RecontextError(error)
    }
  }

  async delete (
    blobContainer: string,
    blobName: string
  ): Promise<BlobDeleteIfExistsResponse> {
    const containerClient = await this.containers.add(blobContainer)
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      return await blockBlobClient.deleteIfExists()
    } catch (error) {
      throw new RecontextError(error)
    }
  }

  async write (
    blobContainer: string,
    blobName: string,
    blobContent: string | Buffer | any[] | Record<string | number, any>
  ): Promise<BlockBlobUploadResponse> {
    const containerClient = await this.containers.add(blobContainer)
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      if (!Buffer.isBuffer(blobContent) && typeof blobContent === 'object') {
        blobContent = JSON.stringify(blobContent)
      }

      return await blockBlobClient.upload(blobContent, blobContent.length)
    } catch (error) {
      throw new RecontextError(error)
    }
  }

  async read (blobContainer: string, blobName: string): Promise<Buffer>
  async read (blobContainer: string, blobName: string, encoding: BufferEncoding): Promise<string>
  async read (blobContainer: string, blobName: string, json: false): Promise<Buffer>
  async read (blobContainer: string, blobName: string, json: true): Promise<Record<string, any> | any[] | null | any>
  async read (blobContainer: string, blobName: string, json: boolean | BufferEncoding): Promise<any>
  async read (blobContainer: string, blobName: string, jsonOrEnc: boolean | BufferEncoding = false): Promise<any> {
    const containerClient = await this.containers.add(blobContainer)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    const tryDownload = async (): Promise<Buffer> => {
      try {
        return await blockBlobClient.downloadToBuffer()
      } catch (error) {
        return Buffer.alloc(0)
      }
    }

    if (typeof jsonOrEnc === 'boolean' && jsonOrEnc) {
      const buffer = await tryDownload()

      if (buffer.length === 0) return null

      const content = buffer.toString('utf8')

      return JSON.parse(content)
    } else if (typeof jsonOrEnc === 'string') {
      const buffer = await tryDownload()

      return buffer.toString(jsonOrEnc)
    }

    return await tryDownload()
  }

  async readWithFallback (blobContainer: string, blobName: string, fallbackBlobName: string): Promise<Buffer> {
    if (await this.has(blobContainer, blobName)) {
      return await this.read(blobContainer, blobName)
    }

    return await this.read(blobContainer, fallbackBlobName)
  }
  async all (inputs: BlobAllDelete[]): Promise<BlobDeleteIfExistsResponse[]>
  async all (inputs: BlobAllRead[]): Promise<Array<Buffer | string | Record<string, any> | any[] | null>>
  async all (inputs: BlobAllWrite[]): Promise<BlockBlobUploadResponse[]>
  async all (inputs: BlobAllInput[]): Promise<BlobAllResult[]>
  async all (inputs: BlobAllInput[]): Promise<BlobAllResult[]> {
    const promises: Array<Promise<any>> = []

    for (const input of inputs) {
      switch (input.operation) {
        case 'delete':
          promises.push(this.delete(input.container, input.name))
          break
        case 'read':
          promises.push(this.read(input.container, input.name, typeof input.json === 'boolean' ? input.json : input.encoding))
          break
        case 'write':
          promises.push(this.write(input.container, input.name, input.content))
      }
    }

    return await Promise.all(promises)
  }
}
