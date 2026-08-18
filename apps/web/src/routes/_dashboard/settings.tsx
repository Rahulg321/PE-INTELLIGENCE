import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '#/features/settings/components/settings-layout'

export const Route = createFileRoute('/_dashboard/settings')({
  component: SettingsLayoutRoute,
})

function SettingsLayoutRoute() {
  return <SettingsLayout />
}
