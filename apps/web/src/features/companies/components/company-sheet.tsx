import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Briefcase,
  MoreVertical,
  Pencil,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { AgentActivity } from '#/components/shared/agent-activity'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { Spinner } from '#/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  DEAL_STAGE_LABEL,
  DEAL_STATUS_LABEL,
} from '#/features/deals/components/columns'
import { deleteCompany } from '../server/mutations/delete-company'
import { updateCompany } from '../server/mutations/update-company'
import { getCompany } from '../server/queries/get-company'
import type { CompanySheetTab } from '../schemas'
import { CompanyContactsTab } from './company-contacts-tab'

const CLOSED_DEAL_STATUSES = new Set(['PASSED', 'LOST', 'WON'])

type CompanyDetail = NonNullable<Awaited<ReturnType<typeof getCompany>>>

export function CompanySheet({
  companyId,
  tab,
  addingContact,
  onTabChange,
  onAddingContactChange,
  onClose,
}: {
  companyId: string | null
  tab: CompanySheetTab
  addingContact: boolean
  onTabChange: (tab: CompanySheetTab) => void
  onAddingContactChange: (open: boolean) => void
  onClose: () => void
}) {
  const companyQuery = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany({ data: { companyId: companyId! } }),
    enabled: Boolean(companyId),
    refetchInterval: (query) => (query.state.data?.enriching ? 3000 : false),
  })

  const data = companyQuery.data
  const company = data?.company

  return (
    <Sheet
      open={Boolean(companyId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="h-full w-[70vw] gap-0 overflow-hidden p-0 sm:max-w-[70vw]"
      >
        <SheetHeader className="border-b p-6 pr-12">
          {companyQuery.isPending && <HeaderSkeleton />}
          {company && (
            <CompanyHeader
              company={company}
              enriching={Boolean(data?.enriching)}
              onDeleted={onClose}
            />
          )}
          {!companyQuery.isPending && !company && (
            <>
              <SheetTitle>Company</SheetTitle>
              <SheetDescription>
                This company could not be found.
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {company && <StatsBar company={company} />}

        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as CompanySheetTab)}
          className="min-h-0 flex-1 gap-0 overflow-hidden"
        >
          <TabsList
            variant="line"
            className="h-auto w-full justify-start rounded-none border-b px-6"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              Contacts
              {company && (
                <Badge variant="secondary">{company.contacts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="deals" className="gap-2">
              Deals
              {company && (
                <Badge variant="secondary">{company.deals.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {companyQuery.isPending && (
              <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {data && company && (
              <>
                <TabsContent value="overview" className="p-6">
                  <OverviewTab company={company} />
                </TabsContent>
                <TabsContent value="contacts" className="p-6">
                  <CompanyContactsTab
                    companyId={company.id}
                    contacts={company.contacts}
                    adding={addingContact}
                    onAddingChange={onAddingContactChange}
                  />
                </TabsContent>
                <TabsContent value="deals" className="p-6">
                  <DealsTab deals={company.deals} />
                </TabsContent>
                <TabsContent value="activity" className="p-6">
                  <AgentActivity events={data.events} />
                </TabsContent>
                <TabsContent value="agent" className="flex min-h-full flex-col">
                  <AgentTab />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {tab === 'agent' && (
          <SheetFooter className="border-t">
            <Input placeholder="What do they sell?" disabled />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CompanyHeader({
  company,
  enriching,
  onDeleted,
}: {
  company: CompanyDetail['company']
  enriching: boolean
  onDeleted: () => void
}) {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [name, setName] = useState(company.displayName)
  const [website, setWebsite] = useState(company.website ?? '')

  useEffect(() => {
    if (!editOpen) return
    setName(company.displayName)
    setWebsite(company.website ?? '')
  }, [editOpen, company.displayName, company.website])

  const updateMutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      setEditOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
      void queryClient.invalidateQueries({ queryKey: ['company', company.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      setDeleteOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
      void queryClient.invalidateQueries({ queryKey: ['company', company.id] })
      void queryClient.invalidateQueries({ queryKey: ['contacts'] })
      void queryClient.invalidateQueries({ queryKey: ['deals'] })
      onDeleted()
    },
  })

  const location = [company.headquartersCity, company.headquartersCountry]
    .filter(Boolean)
    .join(', ')
  const meta = [displayHost(company.website), location, company.industry]
    .filter(Boolean)
    .join(' • ')

  const submitEdit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    updateMutation.mutate({
      data: {
        companyId: company.id,
        name,
        website: website || undefined,
      },
    })
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar size="lg" className="rounded-lg">
          {company.logoUrl && <AvatarImage src={company.logoUrl} alt="" />}
          <AvatarFallback className="rounded-lg">
            {initials(company.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <SheetTitle className="text-2xl leading-tight">
            {company.displayName}
          </SheetTitle>
          <SheetDescription className="mt-1">
            {enriching ? 'Research in progress…' : meta || 'Company profile'}
          </SheetDescription>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <RefreshCw data-icon="inline-start" />
          Re-enrich
        </Button>
        <Button size="sm" disabled>
          <Sparkles data-icon="inline-start" />
          Research
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit company</DialogTitle>
            <DialogDescription>
              Update the company name and website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEdit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-company-name">
                  Company name
                </FieldLabel>
                <Input
                  id="edit-company-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Acme Corp"
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="edit-company-website">Website</FieldLabel>
                <Input
                  id="edit-company-website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="acme.com"
                />
              </Field>
            </FieldGroup>
            {updateMutation.isError && (
              <p className="text-sm text-destructive">
                Could not save: {updateMutation.error.message}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !name.trim()}
              >
                {updateMutation.isPending && (
                  <Spinner data-icon="inline-start" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {company.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the company, its contacts, and linked
              deals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteMutation.isError && (
            <p className="text-sm text-destructive">
              Could not delete: {deleteMutation.error.message}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                deleteMutation.mutate({ data: { companyId: company.id } })
              }}
            >
              {deleteMutation.isPending && <Spinner data-icon="inline-start" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-lg" />
      <div className="flex flex-col gap-2">
        <SheetTitle>Company</SheetTitle>
        <SheetDescription>Loading profile…</SheetDescription>
      </div>
    </div>
  )
}

function StatsBar({ company }: { company: CompanyDetail['company'] }) {
  const openDeals = company.deals.filter(
    (deal) => !CLOSED_DEAL_STATUSES.has(deal.status),
  )
  const pipeline = openDeals.reduce((sum, deal) => {
    const value = Number(
      deal.economics?.enterpriseValue ??
        deal.economics?.equityPurchasePrice ??
        0,
    )
    return sum + (Number.isNaN(value) ? 0 : value)
  }, 0)
  const nextClose = openDeals
    .map((deal) => deal.announcedDate)
    .filter((value): value is Date => value != null)
    .sort((a, b) => a.getTime() - b.getTime())[0]

  const stats = [
    { label: 'Open pipeline', value: formatMoney(pipeline) },
    { label: 'Open deals', value: String(openDeals.length) },
    { label: 'Next close', value: nextClose ? formatDate(nextClose) : '—' },
    { label: 'Contacts', value: String(company.contacts.length) },
  ]

  return (
    <div className="grid grid-cols-4 border-b">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative flex flex-col gap-1 px-6 py-4"
        >
          {index > 0 && (
            <Separator
              orientation="vertical"
              className="absolute inset-y-3 left-0"
            />
          )}
          <span className="text-xs text-muted-foreground">{stat.label}</span>
          <span className="text-sm font-medium">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({ company }: { company: CompanyDetail['company'] }) {
  const rows = [
    company.website && { label: 'Website', value: company.website },
    company.legalName && { label: 'Legal name', value: company.legalName },
    company.industry && { label: 'Industry', value: company.industry },
    company.subIndustry && {
      label: 'Sub-industry',
      value: company.subIndustry,
    },
    (company.headquartersCity || company.headquartersCountry) && {
      label: 'Headquarters',
      value: [company.headquartersCity, company.headquartersCountry]
        .filter(Boolean)
        .join(', '),
    },
    company.employeeCount != null && {
      label: 'Employees',
      value: String(company.employeeCount),
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row))

  if (rows.length === 0 && !company.description) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase />
          </EmptyMedia>
          <EmptyTitle>No profile yet</EmptyTitle>
          <EmptyDescription>
            Research is still filling in this company.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.length > 0 && (
        <dl className="flex flex-col gap-2.5 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-2">
              <dt className="w-32 shrink-0 text-muted-foreground">
                {row.label}
              </dt>
              <dd className="wrap-break-word">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {company.description && (
        <div>
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Investment brief
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-[1.47]">
            {company.description}
          </p>
        </div>
      )}
    </div>
  )
}

function DealsTab({ deals }: { deals: CompanyDetail['company']['deals'] }) {
  if (deals.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase />
          </EmptyMedia>
          <EmptyTitle>No deals</EmptyTitle>
          <EmptyDescription>
            No deals are linked to this company yet.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {deals.map((deal) => (
        <li
          key={deal.id}
          className="flex flex-col gap-2 rounded-md border p-3 text-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="font-medium">{deal.name}</div>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary">
                {DEAL_STATUS_LABEL[deal.status]}
              </Badge>
              <Badge variant="outline">{DEAL_STAGE_LABEL[deal.stage]}</Badge>
            </div>
          </div>
          {deal.description && (
            <p className="text-muted-foreground">{deal.description}</p>
          )}
        </li>
      ))}
    </ul>
  )
}

function AgentTab() {
  return (
    <Empty className="min-h-full border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Sparkles />
        </EmptyMedia>
        <EmptyTitle>Ask about this company</EmptyTitle>
        <EmptyDescription>
          It reads their site and our own history with them, and shows its
          working.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function displayHost(website: string | null) {
  if (!website) return null
  try {
    const url = website.includes('://') ? website : `https://${website}`
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return website
  }
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function formatMoney(value: number) {
  if (!value) return '—'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}
