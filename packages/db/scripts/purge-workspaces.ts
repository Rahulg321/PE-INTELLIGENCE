import { db, workspaces } from '../src/index'
import { and, isNotNull, lt } from 'drizzle-orm'

const DEFAULT_RETENTION_DAYS = 30

function parseDays(argv: string[]): number {
  const flagIndex = argv.indexOf('--days')
  if (flagIndex === -1 || !argv[flagIndex + 1]) return DEFAULT_RETENTION_DAYS
  const parsed = Number(argv[flagIndex + 1])
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_RETENTION_DAYS
}

async function main() {
  const days = parseDays(process.argv.slice(2))
  const before = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const count = await db
    .delete(workspaces)
    .where(and(isNotNull(workspaces.deletedAt), lt(workspaces.deletedAt, before)))
    .returning({ id: workspaces.id })

  console.log(
    `Purged ${count.length} soft-deleted workspace(s) older than ${days} days. ` +
      `Their dependent rows were removed by the database cascade.`,
  )
}

main()
  .catch((error) => {
    console.error('Failed to purge workspaces:', error)
    process.exit(1)
  })
