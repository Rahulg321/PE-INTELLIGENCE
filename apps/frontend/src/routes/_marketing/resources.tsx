import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { ResourceCard } from '~/components/marketing/ResourceCard'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { resourceCategories, resources } from '~/content/resources'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/resources')({
  component: Resources,
  head: () => ({
    ...seo({
      title: 'Resources — Frameworks for investment teams',
      description:
        'Investment strategy, deal sourcing, screening, underwriting, due diligence, IC, AI in investing, portfolio management, and M&A \u2014 practical frameworks for investment teams.',
      canonical: '/resources',
    }),
  }),
})

function Resources() {
  return (
    <>
      <PageHero
        kicker="Resources"
        title="Frameworks for investment teams."
        description="Practical, structured frameworks for the work investment teams actually do — from screening to diligence to the IC memo to institutional memory."
      >
        <Cta
          event="demo_requested"
          page="/resources"
          section="hero"
          source="page-hero"
          location="above-fold"
          label="Request a Demo"
          to="/contact"
        />
      </PageHero>

      <Section tone="parchment">
        <SectionHeader
          align="left"
          kicker="Topics"
          title="Browse by category"
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {resourceCategories.map((cat) => (
            <span
              key={cat.slug}
              className="rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-[13px] text-ink-muted-80"
            >
              {cat.title}
            </span>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          align="left"
          kicker="Library"
          title="Frameworks in the works"
          description="These frameworks are being written. Sign up for a demo to join the waitlist and be notified when they are published."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
