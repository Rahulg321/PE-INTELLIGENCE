import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { InvestmentStrategyStep } from '#/components/shared/mandate/investment-strategy-step'
import { TargetSectorsStep } from '#/components/shared/mandate/target-sectors-step'
import { InvestmentPreferencesStep } from '#/components/shared/mandate/investment-preferences-step'
import { ReviewStep } from '#/components/shared/mandate/review-step'
import { onboardingDraftDataSchema } from '#/features/onboarding/schemas'
import type { OnboardingDraftData } from '#/features/onboarding/schemas'
import { updateMandateSchema } from '../schemas'
import { updateMandate } from '../server/mutations/update-mandate'
import { getSettings } from '../server/queries/get-settings'

const isDigits = (value: string) => /^\d+$/.test(value.trim())

const toOptionalNumber = (value: string) =>
  value.trim() === '' ? undefined : Number(value)

const toNumber = (value: string) => Number(value)

function SectionHeading({
  index,
  title,
}: {
  index: number
  title: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="kicker">{index}</span>
      <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
    </div>
  )
}

export function MandateEditPage({
  initialSettings,
}: {
  initialSettings: Awaited<ReturnType<typeof getSettings>>
}) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
    initialData: initialSettings,
  })

  const [form, setForm] = useState<OnboardingDraftData>(() =>
    onboardingDraftDataSchema.parse({
      ...settingsQuery.data.mandate,
      firmName: settingsQuery.data.workspace.name,
      website: settingsQuery.data.workspace.website,
    }),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setForm((prev) =>
      onboardingDraftDataSchema.parse({
        ...prev,
        ...settingsQuery.data.mandate,
        firmName: settingsQuery.data.workspace.name,
        website: settingsQuery.data.workspace.website,
      }),
    )
  }, [
    settingsQuery.data.mandate,
    settingsQuery.data.workspace.name,
    settingsQuery.data.workspace.website,
  ])

  const patch = (p: Partial<OnboardingDraftData>) =>
    setForm((prev) => ({ ...prev, ...p }))

  const mutation = useMutation({
    mutationFn: updateMandate,
    onSuccess: async () => {
      setError(null)
      await queryClient.invalidateQueries({ queryKey: ['settings'] })
      await router.invalidate()
    },
  })

  const save = (event: React.FormEvent) => {
    event.preventDefault()
    for (const [label, value] of [
      ['Revenue', form.minRevenue],
      ['Revenue', form.maxRevenue],
      ['EBITDA', form.minEbitda],
      ['EBITDA', form.maxEbitda],
    ]) {
      if (value.trim() !== '' && !isDigits(value)) {
        setError(`${label} must be a whole dollar amount.`)
        return
      }
    }

    const parsed = updateMandateSchema.safeParse({
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
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please fix the form.')
      return
    }

    mutation.mutate({ data: parsed.data })
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Investment mandate
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What {form.firmName || 'your firm'} looks to invest in. Changes here
          apply to future deal screening.
        </p>
      </div>

      <form onSubmit={save} className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <SectionHeading index={1} title="Investment strategy" />
          <div className="rounded-lg border border-hairline bg-card p-6">
            <InvestmentStrategyStep form={form} onChange={patch} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading index={2} title="Target sectors" />
          <div className="rounded-lg border border-hairline bg-card p-6">
            <TargetSectorsStep form={form} onChange={patch} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading index={3} title="Investment preferences" />
          <div className="rounded-lg border border-hairline bg-card p-6">
            <InvestmentPreferencesStep form={form} onChange={patch} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading index={4} title="Review" />
          <div className="rounded-lg border border-hairline bg-card p-6">
            <ReviewStep form={form} />
          </div>
        </section>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
        {mutation.isError ? (
          <p className="text-sm text-destructive">
            Could not save: {mutation.error.message}
          </p>
        ) : null}

        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-hairline bg-background/80 py-4 backdrop-blur">
          {mutation.isSuccess ? (
            <span className="text-sm text-muted-foreground">Saved</span>
          ) : null}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner /> : null}
            Save mandate
          </Button>
        </div>
      </form>
    </div>
  )
}
