import { Plugin, ResolvedConfig } from "vite";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

/**
 * Plugin to update SEO-related URLs in HTML at build time
 * Replaces canonical URL and other site-specific URLs with VITE_SITE_URL
 */
export function seoHtmlPlugin(): Plugin {
  let outDir: string;

  return {
    name: "vite-plugin-seo-html",
    configResolved(config: ResolvedConfig) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const siteUrl = (process.env.VITE_SITE_URL || "https://dev.caiokf.com").replace(/\/$/, "");

      try {
        const indexPath = resolve(outDir, "index.html");
        let html = readFileSync(indexPath, "utf-8");

        // Replace canonical URL
        html = html.replace(
          /<link rel="canonical" href="https?:\/\/[^"]+\/" \/>/,
          `<link rel="canonical" href="${siteUrl}/" />`
        );

        writeFileSync(indexPath, html);
        console.log("✓ Updated index.html with correct canonical URL");
      } catch (error) {
        console.warn("⚠ Could not update index.html:", error);
      }
    },
  };
}
