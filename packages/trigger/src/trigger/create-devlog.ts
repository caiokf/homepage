import { task, logger } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";

export type CreateDevlogPayload = {
  text: string;
  userId: string;
  userName?: string;
  channelId: string;
  responseUrl?: string;
};

type GeneratedDevlog = {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  filename: string;
};

const WRITING_GUIDELINES = `
## Writing Rules

### Punctuation Rules (ENFORCED)

**Never use em dashes.** This is the most common AI tell.

| Forbidden      | Use Instead                                   |
| -------------- | --------------------------------------------- |
| \`—\` (em dash)  | \`, \` (comma) or \`. \` (period) or \`: \` (colon) |
| \`word—word\`    | \`word, word\` or restructure sentence          |

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
- Vary sentence length. Short sentences punch. Longer ones explain complex ideas.
- Use concrete examples over abstract descriptions
- State opinions directly without excessive qualification

### Structure

**Opening:** Jump into the content. No "In this article, we will explore..."
**Body:** One idea per paragraph. Use headers to break up sections.
**Closing:** End with insight or implication, not summary.

### Format

The devlog entry should be SHORT and CONCISE. Think 3-6 short paragraphs maximum.
This is a dev log, not a full blog post. Capture the essence quickly.
`;

const SYSTEM_PROMPT = `You are a technical writer helping create dev log entries.
You will receive a short message or idea from a developer and transform it into a well-formatted dev log entry.

${WRITING_GUIDELINES}

## Output Format

You must respond with ONLY valid JSON in this exact format (no markdown code blocks):
{
  "title": "Short, descriptive title",
  "slug": "kebab-case-slug-matching-title",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "The markdown content of the dev log entry (without frontmatter)"
}

## Tag Guidelines
- Use 2-4 relevant tags
- Common tags: ai, vue, typescript, architecture, testing, devops, learning, tools
- Keep tags lowercase

## Content Guidelines
- Keep entries concise (3-6 short paragraphs)
- First paragraph should hook the reader immediately
- Include specific technical details when relevant
- End with a takeaway or next step
- NO em dashes anywhere in the content
- Content should NOT include the frontmatter (title, date, tags, slug) - just the body text
`;

export const createDevlog = task({
  id: "create-devlog",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: CreateDevlogPayload) => {
    logger.info("Creating devlog from Slack message", { text: payload.text });

    // Initialize Anthropic client
    const anthropic = new Anthropic();

    // Generate the devlog content using Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Create a dev log entry from this message:\n\n"${payload.text}"`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract the text content
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    logger.info("Claude response", { response: responseText });

    // Parse the JSON response
    let generated: GeneratedDevlog;
    try {
      const parsed = JSON.parse(responseText);
      const today = new Date().toISOString().split("T")[0];

      generated = {
        title: parsed.title,
        slug: parsed.slug,
        tags: parsed.tags,
        content: parsed.content,
        filename: `${today}-${parsed.slug}.md`,
      };
    } catch (error) {
      logger.error("Failed to parse Claude response", { error, responseText });
      throw new Error(`Failed to parse Claude response: ${responseText}`);
    }

    // Validate no em dashes in content
    if (generated.content.includes("—")) {
      logger.warn("Em dash detected in generated content, replacing");
      generated.content = generated.content.replace(/—/g, ", ");
    }

    // Build the full markdown with frontmatter
    const today = new Date().toISOString().split("T")[0];
    const markdown = `---
title: "${generated.title}"
date: ${today}
tags: [${generated.tags.join(", ")}]
slug: ${generated.slug}
---

${generated.content}
`;

    logger.info("Generated devlog entry", {
      filename: generated.filename,
      title: generated.title,
      tags: generated.tags,
    });

    return {
      success: true,
      filename: generated.filename,
      title: generated.title,
      slug: generated.slug,
      tags: generated.tags,
      markdown,
      timestamp: new Date().toISOString(),
    };
  },
});
