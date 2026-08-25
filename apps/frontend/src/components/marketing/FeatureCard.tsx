import { cn } from '~/lib/utils'

export interface FeatureCardData {
  title: string
  copy: string
  eyebrow?: string
}

type FeatureCardTone = 'light' | 'dark'

export function FeatureCard({
  title,
  copy,
  eyebrow,
  tone = 'light',
}: FeatureCardData & { tone?: FeatureCardTone }) {
  const dark = tone === 'dark'
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-6',
        dark ? 'border-white/10 bg-white/[0.02]' : 'border-hairline bg-canvas',
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.12em]',
            dark ? 'text-primary-on-dark' : 'text-primary',
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h3
        className={cn(
          'text-[17px] font-semibold leading-[1.24]',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'text-[15px] leading-[1.5]',
          dark ? 'text-body-muted' : 'text-ink-muted-80',
        )}
      >
        {copy}
      </p>
    </div>
  )
}
