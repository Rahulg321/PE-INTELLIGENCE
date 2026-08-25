export interface EvidenceStep {
  label: string
  detail?: string
}

/**
 * The evidence trace: conclusion → evidence → source → document → page.
 * The core trust mechanism of the product, visualized.
 */
export function EvidenceTrace({ steps }: { steps?: EvidenceStep[] }) {
  const defaultSteps: EvidenceStep[] = [
    { label: 'Conclusion' },
    { label: 'Evidence' },
    { label: 'Source' },
    { label: 'Document' },
    { label: 'Page / section' },
  ]
  const items = steps ?? defaultSteps

  return (
    <ol className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      {items.map((step, i) => {
        const last = i === items.length - 1
        return (
          <li key={step.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col gap-1 rounded-[8px] border border-hairline bg-canvas px-3.5 py-2.5">
              <span className="text-[11px] font-semibold text-primary">
                {step.label}
              </span>
              {step.detail ? (
                <span className="text-[12px] text-ink-muted-80">
                  {step.detail}
                </span>
              ) : null}
            </div>
            {!last ? (
              <span aria-hidden="true" className="text-ink-muted-48">
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 rotate-90 sm:rotate-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
