import { Plugin, ResolvedConfig } from "vite";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

/**
 * Plugin to rewrite robots.txt with correct sitemap URL from VITE_SITE_URL
 */
export function robotsPlugin(): Plugin {
  let outDir: string;

  return {
    name: "vite-plugin-seo-robots",
    configResolved(config: ResolvedConfig) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const siteUrl = (process.env.VITE_SITE_URL || "https://dev.caiokf.com").replace(/\/$/, "");
      const robotsPath = resolve(outDir, "robots.txt");

      try {
        let content = readFileSync(robotsPath, "utf-8");

        // Replace any sitemap URL with the correct one
        content = content.replace(
          /Sitemap:\s*https?:\/\/[^\s]+\/sitemap\.xml/gi,
          `Sitemap: ${siteUrl}/sitemap.xml`
        );

        writeFileSync(robotsPath, content);
        console.log("✓ Updated robots.txt with correct sitemap URL");
      } catch (error) {
        console.warn("⚠ Could not update robots.txt:", error);
      }
    },
  };
}
