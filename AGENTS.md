# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Work Management with Beads

Before starting any work:

- Run `bd onboard` once to set up Beads integration

## Project Overview

Personal dev-profile and portfolio application built with Vue 3, TypeScript, and D3.js. Features multiple sections including a Tech Radar visualization, devlog, experience timeline, and about page.

**Monorepo Structure:**

```
/
├── apps/web/                         # Vue 3 frontend application
├── services/
│   ├── devlog-slack-workflow/        # Trigger.dev tasks for Slack → devlog automation
│   └── devlog-slack-webhook-worker/  # Cloudflare worker for Slack webhook handling
├── packages/shared/                  # Shared utilities (@caiokf/shared)
└── .claude/                          # Claude Code configuration (agents, skills)
```

**Key Features:**

- Tech Radar visualization with D3.js (desktop SVG + mobile list views)
- Devlog with Markdown entries, tag filtering, week grouping, and contribution matrix
- Light/dark theme with system preference detection
- Responsive design with mobile breakpoint at 1024px
- Slack-to-devlog automation via Trigger.dev

## Commands

```bash
# Root workspace commands (run from repo root)
pnpm dev              # Start Vite dev server (localhost:5173)
pnpm build            # Compile TypeScript + production build
pnpm type-check       # Run vue-tsc TypeScript validation
pnpm test             # Run Vitest unit tests
pnpm test:ui          # Run tests with Vitest UI dashboard
pnpm test:coverage    # Generate test coverage reports

# Devlog workflow (Trigger.dev)
pnpm devlog:dev       # Start Trigger.dev local development
pnpm devlog:deploy    # Deploy workflow to Trigger.dev

# Slack webhook worker (Cloudflare)
pnpm slack-webhook:dev      # Local development
pnpm slack-webhook:deploy   # Deploy to Cloudflare

# Run commands in specific workspace
pnpm --filter @caiokf/web <command>
```

Development environment uses pnpm 10.22.0 and Node.js 20.10.0 (configured via devbox.json).

## Architecture

```
apps/web/src/
├── main.ts                      # App initialization with router
├── App.vue                      # Root component (header, router-view, footer)
├── router/
│   └── index.ts                 # Vue Router config (7 routes)
├── composables/
│   └── useTheme.ts              # Theme management (light/dark + localStorage)
├── components/                  # Reusable UI (Atomic Design)
│   ├── atoms/                   # BaseBadge, BaseCard, BaseThemeToggle, BaseBracketLink, BaseSpotlightLoader
│   ├── molecules/               # BadgeGroup
│   └── layouts/                 # AppHeader, AppFooter, SocialLinks
├── pages/                       # Route-bound page components
│   ├── AboutPage.vue
│   ├── TechRadarHomePage.vue
│   ├── TechRadarViewPage.vue
│   ├── ExperiencePage.vue
│   ├── DevLogPage.vue
│   └── NotFoundPage.vue
├── domain/                      # Domain-specific business logic
│   ├── about/data.ts
│   ├── layout/data.ts
│   ├── experience/data.ts
│   ├── devlog/                  # Devlog domain
│   │   ├── data.ts              # Entry metadata, loading, caching, week grouping
│   │   ├── model.ts             # DevlogEntry type definition
│   │   └── components/          # DevLogHeader, DevLogSearch, TagFilter, TagRadar, ContributionMatrix
│   └── radar/                   # Tech Radar domain
│       ├── constants.ts         # Ring names, angles, dimensions, max blips per ring
│       ├── types.ts             # QuadrantPosition, PositionedBlip, RingName
│       ├── models/              # Core business logic (with tests)
│       │   ├── radar.ts         # Orchestrator (quadrant/blip management)
│       │   ├── quadrant.ts      # Container for blips with collision detection
│       │   ├── blip.ts          # Technology item with status/width
│       │   └── ring.ts          # Ring metadata (name, index)
│       ├── geometry/            # D3/SVG positioning calculations (with tests)
│       │   ├── blip-positioning.geometry.ts   # Collision detection, polar→Cartesian
│       │   ├── blip-rendering.geometry.ts    # Group blip layout logic
│       │   └── svg-layout.geometry.ts
│       ├── data-providers/      # Strategy pattern for data loading
│       │   ├── data-provider.ts           # Abstract base
│       │   ├── data-provider-sample.ts
│       │   ├── data-provider-csv.ts
│       │   └── data-provider-google-sheets.ts
│       ├── utils/
│       │   └── seeded-random.ts # Deterministic RNG for reproducible positioning
│       └── components/          # Radar visualization components
│           ├── TechRadar.vue           # Mobile/desktop responsive switcher
│           ├── TechRadarDesktop.vue    # D3-based SVG visualization
│           ├── TechRadarMobile.vue     # List-based mobile view
│           ├── RadarBlip.vue
│           ├── RadarHeader.vue
│           ├── RadarLegend.vue
│           ├── RadarSeparators.vue
│           ├── RadarTooltip.vue
│           ├── QuadrantLabel.vue
│           ├── Search.vue
│           ├── BlipList.vue
│           ├── BlipListByQuadrant.vue
│           ├── BlipListByRing.vue
│           └── BlipListItem.vue
├── assets/
│   ├── styles/global.css        # Design tokens, theming, global styles
│   ├── images/
│   └── logos/                   # Technology company logos
└── types/
    ├── d3-tip.d.ts              # TypeScript definitions for d3-tip
    └── virtual-devlog-index.d.ts # Virtual module type declaration
```

