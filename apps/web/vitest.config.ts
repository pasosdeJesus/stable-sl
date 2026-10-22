import { defineConfig } from 'vitest/config'
import path from 'path'

const modulesDir = path.resolve(__dirname, 'node_modules')

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      { find: 'viem', replacement: path.join(modulesDir, 'viem') },
      { find: 'next/server', replacement: path.join(modulesDir, 'next/server.js') },
      { find: 'next', replacement: path.join(modulesDir, 'next') },
      { find: 'kysely', replacement: path.join(modulesDir, 'kysely') },
      { find: 'react', replacement: path.join(modulesDir, 'react') },
      { find: 'react-dom', replacement: path.join(modulesDir, 'react-dom') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['app/**/*.test.ts', 'app/**/*.test.tsx', 'db/**/*.test.ts', 'components/**/*.test.tsx'],
    onConsoleLog: (log, type) => type !== 'stderr',
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
})
