import { securityControls } from '~/content/security'
import { cn } from '~/lib/utils'

export function SecurityGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6',
        className,
      )}
    >
      {securityControls.map((item) => (
        <div
          key={item.slug}
          className="flex flex-col gap-2 rounded-lg border border-hairline bg-canvas p-6"
        >
          <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
          <p className="text-[14px] leading-[1.5] text-ink-muted-80">
            {item.copy}
          </p>
        </div>
      ))}
    </div>
  )
}
