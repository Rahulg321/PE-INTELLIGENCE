import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  MoreVertical,
  Sparkles,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { cn } from '#/lib/utils'
import { dealStageValues } from '../schemas'
import type { DealSheetTab } from '../schemas'
import { getDeal } from '../server/queries/get-deal'
import {
  DEAL_STAGE_LABEL,
  DEAL_STATUS_LABEL,
  DEAL_TYPE_LABEL,
} from './columns'

type DealDetail = NonNullable<Awaited<ReturnType<typeof getDeal>>>

export function DealSheet({
  dealId,
  tab,
  onTabChange,
  onClose,
}: {
  dealId: string | null
  tab: DealSheetTab
  onTabChange: (tab: DealSheetTab) => void
  onClose: () => void
}) {
  const dealQuery = useQuery({
    queryKey: ['deal', dealId],
    queryFn: () => getDeal({ data: { dealId: dealId! } }),
    enabled: Boolean(dealId),
  })

  const data = dealQuery.data
  const deal = data?.deal
  const company = deal?.companies
  const contacts = company?.contacts ?? []

  return (
    <Sheet open={Boolean(dealId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="h-full w-[70vw] gap-0 overflow-hidden p-0 sm:max-w-[70vw]"
      >
        <SheetHeader className="border-b p-6 pr-12">
          {dealQuery.isPending && <HeaderSkeleton />}
          {deal && <DealHeader deal={deal} />}
          {!dealQuery.isPending && !deal && (
            <>
              <SheetTitle>Deal</SheetTitle>
              <SheetDescription>This deal could not be found.</SheetDescription>
            </>
          )}
        </SheetHeader>

        {deal && <StatsBar deal={deal} />}

        <Tabs
          value={tab}
          onValueChange={(value) => onTabChange(value as DealSheetTab)}
          className="min-h-0 flex-1 gap-0 overflow-hidden"
        >
          <TabsList
            variant="line"
            className="h-auto w-full justify-start rounded-none border-b px-6"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              Contacts
              <Badge variant="secondary">{contacts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {dealQuery.isPending && (
              <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {data && deal && (
              <>
                <TabsContent value="overview" className="p-6">
                  <OverviewTab deal={deal} />
                </TabsContent>
                <TabsContent value="contacts" className="p-6">
                  <ContactsTab contacts={contacts} />
                </TabsContent>
                <TabsContent value="activity" className="p-6">
                  <ActivityTab events={data.events} />
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
            <Input placeholder="Ask about this deal…" disabled />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function DealHeader({ deal }: { deal: DealDetail['deal'] }) {
  const companyName = deal.companies?.displayName
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar size="lg" className="rounded-lg">
          {deal.companies?.logoUrl && (
            <AvatarImage src={deal.companies.logoUrl} alt="" />
          )}
          <AvatarFallback className="rounded-lg">
            {initials(companyName ?? deal.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <SheetTitle className="text-2xl leading-tight">{deal.name}</SheetTitle>
          <SheetDescription className="mt-1">
            {companyName ?? 'Deal detail'}
          </SheetDescription>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="secondary">{DEAL_STATUS_LABEL[deal.status]}</Badge>
        <Button variant="ghost" size="icon-sm" disabled>
          <MoreVertical />
          <span className="sr-only">More</span>
        </Button>
      </div>
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-lg" />
      <div className="flex flex-col gap-2">
        <SheetTitle>Deal</SheetTitle>
        <SheetDescription>Loading deal…</SheetDescription>
      </div>
    </div>
  )
}

function StatsBar({ deal }: { deal: DealDetail['deal'] }) {
  const amount =
    deal.economics?.enterpriseValue ?? deal.economics?.equityPurchasePrice
  const stats = [
    { label: 'Amount', value: formatMoney(amount) },
    { label: 'Expected close', value: formatDate(deal.announcedDate) },
    { label: 'Updated', value: formatRelative(deal.updatedAt) },
    { label: 'Company', value: deal.companies?.displayName ?? '—' },
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

function OverviewTab({ deal }: { deal: DealDetail['deal'] }) {
  const currentIndex = dealStageValues.indexOf(deal.stage)
  const amount =
    deal.economics?.enterpriseValue ?? deal.economics?.equityPurchasePrice
  const rows = [
    { label: 'Name', value: deal.name },
    { label: 'Company', value: deal.companies?.displayName ?? '—' },
    { label: 'Status', value: DEAL_STATUS_LABEL[deal.status] },
    { label: 'Stage', value: DEAL_STAGE_LABEL[deal.stage] },
    deal.dealType && { label: 'Type', value: DEAL_TYPE_LABEL[deal.dealType] },
    { label: 'Amount', value: formatMoney(amount) },
    { label: 'Close date', value: formatDate(deal.announcedDate) },
    deal.source && { label: 'Source', value: deal.source },
    deal.sourceName && { label: 'Source name', value: deal.sourceName },
  ].filter((row): row is { label: string; value: string } => Boolean(row))

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Stage
        </h3>
        <ol className="flex items-center gap-0 overflow-x-auto">
          {dealStageValues.map((stage, index) => {
            const isCurrent = stage === deal.stage
            const isPast = index < currentIndex
            return (
              <li key={stage} className="flex min-w-0 flex-1 items-center">
                {index > 0 && (
                  <span
                    className={cn(
                      'mx-2 h-px flex-1',
                      isPast || isCurrent ? 'bg-foreground' : 'bg-border',
                    )}
                  />
                )}
                <span
                  className={cn(
                    'shrink-0 text-xs',
                    isCurrent && 'font-semibold text-foreground',
                    isPast && 'text-muted-foreground',
                    !isCurrent && !isPast && 'text-muted-foreground/60',
                  )}
                >
                  {DEAL_STAGE_LABEL[stage]}
                </span>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="wrap-break-word font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {deal.description && (
        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Description
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-[1.47]">
            {deal.description}
          </p>
        </section>
      )}

      {deal.economics && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Economics
          </h3>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Detail
              label="Enterprise value"
              value={formatMoney(deal.economics.enterpriseValue)}
            />
            <Detail
              label="Equity purchase price"
              value={formatMoney(deal.economics.equityPurchasePrice)}
            />
            <Detail
              label="Entry EBITDA"
              value={formatMoney(deal.economics.entryEbitda)}
            />
          </dl>
        </section>
      )}
    </div>
  )
}

function ContactsTab({
  contacts,
}: {
  contacts: NonNullable<DealDetail['deal']['companies']>['contacts']
}) {
  if (contacts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No contacts</EmptyTitle>
          <EmptyDescription>
            No people are linked to this company yet.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {contacts.map((contact) => (
        <li key={contact.id} className="rounded-md border p-3 text-sm">
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>
                {initials(
                  [contact.firstName, contact.lastName].filter(Boolean).join(' '),
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium">
                {[contact.firstName, contact.lastName].filter(Boolean).join(' ')}
              </div>
              {contact.title && (
                <div className="text-muted-foreground">{contact.title}</div>
              )}
              {contact.email && (
                <div className="text-muted-foreground">{contact.email}</div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ActivityTab({ events }: { events: DealDetail['events'] }) {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>No activity yet</EmptyTitle>
          <EmptyDescription>
            Updates for this deal will show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
        >
          <span className="font-medium">{event.kind}</span>
          <span className="text-muted-foreground">
            {formatDate(event.createdAt)}
          </span>
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
        <EmptyTitle>Ask about this deal</EmptyTitle>
        <EmptyDescription>
          It reads the company, the deal history, and shows its working.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word font-medium">{value}</dd>
    </div>
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

function formatDate(value: Date | string | null | undefined) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatRelative(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)
  if (days < 1) return 'today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

function formatMoney(value: string | null | undefined) {
  if (value == null || value === '') return '—'
  const number = Number(value)
  if (Number.isNaN(number) || number === 0) return '—'
  return number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}
