import { createFileRoute, redirect } from '@tanstack/react-router'
import { OnboardingWizard } from '#/features/onboarding/components/onboarding-wizard'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'
import { onboardingSearchSchema } from '#/features/onboarding/schemas'

export const Route = createFileRoute('/_onboarding/onboarding')({
  component: OnboardingRoute,
  validateSearch: onboardingSearchSchema,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
  },
})

function OnboardingRoute() {
  const { step } = Route.useSearch()
  return <OnboardingWizard step={step} />
}
