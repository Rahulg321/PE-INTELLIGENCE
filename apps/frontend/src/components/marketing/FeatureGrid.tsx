import { cn } from '~/lib/utils'
import { FeatureCard, type FeatureCardData } from './FeatureCard'

export function FeatureGrid({
  features,
  columns = 3,
  dark = false,
  className,
}: {
  features: FeatureCardData[]
  columns?: 2 | 3 | 4
  dark?: boolean
  className?: string
}) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }
  return (
    <div className={cn('grid gap-4 sm:gap-6', cols[columns], className)}>
      {features.map((f) => (
        <FeatureCard key={f.title} title={f.title} copy={f.copy} dark={dark} />
      ))}
    </div>
  )
}
