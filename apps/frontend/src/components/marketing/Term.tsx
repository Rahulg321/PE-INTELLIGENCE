import { cn } from '~/lib/utils'

/**
 * Inline glossary term. Renders the acronym with a definition in a tooltip via
 * native `title`, plus a visible definition on small screens where tooltips are
 * unreliable. For example: IC (Investment Committee).
 */
export function Term({
  abbr,
  full,
  className,
}: {
  abbr: string
  full: string
  className?: string
}) {
  return (
    <abbr
      title={full}
      className={cn(
        'cursor-help border-b border-dotted border-ink-muted-48 no-underline',
        className,
      )}
    >
      {abbr}
    </abbr>
  )
}
