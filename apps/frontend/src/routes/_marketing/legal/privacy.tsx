import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '~/components/marketing/LegalPage'
import { brand } from '~/lib/brand'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/legal/privacy')({
  component: Privacy,
  head: () => ({
    ...seo({
      title: 'Privacy Policy',
      description: 'Privacy policy for the investment intelligence platform.',
      canonical: '/legal/privacy',
      index: false,
    }),
  }),
})

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="Template — not yet finalized">
      <h2>About this policy</h2>
      <p>
        This is a working template for the privacy policy of {brand.legalName}.
        It describes how personal information would be handled and is provided
        for review. It does not create legal obligations and must be reviewed
        and finalized with counsel before the product launches.
      </p>

      <h2>Information we collect</h2>
      <p>
        We would collect only the information needed to operate the product and
        respond to requests: contact details you provide (such as name and work
        email), firm and role information, and data your firm stores in the
        platform. We would not collect unnecessary personal data, and we would
        never sell personal information.
      </p>

      <h2>How information is used</h2>
      <ul>
        <li>To operate and secure the platform.</li>
        <li>To respond to demo and contact requests.</li>
        <li>
          To provide the analytics described on this site, which does not
          collect personal data.
        </li>
      </ul>

      <h2>Data we do not use for training</h2>
      <p>
        Customer data is not used to train models shared across customers. AI
        processing is scoped to the firm&rsquo;s own data and governed by the
        same permissions as the team.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        Retention and deletion are designed to be configurable per firm. You
        would be able to request deletion of personal information at any time.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact{' '}
        <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.
      </p>
    </LegalPage>
  )
}
