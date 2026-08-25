import { useLocation } from '@tanstack/react-router'
import { brand } from '~/lib/brand'
import { audienceChips } from '~/content/site'
import { Cta } from './Cta'
import { ProductMockup } from '~/components/mockups/ProductMockup'
import { DealIntelMockup } from '~/components/mockups/DealIntelMockup'

const heroStats = [
  { label: 'LTM revenue', value: '$48.2M' },
  { label: 'LTM EBITDA', value: '$9.4M' },
  { label: 'EBITDA margin', value: '19.5%' },
  { label: 'Revenue growth', value: '+11.4% YoY' },
]

export function Hero() {
  const pathname = useLocation({ select: (s) => s.pathname })

  return (
    <section className="relative bg-canvas px-6 pb-20 pt-16 text-center sm:pt-24">
      <div className="marketing-container">
        <div className="mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-hairline bg-parchment px-3.5 py-1.5 text-[12px] font-medium text-ink-muted-80">
            AI-native investment intelligence &amp; workflow infrastructure
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.28px] sm:text-6xl">
            {brand.tagline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-[1.45] text-ink-muted-48 sm:text-xl">
            Connect your firm&rsquo;s data, workflows, and investment knowledge
            in one intelligent platform.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Cta
              event="hero_cta_clicked"
              page={pathname}
              section="hero"
              source="hero"
              location="above-fold"
              label="Request a Demo"
              to="/contact"
              size="lg"
            />
            <Cta
              event="product_viewed"
              page={pathname}
              section="hero"
              source="hero"
              location="above-fold"
              label="Explore the Platform"
              to="/product"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>

        {/* Institutional data ribbon */}
        <dl className="mx-auto mt-14 max-w-5xl border-y border-hairline bg-surface-pearl">
          <div className="data-ribbon">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 border-l border-hairline px-4 py-4 text-left first:border-l-0 sm:px-6 sm:py-5"
              >
                <dt className="text-[10px] uppercase tracking-[0.14em] text-ink-muted-48">
                  {stat.label}
                </dt>
                <dd className="text-[16px] font-semibold tabular-nums text-ink sm:text-[18px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </div>
        </dl>

        {/* Product proof on an "intelligence layer" grid */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div
            aria-hidden="true"
            className="hairline-grid absolute -inset-x-6 -top-10 bottom-6 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] sm:-inset-x-12"
          />
          <div className="relative">
            <ProductMockup url={`app.${brand.domain}`}>
              <DealIntelMockup />
            </ProductMockup>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted-48">
            Built for modern investment teams
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {audienceChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-hairline bg-surface-pearl px-3.5 py-1.5 text-[12px] font-medium text-ink-muted-48"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
