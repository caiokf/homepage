import { Plugin } from "vite";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const aiUserAgents = ["GPTBot", "Claude-Web", "PerplexityBot", "Amazonbot", "Anthropic-AI"];

/**
 * Plugin to generate robots.txt with AI bot allowlisting
 */
export function robotsPlugin(): Plugin {
  return {
    name: "vite-plugin-seo-robots",
    closeBundle() {
      const siteUrl = (process.env.VITE_SITE_URL || "https://caiokf.com").replace(/\/$/, "");
      const distPath = resolve(__dirname, "../../../dist");

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
