---
title: "The memory problem with AI agents"
date: 2025-12-18
tags: [ai, agents, architecture]
slug: ai-agents-memory-problem
---

Watched an [Anthropic talk](https://www.youtube.com/watch?v=xNcEgqzlPqs) that clicked something for me. The problem with AI agents isn't intelligence - it's memory.

Without persistent memory structures, every agent session starts fresh. Even powerful models become "senior amnesiacs" - very capable but with no context of what happened before.

The insight: agents should be stateless policies that transform one memory state into another. The magic lives in the memory scaffold (feature lists, progress logs, test results), not in the agent's intelligence.

Anthropic uses a two-agent pattern: an initializer that bootstraps domain memory from prompts, and a coding agent that follows a strict read-progress → pick-task → implement → test → commit cycle. Each run the agent "dies" with no memory - but the artifacts persist.

This reframes where competitive advantage lies. It's not smarter AI - it's better domain memory schemas and testing loops.
