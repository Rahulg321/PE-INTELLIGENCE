import { cn } from '~/lib/utils'

/**
 * Temporary brand mark. Three ascending bars — a lightweight symbol for data
 * becoming intelligence. Replace with the final logo by editing this component
 * only.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-6 w-6', className)}
      aria-hidden="true"
      fill="currentColor"
    >
      <rect x="9" y="5" width="14" height="4" rx="2" />
      <rect x="5" y="13" width="22" height="4" rx="2" opacity="0.62" />
      <rect x="2" y="21" width="28" height="4" rx="2" opacity="0.35" />
    </svg>
  )
}
