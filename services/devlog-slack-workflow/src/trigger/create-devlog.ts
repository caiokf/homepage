import { task, logger } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

// Load prompt from markdown file
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(
  resolve(__dirname, "../../prompts/create-devlog.md"),
  "utf-8"
);

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
    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

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
