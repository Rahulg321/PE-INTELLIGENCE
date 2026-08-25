import { Link } from '@tanstack/react-router'
import { lifecycle, type LifecycleItem } from '~/content/lifecycle'
import { cn } from '~/lib/utils'

interface LifecycleDiagramProps {
  stages?: readonly LifecycleItem[]
  /** Highlight one stage, e.g. on its detail page */
  activeSlug?: string
  /** Which stage label is displayed as primary */
  showNumbered?: boolean
  className?: string
}

/**
 * The eight-stage investment lifecycle. Horizontal connected flow on desktop,
 * vertical timeline on mobile. Each stage is clickable.
 */
export function LifecycleDiagram({
  stages = lifecycle,
  activeSlug,
  showNumbered = true,
  className,
}: LifecycleDiagramProps) {
  return (
    <div className={className}>
      {/* Desktop: horizontal connected row */}
      <ol className="hidden flex-wrap items-stretch gap-4 lg:flex">
        {stages.map((stage, i) => {
          const active = stage.slug === activeSlug
          return (
            <li key={stage.slug} className="flex flex-1 items-stretch gap-4">
              <Link
                to={stage.href}
                aria-label={`${stage.title} workflow`}
                className={cn(
                  'group flex flex-1 flex-col justify-between gap-3 rounded-lg border p-5 transition',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-hairline bg-canvas hover:border-primary-focus/40',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  {showNumbered ? (
                    <span
                      className={cn(
                        'text-[11px] font-semibold tabular-nums',
                        active ? 'text-primary' : 'text-ink-muted-48',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ) : null}
                  <span className="text-[10px] text-ink-muted-48">{'→'}</span>
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-[15px] font-semibold leading-tight',
                      active ? 'text-primary' : 'text-ink',
                    )}
                  >
                    {stage.shortLabel}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-[1.45] text-ink-muted-48">
                    {stage.tagline}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      {/* Mobile / tablet: vertical timeline */}
      <ol className="lg:hidden">
        {stages.map((stage, i) => {
          const active = stage.slug === activeSlug
          const last = i === stages.length - 1
          return (
            <li key={stage.slug} className="relative flex gap-4 pb-4">
              {!last ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px bg-hairline"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 mt-1 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums',
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-hairline bg-canvas text-ink-muted-48',
                )}
              >
                {i + 1}
              </span>
              <Link
                to={stage.href}
                className={cn(
                  'flex-1 rounded-lg border p-4 transition',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-hairline bg-canvas',
                )}
              >
                <span className="text-[15px] font-semibold text-ink">
                  {stage.shortLabel}
                </span>
                <span className="mt-1 block text-[12px] leading-[1.45] text-ink-muted-48">
                  {stage.tagline}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
