# caiokf.com

Personal homepage and portfolio featuring an interactive tech radar, devlog, experience timeline, and about page.

[![Homepage Screenshot](https://api.microlink.io/?url=https://caiokf.github.io/dev-profile&screenshot=true&meta=false&embed=screenshot.url)](https://caiokf.github.io/dev-profile)

## Features

- **Tech Radar** - Interactive D3.js visualization of technology opinions with desktop SVG and mobile list views
- **Devlog** - Markdown-based development log with tag filtering, week grouping, and contribution matrix
- **Experience** - Career timeline with company logos and tech stacks
- **About** - Bio and skills overview
- **Theming** - Light/dark mode with system preference detection

## Project Structure

```
├── apps/web/                         # Vue 3 frontend application
├── services/
│   ├── devlog-slack-workflow/        # Trigger.dev tasks for Slack → devlog automation
│   └── devlog-slack-webhook-worker/  # Cloudflare worker for webhook handling
├── packages/shared/                  # Shared utilities
└── .claude/                          # AI assistant configuration
```

## Tech Stack

**Frontend:**
- Vue 3 + TypeScript + Composition API
- D3.js for tech radar visualization
- Vite for build tooling
- Vitest for testing

**Backend/Automation:**
- Trigger.dev v4 for serverless task orchestration
- Cloudflare Workers for webhook handling
- Anthropic SDK + Octokit for content automation

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (localhost:5173)
pnpm dev

# Run tests
pnpm test

# Type check
pnpm type-check

# Build for production
pnpm build
```

## Deployment

The frontend deploys automatically to GitHub Pages via GitHub Actions on push to main.

Services deploy separately:
- `pnpm devlog:deploy` - Deploy Trigger.dev workflow
- `pnpm slack-webhook:deploy` - Deploy Cloudflare worker

## License

MIT
