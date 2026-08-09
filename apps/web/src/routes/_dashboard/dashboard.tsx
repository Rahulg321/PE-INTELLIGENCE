import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/features/dashboard/components/dashboard-page'
import { getDashboardData } from '#/features/dashboard/server/queries/get-dashboard-data'

export const Route = createFileRoute('/_dashboard/dashboard')({
  component: DashboardRoute,
  loader: async () => getDashboardData(),
})

function DashboardRoute() {
  const data = Route.useLoaderData()
  return <DashboardPage data={data} />
}
