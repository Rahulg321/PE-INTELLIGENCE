import { createFileRoute, redirect } from '@tanstack/react-router'
import { DealsTable } from '#/features/deals/components/deals-table'
import { NewDealForm } from '#/features/deals/components/new-deal-form'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/deals')({
  component: DealsRoute,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
  },
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
