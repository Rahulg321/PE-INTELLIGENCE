import { useEffect, useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { InvestmentStrategyStep } from '#/components/shared/mandate/investment-strategy-step'
import { TargetSectorsStep } from '#/components/shared/mandate/target-sectors-step'
import { InvestmentPreferencesStep } from '#/components/shared/mandate/investment-preferences-step'
import { ReviewStep } from '#/components/shared/mandate/review-step'
import type { MandateStepProps } from '#/components/shared/mandate/types'
import { Button } from '#/components/ui/button'
import { saveOnboarding } from '../server/mutations/save-onboarding'
import { saveOnboardingDraft } from '../server/mutations/save-onboarding-draft'
import { onboardingDraftDataSchema } from '../schemas'
import type { OnboardingDraft, OnboardingDraftData } from '../schemas'
import { CreateWorkspaceStep } from './create-workspace-step'

const STEPS = [
  CreateWorkspaceStep,
  InvestmentStrategyStep,
  TargetSectorsStep,
  InvestmentPreferencesStep,
  ReviewStep,
] as const

const STEP_LABELS = [
  'Create workspace',
  'Investment strategy',
  'Target sectors',
  'Investment preferences',
  'Review & complete',
]

export type OnboardingStepProps = MandateStepProps

const isDigits = (value: string) => /^\d+$/.test(value.trim())

const toNumber = (value: string) => Number(value)

const toOptionalNumber = (value: string) =>
  value.trim() === '' ? undefined : Number(value)

function sizeError(form: OnboardingDraftData): string | null {
  if (form.minRevenue.trim() !== '' && !isDigits(form.minRevenue)) {
    return 'Revenue must be a whole dollar amount.'
  }
  if (form.maxRevenue.trim() !== '' && !isDigits(form.maxRevenue)) {
    return 'Revenue must be a whole dollar amount.'
  }
  if (form.minEbitda.trim() !== '' && !isDigits(form.minEbitda)) {
    return 'EBITDA must be a whole dollar amount.'
  }
  if (form.maxEbitda.trim() !== '' && !isDigits(form.maxEbitda)) {
    return 'EBITDA must be a whole dollar amount.'
  }
  if (form.minEbitda.trim() === '') return 'Enter a minimum EBITDA.'

  const minRevenue = toOptionalNumber(form.minRevenue)
  const maxRevenue = toOptionalNumber(form.maxRevenue)
  if (minRevenue != null && maxRevenue != null && minRevenue > maxRevenue) {
    return "Minimum revenue can't exceed maximum revenue."
  }
  const minEbitda = toNumber(form.minEbitda)
  const maxEbitda = toOptionalNumber(form.maxEbitda)
  if (maxEbitda != null && minEbitda > maxEbitda) {
    return "Minimum EBITDA can't exceed maximum EBITDA."
  }
  return null
}

function getStepError(step: number, form: OnboardingDraftData): string | null {
  if (step === 0) {
    return form.firmName.trim().length >= 2
      ? null
      : 'Enter your workspace or firm name.'
  }
  if (step === 1) {
    if (form.geography.length === 0) return 'Select at least one geography.'
    if (form.investmentTypes.length === 0) {
      return 'Select at least one investment type.'
    }
    return sizeError(form)
  }
  if (step === 2) {
    return form.preferredSectors.length > 0 || form.noSectorPreference
      ? null
      : 'Select at least one preferred sector, or confirm you have no sector preference.'
  }
  return null
}

export function OnboardingWizard({
  step,
  draft,
}: {
  step: number
  draft?: OnboardingDraft | null
}) {
  const [form, setForm] = useState<OnboardingDraftData>(() =>
    onboardingDraftDataSchema.parse(draft?.data ?? {}),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const router = useRouter()

  const draftMutation = useMutation({
    mutationFn: (payload: OnboardingDraft) =>
      saveOnboardingDraft({ data: payload }),
  })

  const patch = (p: Partial<OnboardingDraftData>) =>
    setForm((prev) => ({ ...prev, ...p }))

  const goToStep = (next: number) => {
    draftMutation.mutate({ data: form, step })
    navigate({
      to: '/onboarding',
      search: (prev) => ({ ...prev, step: next }),
    })
  }

  useEffect(() => {
    if (!draft || step === draft.step) return
    navigate({
      to: '/onboarding',
      search: (prev) => ({ ...prev, step: draft.step }),
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      draftMutation.mutate({ data: form, step })
    }, 600)
    return () => clearTimeout(timer)
  }, [form, step, draftMutation])

  const handleBack = () => {
    setError(null)
    goToStep(Math.max(0, step - 1))
  }

  const handleContinue = () => {
    const err = getStepError(step, form)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    goToStep(step + 1)
  }

  const submit = async () => {
    if (submitting) return
    for (let s = 0; s <= 3; s++) {
      const err = getStepError(s, form)
      if (err) {
        setError(err)
        navigate({
          to: '/onboarding',
          search: (prev) => ({ ...prev, step: s }),
        })
        return
      }
    }
    setSubmitting(true)
    setError(null)
    try {
      await saveOnboarding({
        data: {
          firmName: form.firmName,
          website: form.website,
          geography: form.geography,
          investmentTypes: form.investmentTypes,
          minRevenue: toOptionalNumber(form.minRevenue),
          maxRevenue: toOptionalNumber(form.maxRevenue),
          minEbitda: toNumber(form.minEbitda),
          maxEbitda: toOptionalNumber(form.maxEbitda),
          preferredSectors: form.noSectorPreference
            ? []
            : form.preferredSectors,
          excludedSectors: form.excludedSectors,
          noSectorPreference: form.noSectorPreference,
          criteria: form.criteria,
          dealbreakers: form.dealbreakers,
        },
      })
      await router.invalidate()
      await router.navigate({ to: '/dashboard' })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
      setSubmitting(false)
    }
  }

  const StepComponent = STEPS[step]

  return (
    <div className="w-full px-6 py-12">
      <div className="mb-10">
        <span className="kicker">{STEP_LABELS[step]}</span>
        <h1 className="mt-3 text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Set up your investment workspace
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          A few quick questions so we can personalize deal screening. Step{' '}
          {step + 1} of {STEPS.length}.
        </p>
      </div>

      <StepComponent form={form} onChange={patch} />

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0 || submitting}
        >
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={handleContinue}>
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
          >
            {submitting ? 'Setting up…' : 'Complete setup'}
          </Button>
        )}
      </div>
    </div>
  )
}
