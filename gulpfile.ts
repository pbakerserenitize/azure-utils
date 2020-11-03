import * as gulp from 'gulp'
import * as shell from 'gulp-shell'
import { default as rmdir } from 'rimraf'
import { normalize } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { Service } from 'managed-service-daemon'

const azuriteV3Dir = './.azurite-v3'
const azuriteV2Dir = './.azurite-v2'
const createAzuriteService = function (serviceName, servicePath, workingDir) {
  return new Service({
    name: serviceName,
    command: 'node',
    args: [normalize(servicePath), '-s', '-l', workingDir],
    startWait: 500,
    onStart: () => {
      if (!existsSync(workingDir)) mkdirSync(workingDir)
    },
    onStop: () => {
      rmdir(workingDir, function (err) {
        if (err) console.log(err)
      })
    },
    onReady: () => {},
    onRestart: () => {}
  })
}
const azuriteBlob = createAzuriteService('azuriteBlob', './node_modules/azurite/dist/src/blob/main', azuriteV3Dir)
const azuriteTable = createAzuriteService(
  'azuriteTable',
  './node_modules/azurite-v2/node_modules/azurite/bin/table',
  azuriteV2Dir
)
const azuriteStart = gulp.parallel(azuriteTable.start as any, azuriteBlob.start as any)
const azuriteStop = gulp.parallel(azuriteTable.stop, azuriteBlob.stop)

function shellTask (commands: string | string[], options?: { name?: string; [prop: string]: any }): () => Promise<void> {
  const task = shell.task(commands, options as any)

  if (options && typeof options.name === 'string') {
    Object.defineProperty(task, 'name', { value: options.name })
  }

  return task
}

export const lint = shellTask(['prettier-standard --check --lint'], { name: 'format' })
export const format = shellTask(['prettier-standard --lint'], { name: 'format' })

export const mocha = shellTask(['mocha'], { name: 'mocha' })
export const nyc = shellTask(['nyc mocha'], { name: 'nyc' })
export const test = gulp.series(azuriteStart, mocha, azuriteStop)
export const coverage = gulp.series(azuriteStart, nyc, azuriteStop)

export const compile = shellTask(['tsc'], { name: 'compile' })
export const docs = shellTask(['typedoc'], { name: 'docs' })
export const install = shellTask(['npm install test/azurite-v2', 'npm install'], { name: 'install' })
