import { createFileRoute } from '@tanstack/react-router'
import { SecuritySettingsPage } from '#/features/settings/components/security-settings-page'

export const Route = createFileRoute('/_dashboard/settings/security')({
  component: SecuritySettingsRoute,
})

function SecuritySettingsRoute() {
  return <SecuritySettingsPage />
}
