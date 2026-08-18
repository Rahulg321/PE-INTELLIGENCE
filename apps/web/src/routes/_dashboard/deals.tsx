import { createFileRoute } from '@tanstack/react-router'
import { DealsPage } from '#/features/deals/components/deals-page'
import { dealsSearchSchema } from '#/features/deals/schemas'
import { getDeals } from '#/features/deals/server/queries/get-deals'

export const Route = createFileRoute('/_dashboard/deals')({
  component: DealsRoute,
  validateSearch: dealsSearchSchema,
  loader: async () => getDeals(),
})

function DealsRoute() {
  const initialDeals = Route.useLoaderData()
  const { dealId, tab } = Route.useSearch()
  return (
    <DealsPage
      initialDeals={initialDeals}
      dealId={dealId}
      tab={tab}
    />
  )
}
