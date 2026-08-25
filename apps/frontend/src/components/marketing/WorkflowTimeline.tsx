import { cn } from '~/lib/utils'

/**
 * A labelled flow of steps connected by arrows. Horizontal on desktop, stacked
 * with downward arrows on mobile. Used for "how it works" pipelines.
 */
export function WorkflowTimeline({
  steps,
  className,
}: {
  steps: string[]
  className?: string
}) {
  return (
    <ol
      className={cn(
        'flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3',
        className,
      )}
    >
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <span className="rounded-[8px] border border-hairline bg-canvas px-3.5 py-2.5 text-[13px] font-medium text-ink">
              {step}
            </span>
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
