import { createFileRoute, redirect } from '@tanstack/react-router'
import { OnboardingWizard } from '#/features/onboarding/components/onboarding-wizard'
import { getOnboardingStatus } from '#/features/onboarding/server/queries/get-onboarding-status'

export const Route = createFileRoute('/_onboarding/onboarding')({
  component: OnboardingWizard,
  beforeLoad: async () => {
    const status = await getOnboardingStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
    if (status.hasFirm) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
