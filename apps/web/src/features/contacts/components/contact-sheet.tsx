import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  Briefcase,
  Mail,
  MoreVertical,
  RefreshCw,
  Sparkles,
  Star,
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
import { Spinner } from '#/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  DEAL_STAGE_LABEL,
  DEAL_STATUS_LABEL,
} from '#/features/deals/components/columns'
import { isContactSheetTab } from '../schemas'
import type { ContactSheetTab } from '../schemas'
import { setPrimaryContact } from '../server/mutations/set-primary-contact'
import { getContact } from '../server/queries/get-contact'

type ContactDetail = NonNullable<Awaited<ReturnType<typeof getContact>>>

export function ContactSheet({
  contactId,
  tab,
  onTabChange,
  onSelectContact,
  onClose,
}: {
  contactId: string | null
  tab: ContactSheetTab
  onTabChange: (tab: ContactSheetTab) => void
  onSelectContact: (contactId: string) => void
  onClose: () => void
}) {
  const contactQuery = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => getContact({ data: { contactId: contactId! } }),
    enabled: Boolean(contactId),
  })

  const data = contactQuery.data
  const contact = data?.contact
  const company = data?.company

  return (
    <Sheet
      open={Boolean(contactId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent
        side="right"
        className="h-full w-[70vw] gap-0 overflow-hidden p-0 sm:max-w-[70vw]"
      >
        <SheetHeader className="border-b p-6 pr-12">
          {contactQuery.isPending && <HeaderSkeleton />}
          {contact && company && (
            <ContactHeader
              contact={contact}
              company={company}
              enriching={Boolean(data?.enriching)}
            />
          )}
          {!contactQuery.isPending && !contact && (
            <>
              <SheetTitle>Contact</SheetTitle>
              <SheetDescription>
                This contact could not be found.
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {contact && company && (
          <StatsBar contact={contact} company={company} />
        )}

        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (!isContactSheetTab(value)) return
            onTabChange(value)
          }}
          className="min-h-0 flex-1 gap-0 overflow-hidden"
        >
          <TabsList
            variant="line"
            className="h-auto w-full justify-start rounded-none border-b px-6"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
            {contactQuery.isPending && (
              <div className="flex flex-col gap-3 p-6">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {data && contact && company && (
              <>
                <TabsContent value="overview" className="p-6">
                  <OverviewTab
                    contact={contact}
                    company={company}
                    onSelectContact={onSelectContact}
                  />
                </TabsContent>
                <TabsContent value="deals" className="p-6">
                  <DealsTab deals={company.deals} />
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
            <Input placeholder="Ask about this contact…" disabled />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function ContactHeader({
  contact,
  company,
  enriching,
}: {
  contact: ContactDetail['contact']
  company: ContactDetail['company']
  enriching: boolean
}) {
  const queryClient = useQueryClient()
  const name = fullName(contact)
  const subtitle = [contact.title, company.displayName]
    .filter(Boolean)
    .join(' · ')
  const primaryMutation = useMutation({
    mutationFn: setPrimaryContact,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contact', contact.id] })
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <SheetTitle className="text-2xl leading-tight">{name}</SheetTitle>
          <SheetDescription className="mt-1">
            {subtitle || 'Contact detail'}
          </SheetDescription>
          {enriching && (
            <p className="mt-1 text-sm text-muted-foreground">
              Research in progress…
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <RefreshCw data-icon="inline-start" />
          Re-enrich
        </Button>
        {contact.email ? (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${contact.email}`}>
              <Mail data-icon="inline-start" />
              Email
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <Mail data-icon="inline-start" />
            Email
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={contact.isPrimary || primaryMutation.isPending}
          onClick={() =>
            primaryMutation.mutate({ data: { contactId: contact.id } })
          }
        >
          {primaryMutation.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Star data-icon="inline-start" />
          )}
          {contact.isPrimary ? 'Primary' : 'Make primary'}
        </Button>
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
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col gap-2">
        <SheetTitle>Contact</SheetTitle>
        <SheetDescription>Loading contact…</SheetDescription>
      </div>
    </div>
  )
}

function StatsBar({
  contact,
  company,
}: {
  contact: ContactDetail['contact']
  company: ContactDetail['company']
}) {
  const stats = [
    {
      label: 'Company',
      value: (
        <span className="flex min-w-0 items-center gap-2">
          <Avatar size="sm" className="rounded-md">
            {company.logoUrl && <AvatarImage src={company.logoUrl} alt="" />}
            <AvatarFallback className="rounded-md">
              {initials(company.displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{company.displayName}</span>
        </span>
      ),
    },
    { label: 'Email', value: displayValue(contact.email) },
    { label: 'Phone', value: displayValue(contact.phone) },
    { label: 'Primary', value: contact.isPrimary ? 'Yes' : '—' },
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
          <span className="truncate text-sm font-medium">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({
  contact,
  company,
  onSelectContact,
}: {
  contact: ContactDetail['contact']
  company: ContactDetail['company']
  onSelectContact: (contactId: string) => void
}) {
  const colleagues = company.contacts.filter((row) => row.id !== contact.id)
  const details = [
    { label: 'First name', value: contact.firstName },
    { label: 'Last name', value: displayValue(contact.lastName) },
    { label: 'Title', value: displayValue(contact.title) },
    { label: 'Email', value: displayValue(contact.email) },
    { label: 'Phone', value: displayValue(contact.phone) },
    { label: 'LinkedIn', value: displayValue(contact.linkedinUrl) },
    { label: 'Company', value: company.displayName },
    { label: 'Primary', value: contact.isPrimary ? 'Yes' : '—' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {details.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="wrap-break-word font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          We know them
        </h3>
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Also here</span>
          {colleagues.length === 0 ? (
            <span className="font-medium">—</span>
          ) : (
            <ul className="flex flex-col gap-1">
              {colleagues.map((colleague) => {
                const name = fullName(colleague)
                return (
                  <li key={colleague.id}>
                    <button
                      type="button"
                      className="text-left font-medium hover:underline"
                      onClick={() => onSelectContact(colleague.id)}
                    >
                      {name}
                      {colleague.title ? ` (${colleague.title})` : ''}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function DealsTab({ deals }: { deals: ContactDetail['company']['deals'] }) {
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
              <Badge variant="secondary">{DEAL_STATUS_LABEL[deal.status]}</Badge>
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

function ActivityTab({ events }: { events: ContactDetail['events'] }) {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>No activity yet</EmptyTitle>
          <EmptyDescription>
            Agent runs and updates for this contact will show up here.
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
        <EmptyTitle>Ask about this contact</EmptyTitle>
        <EmptyDescription>
          It reads this person, their company, and shows its working.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function fullName(person: { firstName: string; lastName: string | null }) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ')
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function displayValue(value: string | null | undefined) {
  return value?.trim() || '—'
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}
