import { Button } from '#/components/ui/button'
import { CRITERIA, DEAL_BREAKERS } from './constants'
import { ToggleChip } from './toggle-chip'
import type { CriterionImportance } from './constants'
import type { MandateStepProps } from './types'

export function InvestmentPreferencesStep({ form, onChange }: MandateStepProps) {
  const toggleCriterion = (criterion: string) => {
    const criteria = { ...form.criteria }
    if (criterion in criteria) {
      delete criteria[criterion]
    } else {
      criteria[criterion] = 'preferred'
    }
    onChange({ criteria })
  }

  const setImportance = (criterion: string, importance: CriterionImportance) => {
    onChange({ criteria: { ...form.criteria, [criterion]: importance } })
  }

  const toggleDealbreaker = (item: string) => {
    onChange({
      dealbreakers: form.dealbreakers.includes(item)
        ? form.dealbreakers.filter((d) => d !== item)
        : [...form.dealbreakers, item],
    })
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-1 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          What makes a company attractive to you?
        </p>
        <p className="mb-3 text-sm text-muted-foreground">
          Select the characteristics you care about. For each, choose whether it's
          preferred or required.
        </p>
        <div className="space-y-3">
          {CRITERIA.map((criterion) => {
            const importance =
              criterion in form.criteria ? form.criteria[criterion] : undefined
            return (
              <div
                key={criterion}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-card px-5 py-3"
              >
                <label className="flex cursor-pointer items-center gap-3 text-[15px] leading-[1.47] tracking-[-0.224px]">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--color-primary)]"
                    checked={importance != null}
                    onChange={() => toggleCriterion(criterion)}
                  />
                  {criterion}
                </label>
                {importance != null && (
                  <div className="flex gap-2" role="radiogroup" aria-label={`${criterion} importance`}>
                    {(['preferred', 'required'] as const).map((option) => (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        variant={importance === option ? 'default' : 'outline'}
                        onClick={() => setImportance(criterion, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <p className="mb-1 text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
          Are there characteristics that are usually deal-breakers?
        </p>
        <p className="mb-3 text-sm text-muted-foreground">Optional.</p>
        <div className="flex flex-wrap gap-3">
          {DEAL_BREAKERS.map((item) => (
            <ToggleChip
              key={item}
              label={item}
              checked={form.dealbreakers.includes(item)}
              onChange={() => toggleDealbreaker(item)}
            />
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-dashed border-hairline p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an investment criteria document? You'll be able to upload
          it later — this step is optional.
        </p>
      </div>
    </div>
  )
}
