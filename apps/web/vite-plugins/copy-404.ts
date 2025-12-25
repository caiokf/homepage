import { Plugin, ResolvedConfig } from "vite";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

/**
 * Plugin to copy index.html to 404.html for GitHub Pages SPA support
 */
export function copy404Plugin(): Plugin {
  let outDir: string;

  return {
    name: "vite-plugin-copy-404",
    configResolved(config: ResolvedConfig) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      try {
        const indexPath = resolve(outDir, "index.html");
        const indexHtml = readFileSync(indexPath, "utf-8");
        writeFileSync(resolve(outDir, "404.html"), indexHtml);
        console.log("✓ Created 404.html from index.html");
      } catch (error) {
        console.warn("⚠ Could not create 404.html:", error);
      }
    },
  };
}
