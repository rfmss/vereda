import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/vereda/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        analysis: resolve(__dirname, 'analise.html'),
        templates: resolve(__dirname, 'templates.html'),
        preparing: resolve(__dirname, 'preparando.html'),
        reader: resolve(__dirname, 'reader.html'),
        readerDark: resolve(__dirname, 'reader-dark.html'),
        organize: resolve(__dirname, 'organize-se.html'),
        pohwEditor: resolve(__dirname, 'editor-pohw.html'),
        digitalRegistry: resolve(__dirname, 'cartorio-digital.html'),
      },
    },
  },
})
