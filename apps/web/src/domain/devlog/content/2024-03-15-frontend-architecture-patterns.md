---
title: "Frontend architecture patterns"
date: 2024-03-15
tags: [architecture, frontend, vue, typescript]
slug: frontend-architecture-patterns
---

Refactored a growing Vue codebase this week. Moved from organizing by type (all components together, all composables together) to organizing by feature.

New structure:
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   └── types.ts
│   └── dashboard/
├── shared/
│   ├── components/
│   └── utils/
└── core/
    ├── api/
    └── config/
```

The benefit: changes for a feature are localized. Less jumping between directories. Easier to understand scope of changes.

Also enforcing stricter TypeScript. Every interface tells a story about how code should be used. API response types with proper generics, function signatures that document intent.

Component design principle I'm sticking to: if you need "and" in your description, split it up. Single responsibility keeps components composable.
