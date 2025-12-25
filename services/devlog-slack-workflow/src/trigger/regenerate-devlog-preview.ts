import { task, logger } from "@trigger.dev/sdk";
import Anthropic from "@anthropic-ai/sdk";
import {
  type GeneratedDevlog,
  SYSTEM_PROMPT,
  parseDevlogResponse,
  sendPreviewToSlack,
  sendErrorToSlack,
} from "./generate-devlog-preview";

export type RegenerateDevlogPreviewPayload = {
  originalText: string;
  currentDevlog: GeneratedDevlog;
  feedback: string;
  feedbackHistory: string[];
  responseUrl: string;
};

export const regenerateDevlogPreview = task({
  id: "regenerate-devlog-preview",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: RegenerateDevlogPreviewPayload, { ctx }) => {
    const { originalText, currentDevlog, feedback, feedbackHistory, responseUrl } = payload;
    const runId = ctx.run.id;

    logger.info("Regenerating devlog with feedback", {
      feedback,
      iterationCount: feedbackHistory.length + 1,
    });

    try {
      const anthropic = new Anthropic();

      // Build conversation history for context
      const messages: Anthropic.MessageParam[] = [
        {
          role: "user",
          content: `Create a dev log entry from this message:\n\n"${originalText}"`,
        },
        {
          role: "assistant",
          content: JSON.stringify(currentDevlog, null, 2),
        },
      ];

      // Add previous feedback iterations if any
      for (let i = 0; i < feedbackHistory.length; i++) {
        messages.push({
          role: "user",
          content: `Please revise the entry based on this feedback: "${feedbackHistory[i]}"`,
        });
        // We don't have the intermediate responses, so just acknowledge
        if (i < feedbackHistory.length - 1) {
          messages.push({
            role: "assistant",
            content: "(revised version was provided)",
          });
        }
      }

      // Add current feedback
      messages.push({
        role: "user",
        content: `Please revise the dev log entry based on this feedback: "${feedback}"\n\nProvide the complete revised entry in the same JSON format.`,
      });

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages,
        system: SYSTEM_PROMPT,
      });

      const responseText = message.content[0].type === "text" ? message.content[0].text : "";

      logger.info("Claude regenerate response", { response: responseText });

      const devlog = parseDevlogResponse(responseText);

      logger.info("Regenerated devlog preview", {
        title: devlog.title,
        tags: devlog.tags,
        iteration: feedbackHistory.length + 1,
      });

      // Send updated preview to Slack with full feedback history
      const updatedHistory = [...feedbackHistory, feedback];
      await sendPreviewToSlack(responseUrl, devlog, originalText, updatedHistory, runId);

      return {
        success: true,
        devlog,
        iteration: updatedHistory.length,
      };
    } catch (error) {
      logger.error("Failed to regenerate preview", { error });

      await sendErrorToSlack(
        responseUrl,
        `Failed to regenerate devlog: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      throw error;
    }
  },
});
