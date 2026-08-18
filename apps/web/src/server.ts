import handler from '@tanstack/react-start/server-entry'
import { env } from 'cloudflare:workers'
import { createDb } from 'db'

export default {
  async fetch(...args: Parameters<typeof handler.fetch>) {
    createDb(env.HYPERDRIVE.connectionString)
    return handler.fetch(...args)
  },
}
