import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '#/features/dashboard/components/dashboard-page'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'
import { getDashboardData } from '#/features/dashboard/server/queries/get-dashboard-data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardRoute,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => getDashboardData(),
})

function DashboardRoute() {
  const data = Route.useLoaderData()
  return <DashboardPage data={data} />
}
