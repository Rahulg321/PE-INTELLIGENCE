import { cn } from '~/lib/utils'

/** Browser-frame wrapper for product UI mockups. */
export function ProductMockup({
  url = 'app.yourfirm.com',
  children,
  className,
}: {
  url?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-hairline bg-canvas text-left shadow-product',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-hairline bg-parchment px-3 py-2">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-chip" />
          <span className="h-2.5 w-2.5 rounded-full bg-chip" />
          <span className="h-2.5 w-2.5 rounded-full bg-chip" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-[6px] bg-surface-pearl px-3 py-1 text-[11px] text-ink-muted-48">
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}
