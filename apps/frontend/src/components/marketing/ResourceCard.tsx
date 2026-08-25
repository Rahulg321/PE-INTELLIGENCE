import type { Resource } from '~/content/resources'
import { resourceCategories } from '~/content/resources'
import { cn } from '~/lib/utils'

export function ResourceCard({ resource }: { resource: Resource }) {
  const category = resourceCategories.find((c) => c.slug === resource.category)
  const isComingSoon = resource.status === 'coming-soon'

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-6',
        isComingSoon
          ? 'border-hairline bg-parchment/60'
          : 'border-hairline bg-canvas',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted-48">
          {category?.title ?? resource.category}
        </span>
        {isComingSoon ? (
          <span className="rounded-full bg-parchment px-2 py-0.5 text-[10px] font-semibold text-ink-muted-48">
            Coming soon
          </span>
        ) : null}
      </div>
      <h3 className="text-[16px] font-semibold leading-snug text-ink">
        {resource.title}
      </h3>
      <p className="text-[14px] leading-[1.5] text-ink-muted-80">
        {resource.summary}
      </p>
    </article>
  )
}
