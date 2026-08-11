import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// Resolver that maps explicit .js imports to .ts source files (ESM convention)
function tsJsResolver(): Plugin {
  return {
    name: 'ts-js-resolver',
    enforce: 'pre',
    resolveId(source) {
      if (source.endsWith('.js') && !source.includes('node_modules')) {
        const tsPath = source.slice(0, -3) + '.ts'
        const baseDir = process.cwd()
        // Try to resolve relative to the importing file is handled by this.resolve,
        // but for absolute-ish imports we try a direct fs check.
        const attempts = [
          resolve(baseDir, 'server', 'src', tsPath),
          resolve(baseDir, tsPath),
        ]
        for (const attempt of attempts) {
          try {
            const fs = require('fs') as typeof import('fs')
            if (fs.existsSync(attempt)) {
              return attempt
            }
          } catch {
            // ignore
          }
        }
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [tsJsResolver()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/__tests__/**/*.test.ts'],
  },
})
