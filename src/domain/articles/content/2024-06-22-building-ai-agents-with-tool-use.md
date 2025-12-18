---
title: Building AI Agents with Tool Use
date: 2024-06-22
tags: [ai, agents, architecture, typescript]
slug: building-ai-agents-with-tool-use
authors: claude code
---

AI agents that can use tools represent a significant leap beyond simple chatbots. By giving LLMs the ability to execute functions, query databases, and interact with APIs, we unlock genuinely useful autonomous systems.

## The Agent Loop

At its core, an AI agent follows a simple loop: observe, think, act, repeat. The magic happens in how we structure the tools and manage the conversation context.

```typescript
type Tool = {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: unknown) => Promise<ToolResult>;
};

async function agentLoop(goal: string, tools: Tool[], maxIterations = 10): Promise<string> {
  const messages: Message[] = [{ role: "user", content: goal }];

  for (let i = 0; i < maxIterations; i++) {
    const response = await llm.chat(messages, { tools });

    if (response.type === "final_answer") {
      return response.content;
    }

    const tool = tools.find((t) => t.name === response.toolCall.name);

    if (!tool) {
      messages.push({
        role: "tool",
        content: `Error: tool not found: ${response.toolCall.name}`,
      });
      continue;
    }

    try {
      const result = await tool.execute(response.toolCall.params);
      const content = typeof result === "string" ? result : JSON.stringify(result);
      messages.push({ role: "tool", content });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      messages.push({
        role: "tool",
        content: `Error executing ${tool.name}: ${errorMessage}`,
      });
    }
  }

  throw new Error("Max iterations reached");
}
```

## Designing Effective Tools

Good tool design is crucial for agent reliability. Each tool should be:

- **Focused**: One clear purpose
- **Descriptive**: Clear documentation the LLM can understand
- **Safe**: Validate inputs and handle errors gracefully

### Example: A Search Tool

```typescript
const searchTool: Tool = {
  name: "search_codebase",
  description: "Search for code patterns or file contents in the repository",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query" },
      fileType: { type: "string", description: "Filter by file extension" },
    },
    required: ["query"],
  },
  execute: async ({ query, fileType }) => {
    // Implementation using grep or AST parsing
  },
};
```

## Handling Failures

Agents will make mistakes. The key is building systems that fail gracefully and can recover:

1. **Retry with feedback**: When a tool call fails, include the error in context
2. **Human escalation**: Know when to ask for help
3. **Rollback capabilities**: Undo actions when things go wrong

## Production Considerations

Running agents in production requires careful attention to:

- **Cost control**: Token usage can explode with long conversations
- **Timeouts**: Set reasonable limits on execution time
- **Observability**: Log every decision for debugging

The future of software development increasingly involves collaborating with AI agents. Understanding how to build them well is becoming an essential skill.
