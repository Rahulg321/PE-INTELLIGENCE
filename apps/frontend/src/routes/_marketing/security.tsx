import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { SecurityGrid } from '~/components/marketing/SecurityGrid'
import { Callout } from '~/components/marketing/Callout'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { certifications } from '~/content/security'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/security')({
  component: Security,
  head: () => ({
    ...seo({
      title: 'Security — Built for sensitive investment information',
      description:
        'Encryption, tenant isolation, role-based access, document permissions, audit trails, and AI data handling \u2014 designed for firms handling extremely sensitive deal information.',
      canonical: '/security',
    }),
  }),
})

function Security() {
  return (
    <>
      <PageHero
        kicker="Security"
        title="Built for sensitive investment information."
        description="Investment organizations deal with extremely sensitive material. The platform is designed around encryption, isolation, permissions, audit, and responsible AI data handling from the ground up."
      >
        <div className="flex flex-wrap gap-4">
          <Cta
            event="demo_requested"
            page="/security"
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
          kicker="Controls"
          title="Security across every layer."
          description="Each control is designed for the way investment firms actually work — sensitive deals, external advisers, and documents that must not leak."
        />
        <div className="mt-10">
          <SecurityGrid />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <Callout title="AI data handling">
            <p className="text-[15px] leading-[1.55]">
              AI processing is scoped to the firm&rsquo;s own data, respects
              document permissions, and is never used to train models shared
              across customers. What the AI sees is governed by the same access
              controls as the team.
            </p>
          </Callout>
        </div>
      </Section>

      <Section tone="parchment">
        <SectionHeader
          kicker="Certifications"
          title="Honest about where we stand."
          description={certifications.statement}
        />
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {[
            {
              title: 'SOC 2',
              copy: 'Status will be published here when the assessment is completed.',
            },
            {
              title: 'ISO 27001',
              copy: 'Status will be published here when the assessment is completed.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-lg border border-hairline bg-canvas p-6"
            >
              <h3 className="text-[15px] font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink-muted-80">
                {c.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
