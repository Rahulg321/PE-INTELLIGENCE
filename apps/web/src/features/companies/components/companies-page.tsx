import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { getCompanies } from '../server/queries/get-companies'
import { createCompany } from '../server/mutations/create-company'
import { CompanySheet } from './company-sheet'

type EnrichmentStatus = 'PENDING' | 'RUNNING' | 'DONE'

const STATUS_LABEL: Record<EnrichmentStatus, string> = {
  PENDING: 'Queued',
  RUNNING: 'Researching',
  DONE: 'Ready',
}

const STATUS_CLASS: Record<EnrichmentStatus, string> = {
  PENDING: 'bg-muted text-muted-foreground',
  RUNNING: 'bg-amber-500/15 text-amber-600',
  DONE: 'bg-emerald-500/15 text-emerald-600',
}

function StatusBadge({ status }: { status: EnrichmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export function CompaniesPage({
  initialCompanies,
}: {
  initialCompanies: Awaited<ReturnType<typeof getCompanies>>
}) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
    initialData: initialCompanies,
    refetchInterval: (query) => {
      const rows = query.state.data
      if (Array.isArray(rows) && rows.some((r) => r.enrichmentStatus !== 'DONE')) {
        return 3000
      }
      return false
    },
  })

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      setName('')
      setWebsite('')
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const companies = companiesQuery.data ?? []

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({ data: { name, website: website || undefined } })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <span className="kicker">Companies</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">Companies</h1>
      <p className="mt-3 max-w-xl text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
        Add a company and the research agent will resolve its brand and write an
        investment brief against your mandate.
      </p>

      <Card className="mt-8 rounded-lg border bg-card shadow-none">
        <CardContent>
          <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-48 flex-1 flex-col gap-1.5">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="flex min-w-48 flex-1 flex-col gap-1.5">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="acme.com"
              />
            </div>
            <Button type="submit" disabled={createMutation.isPending || !name.trim()}>
              <Plus />
              Add company
            </Button>
          </form>
          {createMutation.isError && (
            <p className="mt-3 text-sm text-red-600">
              Could not add company: {createMutation.error.message}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 space-y-3">
        {companies.length === 0 && !companiesQuery.isPending && (
          <p className="text-sm text-muted-foreground">
            No companies yet. Add your first company above.
          </p>
        )}
        {companies.map((company) => (
          <button
            key={company.id}
            type="button"
            onClick={() => setSelectedId(company.id)}
            className="block w-full rounded-lg border border-hairline bg-card p-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt=""
                  className="size-10 shrink-0 rounded-lg border bg-white object-contain p-1"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-base font-semibold">
                  {company.displayName.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[15px] font-medium">
                    {company.displayName}
                  </span>
                  <StatusBadge status={company.enrichmentStatus} />
                </div>
                <div className="mt-0.5 truncate text-sm text-muted-foreground">
                  {company.industry ?? company.website ?? '—'}
                </div>
              </div>
            </div>
            {company.description && (
              <p className="mt-3 line-clamp-2 text-sm leading-[1.47] text-muted-foreground">
                {company.description}
              </p>
            )}
          </button>
        ))}
      </div>

      <CompanySheet
        companyId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
