import * as child_process from 'node:child_process'
import process from 'node:process'
import type { Plugin } from 'vite'

export interface NodeRunnerOptions extends child_process.ForkOptions {
  entry: string // 指定要执行的 Express 启动脚本文件路径
  argvDetect?: boolean // 是否使用命令行参数
  forceEnable?: boolean // 强制启用
}

export function NodeRunner(options: NodeRunnerOptions): Plugin {
  let childProcessInstance: child_process.ChildProcess | null = null
  let clearScreen = true

  return {
    name: 'node-runner',
    apply: 'build',

    configResolved(config) {
      clearScreen = typeof config.clearScreen === 'boolean' ? config.clearScreen : true
    },

    // 每次构建后执行指定的 entry 文件
    closeBundle: {
      handler() {
        // 只在 watch 模式下执行
        if (!this.meta.watchMode) {
          if (options.argvDetect && (!process.argv.includes('-w') || !process.argv.includes('--watch')))
            return
          else if (!options.forceEnable)
            return
        }
        if (clearScreen)
          console.clear()

        this.warn(`Vite build finished, executing ${options.entry}...`)

        // 如果已有子进程在运行，先终止它
        if (childProcessInstance) {
          this.warn(`Killing the previous child process...`)
          childProcessInstance.kill()
        }

        // 启动新的子进程
        childProcessInstance = child_process.fork(options.entry, {
          ...options,
          stdio: 'inherit', // 将子进程的 stdio 重定向到父进程
        })

        childProcessInstance.on('exit', () => this.warn(`${options.entry} exited. restarting...`))
      },
      order: 'post',
      sequential: true,
    },
  }
}
