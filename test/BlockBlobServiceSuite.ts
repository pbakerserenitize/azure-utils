import { deepStrictEqual, strictEqual } from 'assert'
import { BlockBlobService } from '../index'

const connection = 'UseDevelopmentStorage=true'

describe('BlockBlobService', async () => {
  it('should read and write files', async () => {
    const blobService = new BlockBlobService(connection)
    const blobService2 = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'test.txt'

    await blobService.write(container, filename, { hello: 'world!'})

    const hello1 = await blobService.read(container, filename)
    const hello2 = await blobService2.readWithFallback(container, 'not-real.txt', filename)

    strictEqual(hello1.toString('utf8'), hello2.toString('utf8'))
  })

  it('should support buffer on error and revive json', async () => {
    const blobService = new BlockBlobService(connection)
    const container = 'testing'
    const filename = 'test.txt'
    const content = { hello: 'world!'}

    await blobService.write(container, filename, content)

    const hello = await blobService.read(container, filename, true)
    const buf = await blobService.readWithFallback(container, filename, 'not-real.txt')
    const zeroBuf = await blobService.read(container, 'not-real.txt')

    deepStrictEqual(hello, content)
    strictEqual(buf.toString('utf8'), JSON.stringify(content))
    strictEqual(zeroBuf.toString('utf8'), '')
  })
})
