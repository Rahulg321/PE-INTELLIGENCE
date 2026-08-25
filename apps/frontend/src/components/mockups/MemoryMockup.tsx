import { MockChip, MockLabel } from './primitives'

/** Institutional memory surface: decision → evidence → outcome compounding. */
export function MemoryMockup() {
  return (
    <div className="flex flex-col gap-3 bg-canvas p-4 text-left sm:flex-row sm:items-stretch">
      <div className="flex-1 rounded-[8px] border border-hairline p-4">
        <div className="flex items-center justify-between gap-2">
          <MockLabel>Deal #1 · 2024</MockLabel>
          <MockChip>Not pursued</MockChip>
        </div>
        <p className="mt-2 text-[12px] leading-[1.5] text-ink-muted-80">
          <span className="font-semibold text-ink">Decision:</span> passed on a
          services business with 38% customer concentration.
        </p>
        <div className="mt-2 flex flex-col gap-1 text-[11px] text-ink-muted-48">
          <span>· Evidence: top-5 = 62% of revenue</span>
          <span>· Outcome: buyer took 30% multiple, later flagged churn</span>
        </div>
      </div>

      <div className="flex items-center justify-center text-ink-muted-48">
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4 rotate-90 sm:rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </div>

      <div className="flex-1 rounded-[8px] border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-2">
          <MockLabel>Deal #2 · 2025</MockLabel>
          <MockChip tone="primary">Informed by Deal #1</MockChip>
        </div>
        <p className="mt-2 text-[12px] leading-[1.5] text-ink-muted-80">
          <span className="font-semibold text-primary">Decision:</span>{' '}
          concentration threshold raised to 50% max for the top customer;
          flagged earlier in screening.
        </p>
        <div className="mt-2 flex flex-col gap-1 text-[11px] text-ink-muted-48">
          <span>· Rule updated in firm criteria</span>
          <span>· Applied automatically to every new opportunity</span>
        </div>
      </div>
    </div>
  )
}
