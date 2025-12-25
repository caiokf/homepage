import { Plugin } from "vite";
import { writeFileSync } from "fs";
import { resolve } from "path";

interface RouteConfig {
  path: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

const routes: RouteConfig[] = [
  { path: "/", changefreq: "monthly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/experience", changefreq: "monthly", priority: "0.8" },
  { path: "/tech-radar", changefreq: "weekly", priority: "0.9" },
  { path: "/devlog", changefreq: "weekly", priority: "0.9" },
];

const aiUserAgents = ["GPTBot", "Claude-Web", "PerplexityBot", "Amazonbot", "Anthropic-AI"];

/**
 * Plugin to generate sitemap.xml and robots.txt with correct hostname
 */
export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo",
    closeBundle() {
      const siteUrl = (process.env.VITE_SITE_URL || "https://caiokf.com").replace(/\/$/, "");
      const distPath = resolve(__dirname, "../../../dist");

      // Generate sitemap.xml
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      writeFileSync(resolve(distPath, "sitemap.xml"), sitemap);

      // Generate robots.txt
      const robots = `# robots.txt - AI Bot Allowlisting

# Default: Allow all standard crawlers
User-agent: *
Allow: /

# AI Bots - Explicitly Allowed
${aiUserAgents.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n")}

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`;

      writeFileSync(resolve(distPath, "robots.txt"), robots);
    },
  };
}
