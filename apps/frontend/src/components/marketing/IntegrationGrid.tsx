import {
  integrationCategories,
  type IntegrationStatus,
} from '~/content/integrations'
import { cn } from '~/lib/utils'

const statusLabel = {
  available: 'Available',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
} satisfies Record<IntegrationStatus, string>

const statusClasses = {
  available: 'bg-primary/10 text-primary',
  beta: 'bg-warn/10 text-warn',
  'coming-soon': 'bg-parchment text-ink-muted-48',
} satisfies Record<IntegrationStatus, string>

export function IntegrationGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6',
        className,
      )}
    >
      {integrationCategories.map((cat) => (
        <div
          key={cat.slug}
          className="flex flex-col gap-3 rounded-lg border border-hairline bg-canvas p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[17px] font-semibold text-ink">{cat.title}</h3>
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                statusClasses[cat.status],
              )}
            >
              {statusLabel[cat.status]}
            </span>
          </div>
          <p className="text-[14px] leading-[1.5] text-ink-muted-80">
            {cat.copy}
          </p>
          <p className="mt-auto pt-2 text-[12px] leading-[1.5] text-ink-muted-48">
            {cat.examples.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}
