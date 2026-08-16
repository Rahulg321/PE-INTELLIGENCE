import { useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { getCompany } from '../server/queries/get-company'

export function CompanySheet({
  companyId,
  onClose,
}: {
  companyId: string | null
  onClose: () => void
}) {
  const companyQuery = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany({ data: { companyId: companyId! } }),
    enabled: Boolean(companyId),
    refetchInterval: (query) => (query.state.data?.enriching ? 3000 : false),
  })

  const data = companyQuery.data

  return (
    <Sheet open={Boolean(companyId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{data?.company.displayName ?? 'Company'}</SheetTitle>
          <SheetDescription>
            {data?.enriching ? 'Research in progress…' : 'Company profile'}
          </SheetDescription>
        </SheetHeader>

        {companyQuery.isPending && (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {data && (
          <dl className="mt-6 space-y-2.5 text-sm">
            {data.company.website && (
              <Row label="Website" value={data.company.website} />
            )}
            {data.company.legalName && (
              <Row label="Legal name" value={data.company.legalName} />
            )}
            {data.company.industry && (
              <Row label="Industry" value={data.company.industry} />
            )}
            {data.company.subIndustry && (
              <Row label="Sub-industry" value={data.company.subIndustry} />
            )}
            {data.company.headquartersCountry && (
              <Row
                label="Headquarters"
                value={[data.company.headquartersCity, data.company.headquartersCountry]
                  .filter(Boolean)
                  .join(', ')}
              />
            )}
            {data.company.employeeCount != null && (
              <Row label="Employees" value={String(data.company.employeeCount)} />
            )}
            {data.company.logoUrl && (
              <div className="flex items-center gap-2">
                <dt className="w-32 text-muted-foreground">Logo</dt>
                <dd>
                  <img
                    src={data.company.logoUrl}
                    alt=""
                    className="size-10 rounded-lg border bg-white object-contain p-1"
                  />
                </dd>
              </div>
            )}
          </dl>
        )}

        {data?.company.description && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Investment brief
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-[1.47]">
              {data.company.description}
            </p>
          </div>
        )}

        {data && data.company.contacts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contacts
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              {data.company.contacts.map((contact) => (
                <li key={contact.id} className="rounded-md border border-hairline p-3">
                  <div className="font-medium">
                    {[contact.firstName, contact.lastName].filter(Boolean).join(' ')}
                  </div>
                  {contact.title && (
                    <div className="text-muted-foreground">{contact.title}</div>
                  )}
                  {contact.email && (
                    <div className="text-muted-foreground">{contact.email}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  )
}
