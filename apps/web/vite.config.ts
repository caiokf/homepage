import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { devlogIndexPlugin, copy404Plugin, sitemapPlugin } from "./vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), devlogIndexPlugin(), copy404Plugin(), sitemapPlugin()],
  base: process.env.VITE_BASE_URL || "/homepage/",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
});
