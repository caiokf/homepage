/**
 * Cloudflare Worker: Slack Webhook Handler for Devlog
 *
 * Handles:
 * 1. Slash commands (/devlog) - generates preview
 * 2. Interactive actions (buttons) - publish/edit/cancel
 * 3. Text input for feedback - regenerate with changes
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
    block_id?: string;
    value?: string;
  }>;
  state?: {
    values: Record<string, Record<string, { value: string }>>;
  };
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

type EditContext = {
  originalText: string;
  currentDevlog: GeneratedDevlog;
  feedbackHistory: string[];
};

// New button context format (smaller, uses runId to fetch full data)
type SlackButtonContext = {
  runId: string;
  originalText: string;
  feedbackHistory: string[];
};

type TriggerResponse = {
  id: string;
};

type TriggerRunResponse = {
  id: string;
  status: string;
  output?: {
    success: boolean;
    devlog: GeneratedDevlog;
  };
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

async function fetchRunDetails(
  runId: string,
  secretKey: string
): Promise<TriggerRunResponse> {
  const response = await fetch(`https://api.trigger.dev/api/v3/runs/${runId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch run: ${response.status} - ${error}`);
  }

  return response.json();
}

async function triggerRegeneratePreview(
  originalText: string,
  currentDevlog: GeneratedDevlog,
  feedback: string,
  feedbackHistory: string[],
  responseUrl: string,
  secretKey: string
): Promise<TriggerResponse> {
  const response = await fetch(
    "https://api.trigger.dev/api/v1/tasks/regenerate-devlog-preview/trigger",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payload: {
          originalText,
          currentDevlog,
          feedback,
          feedbackHistory,
          responseUrl,
        },
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

// ============================================================================
// Request Handlers
// ============================================================================

async function handleSlashCommand(body: string, env: Env): Promise<Response> {
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

async function handleInteraction(body: string, env: Env): Promise<Response> {
  const params = new URLSearchParams(body);
  const payloadStr = params.get("payload");

  if (!payloadStr) {
    return new Response("Missing payload", { status: 400 });
  }

  let payload: SlackInteractionPayload;
  try {
    payload = JSON.parse(payloadStr);
  } catch (error) {
    console.error("Failed to parse interaction payload:", error);
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const responseUrl = payload.response_url;

  // Handle button clicks
  if (payload.type === "block_actions" && payload.actions) {
    const action = payload.actions[0];

    // Publish button
    if (action.action_id === "publish_devlog" && action.value) {
      const buttonContext: SlackButtonContext = JSON.parse(action.value);

      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: "Publishing your devlog entry...",
        });
      }

      try {
        // Fetch full devlog from run output
        const runDetails = await fetchRunDetails(buttonContext.runId, env.TRIGGER_SECRET_KEY);
        if (!runDetails.output?.devlog) {
          throw new Error("Could not retrieve devlog from run output");
        }
        const devlog = runDetails.output.devlog;

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

    // Edit button - show feedback input
    if (action.action_id === "edit_devlog" && action.value) {
      const buttonContext: SlackButtonContext = JSON.parse(action.value);

      // Fetch full devlog from run output
      let devlog: GeneratedDevlog;
      try {
        const runDetails = await fetchRunDetails(buttonContext.runId, env.TRIGGER_SECRET_KEY);
        if (!runDetails.output?.devlog) {
          throw new Error("Could not retrieve devlog from run output");
        }
        devlog = runDetails.output.devlog;
      } catch (error) {
        console.error("Failed to fetch devlog:", error);
        if (responseUrl) {
          await sendSlackMessage(responseUrl, {
            text: `Failed to load devlog: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
        return new Response("", { status: 200 });
      }

      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          blocks: [
            {
              type: "header",
              text: { type: "plain_text", text: "Edit Devlog" },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  `*Current Preview:*\n` +
                  `*Title:* ${devlog.title}\n` +
                  `*Date:* ${devlog.date}\n` +
                  `*Tags:* ${devlog.tags.join(", ")}\n\n` +
                  `${devlog.content.substring(0, 1500)}${devlog.content.length > 1500 ? "..." : ""}`,
              },
            },
            {
              type: "divider",
            },
            {
              type: "input",
              block_id: "feedback_block",
              dispatch_action: false,
              label: {
                type: "plain_text",
                text: "What would you like to change?",
              },
              element: {
                type: "plain_text_input",
                action_id: "feedback_input",
                placeholder: {
                  type: "plain_text",
                  text: 'e.g., "make the title shorter", "add more detail about X", "change the tone to be more casual"',
                },
                multiline: true,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "Regenerate" },
                  style: "primary",
                  action_id: "regenerate_devlog",
                  value: JSON.stringify(buttonContext),
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "Publish As-Is" },
                  action_id: "publish_devlog",
                  value: JSON.stringify(buttonContext),
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "Cancel" },
                  style: "danger",
                  action_id: "cancel_devlog",
                },
              ],
            },
          ],
        });
      }

      return new Response("", { status: 200 });
    }

    // Regenerate button - get feedback and regenerate
    if (action.action_id === "regenerate_devlog" && action.value) {
      const buttonContext: SlackButtonContext = JSON.parse(action.value);

      // Get feedback from the input field
      const feedback =
        payload.state?.values?.feedback_block?.feedback_input?.value || "";

      if (!feedback.trim()) {
        if (responseUrl) {
          await sendSlackMessage(responseUrl, {
            text: "Please provide feedback on what you'd like to change.",
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "Please provide feedback on what you'd like to change, then click Regenerate.",
                },
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: { type: "plain_text", text: "Try Again" },
                    action_id: "edit_devlog",
                    value: JSON.stringify(buttonContext),
                  },
                  {
                    type: "button",
                    text: { type: "plain_text", text: "Cancel" },
                    style: "danger",
                    action_id: "cancel_devlog",
                  },
                ],
              },
            ],
          });
        }
        return new Response("", { status: 200 });
      }

      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: `Regenerating with your feedback: "${feedback}"...`,
        });
      }

      try {
        // Fetch full devlog from run output
        const runDetails = await fetchRunDetails(buttonContext.runId, env.TRIGGER_SECRET_KEY);
        if (!runDetails.output?.devlog) {
          throw new Error("Could not retrieve devlog from run output");
        }
        const currentDevlog = runDetails.output.devlog;

        await triggerRegeneratePreview(
          buttonContext.originalText,
          currentDevlog,
          feedback,
          buttonContext.feedbackHistory,
          responseUrl || "",
          env.TRIGGER_SECRET_KEY
        );
      } catch (error) {
        console.error("Failed to regenerate:", error);
        if (responseUrl) {
          await sendSlackMessage(responseUrl, {
            text: `Failed to regenerate: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      }

      return new Response("", { status: 200 });
    }

    // Cancel button
    if (action.action_id === "cancel_devlog") {
      if (responseUrl) {
        await sendSlackMessage(responseUrl, {
          text: "Devlog entry cancelled.",
        });
      }
      return new Response("", { status: 200 });
    }
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

    const isValid = await verifySlackSignature(request, body, env.SLACK_SIGNING_SECRET);
    if (!isValid) {
      console.error("Invalid Slack signature");
      return new Response("Invalid signature", { status: 401 });
    }

    if (body.includes("payload=")) {
      return handleInteraction(body, env);
    } else if (body.includes("command=")) {
      return handleSlashCommand(body, env);
    }

    return new Response("Unknown request type", { status: 400 });
  },
};
