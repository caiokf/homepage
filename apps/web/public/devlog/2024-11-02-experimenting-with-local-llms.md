---
title: "Experimenting with local LLMs"
date: 2024-11-02
tags: [ai, llm, tools]
slug: experimenting-with-local-llms
---

Set up Ollama this week to run LLMs locally. The main drivers: no API costs for experimentation, data stays on my machine, and it works offline.

Running CodeLlama 13B on my RTX 3080 (10GB VRAM). Speed is acceptable for code review tasks - not as fast as cloud APIs but usable.

The practical setup ended up being a hybrid approach: local for sensitive code and quick iterations, cloud APIs when I need higher quality reasoning. Built a small wrapper that routes based on sensitivity:

```typescript
async function getCompletion(prompt: string, sensitive: boolean) {
  return sensitive ? localLlm.generate(prompt) : cloudLlm.generate(prompt);
}
```

Main limitation is context length - most local models cap at 4-8k tokens vs 100k+ for Claude. For large codebase analysis, still need the cloud.
