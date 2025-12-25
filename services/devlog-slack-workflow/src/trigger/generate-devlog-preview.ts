import { task, logger } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import { DateTime } from "luxon";

export type GenerateDevlogPreviewPayload = {
  text: string;
  userId: string;
  userName?: string;
  responseUrl: string;
};

export type GeneratedDevlog = {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  date: string;
};

export type EditContext = {
  originalText: string;
  currentDevlog: GeneratedDevlog;
  feedbackHistory: string[];
};

const SYSTEM_PROMPT = readFileSync(
  join(process.cwd(), "prompts/writing-devlog-entries.md"),
  "utf-8"
);

/**
 * Send a preview message to Slack with action buttons
 */
export type SlackButtonContext = {
  runId: string;
  originalText: string;
  feedbackHistory: string[];
};

export async function sendPreviewToSlack(
  responseUrl: string,
  devlog: GeneratedDevlog,
  originalText: string,
  feedbackHistory: string[] = [],
  runId?: string
): Promise<void> {
  // Use runId-based context to stay under Slack's 2000 char button value limit
  const buttonContext: SlackButtonContext = {
    runId: runId || "",
    originalText,
    feedbackHistory,
  };
  const contextJson = JSON.stringify(buttonContext);

  const iterationNote =
    feedbackHistory.length > 0
      ? `\n_Iteration ${feedbackHistory.length + 1} based on your feedback_`
      : "";

  logger.info("Sending preview to Slack", { responseUrl });

  const response = await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "ephemeral",
      replace_original: true,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Devlog Preview",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Preview of your devlog entry${iterationNote}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Title:*\n${devlog.title}`,
            },
            {
              type: "mrkdwn",
              text: `*Date:*\n${devlog.date}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Tags:* ${devlog.tags.join(", ")}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Content:*\n${devlog.content.substring(0, 2500)}${devlog.content.length > 2500 ? "..." : ""}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Publish",
              },
              style: "primary",
              action_id: "publish_devlog",
              value: contextJson,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Edit",
              },
              action_id: "edit_devlog",
              value: contextJson,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Cancel",
              },
              style: "danger",
              action_id: "cancel_devlog",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("Failed to send preview to Slack", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
  } else {
    logger.info("Successfully sent preview to Slack", { status: response.status });
  }
}

/**
 * Send error message to Slack
 */
export async function sendErrorToSlack(responseUrl: string, message: string): Promise<void> {
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "ephemeral",
      replace_original: true,
      text: message,
      attachments: [{ color: "danger", text: message }],
    }),
  });
}

/**
 * Parse Claude's JSON response and extract devlog
 */
export function parseDevlogResponse(responseText: string): GeneratedDevlog {
  let jsonText = responseText.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);

  // Validate and parse date
  let entryDate: string;
  if (parsed.date) {
    let dt = DateTime.fromISO(parsed.date, { zone: "utc" });

    if (!dt.isValid) {
      const formats = [
        "yyyy/MM/dd",
        "MM-dd-yyyy",
        "dd-MM-yyyy",
        "MMMM d, yyyy",
        "MMM d, yyyy",
        "MMMM d",
        "MMM d",
      ];

      for (const fmt of formats) {
        dt = DateTime.fromFormat(parsed.date, fmt, { zone: "utc" });
        if (dt.isValid) break;
      }
    }

    entryDate = dt.isValid ? dt.toISODate()! : DateTime.now().toISODate()!;
  } else {
    entryDate = DateTime.now().toISODate()!;
  }

  return {
    title: parsed.title,
    slug: parsed.slug,
    tags: parsed.tags,
    content: parsed.content.replace(/—/g, ", "),
    date: entryDate,
  };
}

export { SYSTEM_PROMPT };

export const generateDevlogPreview = task({
  id: "generate-devlog-preview",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: GenerateDevlogPreviewPayload, { ctx }) => {
    const { text, responseUrl } = payload;
    const runId = ctx.run.id;

    logger.info("Generating devlog preview", { text });

    try {
      const anthropic = new Anthropic();

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Create a dev log entry from this message:\n\n"${text}"`,
          },
        ],
        system: SYSTEM_PROMPT,
      });

      const responseText = message.content[0].type === "text" ? message.content[0].text : "";

      logger.info("Claude response", { response: responseText });

      const devlog = parseDevlogResponse(responseText);

      logger.info("Generated devlog preview", {
        title: devlog.title,
        tags: devlog.tags,
      });

      // Send preview to Slack with context for editing
      await sendPreviewToSlack(responseUrl, devlog, text, [], runId);

      return {
        success: true,
        devlog,
      };
    } catch (error) {
      logger.error("Failed to generate preview", { error });

      await sendErrorToSlack(
        responseUrl,
        `Failed to generate devlog preview: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      throw error;
    }
  },
});
