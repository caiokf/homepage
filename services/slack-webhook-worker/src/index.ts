/**
 * Cloudflare Worker: Slack Webhook Handler for Devlog
 *
 * Handles:
 * 1. Slash commands (/devlog) - generates preview
 * 2. Interactive actions (buttons) - publish/cancel
 * 3. Modal submissions - edit and publish
 */

type Env = {
  SLACK_SIGNING_SECRET: string;
  TRIGGER_SECRET_KEY: string;
};

type SlackSlashCommandPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
};

type SlackInteractionPayload = {
  type: "block_actions" | "view_submission";
  user: { id: string; username: string };
  trigger_id: string;
  response_url?: string;
  actions?: Array<{
    action_id: string;
    value?: string;
  }>;
  view?: {
    callback_id: string;
    private_metadata: string;
    state: {
      values: Record<string, Record<string, { value: string }>>;
    };
  };
};

type GeneratedDevlog = {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  date: string;
};

type TriggerResponse = {
  id: string;
};

// ============================================================================
// Slack Signature Verification
// ============================================================================

async function verifySlackSignature(
  request: Request,
  body: string,
  signingSecret: string
): Promise<boolean> {
  const timestamp = request.headers.get("x-slack-request-timestamp");
  const signature = request.headers.get("x-slack-signature");

  if (!timestamp || !signature) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 60 * 5) {
    return false;
  }

  const sigBasestring = `v0:${timestamp}:${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(sigBasestring));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const expectedSignature = `v0=${hashHex}`;

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }

  return result === 0;
}

// ============================================================================
// Trigger.dev API
// ============================================================================

async function triggerGeneratePreview(
  text: string,
  userId: string,
  userName: string,
  responseUrl: string,
  secretKey: string
): Promise<TriggerResponse> {
  const response = await fetch(
    "https://api.trigger.dev/api/v1/tasks/generate-devlog-preview/trigger",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payload: { text, userId, userName, responseUrl },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Trigger.dev API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function triggerPublishDevlog(
  devlog: GeneratedDevlog,
  responseUrl: string,
  secretKey: string
): Promise<TriggerResponse> {
  const response = await fetch(
    "https://api.trigger.dev/api/v1/tasks/publish-devlog-from-preview/trigger",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payload: { ...devlog, responseUrl },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Trigger.dev API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ============================================================================
// Slack API Helpers
// ============================================================================

async function sendSlackMessage(
  responseUrl: string,
  payload: Record<string, unknown>
): Promise<void> {
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "ephemeral",
      replace_original: true,
      ...payload,
    }),
  });
}

async function openModal(
  triggerId: string,
  view: Record<string, unknown>,
  token: string
): Promise<void> {
  await fetch("https://slack.com/api/views.open", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      trigger_id: triggerId,
      view,
    }),
  });
}

function buildEditModal(devlog: GeneratedDevlog, responseUrl: string): Record<string, unknown> {
  return {
    type: "modal",
    callback_id: "edit_devlog",
    private_metadata: JSON.stringify({ responseUrl }),
    title: { type: "plain_text", text: "Edit Devlog Entry" },
    submit: { type: "plain_text", text: "Publish" },
    close: { type: "plain_text", text: "Cancel" },
    blocks: [
      {
        type: "input",
        block_id: "title_block",
        label: { type: "plain_text", text: "Title" },
        element: {
          type: "plain_text_input",
          action_id: "title",
          initial_value: devlog.title,
        },
      },
      {
        type: "input",
        block_id: "date_block",
        label: { type: "plain_text", text: "Date (YYYY-MM-DD)" },
        element: {
          type: "plain_text_input",
          action_id: "date",
          initial_value: devlog.date,
        },
      },
      {
        type: "input",
        block_id: "tags_block",
        label: { type: "plain_text", text: "Tags (comma-separated)" },
        element: {
          type: "plain_text_input",
          action_id: "tags",
          initial_value: devlog.tags.join(", "),
        },
      },
      {
        type: "input",
        block_id: "content_block",
        label: { type: "plain_text", text: "Content" },
        element: {
          type: "plain_text_input",
          action_id: "content",
          multiline: true,
          initial_value: devlog.content,
        },
      },
    ],
  };
}

// ============================================================================
// Request Handlers
// ============================================================================

async function handleSlashCommand(
  body: string,
  env: Env
): Promise<Response> {
  const params = new URLSearchParams(body);
  const payload: SlackSlashCommandPayload = {
    token: params.get("token") || "",
    team_id: params.get("team_id") || "",
    team_domain: params.get("team_domain") || "",
    channel_id: params.get("channel_id") || "",
    channel_name: params.get("channel_name") || "",
    user_id: params.get("user_id") || "",
    user_name: params.get("user_name") || "",
    command: params.get("command") || "",
    text: params.get("text") || "",
    response_url: params.get("response_url") || "",
    trigger_id: params.get("trigger_id") || "",
  };

  if (!payload.text.trim()) {
    return new Response(
      JSON.stringify({
        response_type: "ephemeral",
        text: "Please provide content for your devlog entry.\nExample: `/devlog Today I learned about Cloudflare Workers`",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Trigger the preview generation task
  try {
    await triggerGeneratePreview(
      payload.text,
      payload.user_id,
      payload.user_name,
      payload.response_url,
      env.TRIGGER_SECRET_KEY
    );
  } catch (error) {
    console.error("Failed to trigger preview:", error);
    return new Response(
      JSON.stringify({
        response_type: "ephemeral",
        text: `Failed to generate preview: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      response_type: "ephemeral",
      text: "Generating your devlog preview... This may take a moment.",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function handleInteraction(
  body: string,
  env: Env
): Promise<Response> {
  const params = new URLSearchParams(body);
  const payloadStr = params.get("payload");

  if (!payloadStr) {
    return new Response("Missing payload", { status: 400 });
  }

  const payload: SlackInteractionPayload = JSON.parse(payloadStr);

  // Handle button clicks
  if (payload.type === "block_actions" && payload.actions) {
    const action = payload.actions[0];
    const responseUrl = payload.response_url;

    if (action.action_id === "publish_devlog" && action.value) {
      const devlog: GeneratedDevlog = JSON.parse(action.value);

      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: "Publishing your devlog entry...",
        });
      }

      try {
        await triggerPublishDevlog(devlog, responseUrl || "", env.TRIGGER_SECRET_KEY);
      } catch (error) {
        console.error("Failed to publish:", error);
        if (responseUrl) {
          await sendSlackMessage(responseUrl, {
            text: `Failed to publish: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      }

      return new Response("", { status: 200 });
    }

    if (action.action_id === "edit_devlog" && action.value) {
      const devlog: GeneratedDevlog = JSON.parse(action.value);

      // We need a bot token to open modals - for now, show inline editing instructions
      // TODO: Add SLACK_BOT_TOKEN to enable modal editing
      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: "To edit, use the command again with your changes:\n`/devlog [your updated content]`\n\nOr publish the current version:",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Current entry:*\n" +
                  `*Title:* ${devlog.title}\n` +
                  `*Date:* ${devlog.date}\n` +
                  `*Tags:* ${devlog.tags.join(", ")}\n\n` +
                  `${devlog.content.substring(0, 500)}${devlog.content.length > 500 ? "..." : ""}`,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "Publish" },
                  style: "primary",
                  action_id: "publish_devlog",
                  value: JSON.stringify(devlog),
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "Cancel" },
                  action_id: "cancel_devlog",
                },
              ],
            },
          ],
        });
      }

      return new Response("", { status: 200 });
    }

    if (action.action_id === "cancel_devlog") {
      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: "Devlog entry cancelled.",
        });
      }
      return new Response("", { status: 200 });
    }
  }

  // Handle modal submissions (for future use with bot token)
  if (payload.type === "view_submission" && payload.view) {
    const metadata = JSON.parse(payload.view.private_metadata);
    const values = payload.view.state.values;

    const devlog: GeneratedDevlog = {
      title: values.title_block.title.value,
      date: values.date_block.date.value,
      tags: values.tags_block.tags.value.split(",").map((t: string) => t.trim()),
      content: values.content_block.content.value,
      slug: values.title_block.title.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    };

    try {
      await triggerPublishDevlog(devlog, metadata.responseUrl, env.TRIGGER_SECRET_KEY);
    } catch (error) {
      console.error("Failed to publish from modal:", error);
    }

    return new Response("", { status: 200 });
  }

  return new Response("", { status: 200 });
}

// ============================================================================
// Main Handler
// ============================================================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.text();

    // Verify Slack signature
    const isValid = await verifySlackSignature(request, body, env.SLACK_SIGNING_SECRET);
    if (!isValid) {
      console.error("Invalid Slack signature");
      return new Response("Invalid signature", { status: 401 });
    }

    // Determine request type based on content
    const contentType = request.headers.get("content-type") || "";

    if (body.includes("payload=")) {
      // Interactive component (button click, modal submission)
      return handleInteraction(body, env);
    } else if (body.includes("command=")) {
      // Slash command
      return handleSlashCommand(body, env);
    }

    return new Response("Unknown request type", { status: 400 });
  },
};
