import * as shell from 'gulp-shell'

function shellTask (commands: string | string[], options?: { name?: string; [prop: string]: any }): () => Promise<void> {
  const task = shell.task(commands, options as any)

  if (options && typeof options.name === 'string') {
    Object.defineProperty(task, 'name', { value: options.name })
  }

  return task
}

export const test = shellTask(['mocha'], { name: 'test' })
export const compile = shellTask(['tsc'], { name: 'compile' })
