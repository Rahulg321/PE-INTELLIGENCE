import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '~/components/marketing/Hero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { LifecycleDiagram } from '~/components/marketing/LifecycleDiagram'
import { FeatureCard } from '~/components/marketing/FeatureCard'
import { ComparisonTable } from '~/components/marketing/ComparisonTable'
import { WorkflowTimeline } from '~/components/marketing/WorkflowTimeline'
import { Callout } from '~/components/marketing/Callout'
import { EvidenceTrace } from '~/components/marketing/EvidenceTrace'
import { Faq } from '~/components/marketing/Faq'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { Kicker } from '~/components/marketing/Kicker'
import { Reveal } from '~/components/marketing/Reveal'
import { ProductMockup } from '~/components/mockups/ProductMockup'
import { AgentsMockup } from '~/components/mockups/AgentsMockup'
import { MemoryMockup } from '~/components/mockups/MemoryMockup'
import { productSurfaces } from '~/content/productSurfaces'
import { faqItems } from '~/content/faq'
import { faqLdJson, seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/')({
  component: Home,
  head: () => {
    const page = seo({
      title: '[COMPANY NAME] — AI-native infrastructure for investment teams',
      description:
        'An AI-native investment intelligence and workflow platform that connects your firm\u2019s data, workflows, and investment knowledge in one intelligent layer across the deal lifecycle.',
      canonical: '/',
    })
    return {
      ...page,
      scripts: [...page.scripts, ...faqLdJson(faqItems)],
    }
  },
})

function Home() {
  return (
    <>
      <Hero />

      <ProblemSection />

      <LifecycleSection />

      <SurfacesSection />

      <AiSection />

      <MemorySection />

      <ConfigurableSection />

      <ComparisonSection />

      <FaqSection />

      <FinalCta />
    </>
  )
}

const fragmentedSystems = [
  'CRM',
  'Email',
  'Excel',
  'PDFs',
  'Data Rooms',
  'Research',
  'Financials',
  'Notes',
  'Internal Knowledge',
]

