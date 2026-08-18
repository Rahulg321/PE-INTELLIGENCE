import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { DataTableColumnHeader } from '#/components/shared/data-table/data-table-column-header'
import type { DataTableFeatures } from '#/components/shared/data-table/data-table-features'
import type { getContacts } from '../server/queries/get-contacts'

export type ContactRow = Awaited<ReturnType<typeof getContacts>>[number]

const columnHelper = createColumnHelper<DataTableFeatures, ContactRow>()

function fullName(contact: ContactRow) {
  return [contact.firstName, contact.lastName].filter(Boolean).join(' ')
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
  columnHelper.accessor(fullName, {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const contact = row.original
      const name = fullName(contact)
      return (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
            {contact.firstName.charAt(0).toUpperCase()}
          </span>
          <span className="truncate font-medium">{name}</span>
        </div>
      )
    },
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('title', {
    id: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() || '—'}</span>
    ),
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() || '—'}</span>
    ),
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('phone', {
    id: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue() || '—'}</span>
    ),
    sortFn: 'text',
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => row.company.displayName, {
    id: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue()}</span>
    ),
    sortFn: 'text',
    filterFn: 'equalsString',
  }),
  columnHelper.accessor((row) => (row.isPrimary ? 'true' : 'false'), {
    id: 'primary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Primary" />
    ),
    cell: ({ getValue }) =>
      getValue() === 'true' ? (
        <Badge variant="secondary">Primary</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    sortFn: 'alphanumeric',
    filterFn: 'equalsString',
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
