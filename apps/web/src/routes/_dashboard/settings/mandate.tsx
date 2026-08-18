import { createFileRoute } from '@tanstack/react-router'
import { MandateEditPage } from '#/features/settings/components/mandate-edit-page'
import { getSettings } from '#/features/settings/server/queries/get-settings'

export const Route = createFileRoute('/_dashboard/settings/mandate')({
  component: MandateRoute,
  loader: async () => getSettings(),
})

function MandateRoute() {
  const initialSettings = Route.useLoaderData()
  return <MandateEditPage initialSettings={initialSettings} />
}