function ProblemSection() {
  return (
    <Section tone="parchment">
      <SectionHeader
        kicker="The problem"
        title="Investment decisions are built across fragmented systems."
        description="The information behind every decision lives in a dozen places. Turning it into a decision means manual assembly, research, copying, analysis, memo writing, and answering the same questions twice."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <p className="text-[14px] font-semibold text-ink-muted-48">
              Information lives in:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {fragmentedSystems.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-[13px] text-ink-muted-80"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-hairline bg-canvas p-5">
              <p className="text-[15px] font-semibold text-ink">
                Then an analyst:
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-[14px] text-ink-muted-80 sm:grid-cols-2">
                {[
                  'Manually assembles information',
                  'Researches from scratch',
                  'Copies data between tools',
                  'Builds analysis by hand',
                  'Writes the memo',
                  'Answers the same questions',
                ].map((step) => (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-chip"
                    />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <p className="text-[14px] font-semibold text-ink-muted-48">
              With the platform:
            </p>
            <WorkflowTimeline
              steps={['Connected data', 'Intelligence', 'Workflow', 'Decision']}
              className="mt-4"
            />
            <p className="mt-6 text-[15px] leading-[1.55] text-ink-muted-80">
              The platform connects those systems, understands the investment
              context, and turns information into workflow — so the analyst
              works with intelligence instead of assembling it.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function LifecycleSection() {
  return (
    <Section>
      <SectionHeader
        kicker="The lifecycle"
        title="One intelligence layer across the investment lifecycle."
        description="From origination to exit, every stage is configurable around how your firm invests. Explore the lifecycle below."
      />
      <Reveal className="mt-10">
        <LifecycleDiagram />
      </Reveal>
      <div className="mt-8 text-center">
        <Cta
          event="workflow_viewed"
          page="/"
          section="lifecycle"
          source="lifecycle"
          location="below-fold"
          label="Explore investment workflows"
          to="/workflows"
          variant="ghost"
        />
      </div>
    </Section>
  )
}

function SurfacesSection() {
  return (
    <Section tone="parchment">
      <SectionHeader
        kicker="Product surfaces"
        title="Everything the deal touches, in one system."
        description="The major product areas — from the pipeline to the IC, from diligence to portfolio — all on one connected foundation."
      />
      <Reveal className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {productSurfaces.map((surface) => (
            <FeatureCard
              key={surface.slug}
              title={surface.title}
              copy={surface.copy}
              eyebrow={surface.context}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

function AiSection() {
  return (
    <Section>
      <SectionHeader
        kicker="AI"
        title="AI that understands the investment workflow."
        description="Not a blank chatbot. AI operates inside your deal context, criteria, documents, permissions, and workflow state — preparing analysis and automating the repetitive work."
      />
      <Reveal className="mt-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[15px] leading-[1.55] text-ink-muted-80">
              With access to deal context, company data, investment criteria,
              financials, documents, diligence, workflow state, previous
              decisions, permissions, and institutional knowledge, AI can:
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-2 text-[14px] text-ink-muted-80 sm:grid-cols-2">
              {[
                'Research companies and markets',
                'Analyze CIMs',
                'Screen deals against criteria',
                'Identify missing information',
                'Analyze financial statements',
                'Generate diligence requests',
                'Draft investment memos',
                'Prepare IC materials',
                'Monitor portfolio performance',
                'Surface changes and risks',
              ].map((task) => (
                <li key={task} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 rounded-full bg-primary"
                  />
                  {task}
                </li>
              ))}
            </ul>
            <Callout title="The principle" className="mt-6">
              AI prepares and analyzes. Humans decide.
            </Callout>
          </div>
          <ProductMockup url="app.yourfirm.com">
            <AgentsMockup />
          </ProductMockup>
        </div>
      </Reveal>
    </Section>
  )
}

function MemorySection() {
  return (
    <Section tone="deep">
      <SectionHeader
        tone="dark"
        kicker="Institutional memory"
        title="Every investment decision should make the firm smarter."
        description="Theses, rejected deals, successes, failures, diligence findings, and IC decisions are preserved. The firm stops starting from zero on every deal."
      />
      <Reveal className="mt-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <ProductMockup url="app.yourfirm.com">
            <MemoryMockup />
          </ProductMockup>
          <div className="max-w-xl">
            <p className="text-[15px] leading-[1.6] text-body-muted">
              The platform preserves investment theses, rejected deals,
              successful deals, failed deals, diligence findings, management
              assessments, market knowledge, valuation assumptions, IC
              decisions, and historical analyses. Over time, the firm&rsquo;s
              intelligence compounds — every decision informed by the evidence
              and outcomes that came before it.
            </p>
            <div className="mt-6">
              <EvidenceTrace />
            </div>
            <p className="mt-6 text-[15px] leading-[1.6] text-body-muted">
              The loop:{' '}
              <span className="font-semibold text-white">
                DATA → CONTEXT → INTELLIGENCE → WORKFLOW → DECISION → MEMORY →
                BETTER DECISIONS.
              </span>
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function ConfigurableSection() {
  return (
    <Section>
      <Reveal>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Kicker>Configurable investment logic</Kicker>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl">
              Your investment strategy becomes executable.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-[1.6] text-ink-muted-80">
              Define investment criteria, thesis, screening rules, diligence
              requirements, IC requirements, and portfolio KPIs. The platform
              turns them into rules, workflows, and AI actions that apply
              consistently — without hard-coding any single firm&rsquo;s
              process.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                'Geography',
                'Sector',
                'Revenue',
                'EBITDA',
                'Growth',
                'Recurring revenue',
                'Concentration',
                'Leverage',
                'Valuation',
                'Ownership',
                'Transaction type',
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-hairline bg-surface-pearl px-3 py-1.5 text-[13px] text-ink-muted-80"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <WorkflowTimeline
              steps={[
                'Rules',
                'Workflows',
                'AI actions',
                'Decisions',
                'Memory',
              ]}
              className="justify-center"
            />
            <Callout className="mt-8">
              Configure the system around how your firm invests — not the other
              way around.
            </Callout>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function ComparisonSection() {
  return (
    <Section tone="parchment">
      <SectionHeader
        kicker="Why this is different"
        title="Not another AI chatbot. Not another rigid tool."
        description="The platform is an intelligence and workflow layer for the investment process."
      />
      <Reveal className="mt-12">
        <ComparisonTable />
      </Reveal>
    </Section>
  )
}

function FaqSection() {
  return (
    <Section>
      <SectionHeader kicker="FAQ" title="Questions investment teams ask" />
      <Reveal className="mt-10">
        <Faq items={faqItems} />
      </Reveal>
    </Section>
  )
}

export default Home
