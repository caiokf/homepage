# Slack Webhook Worker

Cloudflare Worker that receives Slack slash commands and triggers the devlog workflow via Trigger.dev.

## Flow

```
/devlog your message here
        ↓
   Generates preview with Claude
        ↓
   Shows preview in Slack with buttons:
   [Publish] [Edit] [Cancel]
        ↓
   On Publish → commits to GitHub
   On Edit → shows current content, lets you retry
   On Cancel → dismisses
```

## Setup

### 1. Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" > "From scratch"
3. Name it "Devlog Bot" and select your workspace

### 2. Add Slash Command

1. Go to **Slash Commands** in the sidebar
2. Click "Create New Command":
   - Command: `/devlog`
   - Request URL: `https://devlog-slack-webhook.caiokf.workers.dev`
   - Description: "Create a devlog entry"
   - Usage Hint: "Your message about what you learned today"

### 3. Enable Interactivity

1. Go to **Interactivity & Shortcuts** in the sidebar
2. Toggle "Interactivity" **ON**
3. Set Request URL: `https://devlog-slack-webhook.caiokf.workers.dev`
4. Click "Save Changes"

### 4. Install to Workspace

1. Go to **Install App** in the sidebar
2. Click "Install to Workspace"
3. Authorize the app

### 5. Get Signing Secret

1. Go to **Basic Information** in the sidebar
2. Under "App Credentials", copy the **Signing Secret**

### 6. Configure Worker Secrets

```bash
cd services/slack-webhook-worker

# Set the Slack signing secret
npx wrangler secret put SLACK_SIGNING_SECRET
# Paste your signing secret

# Set the Trigger.dev secret key (use PROD key)
npx wrangler secret put TRIGGER_SECRET_KEY
# Paste your Trigger.dev secret key (tr_prod_...)
```

### 7. Deploy

```bash
# Deploy the worker
npx wrangler deploy

# Deploy Trigger.dev tasks (from repo root)
pnpm devlog:deploy
```

## Usage

In Slack:
```
/devlog Today I learned about interactive Slack apps with buttons and modals.
```

You'll see a preview with the generated title, content, tags, and date. Then you can:
- **Publish** - commits to GitHub and deploys to your site
- **Edit** - retry with different content
- **Cancel** - dismiss without publishing

## Local Development

```bash
# Start the worker locally
pnpm slack-webhook:dev

# Use ngrok to expose for testing
ngrok http 8787

# Update Slack app URLs to ngrok URL temporarily
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SLACK_SIGNING_SECRET` | From Slack app Basic Information |
| `TRIGGER_SECRET_KEY` | From Trigger.dev dashboard (prod key) |
