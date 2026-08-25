import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '~/components/marketing/LegalPage'
import { brand } from '~/lib/brand'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/legal/security')({
  component: LegalSecurity,
  head: () => ({
    ...seo({
      title: 'Security Policy',
      description: 'Security policy for the investment intelligence platform.',
      canonical: '/legal/security',
      index: false,
    }),
  }),
})

function LegalSecurity() {
  return (
    <LegalPage title="Security Policy" updated="Template — not yet finalized">
      <h2>About this policy</h2>
      <p>
        This is a working template for the security policy of {brand.legalName}.
        It describes the security posture the platform is designed around and
        must be reviewed and finalized with counsel. It does not create legal
        obligations.
      </p>

      <h2>Data protection</h2>
      <p>
        Data is encrypted in transit (TLS) and at rest, with keys managed
        independently of the data they protect. Backups are redundant and
        restoration is tested.
      </p>

      <h2>Access control</h2>
      <p>
        Each firm operates in an isolated tenant. Access is role-based and
        permission-scoped down to the document. Authentication supports security
        keys and single sign-on where required.
      </p>

      <h2>Auditing</h2>
      <p>
        Sensitive actions — views, exports, permission changes, and deletions —
        are recorded and reviewable by the firm.
      </p>

      <h2>AI data handling</h2>
      <p>
        AI processing is scoped to the firm&rsquo;s own data, respects document
        permissions, and is never used to train models shared across customers.
      </p>

      <h2>Reporting a vulnerability</h2>
      <p>
        Security researchers and customers can report vulnerabilities to{' '}
        <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.
      </p>
    </LegalPage>
  )
}
