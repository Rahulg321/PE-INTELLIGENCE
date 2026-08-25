import { cn } from '~/lib/utils'

export function MockLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'text-[10px] font-medium uppercase tracking-[0.08em] text-ink-muted-48',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function MockChip({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'primary' | 'success' | 'warn' | 'danger'
  className?: string
}) {
  const tones = {
    neutral: 'bg-parchment text-ink-muted-48',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warn: 'bg-warn/10 text-warn',
    danger: 'bg-danger/10 text-danger',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function MockStat({
  label,
  value,
  delta,
  deltaTone = 'neutral',
}: {
  label: string
  value: string
  delta?: string
  deltaTone?: 'neutral' | 'success' | 'danger'
}) {
  const deltaClasses = {
    neutral: 'text-ink-muted-48',
    success: 'text-success',
    danger: 'text-danger',
  }
  return (
    <div className="flex flex-col gap-1 rounded-[8px] border border-hairline bg-canvas p-3">
      <MockLabel>{label}</MockLabel>
      <span className="text-[15px] font-semibold tabular-nums text-ink">
        {value}
      </span>
      {delta ? (
        <span
          className={cn(
            'text-[11px] font-medium tabular-nums',
            deltaClasses[deltaTone],
          )}
        >
          {delta}
        </span>
      ) : null}
    </div>
  )
}

export function MockBar({
  value,
  tone = 'primary',
}: {
  value: number
  tone?: 'primary' | 'muted'
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-parchment">
      <div
        className={cn(
          'h-full rounded-full',
          tone === 'primary' ? 'bg-primary' : 'bg-chip',
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
