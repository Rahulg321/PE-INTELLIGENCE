import { useEffect, useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { authClient } from '#/features/auth/client'
import { saveOnboarding } from '../server/mutations/save-onboarding'
import { saveOnboardingDraft } from '../server/mutations/save-onboarding-draft'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Checkbox } from '#/components/ui/checkbox'
import { GEOGRAPHIES, INVESTMENT_TYPES, SECTORS, CRITERIA } from '../constants'
import type { CriterionImportance } from '../constants'
import type { OnboardingDraft, OnboardingDraftData } from '../schemas'
import { onboardingDraftDataSchema } from '../schemas'

export function OnboardingWizard({
  step,
  draft,
}: {
  step: number
  draft?: OnboardingDraft | null
}) {
  const [form, setForm] = useState<OnboardingDraftData>(
    () => draft?.data ?? onboardingDraftDataSchema.parse({}),
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const router = useRouter()

  const draftMutation = useMutation({
    mutationFn: (payload: OnboardingDraft) =>
      saveOnboardingDraft({ data: payload }),
  })

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

  const { data: session } = authClient.useSession()

  const toggle = (key: keyof OnboardingDraftData, value: string) => {
    setForm((prev) => {
      const current = prev[key] as string[]
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      }
    })
  }

  const setCriterion = (criterion: string, importance: CriterionImportance) => {
    setForm((prev) => ({
      ...prev,
      criteria: { ...prev.criteria, [criterion]: importance },
    }))
  }

  const canContinue = () => {
    if (step === 0) return form.firmName.trim().length > 0
    if (step === 1)
      return form.geography.length > 0 && form.investmentTypes.length > 0
    if (step === 2) return form.preferredSectors.length > 0
    return true
  }

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await saveOnboarding({
        data: {
          firmName: form.firmName,
          website: form.website,
          geography: form.geography,
          investmentTypes: form.investmentTypes,
          minRevenue: form.minRevenue ? Number(form.minRevenue) : undefined,
          maxRevenue: form.maxRevenue ? Number(form.maxRevenue) : undefined,
          minEbitda: form.minEbitda ? Number(form.minEbitda) : undefined,
          maxEbitda: form.maxEbitda ? Number(form.maxEbitda) : undefined,
          preferredSectors: form.preferredSectors,
          excludedSectors: form.excludedSectors,
          criteria: form.criteria,
        },
      })
      await router.invalidate()
      await router.navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full px-6 py-12">
      <div className="mb-10">
        <span className="kicker">Setup</span>
        <h1 className="mt-3 text-[34px] font-semibold leading-[1.47] tracking-[-0.374px]">
          Set up your firm
        </h1>
        <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
          We'll use this to personalize deal screening. Step {step + 1} of 4.
        </p>
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="firmName" className="text-xs font-semibold tracking-[-0.224px]">
              Firm name
            </Label>
            <Input
              id="firmName"
              className="mt-2"
              placeholder="Acme Capital"
              value={form.firmName}
              onChange={(e) => setForm({ ...form, firmName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-xs font-semibold tracking-[-0.224px]">
              Website
            </Label>
            <Input
              id="website"
              className="mt-2"
              placeholder="https://acme.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-4">
            {session?.user.image ? (
              <img
                src={session.user.image}
                alt=""
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-full bg-muted font-semibold">
                {(session?.user.name ?? 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
                {session?.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {session?.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              Where do you invest?
            </p>
            <div className="flex flex-wrap gap-3">
              {GEOGRAPHIES.map((geo) => (
                <Label
                  key={geo}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-card px-5 py-2.5 text-sm transition-colors ${
                    form.geography.includes(geo)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'hover:border-ink-48'
                  }`}
                >
                  <Checkbox
                    checked={form.geography.includes(geo)}
                    onCheckedChange={() => toggle('geography', geo)}
                  />
                  {geo}
                </Label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              Investment type
            </p>
            <div className="flex flex-wrap gap-3">
              {INVESTMENT_TYPES.map((type) => (
                <Label
                  key={type}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-card px-5 py-2.5 text-sm transition-colors ${
                    form.investmentTypes.includes(type)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'hover:border-ink-48'
                  }`}
                >
                  <Checkbox
                    checked={form.investmentTypes.includes(type)}
                    onCheckedChange={() => toggle('investmentTypes', type)}
                  />
                  {type}
                </Label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              Revenue range (USD)
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={form.minRevenue}
                onChange={(e) =>
                  setForm({ ...form, minRevenue: e.target.value })
                }
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={form.maxRevenue}
                onChange={(e) =>
                  setForm({ ...form, maxRevenue: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              EBITDA range (USD)
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={form.minEbitda}
                onChange={(e) =>
                  setForm({ ...form, minEbitda: e.target.value })
                }
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={form.maxEbitda}
                onChange={(e) =>
                  setForm({ ...form, maxEbitda: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              Preferred sectors
            </p>
            <div className="flex flex-wrap gap-3">
              {SECTORS.map((sector) => (
                <Label
                  key={sector}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-card px-5 py-2.5 text-sm transition-colors ${
                    form.preferredSectors.includes(sector)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'hover:border-ink-48'
                  }`}
                >
                  <Checkbox
                    checked={form.preferredSectors.includes(sector)}
                    onCheckedChange={() => toggle('preferredSectors', sector)}
                  />
                  {sector}
                </Label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              Sectors you explicitly avoid (optional)
            </p>
            <div className="flex flex-wrap gap-3">
              {SECTORS.map((sector) => (
                <Label
                  key={sector}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-card px-5 py-2.5 text-sm transition-colors ${
                    form.excludedSectors.includes(sector)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'hover:border-ink-48'
                  }`}
                >
                  <Checkbox
                    checked={form.excludedSectors.includes(sector)}
                    onCheckedChange={() => toggle('excludedSectors', sector)}
                  />
                  {sector}
                </Label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
            What makes a company attractive to you?
          </p>
          <div className="space-y-3">
            {CRITERIA.map((criterion) => {
              const value = form.criteria[criterion] ?? 'neutral'
              return (
                <div
                  key={criterion}
                  className="flex items-center justify-between rounded-lg border border-hairline bg-card px-5 py-3"
                >
                  <span className="text-[17px] leading-[1.47] tracking-[-0.374px]">
                    {criterion}
                  </span>
                  <div className="flex gap-2">
                    {(['required', 'preferred', 'neutral'] as const).map(
                      (option) => (
                        <Button
                          key={option}
                          type="button"
                          size="sm"
                          variant={value === option ? 'default' : 'outline'}
                          onClick={() => setCriterion(criterion, option)}
                        >
                          {option}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rounded-lg border border-dashed border-hairline p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an investment criteria document? You'll be able to
              upload it later.
            </p>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => goToStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => goToStep(step + 1)}
            disabled={!canContinue()}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => void submit()}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Finish'}
          </Button>
        )}
      </div>
    </div>
  )
}
