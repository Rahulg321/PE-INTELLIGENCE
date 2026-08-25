import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { FeatureCard } from '~/components/marketing/FeatureCard'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/about')({
  component: About,
  head: () => ({
    ...seo({
      title: 'About — Why investment-specific infrastructure matters',
      description:
        'Why we are building an AI-native investment intelligence and workflow platform \u2014 and why human judgment stays at the center of every decision.',
      canonical: '/about',
    }),
  }),
})

function About() {
  return (
    <>
      <PageHero
        kicker="About"
        title="Investment teams deserve infrastructure that understands their work."
        description="The information behind every investment decision is real, sensitive, and scattered. We are building the intelligent layer that connects it."
      >
        <Cta
          event="demo_requested"
          page="/about"
          section="hero"
          source="page-hero"
          location="above-fold"
          label="Request a Demo"
          to="/contact"
        />
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="kicker">Why we exist</p>
            <h2 className="mt-4 max-w-md font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl">
              The work happens across a dozen systems. The intelligence should
              not.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-[16px] leading-[1.6] text-ink-muted-80">
            <p>
              Investment firms run on fragmented information. Deal flow arrives
              through CRMs, email, spreadsheets, and data rooms. Analysis lives
              in financial models, memos, and notes. Knowledge sits in the heads
              of the people who did the last deal. Turning all of it into a
              decision means manual assembly, re-entry, and answering the same
              questions twice.
            </p>
            <p>
              We believe this is an infrastructure problem, not a people
              problem. The tools available to investment teams were either built
              for something else or built around a rigid process. What the
              industry needs is an intelligent layer that connects existing
              systems, understands investment context, and turns information
              into workflow — while keeping humans in control of the decisions.
            </p>
            <p>
              Our eventual team is being assembled around this thesis:
              investment professionals who understand the work, and engineers
              who build AI-native systems. We do not claim a history we do not
              have — we are focused on building the product the industry is
              missing.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="parchment">
        <SectionHeader
          kicker="Philosophy"
          title="Four principles shape everything we build."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {[
            {
              title: 'AI-native architecture',
              copy: 'AI is not a feature bolted on. It is the layer that reads, extracts, analyzes, and automates across everything the firm works with.',
            },
            {
              title: 'Human decision-making',
              copy: 'AI prepares and analyzes. Investment judgment belongs to the humans, with every output designed to be verified.',
            },
            {
              title: 'Data interoperability',
              copy: 'Your existing systems are inputs, not obstacles. The platform connects them rather than forcing a migration.',
            },
            {
              title: 'Institutional memory',
              copy: 'Every decision, its evidence, and its outcome are preserved — so the firm compounds intelligence with every deal.',
            },
          ].map((p) => (
            <FeatureCard key={p.title} title={p.title} copy={p.copy} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="kicker">Long-term vision</p>
            <h2 className="mt-4 max-w-md font-display text-3xl font-semibold leading-[1.1] tracking-[-0.28px] sm:text-4xl">
              An intelligent operating system for investment teams.
            </h2>
          </div>
          <div className="max-w-2xl space-y-5 text-[16px] leading-[1.6] text-ink-muted-80">
            <p>
              The long-term vision is that every investment organization — from
              a two-person independent sponsor to a global private equity firm —
              runs on one intelligent layer. Data connects to context. Context
              becomes intelligence. Intelligence drives workflows. Workflows
              support decisions. And every decision makes the firm smarter.
            </p>
            <p>
              The platform is being built to serve many firms with many
              different strategies, criteria, workflows, and structures. No
              single firm&rsquo;s process is hard-coded into it — the system is
              configured around how each firm invests.
            </p>
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
