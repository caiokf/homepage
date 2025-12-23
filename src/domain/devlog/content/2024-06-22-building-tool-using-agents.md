---
title: "Building tool-using agents"
date: 2024-06-22
tags: [ai, agents, typescript]
slug: building-tool-using-agents
---

Built my first proper AI agent with tool use this week. The core loop is simple: observe → think → act → repeat.

The key insight is tool design matters more than model choice. Each tool should be focused (one purpose), descriptive (docs the LLM can understand), and safe (validate inputs, handle errors gracefully).

Error handling is critical. When a tool call fails, include the error in context so the agent can try something else. Built in a retry-with-feedback pattern that works well.

Production concerns I didn't anticipate:
- Token usage explodes with long conversations - need cost controls
- Timeouts are essential - agents can get stuck in loops
- Log every decision for debugging - you'll need it

Next step: adding human escalation for when the agent gets stuck. Know when to ask for help.
