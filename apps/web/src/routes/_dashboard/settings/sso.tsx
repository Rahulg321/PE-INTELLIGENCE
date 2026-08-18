import { createFileRoute } from '@tanstack/react-router'
import { SettingsPlaceholderPage } from '#/features/settings/components/settings-placeholder-page'

export const Route = createFileRoute('/_dashboard/settings/sso')({
  component: SsoSettingsRoute,
})

function SsoSettingsRoute() {
  return (
    <SettingsPlaceholderPage
      title="SSO"
      description="Configure single sign-on for this workspace."
    />
  )
}
