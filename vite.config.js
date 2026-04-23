import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/vereda/',
  plugins: [
    react(),
    VitePWA({
      // Gera o SW automaticamente via Workbox.
      // 'autoUpdate' faz o SW atualizar silenciosamente em background.
      registerType: 'autoUpdate',

      // Ativa o SW também em modo dev (para testar o banner de progresso)
      devOptions: {
        enabled: true,
        type: 'module',
      },

      // ── Workbox: estratégias de cache ───────────────────────────
      workbox: {
        // Precache: todos os assets do build (JS, CSS, HTML, fontes locais, ícones)
        globPatterns: ['**/*.{js,jsx,ts,tsx,css,html,ico,png,svg,woff,woff2,ttf,json}'],

        // Garante que o SW assuma o controle de imediato (sem precisar reload)
        clientsClaim: true,
        skipWaiting: true,

        // Cache runtime para recursos externos
        runtimeCaching: [
          // Google Fonts CSS (a folha de estilo que importa as fontes)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'vereda-google-fonts-css',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Google Fonts arquivos binários (woff2 etc.) — imutáveis, cache forever
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vereda-google-fonts-files',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // API do Dicionário Aberto — CacheFirst: salva para sempre offline
          // (já temos localStorage, mas o SW captura também para robustez)
          {
            urlPattern: /^https:\/\/api\.dicionario-aberto\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vereda-dictionary-api',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Fallback genérico para qualquer outro recurso de terceiros
          {
            urlPattern: /^https:\/\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'vereda-external-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // ── Manifesto PWA ──────────────────────────────────────────
      manifest: {
        name: '"enverede-se" — Vereda',
        short_name: '"enverede-se"',
        description: 'Editor literário offline com verificação de autoria humana (PoHW).',
        theme_color: '#fdfaf6',
        background_color: '#fdfaf6',
        display: 'standalone',
        start_url: '/vereda/',
        scope: '/vereda/',
        lang: 'pt-BR',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
