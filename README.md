# vite-plugin-node-runner 🚀

A vite plugin to run node scripts in `vite build --watch` mode.

## Installation

```bash
pnpm i vite-plugin-node-runner
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import nodeRunner from 'vite-plugin-node-runner'

export default defineConfig({
  plugins: [
    nodeRunner('path/to/script.mjs'),
  ],
})
```

And then run `vite build --watch`, the script will be executed in watch mode.

## License

MIT
