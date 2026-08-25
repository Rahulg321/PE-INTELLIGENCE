import { cn } from '~/lib/utils'
import { Kicker } from './Kicker'

interface PageHeroProps {
  kicker?: string
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  dark?: boolean
}

/** Inner-page hero: breadcrumb-style kicker + headline + lead + optional CTA. */
export function PageHero({
  kicker,
  title,
  description,
  children,
  className,
  dark = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'px-6 pt-20 pb-14 sm:pt-24 sm:pb-16',
        dark ? 'bg-ink-deep text-white' : 'bg-canvas text-ink',
        className,
      )}
    >
      <div className="marketing-container">
        <div className="max-w-3xl">
          {kicker ? (
            <div
              className={cn(
                dark &&
                  '[&_.kicker]:text-body-muted [&_.kicker::before]:bg-body-muted',
              )}
            >
              <Kicker>{kicker}</Kicker>
            </div>
          ) : null}
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] tracking-[-0.28px] sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'mt-6 max-w-2xl text-lg leading-[1.45] sm:text-xl',
                dark ? 'text-body-muted' : 'text-ink-muted-48',
              )}
            >
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