**Data Flow (Radar):** Radar orchestrates QuadrantConfigs (with angles) → each Quadrant holds Blips → Blips reference Rings

## Devlog System

The devlog uses a build-time indexing approach with runtime content loading:

**Build-time (Vite plugin):**

- `apps/web/vite-plugin-devlog-index.ts` scans `public/devlog/*.md` files
- Extracts YAML frontmatter (title, date, tags, slug) using `front-matter`
- Generates `virtual:devlog-index` module with metadata sorted by date

**Runtime:**

- Content fetched from `${BASE_URL}/devlog/{filename}`
- Week-based grouping using ISO week date system (`packages/shared/getWeekKey`)
- Caching and search integration via Fuse.js

**Entry format:**

```yaml
---
title: "Article Title"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
slug: article-slug
---
Markdown content here...
```

## Services

### devlog-slack-workflow (Trigger.dev v4)

Task-driven workflow for Slack → devlog automation:

- `process-slack-devlog-request` - Parse Slack messages
- `generate-devlog-preview` - Generate preview from Slack content
- `write-devlog-entry` - Write to GitHub repo
- `publish-devlog-entry` - Finalize and deploy
- `regenerate-devlog-preview` - Update existing preview
- `publish-devlog-from-preview` - Publish previously generated preview

Uses Anthropic SDK (Claude API) and Octokit (GitHub API).

### devlog-slack-webhook-worker (Cloudflare Worker)

Webhook endpoint for receiving Slack messages.

### packages/shared

Shared utilities used across services:

- `getWeekKey(date)` - ISO week calculation for week-based grouping

## Key Patterns

### Vue & Component Patterns

- **Vue file formatting:** Indent content inside `<script>` and `<style>` tags (configured via `vueIndentScriptAndStyle: true` in `.prettierrc`)
- **Vue 3 Composition API** with `<script setup>` syntax
- **Atomic Design:** atoms → molecules → layouts → organisms for reusable components
- **Domain components:** Feature-specific components live in `domain/<feature>/components/`
- **D3 integration:** Imperative DOM manipulation within Vue lifecycle hooks, separate from Vue reactivity

### Class Design

- **Private fields with underscore prefix** (`_fieldName`) with getter-only access:

  ```typescript
  // Correct
  class Example {
    private _value: number;

    constructor(value: number) {
      this._value = value;
    }

    get value(): number {
      return this._value;
    }
  }

  // Incorrect
  class Example {
    private value: number; // Missing underscore prefix
  }
  ```

- **Array copying** via `.slice(0)` to prevent external mutations

### Styling

- **CSS Custom Properties** for theming (design tokens in `apps/web/src/assets/styles/global.css`)
- Light/dark theme support via `useTheme` composable
- Custom media queries: `--xs` (480px), `--sm` (600px), `--md` (768px), `--lg` (1024px), `--xl` (1200px)
- Layout constants: `--content-max-width: 800px`, `--radar-width: 1056px`
- Typography scale: `--text-xs` through `--text-3xl`
- Spacing scale: `--space-1` through `--space-12`

