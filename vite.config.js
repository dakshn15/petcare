import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 5183,
    strictPort: true
  },
  preview: {
    port: 4183,
    strictPort: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      filename: 'petcare-sw.js',
      includeAssets: ['favicon.ico', 'assets/images/favicon.png', 'assets/images/logo.png'],
      manifest: {
        id: 'petcare-dakshn15-pwa',
        name: 'Petcare Pro',
        short_name: 'Petcare',
        description: 'Professional pet care and grooming services.',
        theme_color: '#e65742',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/?pwa=petcare',
        icons: [
          {
            src: 'assets/images/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/images/favicon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'assets/images/favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ]
})
