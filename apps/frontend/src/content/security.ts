export interface SecurityItem {
  slug: string
  title: string
  copy: string
}

export const securityControls: SecurityItem[] = [
  {
    slug: 'encryption',
    title: 'Encryption',
    copy: 'Data is encrypted in transit (TLS) and at rest. Encryption keys are managed independently of the data they protect.',
  },
  {
    slug: 'authentication',
    title: 'Authentication',
    copy: 'Modern, phishing-resistant authentication with support for security keys and single sign-on where the firm requires it.',
  },
  {
    slug: 'authorization',
    title: 'Authorization',
    copy: 'Fine-grained, role-based access control so every member sees only what their role and firm configuration allows.',
  },
  {
    slug: 'tenant-isolation',
    title: 'Tenant isolation',
    copy: 'Each firm operates in an isolated tenant. Data, documents, and access are scoped to the firm \u2014 never shared across tenants.',
  },
  {
    slug: 'document-permissions',
    title: 'Document permissions',
    copy: 'Document-level permissions mirror the sensitivity of the material. Access is granted by role, deal, and workstream.',
  },
  {
    slug: 'audit-trails',
    title: 'Audit trails',
    copy: 'Sensitive actions \u2014 views, exports, permission changes, and deletions \u2014 are recorded so the firm can reconstruct what happened and when.',
  },
  {
    slug: 'access-logs',
    title: 'Access logs',
    copy: 'Firms can review who accessed what, from where, and when \u2014 across the platform and individual documents.',
  },
  {
    slug: 'data-retention',
    title: 'Data retention',
    copy: 'Retention and deletion policies are configurable per firm, and deletion is designed to be complete when the firm requires it.',
  },
  {
    slug: 'backups',
    title: 'Backups',
    copy: 'Data is backed up with redundancy and tested restoration, so an incident cannot become a loss.',
  },
  {
    slug: 'ai-data-handling',
    title: 'AI data handling',
    copy: 'AI processing is scoped to the firm\u2019s own data, respects document permissions, and is never used to train models shared across customers.',
  },
  {
    slug: 'infrastructure',
    title: 'Infrastructure security',
    copy: 'The platform runs on hardened, managed infrastructure with environment separation between development, staging, and production.',
  },
  {
    slug: 'environment-separation',
    title: 'Environment separation',
    copy: 'Production data is isolated from non-production environments, with deployment controls between them.',
  },
]

export const certifications = {
  statement:
    'We do not claim certifications we have not earned. SOC 2 and ISO 27001 status will be published here when the relevant assessments are completed.',
}
