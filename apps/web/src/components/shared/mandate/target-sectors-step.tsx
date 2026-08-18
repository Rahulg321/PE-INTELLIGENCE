import { Checkbox } from '#/components/ui/checkbox'
import { Label } from '#/components/ui/label'
import { SECTORS } from './constants'
import { ToggleChip } from './toggle-chip'
import type { MandateStepProps } from './types'

export function TargetSectorsStep({ form, onChange }: MandateStepProps) {
  const togglePreferred = (sector: string) => {
    const next = form.preferredSectors.includes(sector)
      ? form.preferredSectors.filter((s) => s !== sector)
      : [...form.preferredSectors, sector]
    onChange({
      preferredSectors: next,
      excludedSectors: form.excludedSectors.filter((s) => s !== sector),
      noSectorPreference: false,
    })
  }

  const toggleExcluded = (sector: string) => {
    const next = form.excludedSectors.includes(sector)
      ? form.excludedSectors.filter((s) => s !== sector)
      : [...form.excludedSectors, sector]
    onChange({
      excludedSectors: next,
      preferredSectors: form.preferredSectors.filter((s) => s !== sector),
      noSectorPreference: false,
    })
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-1 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Which sectors are you interested in?
        </p>
        <p className="mb-3 text-sm text-muted-foreground">
          Select as many as you like.
        </p>
        <div className="flex flex-wrap gap-3">
          {SECTORS.map((sector) => (
            <ToggleChip
              key={sector}
              label={sector}
              checked={form.preferredSectors.includes(sector)}
              onChange={() => togglePreferred(sector)}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-3 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Are there sectors you generally avoid?
        </p>
        <div className="flex flex-wrap gap-3">
          {SECTORS.map((sector) => (
            <ToggleChip
              key={sector}
              label={sector}
              checked={form.excludedSectors.includes(sector)}
              onChange={() => toggleExcluded(sector)}
            />
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-lg border border-hairline bg-card p-4">
        <Checkbox
          id="no-sector-preference"
          checked={form.noSectorPreference}
          onCheckedChange={(checked) =>
            onChange({
              noSectorPreference: checked === true,
              preferredSectors: checked === true ? [] : form.preferredSectors,
            })
          }
        />
        <Label
          htmlFor="no-sector-preference"
          className="cursor-pointer text-sm leading-snug"
        >
          We don't have sector preferences — we're open to any sector
        </Label>
      </div>
    </div>
  )
}
