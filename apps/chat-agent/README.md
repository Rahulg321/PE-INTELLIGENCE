# Chat SDK Slack demo

A small Bun webhook server demonstrating Chat SDK with Slack. It responds to
mentions, direct messages, and subscribed thread messages with `help` and
`status` commands.

## Configure Slack

1. Create a Slack app and install it to your workspace.
2. Add bot scopes: `app_mentions:read`, `channels:history`, `chat:write`, and
   `im:history`.
3. Subscribe to bot events: `app_mention`, `message.channels`, and `message.im`.
4. Set the Event Subscriptions request URL to:
   `https://<public-host>/api/webhooks/slack`.
5. Add these values to the monorepo root `.env.local`:

```text
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
PORT=3001
```

Use a tunnel such as Cloudflare Tunnel for local Slack webhooks.

## Run

```bash
bun install
cd apps/chat-agent
bun run dev
```

Health check: `GET http://localhost:3001/health`.

```bash
bun run test
bun run check-types
```

The memory state adapter is intentionally development-only. Use Redis or
PostgreSQL state before running multiple instances or deploying to production.
