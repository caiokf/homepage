import { task, logger } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

export type WriteDevlogEntryPayload = {
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
  date: string;
  filename: string;
};

// Load prompt from markdown file
// Using process.cwd() with legacyDevProcessCwdBehaviour: false in trigger.config.ts
const SYSTEM_PROMPT = readFileSync(
  join(process.cwd(), "prompts/create-devlog.md"),
  "utf-8"
);

export const writeDevlogEntry = task({
  id: "write-devlog-entry",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: WriteDevlogEntryPayload) => {
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
    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    logger.info("Claude response", { response: responseText });

    // Parse the JSON response (strip markdown code fences if present)
    let generated: GeneratedDevlog;
    try {
      let jsonText = responseText.trim();
      // Remove markdown code fences if Claude wrapped the response
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const parsed = JSON.parse(jsonText);
      // Use extracted date from Claude if provided, otherwise use today
      const entryDate = parsed.date || new Date().toISOString().split("T")[0];

      generated = {
        title: parsed.title,
        slug: parsed.slug,
        tags: parsed.tags,
        content: parsed.content,
        date: entryDate,
        filename: `${entryDate}-${parsed.slug}.md`,
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
    const markdown = `---
title: "${generated.title}"
date: ${generated.date}
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
