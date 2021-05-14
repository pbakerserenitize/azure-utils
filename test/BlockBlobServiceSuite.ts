import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob'
import { deepStrictEqual, doesNotThrow, rejects, strictEqual } from 'assert'
import * as sinon from 'sinon'
import { BlockBlobService, BlobAllInput } from '../index'
import { connection } from './helpers'

describe('BlockBlobService', () => {
  it('should read and write files', async () => {
    const blobService = new BlockBlobService(connection)
    const blobService2 = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'test.txt'

    await blobService.write(container, filename, { hello: 'world!' })

    const hello1 = await blobService.read(container, filename)
    const hello2 = await blobService2.readWithFallback(container, 'not-real.txt', filename)

    strictEqual(hello1.toString('utf8'), hello2.toString('utf8'))
    doesNotThrow(() => {
      const blobService3 = new BlockBlobService(connection, connection)

      strictEqual(blobService3 instanceof BlockBlobService, true)
    })
  })

  it('should support buffer on error, return a string, and revive json', async () => {
    const blobService = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'test.txt'
    const filename2 = 'test2.txt'
    const content = { hello: 'world!' }
    const contentString = JSON.stringify(content)

    await blobService.write(container, filename, content)
    await blobService.write(container, filename2, 'not JSON')

    const hello = await blobService.read(container, filename, true)
    const buf = await blobService.readWithFallback(container, filename, 'not-real.txt')
    const zeroBuf = await blobService.read(container, 'not-real.txt')
    const nullResult = await blobService.read(container, 'not-real.txt', true)
    const stringResult = await blobService.read(container, filename, 'utf8')

    deepStrictEqual(hello, content)
    strictEqual(buf.toString('utf8'), contentString)
    strictEqual(zeroBuf.toString('utf8'), '')
    strictEqual(nullResult, null)
    strictEqual(stringResult, contentString)

    await rejects(async () => {
      await blobService.read(container, filename2, true)
    })
  })

  it('should support blob deletes', async () => {
    const blobService = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'test.txt'
    const content = { hello: 'world!' }

    await blobService.write(container, filename, content)
    const res = await blobService.delete(container, filename)

    strictEqual(res.succeeded, true)
  })

  it('should support an array of blob inputs to read, write, and delete', async () => {
    const blobService = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'read.txt'
    const content = 'a'
    const inputs: BlobAllInput[] = [
      {
        operation: 'delete',
        container,
        name: 'deleted.txt'
      },
      {
        operation: 'read',
        container,
        name: filename
      },
      {
        operation: 'write',
        container,
        name: 'write.txt',
        content
      }
    ]

    // Seeds content to be read for testing.
    await blobService.write(container, filename, content)

    // Ordered destructuring expecting results in the order of the inputs.
    const [deleteResult, readResult, writeResult] = await blobService.all(inputs)

    // Duck type the delete result.
    if ('succeeded' in deleteResult) {
      strictEqual(typeof deleteResult.succeeded, 'boolean')
    } else {
      throw new Error("Delete result misisng property 'succeeded'.")
    }
    if (readResult instanceof Buffer) {
      strictEqual(readResult.toString('utf8'), content)
    } else {
      throw new Error('Read result was not an instance of Buffer.')
    }
    if ('etag' in writeResult) {
      strictEqual(typeof writeResult.etag, 'string')
    } else {
      throw new Error("Write result misisng property 'etag'.")
    }
  })

  it('should handle errors', async () => {
    const error = new Error('My fake error.')
    const sandbox = sinon.createSandbox()

    sandbox.stub(BlockBlobClient.prototype, 'exists').rejects(error)

    await rejects(async () => {
      const blobService = new BlockBlobService(connection)

      await blobService.has('myContainer', 'doogie')
    })

    sandbox.stub(BlockBlobClient.prototype, 'deleteIfExists').rejects(error)

    await rejects(async () => {
      const blobService = new BlockBlobService(connection)

      await blobService.delete('myContainer', 'doogie')
    })

    sandbox.stub(BlockBlobClient.prototype, 'upload').rejects(error)

    await rejects(async () => {
      const blobService = new BlockBlobService(connection)

      await blobService.write('myContainer', 'doogie', '')
    })

    sandbox.stub(ContainerClient.prototype, 'create').throws(error)

    rejects(async () => {
      const blobService = new BlockBlobService(connection)

      await blobService.has('myContainer', 'doogie')
    })

    sandbox.stub(BlobServiceClient, 'fromConnectionString').throws(error)

    rejects(async () => {
      new BlockBlobService(connection)
    })

    rejects(async () => {
      new BlockBlobService(connection, connection)
    })

    sandbox.restore()
  })
})
