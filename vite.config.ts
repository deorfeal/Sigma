import { fileURLToPath, URL } from 'node:url'
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  base: '/Sigma/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  define: {
    TELEGRAM_TOKEN: JSON.stringify(process.env.VITE_TELEGRAM_TOKEN),
    CHAT_ID: JSON.stringify(process.env.VITE_CHAT_ID),
  }
})