### Radar Constants

- Ring names: `["proven", "experimental", "learning", "avoid"]`
- Ring ratios: `[0.11, 0.406, 0.652, 0.832, 1]`
- Quadrant angles: NW=0°, SW=-90°, NE=90°, SE=-180°
- Blip dimensions: `IDEAL_BLIP_WIDTH = 22px`, `NEW_GROUP_BLIP_WIDTH = 88px`, `EXISTING_GROUP_BLIP_WIDTH = 124px`
- Max blips per ring: `[8, 22, 17, 18]` (rings 0-3)
- Mobile breakpoint: 1024px
- Transition duration: 300ms

## TypeScript Conventions

- **Use `type` instead of `interface`** for all type definitions. The only exception is `.d.ts` declaration files where `interface` may be required for module augmentation.
- **Use `type` for object shapes:**

  ```typescript
  // Correct
  type SearchResult = {
    blip: Blip;
    quadrant: QuadrantPosition;
  };

  // Incorrect
  interface SearchResult {
    blip: Blip;
    quadrant: QuadrantPosition;
  }
  ```

- **Quadrant positions use compass directions:** `"NE" | "NW" | "SE" | "SW"` (not "first", "second", etc.)

## Testing

Vitest with globals enabled. Test files colocated with source (`*.test.ts`).

```typescript
describe("ClassName", () => {
  let instance: ClassName;
  beforeEach(() => {
    instance = new ClassName();
  });

  describe("method_name", () => {
    it("should behave as expected", () => {
      /* arrange, act, assert */
    });
  });
});
```

## Routes

| Path               | Page              | Description                |
| ------------------ | ----------------- | -------------------------- |
| `/`                | AboutPage         | Home/about page            |
| `/about`           | AboutPage         | About page (alias)         |
| `/tech-radar`      | TechRadarHomePage | Radar landing              |
| `/tech-radar/:id`  | TechRadarViewPage | Radar visualization        |
| `/experience`      | ExperiencePage    | Work history               |
| `/devlog`          | DevLogPage        | Development log            |
| `/articles/*`      | redirect          | Legacy redirect to /devlog |
| `/:pathMatch(.*)*` | NotFoundPage      | 404 handler                |

## Static Files Requiring Manual Sync

The following files in `apps/web/public/` must be manually updated when content changes:

| File          | Sync When                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------- |
| `llms.txt`    | About page content changes (skills, specialties, descriptions)                              |
| `sitemap.xml` | Routes are added or removed (also generated at build time by `vite-plugins/seo-sitemap.ts`) |

The `sitemap.xml` in `public/` uses `dev.caiokf.com` as the default hostname for local development. At build time, the vite plugin overwrites it with the correct hostname based on `VITE_SITE_URL`.

## Content Writing Guidelines

When writing devlog articles or content:

- **No em dashes** - Use commas, semicolons, or separate sentences instead
- **Avoid AI-typical hedging phrases** like "it's important to note", "it's worth mentioning"
- **Don't start with "In this article..."** - Jump directly into the content
- **Write naturally** - Content should read as human-written, not AI-generated

# Claude Code Conventions

Project-specific conventions for AI-assisted development.

## Commands

### Cloudflare Workers

Always use `pnpm exec wrangler` instead of `npx wrangler` or `wrangler`:

```bash
# Deploy a worker
cd services/devlog-slack-webhook-worker && pnpm exec wrangler deploy

# Set secrets
cd services/devlog-slack-webhook-worker && pnpm exec wrangler secret put SECRET_NAME

# List secrets
cd services/devlog-slack-webhook-worker && pnpm exec wrangler secret list
```

### Trigger.dev

Deploy using the MCP tool or CLI:

```bash
# CLI deployment
cd services/devlog-slack-workflow && npx trigger deploy --env prod
```

## Services

### devlog-slack-workflow (Trigger.dev)

- Location: `services/devlog-slack-workflow/`
- Config: `trigger.config.ts`
- Tasks in: `src/trigger/`

### devlog-slack-webhook-worker (Cloudflare Worker)

- Location: `services/devlog-slack-webhook-worker/`
- Config: `wrangler.toml`
- Required secrets: `SLACK_SIGNING_SECRET`, `TRIGGER_SECRET_KEY`
