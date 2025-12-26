import { task, logger } from "@trigger.dev/sdk";
import { Octokit } from "@octokit/rest";

export type PublishDevlogEntryPayload = {
  filename: string;
  markdown: string;
  title: string;
  commitMessage?: string;
};

const REPO_OWNER = "caiokf";
const REPO_NAME = "homepage";
const BRANCH = "main";
const DEVLOG_PATH = "apps/web/public/devlog";

export const publishDevlogEntry = task({
  id: "publish-devlog-entry",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: PublishDevlogEntryPayload) => {
    const { filename, markdown, title, commitMessage } = payload;

    logger.info("Publishing devlog entry", { filename, title });

    // Initialize Octokit with GitHub token
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const markdownPath = `${DEVLOG_PATH}/${filename}`;
    const message = commitMessage || `devlog: ${title}`;

    try {
      // Get the current commit SHA for the branch
      const { data: ref } = await octokit.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${BRANCH}`,
      });
      const latestCommitSha = ref.object.sha;

      logger.info("Got latest commit", { sha: latestCommitSha });

      // Get the tree SHA from the latest commit
      const { data: commit } = await octokit.git.getCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        commit_sha: latestCommitSha,
      });
      const treeSha = commit.tree.sha;

      // Create blob for markdown file
      const { data: markdownBlob } = await octokit.git.createBlob({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        content: Buffer.from(markdown).toString("base64"),
        encoding: "base64",
      });

      logger.info("Created blob", { markdown: markdownBlob.sha });

      // Create a new tree with the markdown file
      const { data: newTree } = await octokit.git.createTree({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        base_tree: treeSha,
        tree: [
          {
            path: markdownPath,
            mode: "100644",
            type: "blob",
            sha: markdownBlob.sha,
          },
        ],
      });

      logger.info("Created tree", { sha: newTree.sha });

      // Create a new commit
      const { data: newCommit } = await octokit.git.createCommit({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
        author: {
          name: "Devlog Bot",
          email: "devlog@caiokf.com",
          date: new Date().toISOString(),
        },
      });

      logger.info("Created commit", { sha: newCommit.sha });

      // Update the branch reference to point to the new commit
      await octokit.git.updateRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${BRANCH}`,
        sha: newCommit.sha,
      });

      logger.info("Updated branch reference", {
        branch: BRANCH,
        newSha: newCommit.sha,
      });

      return {
        success: true,
        commitSha: newCommit.sha,
        file: markdownPath,
        commitUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${newCommit.sha}`,
        fileUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${markdownPath}`,
      };
    } catch (error) {
      logger.error("Failed to publish devlog entry", { error });
      throw error;
    }
  },
});
