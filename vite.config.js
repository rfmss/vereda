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
        linguisticAnalysis: resolve(__dirname, 'analise-linguistica.html'),
        launchTrack: resolve(__dirname, 'trilha-lancamento.html'),
        personaMapping: resolve(__dirname, 'persona-literaria.html'),
        writerSanctuary: resolve(__dirname, 'santuario-escritor.html'),
        writingWorkspaceEn: resolve(__dirname, 'writing-workspace-en.html'),
      },
    },
  },
})
