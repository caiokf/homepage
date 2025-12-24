---
title: "Integrating LLM code review"
date: 2024-05-10
tags: [ai, code-review, developer-experience]
slug: llm-code-review-integration
---

Added LLM-powered code review to our CI pipeline. Using it as a first-pass filter before human review.

What it catches well: security issues (OWASP top 10), style inconsistencies, documentation gaps, obvious bugs like null dereferences.

What it struggles with: business context, architectural decisions, understanding *why* code is written a certain way.

The key insight: treat suggestions as conversation starters, not authoritative decisions. A "wrong" suggestion might reveal a gap in documentation or an opportunity to improve clarity.

Built the pipeline as: lint → type-check → llm-review → human review (architecture + business logic + final approval). The LLM handles tedious pattern matching, humans handle judgment calls.

Main gotcha: false positives. LLMs can be overly cautious, flagging non-issues. Tuning the system prompt to reduce noise is ongoing work.
