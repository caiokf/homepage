/**
 * Cloudflare Worker: Slack Webhook Handler for Devlog
 *
 * Receives Slack slash commands and triggers the Trigger.dev workflow
 * to create and publish devlog entries.
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

type TriggerResponse = {
  id: string;
  publicAccessToken?: string;
};

/**
 * Verify the Slack request signature using HMAC-SHA256
 */
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

  // Check timestamp is within 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 60 * 5) {
    return false;
  }

  // Create the signature base string
  const sigBasestring = `v0:${timestamp}:${body}`;

  // Create HMAC-SHA256 signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(sigBasestring));

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const expectedSignature = `v0=${hashHex}`;

  // Constant-time comparison
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Parse URL-encoded form data from Slack
 */
function parseSlackPayload(body: string): SlackSlashCommandPayload {
  const params = new URLSearchParams(body);
  return {
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
}

/**
 * Trigger the devlog workflow via Trigger.dev REST API
 */
async function triggerDevlogWorkflow(
  payload: SlackSlashCommandPayload,
  secretKey: string
): Promise<TriggerResponse> {
  const response = await fetch("https://api.trigger.dev/api/v1/tasks/process-slack-devlog-request/trigger", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      payload: {
        text: payload.text,
        userId: payload.user_id,
        userName: payload.user_name,
        channelId: payload.channel_id,
        responseUrl: payload.response_url,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Trigger.dev API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Send a response back to Slack via response_url
 */
async function sendSlackResponse(
  responseUrl: string,
  message: string,
  isError = false
): Promise<void> {
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "ephemeral",
      text: message,
      ...(isError && {
        attachments: [
          {
            color: "danger",
            text: message,
          },
        ],
      }),
    }),
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Only accept POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Get the raw body for signature verification
    const body = await request.text();

    // Verify Slack signature
    const isValid = await verifySlackSignature(request, body, env.SLACK_SIGNING_SECRET);
    if (!isValid) {
      console.error("Invalid Slack signature");
      return new Response("Invalid signature", { status: 401 });
    }

    // Parse the Slack payload
    const payload = parseSlackPayload(body);

    // Validate we have text content
    if (!payload.text.trim()) {
      return new Response(
        JSON.stringify({
          response_type: "ephemeral",
          text: "Please provide some content for your devlog entry. Example: `/devlog Today I learned about Cloudflare Workers and how they can handle webhooks efficiently.`",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Immediately acknowledge the slash command (Slack requires response within 3 seconds)
    // We'll send the actual result via response_url later
    const immediateResponse = new Response(
      JSON.stringify({
        response_type: "ephemeral",
        text: `Processing your devlog entry... This may take a moment.`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Trigger the workflow asynchronously using waitUntil
    // This continues after the response is sent
    const ctx = { waitUntil: (_promise: Promise<unknown>) => {} };

    // In Cloudflare Workers, we use the context's waitUntil
    // For now, we trigger and respond - the workflow will handle its own completion
    try {
      const result = await triggerDevlogWorkflow(payload, env.TRIGGER_SECRET_KEY);
      console.log("Workflow triggered:", result.id);

      // Send follow-up message with run ID
      if (payload.response_url) {
        await sendSlackResponse(
          payload.response_url,
          `Devlog workflow started (run: \`${result.id}\`). You'll see the published entry on caiokf.com/devlog shortly.`
        );
      }
    } catch (error) {
      console.error("Failed to trigger workflow:", error);

      if (payload.response_url) {
        await sendSlackResponse(
          payload.response_url,
          `Failed to start devlog workflow: ${error instanceof Error ? error.message : "Unknown error"}`,
          true
        );
      }
    }

    return immediateResponse;
  },
};
