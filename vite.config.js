import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/vereda/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        analysis: resolve(__dirname, 'analise.html'),
        reader: resolve(__dirname, 'reader.html'),
        readerDark: resolve(__dirname, 'reader-dark.html'),
      },
    },
  },
})
