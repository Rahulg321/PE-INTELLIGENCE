import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { ReactNode } from 'react'
import type { MandateStepProps } from './types'

const money = (value: string) => {
  const n = Number(value)
  if (value === '' || !Number.isFinite(n)) return null
  if (n >= 1_000_000) {
    const decimals = n % 1_000_000 === 0 ? 0 : 1
    return `$${(n / 1_000_000).toFixed(decimals)}M`
  }
  return `$${n.toLocaleString()}`
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  if (value == null || value === '') return null
  return (
    <div className="flex gap-2 py-1.5 text-sm">
      <dt className="w-40 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

export function ReviewStep({ form }: Pick<MandateStepProps, 'form'>) {
  const preferredSectors = form.noSectorPreference
    ? ['No sector preference']
    : form.preferredSectors
  const range = (min: string, max: string) => {
    const lo = money(min)
    const hi = money(max)
    if (lo && hi) return `${lo} – ${hi}`
    if (lo) return `${lo}+`
    if (hi) return `up to ${hi}`
    return null
  }
  const preferences = Object.entries(form.criteria).map(
    ([criterion, importance]) => `${criterion} (${importance})`,
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Here's your investment mandate.
        </p>
        <p className="mt-1 text-sm leading-[1.47] text-muted-foreground">
          Confirm the details and we'll set up your workspace.
        </p>
      </div>

      <Card className="rounded-lg border bg-card shadow-none">
        <CardHeader className="px-6">
          <CardTitle className="text-[15px] font-semibold leading-[1.24] tracking-[-0.224px]">
            {form.firmName}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-5">
          <dl className="mt-1">
            <Row label="Geography" value={form.geography.join(', ')} />
            <Row label="Investment type" value={form.investmentTypes.join(', ')} />
            <Row label="Revenue" value={range(form.minRevenue, form.maxRevenue)} />
            <Row label="EBITDA" value={range(form.minEbitda, form.maxEbitda)} />
            <Row label="Preferred sectors" value={preferredSectors.join(', ')} />
            <Row label="Excluded sectors" value={form.excludedSectors.join(', ') || undefined} />
            <Row label="Investment criteria" value={preferences.join(', ') || undefined} />
            <Row label="Deal-breakers" value={form.dealbreakers.join(', ') || undefined} />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
