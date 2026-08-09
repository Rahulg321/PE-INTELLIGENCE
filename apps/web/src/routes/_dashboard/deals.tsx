import { createFileRoute } from '@tanstack/react-router'
import { DealsTable } from '#/features/deals/components/deals-table'
import { NewDealForm } from '#/features/deals/components/new-deal-form'

export const Route = createFileRoute('/_dashboard/deals')({
  component: DealsRoute,
})

function DealsRoute() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Deals</h1>
      <p className="mt-3 text-muted-foreground">
        Your deal pipeline. Add deals and watch the table update automatically.
      </p>
      <div className="mt-8 space-y-8">
        <NewDealForm />
        <DealsTable />
      </div>
    </div>
  )
}
