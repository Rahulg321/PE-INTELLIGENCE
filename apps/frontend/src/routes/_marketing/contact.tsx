import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '~/components/marketing/PageHero'
import { Section } from '~/components/marketing/Section'
import { SectionHeader } from '~/components/marketing/SectionHeader'
import { Faq } from '~/components/marketing/Faq'
import { ContactForm } from '~/components/marketing/ContactForm'
import { brand } from '~/lib/brand'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/contact')({
  component: Contact,
  head: () => ({
    ...seo({
      title: 'Contact — Request a Demo',
      description:
        'See what your investment workflow could look like. Request a demo of the AI-native investment intelligence and workflow platform.',
      canonical: '/contact',
    }),
  }),
})

function Contact() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="See what your investment workflow could look like."
        description="Tell us about your firm and your current process. We&rsquo;ll show you how the platform connects your data, workflows, and investment knowledge."
      />

      <Section tone="parchment" className="pt-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-[17px] font-semibold text-ink">
                What happens next
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-[15px] leading-[1.5] text-ink-muted-80">
                <li className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 rounded-full bg-primary"
                  />
                  We review your request and reach out within two business days.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 rounded-full bg-primary"
                  />
                  A short walkthrough mapped to your firm&rsquo;s lifecycle and
                  criteria.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 rounded-full bg-primary"
                  />
                  No sales pressure — we&rsquo;re in pre-launch and building
                  with early teams.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-ink">
                Prefer email?
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted-80">
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="text-primary transition hover:text-primary-focus"
                >
                  {brand.contact.email}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-hairline bg-canvas p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          kicker="FAQ"
          title="Questions before you book a demo"
          description="The answers to what firms usually ask before a walkthrough."
        />
        <Faq
          items={[
            {
              question: 'Do we need to migrate our systems first?',
              answer:
                'No. The platform is designed to connect to the systems you already use \u2014 CRM, email, cloud storage, data rooms, and spreadsheets \u2014 so they become inputs. There is no forced migration to get value.',
            },
            {
              question: 'What will the demo cover?',
              answer:
                'A walkthrough mapped to your firm\u2019s lifecycle and criteria. We show origination, screening, underwriting, diligence, IC, and portfolio \u2014 and how the platform connects them with AI that prepares analysis for your team to decide.',
            },
            {
              question: 'How long does it take to get started?',
              answer:
                'We are in pre-launch and building with early teams. Once we connect, onboarding focuses on your criteria and workflow first, so the platform reflects how your firm invests from day one.',
            },
            {
              question: 'Is my information kept confidential?',
              answer:
                'Yes. We treat any information you share as confidential, and the platform itself is designed for firms handling extremely sensitive deal information \u2014 tenant isolation, permissions, and audit trails included.',
            },
          ]}
        />
      </Section>
    </>
  )
}
