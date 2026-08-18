import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getCompanies } from '#/features/companies/server/queries/get-companies'
import type { DealSheetTab, DealStage, DealStatus, DealType } from '../schemas'
import { getDeals } from '../server/queries/get-deals'
import { createDeal } from '../server/mutations/create-deal'
import { DealsDataTable } from './deals-data-table'
import { DealSheet } from './deal-sheet'
import {
  DEAL_STAGE_OPTIONS,
  DEAL_STATUS_OPTIONS,
  DEAL_TYPE_OPTIONS,
} from './columns'

export function DealsPage({
  initialDeals,
  dealId,
  tab,
}: {
  initialDeals: Awaited<ReturnType<typeof getDeals>>
  dealId?: string
  tab?: DealSheetTab
}) {
  const navigate = useNavigate({ from: '/deals' })
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [status, setStatus] = useState<DealStatus | ''>('')
  const [stage, setStage] = useState<DealStage | ''>('')
  const [dealType, setDealType] = useState<DealType | ''>('')
  const [createOpen, setCreateOpen] = useState(false)

  const openDeal = (id: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        dealId: id,
        tab: prev.tab ?? 'overview',
      }),
    })
  }

  const closeDeal = () => {
    void navigate({
      search: (prev) => ({ ...prev, dealId: undefined, tab: undefined }),
    })
  }

  const setTab = (next: DealSheetTab) => {
    void navigate({
      search: (prev) => ({ ...prev, tab: next }),
      replace: true,
    })
  }

  const dealsQuery = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals(),
    initialData: initialDeals,
  })

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
    enabled: createOpen,
  })

  const createMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      setName('')
      setCompanyId('')
      setStatus('')
      setStage('')
      setDealType('')
      setCreateOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })

  const deals = dealsQuery.data

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !companyId) return
    createMutation.mutate({
      data: {
        name,
        companyId,
        status: status || undefined,
        stage: stage || undefined,
        dealType: dealType || undefined,
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-6 md:px-4 md:py-8">
      <DealsDataTable
        data={deals}
        onRowClick={openDeal}
        onCreateClick={() => setCreateOpen(true)}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New deal</DialogTitle>
            <DialogDescription>
              Log a new opportunity against one of your companies.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-name">Deal name</Label>
              <Input
                id="deal-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp buyout"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deal-company">Company</Label>
              <Select
                value={companyId}
                onValueChange={setCompanyId}
                disabled={companiesQuery.isPending}
              >
                <SelectTrigger id="deal-company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Companies</SelectLabel>
                    {(companiesQuery.data ?? []).map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.displayName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as DealStatus | '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DEAL_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Stage</Label>
                <Select
                  value={stage}
                  onValueChange={(value) => setStage(value as DealStage | '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DEAL_STAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Deal type</Label>
              <Select
                value={dealType}
                onValueChange={(value) => setDealType(value as DealType | '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Deal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DEAL_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {createMutation.isError && (
              <p className="text-sm text-destructive">
                Could not create deal: {createMutation.error.message}
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
                disabled={
                  createMutation.isPending || !name.trim() || !companyId
                }
              >
                Create deal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DealSheet
        dealId={dealId ?? null}
        tab={tab ?? 'overview'}
        onTabChange={setTab}
        onClose={closeDeal}
      />
    </div>
  )
}
