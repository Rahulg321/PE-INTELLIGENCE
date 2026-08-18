import '@repo/env/load'
import { $ } from 'bun'

type MigrateTarget = 'local' | 'remote'

function parseTarget(value: string | undefined): MigrateTarget {
  switch (value) {
    case 'local':
    case 'remote':
      return value
    default:
      console.error('Usage: bun scripts/migrate.ts <local|remote>')
      process.exit(1)
  }
}

function connectionString(target: MigrateTarget): string {
  switch (target) {
    case 'local': {
      const url = process.env.DATABASE_URL
      if (!url) throw new Error('DATABASE_URL is not set')
      return url
    }
    case 'remote': {
      const url = process.env.DATABASE_URL_REMOTE
      if (!url) {
        throw new Error(
          'DATABASE_URL_REMOTE is not set. For Cloudflare Builds, add it under Settings → Builds → Build variables and secrets — wrangler secret put is runtime-only and is not available during migrate.',
        )
      }
      return url
    }
    default: {
      const _exhaustive: never = target
      return _exhaustive
    }
  }
}

async function main() {
  const target = parseTarget(process.argv[2])
  process.env.DATABASE_URL = connectionString(target)
  await $`bunx drizzle-kit migrate`
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
