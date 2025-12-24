import { task, logger } from "@trigger.dev/sdk";
import { createDevlog, type CreateDevlogPayload } from "./create-devlog";
import { commitDevlog } from "./commit-devlog";

export type SlackDevlogPayload = CreateDevlogPayload;

/**
 * Orchestrator task that:
 * 1. Creates devlog content using Claude
 * 2. Commits the devlog to GitHub
 *
 * This is the main entry point triggered by Slack slash commands.
 */
export const slackDevlog = task({
  id: "slack-devlog",
  retry: {
    maxAttempts: 1, // Don't retry the orchestrator, let subtasks handle their own retries
  },
  run: async (payload: SlackDevlogPayload) => {
    logger.info("Starting Slack devlog workflow", {
      text: payload.text,
      userId: payload.userId,
    });

    // Step 1: Generate devlog content
    const createResult = await createDevlog.triggerAndWait(payload);

    if (!createResult.ok) {
      logger.error("Failed to create devlog content", {
        error: createResult.error,
      });
      throw new Error(`Failed to create devlog: ${createResult.error}`);
    }

    const { filename, markdown, title } = createResult.output;

    logger.info("Devlog content created", { filename, title });

    // Step 2: Commit to GitHub
    const commitResult = await commitDevlog.triggerAndWait({
      filename,
      markdown,
      title,
    });

    if (!commitResult.ok) {
      logger.error("Failed to commit devlog", { error: commitResult.error });
      throw new Error(`Failed to commit devlog: ${commitResult.error}`);
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
