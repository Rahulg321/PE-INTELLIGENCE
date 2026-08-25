import { cn } from '~/lib/utils'

export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn('kicker', className)}>{children}</span>
}
