import { MockBar, MockChip, MockLabel } from './primitives'

/** Screening surface: criteria fit, flags, and an advance/pass decision. */
export function ScreeningMockup() {
  const criteria = [
    {
      label: 'Financial fit',
      value: 82,
      chip: 'Strong',
      tone: 'success' as const,
    },
    { label: 'Market fit', value: 64, chip: 'Moderate', tone: 'warn' as const },
    {
      label: 'Business quality',
      value: 90,
      chip: 'Strong',
      tone: 'success' as const,
    },
    {
      label: 'Strategic fit',
      value: 55,
      chip: 'Unknown',
      tone: 'neutral' as const,
    },
  ]
  return (
    <div className="grid gap-4 bg-canvas p-4 text-left sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-[8px] border border-hairline p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-ink">
            Meridian Logistics Group
          </h3>
          <MockChip tone="primary">In screening</MockChip>
        </div>
        <MockLabel>Fit against firm criteria</MockLabel>
        <div className="flex flex-col gap-3">
          {criteria.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[11px] text-ink-muted-80">{c.label}</span>
                <MockChip tone={c.tone}>{c.chip}</MockChip>
              </div>
              <MockBar value={c.value} />
            </div>
          ))}
        </div>
        <div className="mt-1 rounded-[6px] border border-hairline bg-parchment/60 p-2.5 text-[11px] leading-[1.45] text-ink-muted-80">
          Fits financial and quality thresholds. Strategic fit is incomplete —
          ownership structure and geography still to be confirmed.
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[8px] border border-hairline p-4">
        <MockLabel>Flags</MockLabel>
        {[
          {
            label: 'Customer concentration',
            note: 'Top 5 customers = 54% of revenue',
            tone: 'warn' as const,
          },
          {
            label: 'Owner transition',
            note: 'Founder seeking full exit',
            tone: 'neutral' as const,
          },
          {
            label: 'Recurring revenue',
            note: 'Only 28% contracted',
            tone: 'danger' as const,
          },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-[6px] border border-hairline p-2.5"
          >
            <div className="flex items-center gap-2">
              <MockChip tone={f.tone}>
                {f.tone === 'warn'
                  ? 'Red flag'
                  : f.tone === 'danger'
                    ? 'Red flag'
                    : 'Unknown'}
              </MockChip>
              <span className="text-[12px] font-medium text-ink">
                {f.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-[1.45] text-ink-muted-80">
              {f.note}
            </p>
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2 border-t border-hairline pt-3">
          <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white">
            Advance to underwriting
          </span>
          <span className="text-[11px] text-ink-muted-48">
            after 2 open questions resolved
          </span>
        </div>
      </div>
    </div>
  )
}
