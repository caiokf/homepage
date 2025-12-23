import { task } from "@trigger.dev/sdk";

export type CreateDevlogPayload = {
  text: string;
  userId: string;
  channelId: string;
};

export const createDevlog = task({
  id: "create-devlog",
  run: async (payload: CreateDevlogPayload) => {
    console.log(`Creating devlog from Slack message: ${payload.text}`);

    // TODO: Implement the following steps:
    // 1. Call Claude API with repo context and writing-articles skill
    // 2. Generate markdown with proper frontmatter (title, date, tags)
    // 3. Create file in apps/web/src/domain/devlog/content/
    // 4. Git add, commit, push to main

    return {
      success: true,
      message: `Received: ${payload.text}`,
      timestamp: new Date().toISOString(),
    };
  },
});
