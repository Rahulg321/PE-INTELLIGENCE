import type { FaqItem } from '~/content/faq'
import { cn } from '~/lib/utils'

/** Accessible FAQ accordion using native `<details>`. No JavaScript required. */
export function Faq({
  items,
  className,
}: {
  items: FaqItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'mx-auto max-w-3xl divide-y divide-hairline rounded-lg border border-hairline bg-canvas',
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.question} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-ink-muted-48 transition-transform duration-200 group-open:rotate-45"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M8 2v12M2 8h12" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.55] text-ink-muted-80">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
