import { createServerFn } from '@tanstack/react-start'
import { demoRequestSchema } from './schema'

/**
 * Demo-request submission.
 *
 * If `DEMO_WEBHOOK_URL` is configured (in apps/frontend/.env for local dev, or a
 * wrangler var for Cloudflare), the payload is POSTed there so it can be wired
 * to email, a CRM, or a queue. Without it, the request is validated and accepted
 * (recorded via server logs) so the form works end-to-end out of the box.
 */
export const requestDemo = createServerFn({ method: 'POST' })
  .validator(demoRequestSchema)
  .handler(async ({ data }) => {
    const webhook = process.env.DEMO_WEBHOOK_URL

    if (webhook) {
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...data,
            submittedAt: new Date().toISOString(),
          }),
        })
        if (!response.ok) {
          console.error(
            `[requestDemo] webhook returned ${response.status}: ${await response.text().catch(() => '')}`,
          )
        }
      } catch (error) {
        // Delivery is best-effort; never fail the user's submission.
        console.error('[requestDemo] webhook delivery failed:', error)
      }
    } else {
      console.log(
        '[requestDemo] received demo request (no webhook configured):',
        data.email,
      )
    }

    return { ok: true as const }
  })
