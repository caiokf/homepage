# Slack Webhook Worker

Cloudflare Worker that receives Slack slash commands and triggers the devlog workflow via Trigger.dev.

## Setup

### 1. Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" > "From scratch"
3. Name it "Devlog Bot" and select your workspace
4. Under "Features" > "Slash Commands", click "Create New Command":
   - Command: `/devlog`
   - Request URL: `https://devlog-slack-webhook.<your-subdomain>.workers.dev`
   - Description: "Create a devlog entry"
   - Usage Hint: "Your message about what you learned or built today"
5. Under "Basic Information", copy the "Signing Secret"
6. Install the app to your workspace

### 2. Configure Cloudflare Worker Secrets

```bash
# Navigate to the worker directory
cd services/slack-webhook-worker

# Set the Slack signing secret
wrangler secret put SLACK_SIGNING_SECRET
# Paste your signing secret from Slack app settings

# Set the Trigger.dev secret key (use PROD key for production)
wrangler secret put TRIGGER_SECRET_KEY
# Paste your Trigger.dev secret key (tr_prod_...)
```

### 3. Deploy the Worker

```bash
# From repo root
pnpm slack-webhook:deploy

# Or from this directory
pnpm deploy
```

### 4. Update Slack App URL

After deploying, update the Request URL in your Slack app's slash command settings to match your worker URL.

## Local Development

```bash
# Start the worker locally
pnpm slack-webhook:dev

# Use ngrok to expose locally for testing
ngrok http 8787
```

Then update your Slack app's slash command URL to the ngrok URL.

## Usage

In Slack, type:
```
/devlog Today I set up a Cloudflare Worker to handle Slack webhooks.
It verifies signatures and triggers Trigger.dev workflows.
```

The bot will:
1. Acknowledge immediately
2. Generate a polished devlog entry using Claude
3. Publish to GitHub
4. Send a follow-up message with links to view the entry

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SLACK_SIGNING_SECRET` | From Slack app Basic Information page |
| `TRIGGER_SECRET_KEY` | From Trigger.dev dashboard (use prod key) |
