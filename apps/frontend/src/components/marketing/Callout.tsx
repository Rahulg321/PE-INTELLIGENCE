import { cn } from '~/lib/utils'

export function Callout({
  title,
  children,
  dark = false,
  className,
}: {
  title?: string
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <aside
      className={cn(
        'rounded-lg border p-6',
        dark
          ? 'border-white/10 bg-white/[0.03] text-body-muted'
          : 'border-hairline bg-parchment text-ink-muted-80',
        className,
      )}
    >
      {title ? (
        <p className={cn('font-semibold', dark ? 'text-white' : 'text-ink')}>
          {title}
        </p>
      ) : null}
      <div className={cn('mt-2 text-[15px] leading-[1.5]', title ? '' : '')}>
        {children}
      </div>
    </aside>
  )
}
