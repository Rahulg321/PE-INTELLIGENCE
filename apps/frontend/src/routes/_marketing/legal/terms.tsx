import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '~/components/marketing/LegalPage'
import { brand } from '~/lib/brand'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/legal/terms')({
  component: Terms,
  head: () => ({
    ...seo({
      title: 'Terms of Service',
      description: 'Terms of service for the investment intelligence platform.',
      canonical: '/legal/terms',
      index: false,
    }),
  }),
})

function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="Template — not yet finalized">
      <h2>About these terms</h2>
      <p>
        This is a working template for the terms of service of {brand.legalName}
        . It does not create legal obligations and must be reviewed and
        finalized with counsel before the product launches.
      </p>

      <h2>Use of the service</h2>
      <p>
        The platform is an AI-native investment intelligence and workflow tool.
        It is designed to assist investment teams in their own work; it does not
        replace professional judgment, financial modeling decisions, or the
        advice of legal, financial, tax, and other professional advisors.
      </p>

      <h2>Your data</h2>
      <p>
        Your firm&rsquo;s data belongs to your firm. Access is governed by the
        permissions and controls described on the Security page. We process
        customer data to operate the service and do not use it to train models
        shared across customers.
      </p>

      <h2>AI output</h2>
      <p>
        AI-generated output is provided to assist the investment team and must
        be reviewed by qualified humans before any decision or action is taken.
        The service is not an investment adviser and nothing in it is investment
        advice.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; and, to the maximum extent
        permitted by law, {brand.legalName} is not liable for any indirect,
        incidental, or consequential damages arising from use of the service.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact{' '}
        <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.
      </p>
    </LegalPage>
  )
}
