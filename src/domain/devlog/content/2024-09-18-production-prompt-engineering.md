---
title: "Production prompt engineering patterns"
date: 2024-09-18
tags: [ai, llm, architecture]
slug: production-prompt-engineering
---

Been refining how I structure prompts for production systems. The basics ("be specific", "provide examples") only get you so far.

Key patterns I'm using now:

**Structured outputs** - Force JSON mode or function calling. Parsing free-form text is fragile. Define a schema and validate against it.

**Chain of thought** - For complex analysis, make the model show its work. "Think step by step: 1. identify inputs, 2. trace data flow, 3. check validation..." catches more issues than a direct "find bugs" prompt.

**Plan and execute** - Separate planning from execution. Generate a plan as JSON, then execute each step with prior context.

**Defensive prompting** - System prompts that constrain behavior ("you ONLY discuss code topics") plus programmatic output validation.

The mindset shift: treat prompts like code. They need tests, version control, and monitoring. A/B test significant changes. Track performance metrics over time.
