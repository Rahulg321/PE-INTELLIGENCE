import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { LifecycleDiagram } from '~/components/marketing/LifecycleDiagram'
import { WorkflowTimeline } from '~/components/marketing/WorkflowTimeline'
import { FinalCta } from '~/components/marketing/FinalCta'
import { workflows } from '~/content/workflows'
import { lifecycle } from '~/content/lifecycle'
import { Reveal } from '~/components/marketing/Reveal'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/')({
  component: WorkflowsHub,
  head: () => ({
    ...seo({
      title:
        'Investment Workflows — Built around the way investment teams work',
      description:
        'Origination, screening, underwriting, diligence, IC, transaction, portfolio, and exit \u2014 a configurable investment lifecycle, each stage supported by the platform.',
      canonical: '/workflows',
    }),
  }),
})

function WorkflowsHub() {
  return (
    <>
      <PageHero
        kicker="Workflows"
        title="Built around the way investment teams actually work."
        description="Not every firm runs the same process — so the lifecycle is configurable. Each stage below is a structured workflow with its own capabilities, and every one is optional, adjustable, or skippable."
      />

      <Section>
        <SectionHeader
          align="left"
          kicker="The lifecycle"
          title="From source to exit, in one connected system."
        />
        <div className="mt-8">
          <WorkflowTimeline
            steps={[
              'Source',
              'Screen',
              'Underwrite',
              'Diligence',
              'IC',
              'Transact',
              'Operate',
              'Exit',
            ]}
          />
        </div>
      </Section>

      <Section tone="parchment">
        <SectionHeader
          kicker="Stages"
          title="Explore each stage of the investment lifecycle."
        />
        <Reveal className="mt-12">
          <LifecycleDiagram />
        </Reveal>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-[1.55] text-ink-muted-48">
          {workflows.length} primary workflow stages, each with its own
          capabilities. Select a stage to see how the platform supports the
          work.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[13px] leading-[1.5] text-ink-muted-48">
          The exit stage reuses the portfolio record — the full investment
          history supports the exit, and what was learned becomes institutional
          memory.
        </p>
      </Section>

      <Section>
        <SectionHeader
          kicker="Where does it fit?"
          title="A configurable lifecycle, not a rigid process."
          description={lifecycle[0].summary}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Configure around your firm',
              copy: 'Encode criteria, process, and requirements the way your firm invests.',
            },
            {
              title: 'Use the stages you need',
              copy: 'Independent sponsors and small teams may compress stages; large firms keep them distinct.',
            },
            {
              title: 'Every stage carries context',
              copy: 'Nothing is re-entered between stages. The record flows forward.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-lg border border-hairline bg-canvas p-6"
            >
              <h3 className="text-[17px] font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.5] text-ink-muted-80">
                {c.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="parchment">
        <SectionHeader
          align="left"
          kicker="The stages"
          title="What each stage does"
          description="Every stage is a structured workflow with its own capabilities \u2014 and each one flows into the next."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {workflows.map((w) => (
            <div
              key={w.slug}
              className="rounded-lg border border-hairline bg-canvas p-6"
            >
              <h3 className="text-[17px] font-semibold text-ink">
                {w.label}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.5] text-ink-muted-80">
                {w.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
