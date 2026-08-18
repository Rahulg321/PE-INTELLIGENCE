import type { OnboardingDraftData } from '#/features/onboarding/schemas'

export type MandateStepProps = {
  form: OnboardingDraftData
  onChange: (patch: Partial<OnboardingDraftData>) => void
}
