---
title: Running Local LLMs for Development
date: 2024-11-02
tags: [ai, llm, developer-experience, privacy]
slug: local-llms-for-development
---

Running LLMs locally has become increasingly practical. With models like Llama, Mistral, and CodeLlama available as open weights, developers can now have AI assistance without sending code to external APIs.

## Why Run Locally?

The advantages extend beyond just privacy:

- **No API costs**: Unlimited usage after initial setup
- **Low latency**: No network round-trips
- **Offline capability**: Works without internet
- **Data sovereignty**: Code never leaves your machine
- **Customization**: Fine-tune for your specific codebase

## Hardware Requirements

Modern quantized models run surprisingly well on consumer hardware:

| Model Size | VRAM Required | Example Hardware |
|------------|---------------|------------------|
| 7B (Q4)    | 6GB           | RTX 3060         |
| 13B (Q4)   | 10GB          | RTX 3080         |
| 34B (Q4)   | 20GB          | RTX 4090         |

For CPU-only inference, expect 10-50x slower speeds but it remains usable for many tasks.

## Getting Started with Ollama

Ollama provides the simplest path to local LLMs:

```bash
# Install and run
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama:13b

# Use via API
curl http://localhost:11434/api/generate -d '{
  "model": "codellama:13b",
  "prompt": "Write a TypeScript function to debounce"
}'
```

## Integration Patterns

### VS Code Extension

Many extensions support local backends:

```json
{
  "continue.models": [{
    "title": "Local CodeLlama",
    "provider": "ollama",
    "model": "codellama:13b"
  }]
}
```

### Custom CLI Tools

Build project-specific assistants:

```typescript
import { Ollama } from "ollama";

const ollama = new Ollama();

async function reviewFile(path: string): Promise<string> {
  const code = await fs.readFile(path, "utf-8");

  const response = await ollama.generate({
    model: "codellama:13b",
    prompt: `Review this code for issues:\n\n${code}`,
    system: "You are a senior code reviewer. Be concise.",
  });

  return response.response;
}
```

## Model Selection

Different models excel at different tasks:

- **CodeLlama**: Best for code generation and completion
- **Mistral**: Strong general reasoning, good for explanations
- **DeepSeek Coder**: Excellent for multi-file understanding
- **Phi-2**: Surprisingly capable for its tiny size

## Practical Limitations

Be realistic about what local models can do:

1. **Context length**: Most cap at 4-8k tokens vs. 100k+ for cloud models
2. **Quality gap**: GPT-4 and Claude still lead on complex reasoning
3. **Speed**: Even with GPU, slower than API calls to optimized infrastructure

## Hybrid Approach

The pragmatic solution combines local and cloud:

```typescript
async function getCompletion(prompt: string, sensitive: boolean) {
  if (sensitive) {
    return localLlm.generate(prompt);
  }
  return cloudLlm.generate(prompt); // Better quality for non-sensitive
}
```

Local LLMs aren't replacing cloud APIs, but they're becoming an essential part of the developer toolkit—especially for sensitive codebases and cost-conscious teams.
