import handler from '@tanstack/react-start/server-entry'
import { env } from 'cloudflare:workers'
import { withDb } from 'db'

export default {
  async fetch(...args: Parameters<typeof handler.fetch>) {
    return withDb(env.HYPERDRIVE.connectionString, () => handler.fetch(...args))
  },
}
