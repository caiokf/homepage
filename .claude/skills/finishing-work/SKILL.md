---
name: finishing-work
description: Apply when finishing work session. Explains GitButler hook integration - do NOT manually commit.
---

# Finishing Work

## GitButler Integration

GitButler hooks are already configured to automatically track your changes:

- **PreToolUse**: `but claude pre-tool` runs before Edit/Write operations
- **PostToolUse**: `but claude post-tool` runs after Edit/Write operations
- **Stop**: `but claude stop` runs when the session ends

**You do NOT need to commit manually.** GitButler handles everything through these hooks.

## What You Should Do

When finishing work:

1. Run `bd sync --from-main` to pull beads updates
2. That's it - just stop working

**Do NOT run `git commit` directly** - this bypasses GitButler and creates commits on the workspace branch instead of letting GitButler manage branches properly.

## Beads Sync Reminder

Before ending a session, sync beads to ensure issue tracking is up to date:

```bash
bd sync --from-main
```
