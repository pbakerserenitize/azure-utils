/** Takes a whole number and divides it into results of up to 32, including the remainder.
 * @hidden
 */
export function * splitCount (count: number): Generator<number> {
  if (typeof count !== 'number' || Number.isNaN(count) || !Number.isFinite(count) || count < 1) return

  const MAX_MESSAGES = 32

  if (count < MAX_MESSAGES) {
    yield count
  } else {
    const result = Math.floor(count / MAX_MESSAGES)
    const remainder = Math.floor(count % MAX_MESSAGES)

    for (let i = 0; i < result; i += 1) {
      yield MAX_MESSAGES
    }

    if (remainder > 0) yield remainder
  }
}

/** Checks a string to see if it opens and closes with `[]` or `{}` and is therefore probably JSON. Only really supports arrays and objects.
 * @hidden
 */
export function probablyJson (str: string): boolean {
  if (typeof str === 'string') {
    const trimmed = str.trim()
    const open = trimmed.substring(0, 1)
    const close = trimmed.substring(trimmed.length - 1, trimmed.length)

    return (open === '{' && close === '}') || (open === '[' && close === ']')
  }

  return false
}

/** Checks a string to see if it is likely to be a valid base64 string.
 * @hidden
 */
export function probablyBase64 (str: string): boolean {
  if (typeof str === 'string') {
    const validBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gu

    return validBase64.test(str)
  }

  return false
}

/** Checks the first 64 chars of a string to see if it is likely to be a binary representation.
 * @hidden
 */
export function probablyBinary (str: string): boolean {
  // Tab, new line, and carriage return are all considered printable for purposes of detecting binary code.
  const nonPrintable = '\ufffd\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\u000b\f\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f'
  const notUnicode = '\ufffd'

  if (typeof str === 'string') {
    let register = 0

    for (const char of [...str.substring(0, 64)]) {
      // Escape early if string contains bit that is not valid unicode character code.
      if (char === notUnicode) return true

      if (nonPrintable.includes(char)) {
        switch (register) {
          case 0:
          case 1:
            register += 1
            break
          case 2:
            return true
        }
      } else {
        register = 0
      }
    }
  }

  return false
}
