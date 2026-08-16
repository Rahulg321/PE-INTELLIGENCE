import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import type { getCompanies } from '../server/queries/get-companies'
import { DataTableColumnHeader } from './data-table-column-header'
import type { DataTableFeatures } from './data-table-features'

export type CompanyRow = Awaited<ReturnType<typeof getCompanies>>[number]

const columnHelper = createColumnHelper<DataTableFeatures, CompanyRow>()

const ENRICHMENT_LABEL = {
  PENDING: 'Queued',
  RUNNING: 'Researching',
  DONE: 'Ready',
} as const

function domainFromWebsite(website: string | null) {
  if (!website) return ''
  return website.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

function formatRelativeTime(value: Date | string | null) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export const columns = columnHelper.columns([
  columnHelper.accessor('displayName', {
    id: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex min-w-0 items-center gap-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt=""
              className="size-8 shrink-0 rounded-md border bg-background object-contain p-0.5"
            />
          ) : (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-semibold">
              {company.displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="truncate font-medium">{company.displayName}</span>
        </div>
      )
    },
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => domainFromWebsite(row.website), {
    id: 'domain',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Domain" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() || '—'}</span>
    ),
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => row.industry ?? '', {
    id: 'industry',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ getValue }) => getValue() || '—',
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('enrichmentStatus', {
    id: 'enrichment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enrichment" />
    ),
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge variant={status === 'DONE' ? 'secondary' : 'outline'}>
          {ENRICHMENT_LABEL[status]}
        </Badge>
      )
    },
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('contactCount', {
    id: 'contacts',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Contacts"
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue()}</div>
    ),
    sortFn: 'alphanumeric',
  }),
  columnHelper.accessor('openDealCount', {
    id: 'openDeals',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Open deals"
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue()}</div>
    ),
    sortFn: 'alphanumeric',
  }),
  columnHelper.accessor('updatedAt', {
    id: 'lastActivity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last activity"
        className="justify-end"
      />
    ),
    cell: ({ getValue }) => (
      <div className="text-right text-muted-foreground">
        {formatRelativeTime(getValue())}
      </div>
    ),
    sortFn: 'alphanumeric',
  }),
])
