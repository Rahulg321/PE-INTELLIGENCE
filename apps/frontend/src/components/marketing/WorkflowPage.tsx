import { Link } from '@tanstack/react-router'
import type { WorkflowItem } from '~/content/workflows'
import { getWorkflow } from '~/content/workflows'
import { PageHero } from './PageHero'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'
import { WorkflowTimeline } from './WorkflowTimeline'
import { FeatureGrid } from './FeatureGrid'
import { Callout } from './Callout'
import { FinalCta } from './FinalCta'
import { LifecycleDiagram } from './LifecycleDiagram'
import { Reveal } from './Reveal'

/** Standard template for `/workflows/:slug` pages. */
export function WorkflowPage({ workflow }: { workflow: WorkflowItem }) {
  const prev = workflow.prev ? getWorkflow(workflow.prev) : undefined
  const next = workflow.next ? getWorkflow(workflow.next) : undefined

  return (
    <>
      <PageHero
        kicker="Investment Workflow"
        title={workflow.title}
        description={workflow.description}
      >
        <Callout title="Positioning" className="mt-6 max-w-2xl">
          {workflow.positioning}
        </Callout>
      </PageHero>

      <Section tone="parchment">
        <SectionHeader
          align="left"
          kicker="How it works"
          title={`The ${workflow.shortLabel.toLowerCase()} flow`}
        />
        <Reveal className="mt-8">
          <WorkflowTimeline steps={workflow.pipeline} />
        </Reveal>
      </Section>

      <Section>
        <SectionHeader
          align="left"
          kicker="Capabilities"
          title={`What the platform does across ${workflow.shortLabel.toLowerCase()}`}
        />
        <Reveal className="mt-10">
          <FeatureGrid features={workflow.capabilities} columns={3} />
        </Reveal>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="kicker">Deeper</p>
            <h2 className="mt-4 max-w-md font-display text-2xl font-semibold leading-[1.15] tracking-[-0.28px] sm:text-3xl">
              {workflow.deep.title}
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-[16px] leading-[1.6] text-ink-muted-80">
              {workflow.deep.copy}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {workflow.deep.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink-muted-80"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="bg-tile-1 px-6 py-20 text-white sm:py-24">
        <div className="marketing-container">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-display text-2xl font-semibold leading-[1.25] tracking-[-0.28px] sm:text-3xl">
              &ldquo;{workflow.principle}&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      <Section>
        <SectionHeader
          kicker="The full lifecycle"
          title="See where this stage fits"
          description="Every stage is configurable around how your firm invests. Explore the rest of the lifecycle."
        />
        <Reveal className="mt-10">
          <LifecycleDiagram activeSlug={workflow.slug} />
        </Reveal>
      </Section>

      <nav
        aria-label="Workflow navigation"
        className="border-t border-hairline bg-parchment px-6 py-8"
      >
        <div className="marketing-container flex items-center justify-between gap-4">
          {prev ? (
            <Link
              to={`/workflows/${prev.slug}`}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
                Previous
              </span>
              <span className="text-[15px] font-semibold text-ink transition group-hover:text-primary">
                ← {prev.label}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/workflows/${next.slug}`}
              className="group flex flex-col items-end gap-1 text-right"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
                Next
              </span>
              <span className="text-[15px] font-semibold text-ink transition group-hover:text-primary">
                {next.label} →
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>

      <FinalCta />
    </>
  )
}
