import { task, logger } from "@trigger.dev/sdk";
import { Octokit } from "@octokit/rest";
import fm from "front-matter";
import { getWeekKey } from "@caiokf/shared";

export type PublishDevlogEntryPayload = {
  filename: string;
  markdown: string;
  title: string;
  commitMessage?: string;
};

type Frontmatter = {
  title: string;
  date: string;
  tags: string[];
  slug: string;
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

    // Parse frontmatter from markdown
    const parsed = fm<Frontmatter>(markdown);
    const { slug, date, tags } = parsed.attributes;

    // Create new index entry
    const newEntry: IndexEntry = {
      title: parsed.attributes.title,
      date,
      tags,
      slug,
      filename,
      weekKey: getWeekKey(new Date(date)),
    };

    const markdownPath = `${DEVLOG_PATH}/${filename}`;
    const indexPath = `${DEVLOG_PATH}/index.json`;
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

      // Fetch current index.json
      let currentIndex: IndexEntry[] = [];
      try {
        const { data: indexFile } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: indexPath,
          ref: BRANCH,
        });
        if ("content" in indexFile) {
          const content = Buffer.from(indexFile.content, "base64").toString("utf-8");
          currentIndex = JSON.parse(content);
        }
      } catch (error) {
        // Index doesn't exist yet, start with empty array
        logger.info("No existing index.json, creating new one");
      }

      // Add new entry and sort by date (newest first)
      // Remove existing entry with same slug if present (for updates/republishing)
      currentIndex = currentIndex.filter((e) => e.slug !== newEntry.slug);
      currentIndex.push(newEntry);
      currentIndex.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const updatedIndexJson = JSON.stringify(currentIndex, null, 2);

      // Create blobs for both files
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

      logger.info("Created blobs", {
        markdown: markdownBlob.data.sha,
        index: indexBlob.data.sha,
      });

      // Create a new tree with both files
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
        files: {
          markdown: markdownPath,
          index: indexPath,
        },
        commitUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${newCommit.sha}`,
        fileUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/${BRANCH}/${markdownPath}`,
      };
    } catch (error) {
      logger.error("Failed to publish devlog entry", { error });
      throw error;
    }
  },
});
