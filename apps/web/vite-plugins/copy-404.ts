import { Plugin } from "vite";
import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Plugin to copy index.html to 404.html for GitHub Pages SPA support
 */
export function copy404Plugin(): Plugin {
  return {
    name: "vite-plugin-copy-404",
    closeBundle() {
      const distPath = resolve(__dirname, "../../../dist");
      const indexHtml = readFileSync(resolve(distPath, "index.html"), "utf-8");
      writeFileSync(resolve(distPath, "404.html"), indexHtml);
    },
  };
}
