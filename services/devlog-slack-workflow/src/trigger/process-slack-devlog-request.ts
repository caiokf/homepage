import { task, logger } from "@trigger.dev/sdk";
import { writeDevlogEntry, type WriteDevlogEntryPayload } from "./write-devlog-entry";
import { commitDevlogEntry } from "./commit-devlog-entry";

export type ProcessSlackDevlogRequestPayload = WriteDevlogEntryPayload;

/**
 * Orchestrator task that:
 * 1. Creates devlog content using Claude
 * 2. Commits the devlog to GitHub
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

    // Step 1: Generate devlog content
    const writeResult = await writeDevlogEntry.triggerAndWait(payload);

    if (!writeResult.ok) {
      logger.error("Failed to write devlog entry", {
        error: writeResult.error,
      });
      throw new Error(`Failed to write devlog entry: ${writeResult.error}`);
    }

    const { filename, markdown, title } = writeResult.output;

    logger.info("Devlog entry written", { filename, title });

    // Step 2: Commit to GitHub
    const commitResult = await commitDevlogEntry.triggerAndWait({
      filename,
      markdown,
      title,
    });

    if (!commitResult.ok) {
      logger.error("Failed to commit devlog entry", { error: commitResult.error });
      throw new Error(`Failed to commit devlog entry: ${commitResult.error}`);
    }

    const { commitSha, commitUrl, fileUrl } = commitResult.output;

    logger.info("Devlog committed successfully", { commitSha, commitUrl });

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
