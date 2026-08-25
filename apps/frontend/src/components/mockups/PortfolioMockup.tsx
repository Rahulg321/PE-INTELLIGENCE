import { MockChip, MockLabel } from './primitives'

/** Portfolio surface: underwritten case vs actual performance. */
export function PortfolioMockup() {
  const series = [
    { label: 'Revenue', underwritten: 52, actual: 57 },
    { label: 'EBITDA', underwritten: 11, actual: 12.4 },
    { label: 'Margin', underwritten: 21, actual: 21.8 },
  ]
  return (
    <div className="bg-canvas p-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">
            Union Industrial · Year 2
          </h3>
          <p className="mt-0.5 text-[11px] text-ink-muted-48">
            Acquired 03/2025 · underwriting memo v3 as baseline
          </p>
        </div>
        <div className="flex gap-1.5">
          <MockChip tone="success">Tracking to plan</MockChip>
          <MockChip>Covenant headroom 1.9x</MockChip>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {series.map((s) => (
          <div
            key={s.label}
            className="rounded-[8px] border border-hairline p-3"
          >
            <MockLabel>{s.label}</MockLabel>
            <div className="mt-2 flex items-end gap-4">
              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-semibold tabular-nums text-ink-muted-48">
                  {s.underwritten}M
                </span>
                <div className="flex h-16 w-8 items-end rounded-t-[4px] bg-chip/70">
                  <div
                    className="w-full rounded-t-[4px] bg-ink-muted-48"
                    style={{
                      height: `${(s.underwritten / Math.max(s.underwritten, s.actual)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-ink-muted-48">
                  Underwritten
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-semibold tabular-nums text-success">
                  {s.actual}M
                </span>
                <div className="flex h-16 w-8 items-end rounded-t-[4px] bg-primary/20">
                  <div
                    className="w-full rounded-t-[4px] bg-primary"
                    style={{
                      height: `${(s.actual / Math.max(s.underwritten, s.actual)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-ink-muted-48">Actual</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[8px] border border-hairline bg-parchment/50 p-3 text-[11px] leading-[1.5] text-ink-muted-80">
        <span className="font-semibold text-ink">Variance notes:</span> revenue
        +9% vs underwritten on 2 new contracts · margin +80bps from renegotiated
        freight · add-on #2 in diligence under the same playbook.
      </div>
    </div>
  )
}
