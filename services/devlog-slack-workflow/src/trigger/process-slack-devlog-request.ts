import { task, logger } from "@trigger.dev/sdk";
import { writeDevlogEntry, type WriteDevlogEntryPayload } from "./write-devlog-entry";
import { publishDevlogEntry } from "./publish-devlog-entry";

export type ProcessSlackDevlogRequestPayload = WriteDevlogEntryPayload;

/**
 * Send a response back to Slack via response_url
 */
async function sendSlackResponse(
  responseUrl: string,
  message: string,
  options?: {
    isError?: boolean;
    blocks?: unknown[];
  }
): Promise<void> {
  const body: Record<string, unknown> = {
    response_type: "ephemeral",
  };

  if (options?.blocks) {
    body.blocks = options.blocks;
  } else {
    body.text = message;
    if (options?.isError) {
      body.attachments = [{ color: "danger", text: message }];
    }
  }

  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Orchestrator task that:
 * 1. Writes devlog content using Claude
 * 2. Publishes the devlog to GitHub
 *
 * This is the main entry point triggered by Slack slash commands.
 */
export const processSlackDevlogRequest = task({
  id: "process-slack-devlog-request",
  retry: {
    maxAttempts: 1, // Don't retry the orchestrator, let subtasks handle their own retries
  },
  run: async (payload: ProcessSlackDevlogRequestPayload) => {
    logger.info("Starting Slack devlog workflow", {
      text: payload.text,
      userId: payload.userId,
    });

    const { responseUrl } = payload;

    try {
      // Step 1: Write devlog content
      const writeResult = await writeDevlogEntry.triggerAndWait(payload);

      if (!writeResult.ok) {
        logger.error("Failed to write devlog entry", {
          error: writeResult.error,
        });

        if (responseUrl) {
          await sendSlackResponse(responseUrl, `Failed to generate devlog content. Please try again.`, {
            isError: true,
          });
        }

        throw new Error(`Failed to write devlog entry: ${writeResult.error}`);
      }

      const { filename, markdown, title, slug, tags } = writeResult.output;

      logger.info("Devlog entry written", { filename, title });

      // Step 2: Publish to GitHub
      const publishResult = await publishDevlogEntry.triggerAndWait({
        filename,
        markdown,
        title,
      });

      if (!publishResult.ok) {
        logger.error("Failed to publish devlog entry", { error: publishResult.error });

        if (responseUrl) {
          await sendSlackResponse(
            responseUrl,
            `Generated devlog "${title}" but failed to publish to GitHub. Please try again.`,
            { isError: true }
          );
        }

        throw new Error(`Failed to publish devlog entry: ${publishResult.error}`);
      }

      const { commitSha, commitUrl, fileUrl } = publishResult.output;

      logger.info("Devlog published successfully", { commitSha, commitUrl });

      // Send success notification to Slack
      if (responseUrl) {
        const devlogUrl = `https://caiokf.com/devlog#${slug}`;
        await sendSlackResponse(responseUrl, "", {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Devlog published!*\n\n*${title}*\nTags: ${tags.join(", ")}`,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "View on Site" },
                  url: devlogUrl,
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "View on GitHub" },
                  url: fileUrl,
                },
              ],
            },
          ],
        });
      }

      return {
        success: true,
        title,
        filename,
        commitSha,
        commitUrl,
        fileUrl,
        message: `Created devlog entry: "${title}"`,
      };
    } catch (error) {
      // Send error notification if we haven't already
      if (responseUrl && error instanceof Error && !error.message.includes("Failed to")) {
        await sendSlackResponse(responseUrl, `Unexpected error: ${error.message}`, { isError: true });
      }
      throw error;
    }
  },
});
