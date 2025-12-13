---
name: coderabbit-request
description: Dispatch a CodeRabbit reviewer subagent to analyze code changes. Returns structured issue list with severity levels. Use when completing a feature and wanting autonomous code review before fixing.
---

# Requesting Review

## Overview

This skill dispatches a CodeRabbit reviewer subagent to analyze your uncommitted code changes and return a structured list of issues. It's the first step in the code → review → triage → fix pipeline.

**When to use**: After implementing a feature, before moving to the triage/fixing phase.

**Outputs**: Structured JSON with categorized issues (Critical/Important/Minor).

## Process

### Step 1: Prepare Context

Stage all changes before review. The `--type uncommitted` flag analyzes both staged and unstaged changes, but staging ensures nothing is missed:

```bash
# Stage all changes
git add -A

# Verify staged changes
git diff --cached --stat
```

Document in your mind what was just implemented. This context helps the reviewer subagent understand scope.

### Step 2: Dispatch CodeRabbit Reviewer Subagent

Spawn subagent with clear instructions:

```text
You are a code review specialist using CodeRabbit CLI.

Your task: Analyze the uncommitted changes and identify issues.

Run this command:
coderabbit --prompt-only --type uncommitted

Let it run to completion. The --prompt-only flag makes output succinct and token-efficient.
This analysis is from the perspective of code quality, security, performance, and best practices.

When complete, return issues in this JSON structure:
```

```json
{
  "critical": [
    {"file": "...", "line": NNN, "issue": "...", "suggestion": "..."}
  ],
  "important": [...],
  "minor": [...]
}
```

```text
Include only genuine issues CodeRabbit found. Do not invent.
```

### Step 3: Monitor Execution

While subagent runs, check progress if needed:

```text
Is CodeRabbit still running? Has it completed?
```

CodeRabbit typically takes 1-3 minutes depending on code volume.

### Step 4: Parse Results

Subagent returns issues in structured format. Verify:

- All issues have `file`, `line`, `issue`, and `suggestion`
- Issues are correctly categorized by severity
- No invented issues
- CodeRabbit's exact wording preserved

### Step 5: Return Results

Pass structured issue list to next skill (`coderabbit-triage`).

## Example Output

```json
{
  "critical": [
    {
      "file": "src/webhooks.ts",
      "line": 42,
      "issue": "Missing HMAC signature verification for webhook authenticity",
      "suggestion": "Add HMAC-SHA256 signature verification using crypto module. Compare against timestamp to prevent replay attacks."
    }
  ],
  "important": [
    {
      "file": "src/webhooks.ts",
      "line": 89,
      "issue": "Race condition in concurrent webhook handling. Multiple async calls can update state simultaneously.",
      "suggestion": "Implement idempotency key handling. Store processed keys in cache with TTL to deduplicate retries."
    },
    {
      "file": "src/webhooks.ts",
      "line": 156,
      "issue": "Missing error logging for webhook failures. Makes debugging production issues difficult.",
      "suggestion": "Add structured logging with timestamp, error type, and webhook ID. Include full error stack."
    }
  ],
  "minor": []
}
```

## Key Principles

**Objectivity**: CodeRabbit is the source of truth. Don't filter or reinterpret findings.

**Completeness**: Return all issues CodeRabbit found, regardless of difficulty.

**Clarity**: Preserve CodeRabbit's exact issue descriptions and suggestions.

**Structure**: Always return JSON with three severity levels, even if some are empty arrays.

## Common Patterns

**When CodeRabbit finds nothing**: Return empty arrays for all severity levels.

```json
{
  "critical": [],
  "important": [],
  "minor": []
}
```

**When issues span multiple files**: Group by file but preserve line numbers.

**When suggestion is vague**: Include CodeRabbit's exact wording. Don't interpret or improve it.

## Constraints

- **DO**: Use `--prompt-only` flag for efficiency
- **DO**: Let CodeRabbit run to completion
- **DO**: Preserve exact issue descriptions from CodeRabbit output
- **DON'T**: Filter out any findings
- **DON'T**: Add your own issues
- **DON'T**: Modify or improve CodeRabbit's suggestions

## Integration Points

This skill feeds directly into `coderabbit-triage`:

```
coderabbit-request
        ↓ (outputs JSON)
coderabbit-triage
        ↓ (outputs task plan)
coderabbit-fix (parallel or sequential)
```
