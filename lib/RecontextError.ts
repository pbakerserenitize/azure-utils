/** Class for re-contexting an error provided by another library in the event that the call-stack is incomplete. */
export class RecontextError extends Error {
  /** Use this class for a custom error; no re-contexting will occur. */
  constructor (message: string)
  /** Take any error, fuzzy-match the stack trace to the calling trace, and merge the stack-traces together if necessary. */
  constructor (error: Error)
  constructor (messageOrError: string | Error) {
    if (typeof messageOrError === 'string') {
      super(messageOrError)
    } else {
      super()
      this.mergeError(messageOrError)
    }

    Object.setPrototypeOf(this, RecontextError.prototype)
  }

  /** Merge an error stack trace to the recontext stack trace. */
  private mergeError (error: Error): void {
    const { stack: recontextStack } = this

    // Copy the properties and accessors from the donor error.
    Object.assign(this, error)

    // Break out stack data from recontext stack, throwing away the empty message line.
    const [,recontextCalleeLine, ...remainingStack] = recontextStack.split('\n')
    const recontextFilepath = this.getFilePathFromLine(recontextCalleeLine)
    const matchFound = recontextFilepath !== '' && error?.stack.includes(recontextFilepath)

    if (!matchFound) {
      const donor = this.getStackData(error)
      this.name = donor.name
      this.stack = `${donor.message}\n${recontextCalleeLine}\n${donor.stack}\n${remainingStack.join('\n')}`
    } else {
      this.name = error.name
      this.stack = error.stack
    }
  }

  /** Retrieve and format the stack data of a donor error. */
  private getStackData ({ name, stack }: Error): Record<keyof Error, string> {
    const donorLines = stack.split('\n')
    const donorStack: string[] = []
    const donorMessage: string[] = []
    let stackFound = false

    for (const donorLine of donorLines) {
      if (donorLine.trim().startsWith('at ')) stackFound = true

      // Push every remaining line after the error message to the donor stack.
      if (stackFound) {
        donorStack.push(donorLine)
      } else {
        // Some messages are more than one line, build these up for a complete donor stack trace.
        donorMessage.push(donorLine)
      }
    }

    return {
      name,
      message: donorMessage.join('\n'),
      stack: donorStack.join('\n')
    }
  }

  /** Get the file path from a given call stack trace line. */
  private getFilePathFromLine (line: string): string {
    const parts = line.trim().split(' ')
    const filetrace = parts[parts.length - 1]
    const trimmed = filetrace.startsWith('(')
      ? filetrace.substring(1, filetrace.length - 1)
      : filetrace
    const [filepath] = trimmed.split(/:\d/gui)

    return filepath
  }
}
