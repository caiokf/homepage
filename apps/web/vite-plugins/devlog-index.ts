import { Plugin } from "vite";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import fm from "front-matter";

// Types defined locally - vite plugins use tsconfig.node.json which is separate from the app
interface EntryFrontmatter {
  title: string;
  date: Date | string;
  tags: string[];
  slug: string;
}

interface EntryMetadata {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  filename: string;
  weekKey: string;
}

// Local copy of getWeekKey - cannot import from @caiokf/shared at build time
// since Vite config runs in Node before TypeScript compilation
function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

function generateDevlogIndex(devlogDir: string): EntryMetadata[] {
  const files = readdirSync(devlogDir).filter((f) => f.endsWith(".md"));

  const entries: EntryMetadata[] = files.map((filename) => {
    const filepath = resolve(devlogDir, filename);
    const content = readFileSync(filepath, "utf-8");
    const parsed = fm<EntryFrontmatter>(content);

    const dateValue = parsed.attributes.date;
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    const weekKey = getWeekKey(date);

    return {
      title: parsed.attributes.title,
      date: date instanceof Date ? date.toISOString().split("T")[0] : String(date),
      tags: parsed.attributes.tags,
      slug: parsed.attributes.slug,
      filename,
      weekKey,
    };
  });

  // Sort by date descending (newest first)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const VIRTUAL_MODULE_ID = "virtual:devlog-index";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

export function devlogIndexPlugin(): Plugin {
  let devlogDir: string;

  return {
    name: "vite-plugin-devlog-index",

    configResolved(config) {
      devlogDir = resolve(config.root, "public/devlog");
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const index = generateDevlogIndex(devlogDir);
        return `export default ${JSON.stringify(index, null, 2)};`;
      }
    },

    handleHotUpdate({ file, server }) {
      // Invalidate virtual module when any .md file in devlog changes
      if (file.includes("/devlog/") && file.endsWith(".md")) {
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          return [module];
        }
      }
    },
  };
}
