import { createFileRoute } from '@tanstack/react-router'
import { GeneralSettingsPage } from '#/features/settings/components/general-settings-page'
import { getSettings } from '#/features/settings/server/queries/get-settings'

export const Route = createFileRoute('/_dashboard/settings/')({
  component: GeneralSettingsRoute,
  loader: async () => getSettings(),
})

function GeneralSettingsRoute() {
  const initialSettings = Route.useLoaderData()
  return <GeneralSettingsPage initialSettings={initialSettings} />
}
