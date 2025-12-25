---
title: "The memory problem with AI agents"
date: 2025-12-18
tags: [ai, agents, architecture]
slug: ai-agents-memory-problem
---

The problem with AI agents isn't intelligence, it's memory.

I feel like models don't need to improve anymore, they are pretty good as it is. But without persistent memory structures, every agent session starts fresh. Even powerful models become "senior amnesiacs": very capable but with no context of what happened before.

Agents should be stateless policies that transform one memory state into another. The magic lives in the memory scaffold (feature lists, progress logs, test results), not in the agent's intelligence.

Anthropic uses a two-agent pattern: an initializer that bootstraps domain memory from prompts, and a coding agent that follows a strict read-progress → pick-task → implement → test → commit cycle. Each run the agent "dies" with no memory, but the artifacts persist.

It's not about smarter AI, it's better domain memory schemas and testing loops.
