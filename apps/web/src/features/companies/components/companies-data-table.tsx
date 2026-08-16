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
import { columns  } from './columns'
import type {CompanyRow} from './columns';
import { features } from './data-table-features'

const COLUMN_LABELS = {
  company: 'Company',
  domain: 'Domain',
  industry: 'Industry',
  enrichment: 'Enrichment',
  contacts: 'Contacts',
  openDeals: 'Open deals',
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
  { id: 'company', label: 'Company' },
  { id: 'domain', label: 'Domain' },
  { id: 'industry', label: 'Industry' },
  { id: 'enrichment', label: 'Enrichment' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'openDeals', label: 'Open deals' },
  { id: 'lastActivity', label: 'Last activity' },
] as const

type CompaniesDataTableProps = {
  data: CompanyRow[]
  onRowClick: (companyId: string) => void
  onCreateClick: () => void
}

export function CompaniesDataTable({
  data,
  onRowClick,
  onCreateClick,
}: CompaniesDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lastActivity', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const industries = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map((row) => row.industry)
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort((a, b) => a.localeCompare(b))
  }, [data])

  const table = useTable({
    features,
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

  const industryFilter = filterValueSchema.parse(
    table.getColumn('industry')?.getFilterValue(),
  )
  const enrichmentFilter = filterValueSchema.parse(
    table.getColumn('enrichment')?.getFilterValue(),
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
            Companies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every account in the pipeline.
          </p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus data-icon="inline-start" />
          New company
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search companies by name or domain..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={industryFilter}
            onValueChange={(value) =>
              table
                .getColumn('industry')
                ?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Industry</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={enrichmentFilter}
            onValueChange={(value) =>
              table
                .getColumn('enrichment')
                ?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Enrichment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Enrichment</SelectItem>
                <SelectItem value="PENDING">Queued</SelectItem>
                <SelectItem value="RUNNING">Researching</SelectItem>
                <SelectItem value="DONE">Ready</SelectItem>
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
                  No companies found.
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
