import { useLocation } from '@tanstack/react-router'
import { brand } from '~/lib/brand'
import { audienceChips } from '~/content/site'
import { Cta } from './Cta'
import { ProductMockup } from '~/components/mockups/ProductMockup'
import { DealIntelMockup } from '~/components/mockups/DealIntelMockup'

export function Hero() {
  const pathname = useLocation({ select: (s) => s.pathname })

  return (
    <section className="bg-canvas px-6 pb-20 pt-16 text-center sm:pt-24">
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

        <div className="mx-auto mt-16 max-w-5xl">
          <ProductMockup url={`app.${brand.domain}`}>
            <DealIntelMockup />
          </ProductMockup>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-2">
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
    </section>
  )
}
