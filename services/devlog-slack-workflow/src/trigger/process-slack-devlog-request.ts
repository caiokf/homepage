import { task, logger } from "@trigger.dev/sdk";
import { writeDevlogEntry, type WriteDevlogEntryPayload } from "./write-devlog-entry";
import { publishDevlogEntry } from "./publish-devlog-entry";

export type ProcessSlackDevlogRequestPayload = WriteDevlogEntryPayload;

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

    // Step 1: Write devlog content
    const writeResult = await writeDevlogEntry.triggerAndWait(payload);

    if (!writeResult.ok) {
      logger.error("Failed to write devlog entry", {
        error: writeResult.error,
      });
      throw new Error(`Failed to write devlog entry: ${writeResult.error}`);
    }

    const { filename, markdown, title } = writeResult.output;

    logger.info("Devlog entry written", { filename, title });

    // Step 2: Publish to GitHub
    const publishResult = await publishDevlogEntry.triggerAndWait({
      filename,
      markdown,
      title,
    });

    if (!publishResult.ok) {
      logger.error("Failed to publish devlog entry", { error: publishResult.error });
      throw new Error(`Failed to publish devlog entry: ${publishResult.error}`);
    }

    const { commitSha, commitUrl, fileUrl } = publishResult.output;

    logger.info("Devlog published successfully", { commitSha, commitUrl });

    return {
      success: true,
      title,
      filename,
      commitSha,
      commitUrl,
      fileUrl,
      message: `Created devlog entry: "${title}"`,
    };
  },
});
