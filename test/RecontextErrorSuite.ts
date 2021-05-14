import { notStrictEqual, strictEqual } from 'assert'
import { createTableService } from 'azure-table-promise'
import { RecontextError } from '../index'
import { connection } from './helpers'

describe('RecontextError', () => {
  it('should createa standard error with a string message', () => {
    const message = 'My actual error message'
    const result = new RecontextError(message)

    strictEqual(result.message, message)
  })

  it('should not recontext an error including the current stack', () => {
    try {
      // Intentionally create a "good" error stack.
      Buffer.from(undefined)
    } catch (error) {
      const result = new RecontextError(error)

      strictEqual(typeof result.stack, 'string')
      strictEqual(typeof error.stack, 'string')
      strictEqual(result.stack, error.stack)
    }
  })

  it('should recontext an error not matching the current stack', async () => {
    try {
      // Intentionally create a "bad" error stack.
      const tbs = createTableService(connection)

      await tbs.insertOrMergeEntity('fake', { PartitionKey: 'nada', RowKey: 'moron', nope: 'nogo' })
    } catch (error) {
      const result = new RecontextError(error)

      strictEqual(typeof result.stack, 'string')
      strictEqual(typeof error.stack, 'string')
      notStrictEqual(result.stack, error.stack)
    }
  })
})
