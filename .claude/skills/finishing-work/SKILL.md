---
name: finishing-work
description: Use when completing work on a task or feature. Prompts for code review before finishing. ALWAYS invoke this skill before saying work is done.
---

# Finishing Work

## CRITICAL: Always Ask About Code Review

Before finishing ANY work, you MUST ask the user:

> "Would you like me to request a code review before finishing? (Yes/No)"

Use the AskUserQuestion tool with options:
- **Yes** - Invoke `coderabbit-request` skill, then triage and fix any issues
- **No** - Skip review and proceed to finish

**Do NOT skip this prompt.** Even for small changes, the user decides.

## If User Says Yes: Code Review Workflow

Invoke `coderabbit-request` to start the review pipeline:

```
coderabbit-request
        ↓ (outputs JSON)
coderabbit-triage
        ↓ (outputs task plan)
coderabbit-fix (parallel or sequential)
```

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
