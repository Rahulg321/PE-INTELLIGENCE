import { CurrencyInput } from '#/components/shared/currency-input'
import { Label } from '#/components/ui/label'
import { GEOGRAPHIES, INVESTMENT_TYPES } from './constants'
import { ToggleChip } from './toggle-chip'
import type { MandateStepProps } from './types'

type ArrayKey = 'geography' | 'investmentTypes'

export function InvestmentStrategyStep({ form, onChange }: MandateStepProps) {
  const toggle = (key: ArrayKey, value: string) => {
    const current = form[key]
    onChange({
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    })
  }

  const setRange = (
    key: 'minRevenue' | 'maxRevenue' | 'minEbitda' | 'maxEbitda',
    value: string,
  ) => {
    onChange({ [key]: value })
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Where do you invest?
        </p>
        <div className="flex flex-wrap gap-3">
          {GEOGRAPHIES.map((geo) => (
            <ToggleChip
              key={geo}
              label={geo}
              checked={form.geography.includes(geo)}
              onChange={() => toggle('geography', geo)}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          What type of investments do you pursue?
        </p>
        <div className="flex flex-wrap gap-3">
          {INVESTMENT_TYPES.map((type) => (
            <ToggleChip
              key={type}
              label={type}
              checked={form.investmentTypes.includes(type)}
              onChange={() => toggle('investmentTypes', type)}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          What size companies do you typically target?
        </p>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label className="text-xs font-semibold tracking-[-0.224px]">
              Revenue range (USD) <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <div className="flex items-center gap-3">
              <CurrencyInput
                placeholder="Minimum"
                value={form.minRevenue}
                onValueChange={(digits) => setRange('minRevenue', digits)}
              />
              <span className="text-muted-foreground">–</span>
              <CurrencyInput
                placeholder="Maximum"
                value={form.maxRevenue}
                onValueChange={(digits) => setRange('maxRevenue', digits)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-semibold tracking-[-0.224px]">
              EBITDA range (USD)
            </Label>
            <div className="flex items-center gap-3">
              <CurrencyInput
                placeholder="Minimum"
                value={form.minEbitda}
                onValueChange={(digits) => setRange('minEbitda', digits)}
              />
              <span className="text-muted-foreground">–</span>
              <CurrencyInput
                placeholder="Maximum"
                value={form.maxEbitda}
                onValueChange={(digits) => setRange('maxEbitda', digits)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
