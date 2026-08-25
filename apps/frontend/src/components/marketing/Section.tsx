import { cn } from '~/lib/utils'

export type SectionTone = 'light' | 'parchment' | 'dark' | 'deep'

const toneClasses = {
  light: 'bg-canvas text-ink',
  parchment: 'bg-parchment text-ink',
  dark: 'bg-tile-1 text-white',
  deep: 'bg-ink-deep text-white',
} satisfies Record<SectionTone, string>

interface SectionProps {
  id?: string
  tone?: SectionTone
  className?: string
  children: React.ReactNode
}

export function Section({
  id,
  tone = 'light',
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('px-6 py-20 sm:py-24', toneClasses[tone], className)}
    >
      <div className="marketing-container">{children}</div>
    </section>
  )
}
