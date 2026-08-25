import { cn } from '~/lib/utils'
import { Kicker } from './Kicker'

interface SectionHeaderProps {
  kicker?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = 'center',
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center'
          ? 'items-center text-center'
          : 'items-start text-left',
        className,
      )}
    >
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h2
        className={cn(
          'max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-lg leading-[1.4] sm:text-xl',
            dark ? 'text-body-muted' : 'text-ink-muted-48',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
