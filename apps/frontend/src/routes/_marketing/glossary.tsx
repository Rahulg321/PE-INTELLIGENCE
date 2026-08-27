import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { FinalCta } from '~/components/marketing/FinalCta'
import { glossaryTerms } from '~/content/glossary'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/glossary')({
  component: Glossary,
  head: () => ({
    ...seo({
      title: 'Glossary — Investment and platform terminology',
      description:
        'Plain-language definitions of the investment and platform terms used across the site \u2014 CIM, IC, EBITDA, underwriting, diligence, institutional memory, and more.',
      canonical: '/glossary',
    }),
  }),
})

function Glossary() {
  return (
    <>
      <PageHero
        kicker="Glossary"
        title="The terms, in plain language."
        description="Definitions of the investment and platform terminology used across the site \u2014 written so anyone, human or agent, can understand the work."
      />

      <Section>
        <SectionHeader align="left" kicker="Terminology" title="A\u2013Z" />
        <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {glossaryTerms.map(({ term, definition }) => (
            <div key={term}>
              <dt className="font-display text-[17px] font-semibold text-ink">
                {term}
              </dt>
              <dd className="mt-2 text-[14px] leading-[1.6] text-ink-muted-80">
                {definition}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <FinalCta />
    </>
  )
}
