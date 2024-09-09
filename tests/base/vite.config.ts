import { defineConfig } from 'vite'
import NodeRunner from 'vite-plugin-node-runner'

export default defineConfig({
  build: {
    ssr: './src/index.ts',
  },

  plugins: [
    NodeRunner('./dist/index.mjs'),
  ],
})
