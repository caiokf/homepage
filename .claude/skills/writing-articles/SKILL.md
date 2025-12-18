---
name: writing-articles
description: Use when creating or editing blog articles for the homepage - enforces humanized writing style, validates punctuation rules, and ensures content reads naturally without AI-typical patterns
---

# Writing Articles

## Overview

Guidelines for writing blog articles that read naturally and avoid AI-typical patterns. Enforces specific punctuation rules and validates content before completion.

## Article Location

Articles go in `src/domain/articles/content/` with naming convention: `YYYY-MM-DD-slug.md`

## Required Frontmatter

```yaml
---
title: "Article Title"
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
slug: article-slug-matching-filename
---
```

## Writing Rules

### Punctuation Rules (ENFORCED)

**Never use em dashes.** This is the most common AI tell.

| Forbidden      | Use Instead                                   |
| -------------- | --------------------------------------------- |
| `—` (em dash)  | `, ` (comma) or `. ` (period) or `: ` (colon) |
| `word—word`    | `word, word` or restructure sentence          |
| `concept—it's` | `concept. It's` or `concept, which is`        |

**Examples:**

```markdown
# BAD (em dash)

Domain memory isn't RAG—it's a persistent representation.

# GOOD (period)

Domain memory isn't RAG. It's a persistent representation.

# GOOD (comma)

Domain memory isn't RAG, it's a persistent representation.
```

### Humanized Writing

**Avoid AI-typical patterns:**

- Excessive hedging: "It's important to note that..."
- Filler phrases: "In order to", "It should be noted"
- Redundant transitions: "Furthermore", "Moreover", "Additionally" (overused)
- Corporate speak: "leverage", "utilize", "facilitate"
- Superlatives without evidence: "revolutionary", "game-changing"

**Write like a person:**

- Start sentences with "And" or "But" when it flows naturally
- Use contractions: "isn't", "doesn't", "won't"
- Vary sentence length. Short sentences punch. Longer ones explain complex ideas with proper context.
- Use concrete examples over abstract descriptions
- State opinions directly without excessive qualification

### Structure

**Opening:** Jump into the content. No "In this article, we will explore..."

**Body:**

- Use headers to break up sections
- Code examples should be complete and runnable
- One idea per paragraph
- Bullet lists for scannable content

**Closing:** End with insight or implication, not summary of what was covered.

## Validation Checklist (MUST run before completing)

After writing any article, validate these rules:

### 1. Em Dash Check

Search the content for em dashes:

```bash
grep -n '—' path/to/article.md
```

If any found, replace them.

### 2. AI Pattern Check

Scan for these phrases and remove/rewrite:

- "It's worth noting"
- "It's important to understand"
- "In order to"
- "This allows us to"
- "At the end of the day"
- "First and foremost"
- "Needless to say"

### 3. Opening Check

First paragraph must NOT contain:

- "In this article"
- "We will explore"
- "This post covers"
- "Let's dive into"

### 4. Readability Check

Read the opening paragraph aloud (mentally). Does it sound like a person wrote it?

## Red Flags - STOP if you notice:

- Em dashes anywhere in content
- Multiple "Furthermore/Moreover/Additionally" in same article
- Opening with "In this article..."
- Passive voice overuse
- Every paragraph starting with same structure

## Common Mistakes

| Mistake                         | Fix                                              |
| ------------------------------- | ------------------------------------------------ |
| Em dash usage                   | Replace with comma, period, or colon             |
| "utilize"                       | Use "use"                                        |
| "in order to"                   | Use "to"                                         |
| "It's important to note that X" | Just say X                                       |
| "This allows us to"             | "This lets you" or restructure                   |
| Listing without context         | Add one sentence explaining why the list matters |

## Workflow

1. **Gather content** from user (source material, key points, intended message)
2. **Draft article** following rules above
3. **Run validation checklist** (em dashes, AI patterns, opening)
4. **Fix any violations** found
5. **Present to user** for approval
6. **Iterate** until approved

**Do NOT mark article as complete until validation passes.**
