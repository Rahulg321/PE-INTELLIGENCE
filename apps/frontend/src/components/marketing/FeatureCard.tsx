import { cn } from '~/lib/utils'

export interface FeatureCardData {
  title: string
  copy: string
  icon?: string
}

export function FeatureCard({
  title,
  copy,
  icon,
  dark = false,
}: {
  title: string
  copy: string
  icon?: string
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-6',
        dark ? 'border-white/10 bg-white/[0.02]' : 'border-hairline bg-canvas',
      )}
    >
      {icon ? (
        <span
          className={cn(
            'text-[13px] font-semibold',
            dark ? 'text-primary-on-dark' : 'text-primary',
          )}
        >
          {icon}
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
