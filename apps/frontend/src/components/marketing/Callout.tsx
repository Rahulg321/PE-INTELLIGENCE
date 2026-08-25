import { cn } from '~/lib/utils'

type CalloutTone = 'light' | 'dark'

export function Callout({
  title,
  children,
  tone = 'light',
  className,
}: {
  title?: string
  children: React.ReactNode
  tone?: CalloutTone
  className?: string
}) {
  const dark = tone === 'dark'
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
      <div className="mt-2 text-[15px] leading-[1.5]">{children}</div>
    </aside>
  )
}
