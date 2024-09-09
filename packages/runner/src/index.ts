import type { ChildProcess } from 'node:child_process'
import * as child_progress from 'node:child_process'
import { cwd, env, stderr, stdout } from 'node:process'
import path from 'node:path'
import type { Plugin } from 'vite'
import { watch } from 'chokidar'
import type { RunnerOptions } from './types'

let ruined = false
export function NodeRunner(distEntryPath: string, options: RunnerOptions = {}): Plugin {
  // let isClearScreen = true
  let child_process_instance: ChildProcess

  function createChildProcess() {
    child_process_instance = child_progress.fork(distEntryPath, {
      cwd: cwd(),
      env: {
        ...env,
        ...(options.env || {}),
      },
      stdio: 'pipe',
      ...(options.extraForkOptions || {}),
    })

    child_process_instance.stdout.pipe(stdout)
    child_process_instance.stderr.pipe(stderr)
  }

  function killChildProcess(): boolean {
    if (child_process_instance) {
      child_process_instance.kill('SIGKILL')
      child_process_instance = null
      return true
    }
    return false
  }

  let isClearScreen = true

  return {
    name: 'loader',
    apply: 'build',

    config(config) {
      isClearScreen = config.clearScreen ?? true
    },

    writeBundle: {
      handler() {
        if (ruined || !this.meta.watchMode)
          return

        createChildProcess()
        ruined = true
        watch(this.getWatchFiles()).on('change', (filePath) => {
          if (isClearScreen) {
            stdout.write('\n')
            console.clear()
          }
          this.warn(`File changed: ${path.relative(cwd(), filePath)}`)
          const isSuccess = killChildProcess()
          setTimeout(() => {
            if (isSuccess)
              createChildProcess()
          }, 1000)
        })
      },
      order: 'post',
      sequential: true,
    },
  }
}

export default NodeRunner
