# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commits

**DO NOT make git commits.** GitButler handles commits automatically via pre/post tool-use hooks. Just make your changes and move on.

## Work Management with Beads

Before starting any work:

- Run `bd onboard` once to set up Beads integration

## Project Overview

Personal homepage and portfolio application built with Vue 3, TypeScript, and D3.js. Features multiple sections including a Tech Radar visualization, devlog, experience timeline, and about page.

**Monorepo Structure:**
- `apps/web/` - Vue 3 frontend application
- `services/devlog-slack-workflow/` - Trigger.dev tasks for Slack → devlog automation

**Key Features:**

- Tech Radar visualization with D3.js (desktop SVG + mobile list views)
- Devlog with Markdown entries, tag filtering, and contribution matrix
- Light/dark theme with system preference detection
- Responsive design with mobile breakpoint at 1024px

## Commands

```bash
# Root workspace commands (run from repo root)
pnpm dev           # Start Vite dev server (localhost:5173)
pnpm build         # Compile TypeScript + production build
pnpm type-check    # Run vue-tsc TypeScript validation
pnpm test          # Run Vitest unit tests
pnpm test:ui       # Run tests with Vitest UI dashboard
pnpm test:coverage # Generate test coverage reports

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
│   ├── atoms/                   # BaseBadge, BaseCard, BaseThemeToggle, etc.
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
│   ├── devlog/
│   │   ├── data.ts              # Devlog entry metadata and loading
│   │   ├── content/             # Markdown devlog entries
│   │   └── components/          # TagFilter, ContributionMatrix, DevLogHeader, etc.
│   └── radar/                   # Tech Radar domain
│       ├── constants.ts         # Ring names, angles, dimensions
│       ├── types.ts             # QuadrantPosition, PositionedBlip
│       ├── models/              # Core business logic
│       │   ├── radar.ts         # Orchestrator (quadrant/blip management)
│       │   ├── quadrant.ts      # Container for blips
│       │   ├── blip.ts          # Technology item with status
│       │   └── ring.ts          # Ring metadata (name, order)
│       ├── geometry/            # D3/SVG positioning calculations
│       │   ├── blip-positioning.geometry.ts  # Collision detection, polar→Cartesian
│       │   ├── blip-rendering.geometry.ts   # Group blip logic
│       │   └── svg-layout.geometry.ts
│       ├── data-providers/      # Data loading strategies
│       │   ├── data-provider-sample.ts
│       │   ├── data-provider-csv.ts
│       │   └── data-provider-google-sheets.ts
│       ├── utils/
│       │   └── seeded-random.ts # Deterministic RNG for reproducible positioning
│       └── components/          # Radar-specific Vue components
│           ├── TechRadar.vue           # Main wrapper (mobile/desktop switch)
│           ├── TechRadarDesktop.vue    # SVG visualization with D3
│           ├── TechRadarMobile.vue     # List-based mobile view
│           ├── RadarBlip.vue
│           ├── RadarHeader.vue
│           ├── RadarLegend.vue
│           ├── Search.vue
│           └── BlipList*.vue           # List display components
├── assets/
│   ├── styles/global.css        # Design tokens, theming, global styles
│   └── logos/                   # Technology company logos
└── types/
    └── d3-tip.d.ts              # TypeScript definitions for d3-tip
```

**Data Flow (Radar):** Radar orchestrates QuadrantConfigs (with angles) → each Quadrant holds Blips → Blips reference Rings

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
- Layout constants: `--content-max-width: 800px`, `--radar-width: 1056px`
- Typography scale: `--text-xs` through `--text-3xl`

### Radar Constants

- Ring names: `["proven", "experimental", "learning", "avoid"]`
- Ring ratios: `[0.11, 0.406, 0.652, 0.832, 1]`
- Quadrant angles: NW=0°, SW=-90°, NE=90°, SE=-180°
- Blip dimensions: `IDEAL_BLIP_WIDTH = 22px`, `NEW_GROUP_BLIP_WIDTH = 88px`, `EXISTING_GROUP_BLIP_WIDTH = 124px`

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

| Path | Page | Description |
|------|------|-------------|
| `/` | AboutPage | Home/about page |
| `/about` | AboutPage | About page (alias) |
| `/tech-radar` | TechRadarHomePage | Radar landing |
| `/tech-radar/:id` | TechRadarViewPage | Radar visualization |
| `/experience` | ExperiencePage | Work history |
| `/devlog` | DevLogPage | Development log |
| `/articles/*` | redirect | Legacy redirect to /devlog |
| `/:pathMatch(.*)*` | NotFoundPage | 404 handler |
