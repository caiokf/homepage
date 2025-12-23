import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'

// Plugin to copy index.html to 404.html for GitHub Pages SPA support
const copy404Plugin = () => ({
  name: 'copy-404',
  closeBundle() {
    const distPath = resolve(__dirname, '../../dist')
    const indexHtml = readFileSync(resolve(distPath, 'index.html'), 'utf-8')
    writeFileSync(resolve(distPath, '404.html'), indexHtml)
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), copy404Plugin()],
  base: process.env.VITE_BASE_URL || '/homepage/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})

