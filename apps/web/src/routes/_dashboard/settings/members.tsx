import { createFileRoute } from '@tanstack/react-router'
import { SettingsPlaceholderPage } from '#/features/settings/components/settings-placeholder-page'

export const Route = createFileRoute('/_dashboard/settings/members')({
  component: MembersSettingsRoute,
})

function MembersSettingsRoute() {
  return (
    <SettingsPlaceholderPage
      title="Members"
      description="Invite teammates and manage who can access this workspace."
    />
  )
}
