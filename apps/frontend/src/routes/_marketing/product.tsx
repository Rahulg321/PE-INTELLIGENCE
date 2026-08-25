import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { ArchitectureDiagram } from '~/components/marketing/ArchitectureDiagram'
import { FeatureCard } from '~/components/marketing/FeatureCard'
import { Callout } from '~/components/marketing/Callout'
import { FinalCta } from '~/components/marketing/FinalCta'
import { Cta } from '~/components/marketing/Cta'
import { Reveal } from '~/components/marketing/Reveal'
import { productSurfaces } from '~/content/productSurfaces'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/product')({
  component: Product,
  head: () => ({
    ...seo({
      title:
        'Product — AI-native investment intelligence and workflow infrastructure',
      description:
        'A five-layer architecture: connected data, intelligence, workflows, AI, and human decision \u2014 one intelligent layer across the investment lifecycle.',
      canonical: '/product',
    }),
  }),
})

function Product() {
  return (
    <>
      <PageHero
        kicker="Product"
        title="One intelligent layer across the investment lifecycle."
        description="Five layers, one connected system. Data becomes intelligence, intelligence powers workflows, AI does the repetitive work, and humans make the decisions."
      >
        <div className="flex flex-wrap gap-4">
          <Cta
            event="demo_requested"
            page="/product"
            section="hero"
            source="page-hero"
            location="above-fold"
            label="Request a Demo"
            to="/contact"
          />
          <Cta
            event="workflow_viewed"
            page="/product"
            section="hero"
            source="page-hero"
            location="above-fold"
            label="See investment workflows"
            to="/workflows"
            variant="secondary"
          />
        </div>
      </PageHero>

      <Section tone="parchment">
        <SectionHeader
          kicker="Architecture"
          title="A layered system, not another tool."
          description="Each layer serves the layer above it. Data flows up into intelligence; intelligence feeds workflows; AI operates inside that context; humans decide with full visibility."
        />
        <Reveal className="mt-12">
          <ArchitectureDiagram />
        </Reveal>
        <Callout className="mx-auto mt-10 max-w-2xl">
          The application is the architecture. There is no separate database,
          document store, and AI tool to stitch together — they are one
          connected system.
        </Callout>
      </Section>

      <Section>
        <SectionHeader
          kicker="Product surfaces"
          title="Built around the work."
          description="Ten product areas cover the full lifecycle. Each one reads from the same connected foundation."
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
        <div className="mt-10 text-center">
          <Link
            to="/workflows"
            className="text-[15px] font-semibold text-primary transition hover:text-primary-focus"
          >
            See how these surfaces work across the investment lifecycle →
          </Link>
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
