import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { getCompanies } from '../server/queries/get-companies'
import { createCompany } from '../server/mutations/create-company'
import { CompaniesDataTable } from './companies-data-table'
import { CompanySheet } from './company-sheet'

export function CompaniesPage({
  initialCompanies,
}: {
  initialCompanies: Awaited<ReturnType<typeof getCompanies>>
}) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
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
      setCreateOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })

  const companies = companiesQuery.data

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({ data: { name, website: website || undefined } })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-6 md:px-4 md:py-8">
      <CompaniesDataTable
        data={companies}
        onRowClick={setSelectedId}
        onCreateClick={() => setCreateOpen(true)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New company</DialogTitle>
            <DialogDescription>
              Add a company and the research agent will resolve its brand and
              write an investment brief against your mandate.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="acme.com"
              />
            </div>
            {createMutation.isError && (
              <p className="text-sm text-destructive">
                Could not add company: {createMutation.error.message}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !name.trim()}
              >
                Add company
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CompanySheet
        companyId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
