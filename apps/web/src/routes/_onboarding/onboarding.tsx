import { createFileRoute, redirect } from '@tanstack/react-router'
import { BrandPanel } from '#/components/shared/brand-panel'
import { OnboardingWizard } from '#/features/onboarding/components/onboarding-wizard'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'
import { getOnboardingDraft } from '#/features/onboarding/server/queries/get-onboarding-draft'
import { onboardingSearchSchema } from '#/features/onboarding/schemas'

export const Route = createFileRoute('/_onboarding/onboarding')({
  component: OnboardingRoute,
  validateSearch: onboardingSearchSchema,
  loader: async () => getOnboardingDraft(),
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
  },
})

function OnboardingRoute() {
  const { step } = Route.useSearch()
  const draft = Route.useLoaderData()
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      <BrandPanel
        title="Set up your investment workspace"
        subtitle="Tell us what your firm looks to invest in so we can screen deals that fit your mandate."
      >
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Create your workspace
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Investment strategy
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Target sectors
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Investment preferences
          </li>
        </ul>
      </BrandPanel>
      <main className="flex items-center justify-center bg-parchment px-6 py-12">
        <div className="w-full max-w-2xl">
          <OnboardingWizard step={step} draft={draft} />
        </div>
      </main>
    </div>
  )
}
