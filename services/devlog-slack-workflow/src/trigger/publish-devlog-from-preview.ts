import { task, logger } from "@trigger.dev/sdk";
import { Octokit } from "@octokit/rest";
import { getWeekKey } from "@caiokf/shared";

export type PublishDevlogFromPreviewPayload = {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  date: string;
  responseUrl: string;
};

type IndexEntry = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  filename: string;
  weekKey: string;
};

const REPO_OWNER = "caiokf";
const REPO_NAME = "homepage";
const BRANCH = "main";
const DEVLOG_PATH = "apps/web/public/devlog";

/**
 * Send success message to Slack with links
 */
async function sendSuccessToSlack(
  responseUrl: string,
  title: string,
  slug: string,
  tags: string[],
  fileUrl: string
): Promise<void> {
  const devlogUrl = `https://caiokf.com/devlog#${slug}`;

  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "ephemeral",
      replace_original: true,
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
    }),
  });
}

/**
 * Send error message to Slack
 */
async function sendErrorToSlack(responseUrl: string, message: string): Promise<void> {
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

export const publishDevlogFromPreview = task({
  id: "publish-devlog-from-preview",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: PublishDevlogFromPreviewPayload) => {
    const { title, slug, tags, content, date, responseUrl } = payload;

    logger.info("Publishing devlog from preview", { title, slug });

    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      // Build markdown with frontmatter
      const filename = `${date}-${slug}.md`;
      const markdown = `---
title: "${title}"
date: ${date}
tags: [${tags.join(", ")}]
slug: ${slug}
---

${content}
`;

      // Create new index entry
      const newEntry: IndexEntry = {
        title,
        date,
        tags,
        slug,
        filename,
        weekKey: getWeekKey(new Date(date)),
      };

      const markdownPath = `${DEVLOG_PATH}/${filename}`;
      const indexPath = `${DEVLOG_PATH}/index.json`;
      const commitMessage = `devlog: ${slug}`;

      // Get latest commit SHA
      const { data: ref } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${BRANCH}`,
      });
      const latestCommitSha = ref.object.sha;

      // Get tree SHA
      const { data: commit } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha,
      });
      const treeSha = commit.tree.sha;

      // Fetch current index
      let currentIndex: IndexEntry[] = [];
      try {
        const { data: indexFile } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: indexPath,
          ref: BRANCH,
        });
        if ("content" in indexFile) {
          const indexContent = Buffer.from(indexFile.content, "base64").toString("utf-8");
          currentIndex = JSON.parse(indexContent);
        }
      } catch {
        logger.info("No existing index.json, creating new one");
      }

      // Update index
      currentIndex = currentIndex.filter((e) => e.slug !== newEntry.slug);
      currentIndex.push(newEntry);
      currentIndex.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const updatedIndexJson = JSON.stringify(currentIndex, null, 2);

      // Create blobs
      const [markdownBlob, indexBlob] = await Promise.all([
        octokit.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content: Buffer.from(markdown).toString("base64"),
          encoding: "base64",
        }),
        octokit.git.createBlob({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          content: Buffer.from(updatedIndexJson).toString("base64"),
          encoding: "base64",
        }),
      ]);

      // Create tree
      const { data: newTree } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: treeSha,
        tree: [
          {
            path: markdownPath,
            mode: "100644",
            type: "blob",
            sha: markdownBlob.data.sha,
          },
          {
            path: indexPath,
            mode: "100644",
            type: "blob",
            sha: indexBlob.data.sha,
          },
        ],
      });

      // Create commit
      const { data: newCommit } = await octokit.git.createCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        message: commitMessage,
        tree: newTree.sha,
        parents: [latestCommitSha],
        author: {
          name: "Devlog Bot",
          email: "devlog@caiokf.com",
          date: new Date().toISOString(),
        },
      });

      // Update branch
      await octokit.git.updateRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${BRANCH}`,
        sha: newCommit.sha,
      });

      const fileUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${markdownPath}`;

      logger.info("Devlog published", { commitSha: newCommit.sha, fileUrl });

      // Send success to Slack
      await sendSuccessToSlack(responseUrl, title, slug, tags, fileUrl);

      return {
        success: true,
        commitSha: newCommit.sha,
        fileUrl,
        filename,
      };
    } catch (error) {
      logger.error("Failed to publish devlog", { error });

      await sendErrorToSlack(
        responseUrl,
        `Failed to publish devlog: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      throw error;
    }
  },
});
