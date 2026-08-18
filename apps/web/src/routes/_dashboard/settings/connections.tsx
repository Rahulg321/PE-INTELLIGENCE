import { createFileRoute } from '@tanstack/react-router'
import { SettingsPlaceholderPage } from '#/features/settings/components/settings-placeholder-page'

export const Route = createFileRoute('/_dashboard/settings/connections')({
  component: ConnectionsSettingsRoute,
})

function ConnectionsSettingsRoute() {
  return (
    <SettingsPlaceholderPage
      title="Connections"
      description="Connect data sources and integrations used by this workspace."
    />
  )
}
