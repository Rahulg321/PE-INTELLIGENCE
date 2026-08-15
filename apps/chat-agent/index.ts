import { bot } from './bot'
import { env } from './env'

const server = Bun.serve({
  port: env.port,
  async fetch(request) {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname === '/health') {
      return Response.json({ ok: true })
    }

    if (
      request.method === 'POST' &&
      url.pathname === '/api/webhooks/slack'
    ) {
      return bot.webhooks.slack(request)
    }

    return new Response('Not found', { status: 404 })
  },
})

async function shutdown() {
  server.stop()
  await bot.shutdown()
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

console.log(`Chat agent listening on http://localhost:${server.port}`)