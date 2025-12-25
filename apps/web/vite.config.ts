import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { devlogIndexPlugin } from './vite-plugin-devlog-index'

// Plugin to copy index.html to 404.html for GitHub Pages SPA support
const copy404Plugin = () => ({
  name: 'copy-404',
  closeBundle() {
    const distPath = resolve(__dirname, '../../dist')
    const indexHtml = readFileSync(resolve(distPath, 'index.html'), 'utf-8')
    writeFileSync(resolve(distPath, '404.html'), indexHtml)
  }
})

// Plugin to generate sitemap.xml and robots.txt with correct hostname
const seoPlugin = () => ({
  name: 'generate-seo-files',
  closeBundle() {
    const siteUrl = (process.env.VITE_SITE_URL || 'https://caiokf.com').replace(/\/$/, '')
    const distPath = resolve(__dirname, '../../dist')

    // Generate sitemap.xml
    const routes = [
      { path: '/', changefreq: 'monthly', priority: '1.0' },
      { path: '/about', changefreq: 'monthly', priority: '0.8' },
      { path: '/experience', changefreq: 'monthly', priority: '0.8' },
      { path: '/tech-radar', changefreq: 'weekly', priority: '0.9' },
      { path: '/devlog', changefreq: 'weekly', priority: '0.9' },
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    writeFileSync(resolve(distPath, 'sitemap.xml'), sitemap)

    // Generate robots.txt
    const robots = `# robots.txt - AI Bot Allowlisting

# Default: Allow all standard crawlers
User-agent: *
Allow: /

# AI Bots - Explicitly Allowed
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Anthropic-AI
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`

    writeFileSync(resolve(distPath, 'robots.txt'), robots)
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), devlogIndexPlugin(), copy404Plugin(), seoPlugin()],
  base: process.env.VITE_BASE_URL || '/homepage/',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})

