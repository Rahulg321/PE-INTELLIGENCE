import { useLocation } from '@tanstack/react-router'
import { Cta } from './Cta'
import { cn } from '~/lib/utils'

interface FinalCtaProps {
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  dark?: boolean
  className?: string
}

export function FinalCta({
  title = 'See what your investment workflow could look like.',
  description = 'Connect your data, workflows, and investment knowledge in one intelligent layer. Request a demo to see the platform around your firm\u2019s process.',
  primaryLabel = 'Request a Demo',
  secondaryLabel = 'Explore the platform',
  dark = true,
  className,
}: FinalCtaProps) {
  const pathname = useLocation({ select: (s) => s.pathname })
  return (
    <section
      className={cn(
        'px-6 py-20 sm:py-28',
        dark ? 'bg-ink-deep text-white' : 'bg-parchment text-ink',
        className,
      )}
    >
      <div className="marketing-container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl">
            {title}
          </h2>
          <p
            className={cn(
              'max-w-2xl text-lg leading-[1.45]',
              dark ? 'text-body-muted' : 'text-ink-muted-48',
            )}
          >
            {description}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Cta
              event="demo_requested"
              page={pathname}
              section="final-cta"
              source="final-cta"
              location="closing"
              label={primaryLabel}
              to="/contact"
              size="lg"
            />
            <Cta
              event="product_viewed"
              page={pathname}
              section="final-cta"
              source="final-cta"
              location="closing"
              label={secondaryLabel}
              to="/product"
              variant={dark ? 'link' : 'ghost'}
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
