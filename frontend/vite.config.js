import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Rashed Store',
        short_name: 'Rashed Store',
        description: 'আপনার বিশ্বস্ত ডিজিটাল হিসাবঘর',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/app-logo/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/app-logo/logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/app-logo/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
