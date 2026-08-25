import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { AgentCard } from '~/components/marketing/AgentCard'
import { Callout } from '~/components/marketing/Callout'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { ProductMockup } from '~/components/mockups/ProductMockup'
import { AgentsMockup } from '~/components/mockups/AgentsMockup'
import { agents } from '~/content/agents'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/ai')({
  component: Ai,
  head: () => ({
    ...seo({
      title: 'AI — Agents built around investment work',
      description:
        'AI agents for investment teams: deal research, screening, CIM analysis, financial review, diligence, IC briefing, and portfolio monitoring. AI prepares; humans decide.',
      canonical: '/ai',
    }),
  }),
})

function Ai() {
  return (
    <>
      <PageHero
        kicker="AI"
        title="AI agents built around investment work."
        description="Not a generic chatbot. Agents operate inside your deal context, criteria, documents, permissions, and workflow state — with every output designed to be verified."
      >
        <div className="flex flex-wrap gap-4">
          <Cta
            event="demo_requested"
            page="/ai"
            section="hero"
            source="page-hero"
            location="above-fold"
            label="Request a Demo"
            to="/contact"
          />
          <Cta
            event="workflow_viewed"
            page="/ai"
            section="hero"
            source="page-hero"
            location="above-fold"
            label="See the workflows they support"
            to="/workflows"
            variant="secondary"
          />
        </div>
      </PageHero>

      <Section tone="parchment">
        <SectionHeader
          kicker="Context"
          title="AI that understands the investment workflow."
          description="The AI is not isolated. It has access to the context that makes investment work meaningful — and the permissions that keep it safe."
        />
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {[
            'Deal context',
            'Company data',
            'Investment criteria',
            'Financial information',
            'Documents',
            'Diligence',
            'Workflow state',
            'Previous decisions',
            'Permissions',
            'Institutional knowledge',
          ].map((ctx) => (
            <span
              key={ctx}
              className="rounded-full border border-hairline bg-canvas px-3.5 py-1.5 text-[13px] text-ink-muted-80"
            >
              {ctx}
            </span>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          kicker="Agents"
          title="Specific agents, specific outputs."
          description="Each agent takes an input, performs a defined action inside your data, produces a structured output, and hands it to a human for review."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="kicker">In practice</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl">
              Every agent follows the same loop.
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {[
                ['INPUT', 'Company, document, or workspace'],
                ['AI ACTION', 'Analysis inside your data and criteria'],
                ['OUTPUT', 'Structured result with citations'],
                ['HUMAN REVIEW', 'The team verifies and decides'],
              ].map(([k, v], i) => (
                <div key={k} className="flex items-center gap-4">
                  <span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
                    {k}
                  </span>
                  <span className="rounded-[8px] border border-hairline bg-canvas px-3 py-2 text-[13px] text-ink-muted-80">
                    {v}
                  </span>
                  {i < 3 ? (
                    <span aria-hidden="true" className="text-ink-muted-48">
                      ↓
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <ProductMockup url="app.yourfirm.com">
            <AgentsMockup />
          </ProductMockup>
        </div>
      </Section>

      <Section>
        <SectionHeader
          kicker="Trust"
          title="Built to be verified, not trusted blindly."
          description="The platform is designed so AI output can be checked — because investment decisions are too important for black boxes."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Evidence-backed',
              copy: 'AI outputs reference the documents, pages, and sections they came from.',
            },
            {
              title: 'Source provenance',
              copy: 'Every claim can be traced back to its source. Nothing is asserted without provenance.',
            },
            {
              title: 'Permissions-aware',
              copy: 'AI respects the firm\u2019s permissions — it only sees what the team is allowed to see.',
            },
            {
              title: 'Explainable',
              copy: 'AI explains its reasoning in terms the investment team can follow and challenge.',
            },
            {
              title: 'Auditable',
              copy: 'What AI did, when, and on what data is recorded and reviewable.',
            },
            {
              title: 'Human-in-the-loop',
              copy: 'AI prepares and analyzes. Humans make the investment decision, with full context.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-hairline bg-canvas p-6"
            >
              <h3 className="text-[15px] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.5] text-ink-muted-80">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Callout className="mx-auto max-w-2xl" title="The principle">
            AI assists the investment team. It does not replace investment
            judgment.
          </Callout>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
