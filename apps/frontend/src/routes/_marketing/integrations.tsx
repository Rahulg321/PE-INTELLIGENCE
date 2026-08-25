import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { IntegrationGrid } from '~/components/marketing/IntegrationGrid'
import { Callout } from '~/components/marketing/Callout'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { WorkflowTimeline } from '~/components/marketing/WorkflowTimeline'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/integrations')({
  component: Integrations,
  head: () => ({
    ...seo({
      title: 'Integrations — Your investment stack should work together',
      description:
        'Connect CRM, email, cloud storage, data rooms, financial systems, market data, research, communication, and spreadsheets. Your existing systems become inputs.',
      canonical: '/integrations',
    }),
  }),
})

function Integrations() {
  return (
    <>
      <PageHero
        kicker="Integrations"
        title="Your investment stack should work together."
        description="You should not have to replace everything you already use. The platform connects to your existing systems and turns them into inputs — no forced migration."
      >
        <div className="flex flex-wrap gap-4">
          <Cta
            event="demo_requested"
            page="/integrations"
            section="hero"
            source="page-hero"
            location="above-fold"
            label="Request a Demo"
            to="/contact"
          />
        </div>
      </PageHero>

      <Section tone="parchment">
        <SectionHeader
          kicker="Architecture"
          title="From existing systems to one intelligence layer."
          description="Connectors bring data in, normalization makes it consistent, and one unified data model feeds the AI and workflow engine your team works in."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <WorkflowTimeline
            steps={[
              'Existing systems',
              'Connectors',
              'Normalization',
              'Unified data model',
              'AI / workflow engine',
              'Investment team',
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeader
          kicker="Categories"
          title="Built around your existing stack."
          description="Statuses are reported honestly — nothing is listed as available until it actually ships."
        />
        <div className="mt-10">
          <IntegrationGrid />
        </div>
      </Section>

      <Section tone="parchment">
        <div className="mx-auto max-w-2xl text-center">
          <Callout>
            <p className="text-[15px] leading-[1.55]">
              <span className="font-semibold text-ink">
                Your existing systems become inputs.
              </span>{' '}
              You do not need to migrate your CRM into the platform to get value
              from it. The platform reads from what you already use, and the
              intelligence layer sits on top.
            </p>
          </Callout>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
