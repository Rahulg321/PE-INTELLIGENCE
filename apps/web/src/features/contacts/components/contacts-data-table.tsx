import { useMemo, useState } from 'react'
import {
  useTable
  
  
  
} from '@tanstack/react-table'
import type {ColumnFiltersState, ColumnVisibilityState, SortingState} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Columns3,
  Plus,
  Search,
} from 'lucide-react'
import { z } from 'zod'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { dataTableFeatures } from '#/components/shared/data-table/data-table-features'
import { columns } from './columns'
import type { ContactRow } from './columns'

const COLUMN_LABELS = {
  name: 'Name',
  title: 'Title',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  primary: 'Primary',
  lastActivity: 'Last activity',
}

type LabelledColumnId = keyof typeof COLUMN_LABELS

function isLabelledColumnId(columnId: string): columnId is LabelledColumnId {
  return Object.hasOwn(COLUMN_LABELS, columnId)
}

function columnLabel(columnId: string) {
  return isLabelledColumnId(columnId) ? COLUMN_LABELS[columnId] : columnId
}

const filterValueSchema = z.string().catch('all')

const SORT_OPTIONS = [
  { id: 'name', label: 'Name' },
  { id: 'title', label: 'Title' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'company', label: 'Company' },
  { id: 'primary', label: 'Primary' },
  { id: 'lastActivity', label: 'Last activity' },
] as const

type ContactsDataTableProps = {
  data: ContactRow[]
  onRowClick: (contactId: string) => void
  onCreateClick: () => void
}

export function ContactsDataTable({
  data,
  onRowClick,
  onCreateClick,
}: ContactsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lastActivity', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const companies = useMemo(() => {
    return Array.from(
      new Set(data.map((row) => row.company.displayName)),
    ).sort((a, b) => a.localeCompare(b))
  }, [data])

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 15 },
    },
  })

  const companyFilter = filterValueSchema.parse(
    table.getColumn('company')?.getFilterValue(),
  )
  const primaryFilter = filterValueSchema.parse(
    table.getColumn('primary')?.getFilterValue(),
  )
  const activeSort = sorting[0]
  const visibleColumnCount = table.getVisibleLeafColumns().length
  const filteredCount = table.getFilteredRowModel().rows.length
  const { pageIndex, pageSize } = table.state.pagination
  const from = filteredCount === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(filteredCount, (pageIndex + 1) * pageSize)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.5px]">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The people behind your companies.
          </p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus data-icon="inline-start" />
          New contact
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search contacts by name, title, or email..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={companyFilter}
            onValueChange={(value) =>
              table
                .getColumn('company')
                ?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Company</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={primaryFilter}
            onValueChange={(value) =>
              table
                .getColumn('primary')
                ?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Primary" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Primary</SelectItem>
                <SelectItem value="true">Primary</SelectItem>
                <SelectItem value="false">Not primary</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown data-icon="inline-start" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={activeSort.id}
                  onValueChange={(value) =>
                    setSorting([{ id: value, desc: activeSort.desc }])
                  }
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={activeSort.desc ? 'desc' : 'asc'}
                  onValueChange={(value) => {
                    setSorting([{ id: activeSort.id, desc: value === 'desc' }])
                  }}
                >
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 data-icon="inline-start" />
                Columns ({visibleColumnCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {columnLabel(column.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {from}-{to} of {filteredCount}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
