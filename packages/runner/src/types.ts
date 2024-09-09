import type * as child_progress from 'node:child_process'

export interface RunnerOptions {
  env?: NodeJS.ProcessEnv
  extraForkOptions?: Omit<child_progress.ForkOptions, 'stdio' | 'env'>
}
