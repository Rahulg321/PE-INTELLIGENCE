import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { DataTableColumnHeader } from '#/components/shared/data-table/data-table-column-header'
import type { DataTableFeatures } from '#/components/shared/data-table/data-table-features'
import type { getDeals } from '../server/queries/get-deals'

export type DealRow = Awaited<ReturnType<typeof getDeals>>[number]

const columnHelper = createColumnHelper<DataTableFeatures, DealRow>()

export const DEAL_STATUS_LABEL = {
  NEW: 'New',
  ACTIVE: 'Active',
  ON_HOLD: 'On hold',
  PASSED: 'Passed',
  LOST: 'Lost',
  WON: 'Won',
} as const

export const DEAL_STAGE_LABEL = {
  INITIAL_REVIEW: 'Initial review',
  SCREENING: 'Screening',
  DILIGENCE: 'Diligence',
  IC: 'IC',
  LOI: 'LOI',
  CLOSING: 'Closing',
  CLOSED: 'Closed',
} as const

export const DEAL_TYPE_LABEL = {
  CONTROL_MAJORITY: 'Control / Majority',
  MINORITY: 'Minority',
  BUYOUT: 'Buyout',
  GROWTH: 'Growth',
  SPECIAL_SITUATIONS: 'Special situations',
} as const

export const DEAL_STATUS_OPTIONS = Object.entries(DEAL_STATUS_LABEL).map(
  ([value, label]) => ({ value, label }),
)

export const DEAL_STAGE_OPTIONS = Object.entries(DEAL_STAGE_LABEL).map(
  ([value, label]) => ({ value, label }),
)

export const DEAL_TYPE_OPTIONS = Object.entries(DEAL_TYPE_LABEL).map(
  ([value, label]) => ({ value, label }),
)

function formatDate(value: Date | string | null) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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
  columnHelper.accessor('name', {
    id: 'deal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deal" />
    ),
    cell: ({ row }) => {
      const deal = row.original
      return (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-semibold">
            {deal.name.charAt(0).toUpperCase()}
          </span>
          <span className="truncate font-medium">{deal.name}</span>
        </div>
      )
    },
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => row.company?.displayName ?? '', {
    id: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const company = row.original.company
      return (
        <div className="flex min-w-0 items-center gap-2">
          {company?.logoUrl ? (
            <img
              src={company.logoUrl}
              alt=""
              className="size-6 shrink-0 rounded-md border bg-background object-contain p-0.5"
            />
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-muted text-[10px] font-semibold">
              {(company?.displayName.charAt(0) ?? '?').toUpperCase()}
            </span>
          )}
          <span className="truncate text-muted-foreground">
            {company?.displayName ?? '—'}
          </span>
        </div>
      )
    },
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => (
      <Badge variant="outline">{DEAL_STATUS_LABEL[getValue()]}</Badge>
    ),
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('stage', {
    id: 'stage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{DEAL_STAGE_LABEL[getValue()]}</span>
    ),
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('dealType', {
    id: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ getValue }) => {
      const dealType = getValue()
      return (
        <span className="text-muted-foreground">
          {dealType ? DEAL_TYPE_LABEL[dealType] : '—'}
        </span>
      )
    },
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('source', {
    id: 'source',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() || '—'}</span>
    ),
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('announcedDate', {
    id: 'announced',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Announced" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{formatDate(getValue())}</span>
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
