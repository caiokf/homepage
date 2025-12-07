# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tech Radar visualization application built with Vue 3, TypeScript, and D3.js. Displays technology trends in a radar chart format across 4 quadrants (angles: 0°, -90°, 90°, -180°) and multiple concentric rings (Adopt, Trial, Assess, Hold).

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Compile TypeScript + production build
npm run type-check   # Run vue-tsc TypeScript validation
npm test             # Run Vitest unit tests
npm run test:ui      # Run tests with Vitest UI dashboard
npm run test:coverage # Generate test coverage reports
```

Development environment uses pnpm 10.22.0 and Node.js 20.10.0 (configured via devbox.json).

## Architecture

```
src/
├── main.ts                 # App initialization
├── App.vue                 # Root component with header
├── components/
│   └── D3Chart.vue         # Radar visualization (D3 + d3-tip)
├── models/                 # Core business logic
│   ├── radar.ts            # Main orchestrator - manages quadrants, rings, blip numbering
│   ├── quadrant.ts         # Container for Blips with name
│   ├── blip.ts             # Technology item with status tracking
│   └── ring.ts             # Ring metadata (name, order)
└── types/
    └── d3-tip.d.ts         # TypeScript definitions for d3-tip
```

**Data Flow:** Radar orchestrates QuadrantConfigs (with angles) → each Quadrant holds Blips → Blips reference Rings

## Key Patterns

- **Private fields with underscore prefix** (`_fieldName`) with getter-only access
- **Array copying** via `.slice(0)` to prevent external mutations
- **Vue 3 Composition API** with `<script setup>` syntax
- **D3 integration:** Imperative DOM manipulation within Vue lifecycle hooks, separate from Vue reactivity
- **Constants:** `IDEAL_BLIP_WIDTH = 22px`, `NEW_GROUP_BLIP_WIDTH = 88px`, `EXISTING_GROUP_BLIP_WIDTH = 124px`

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
  beforeEach(() => { instance = new ClassName(); });

  describe("method_name", () => {
    it("should behave as expected", () => { /* arrange, act, assert */ });
  });
});
```

## Legacy Code

`src/legacy/` contains original JavaScript implementation not currently in use. The project is being modernized to TypeScript with component-based Vue 3 architecture.
