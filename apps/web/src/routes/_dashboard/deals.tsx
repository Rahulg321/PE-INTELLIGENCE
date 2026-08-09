import { createFileRoute } from '@tanstack/react-router'
import { DealsTable } from '#/features/deals/components/deals-table'
import { NewDealForm } from '#/features/deals/components/new-deal-form'

export const Route = createFileRoute('/_dashboard/deals')({
  component: DealsRoute,
})

function DealsRoute() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="kicker">Pipeline</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">Deals</h1>
      <p className="mt-3 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
        Your deal pipeline. Add deals and watch the table update automatically.
      </p>
      <div className="mt-10 space-y-8">
        <NewDealForm />
        <DealsTable />
      </div>
    </div>
  )
}
