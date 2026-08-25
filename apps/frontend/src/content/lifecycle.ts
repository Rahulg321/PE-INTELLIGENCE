export interface LifecycleStage {
  /** URL-safe slug */
  slug: string
  /** Full stage name */
  title: string
  /** Compact label for diagrams */
  shortLabel: string
  /** One-line description for the diagram */
  tagline: string
  /** Where the stage lives in the site */
  href: string
  /** Paragraph summary used on hub pages */
  summary: string
}

export const lifecycle = [
  {
    slug: 'origination',
    title: 'Origination',
    shortLabel: 'Origination',
    tagline: 'Source opportunities from every channel you already use.',
    href: '/workflows/origination',
    summary:
      'Capture deal flow from CRM, email, inbound submissions, spreadsheets, and data providers without forcing your team to re-enter information by hand.',
  },
  {
    slug: 'screening',
    title: 'Screening',
    shortLabel: 'Screening',
    tagline: 'Evaluate fit before committing underwriting time.',
    href: '/workflows/screening',
    summary:
      'Screen every opportunity against your firm\u2019s investment criteria and understand why it fits, where it does not, and what remains unknown.',
  },
  {
    slug: 'underwriting',
    title: 'Underwriting',
    shortLabel: 'Underwriting',
    tagline: 'Build and pressure-test the investment case.',
    href: '/workflows/underwriting',
    summary:
      'Develop the investment thesis from company facts, financials, market, management, transaction structure, valuation, and risk in one connected workspace.',
  },
  {
    slug: 'diligence',
    title: 'Due Diligence',
    shortLabel: 'Diligence',
    tagline: 'Turn a large body of material into a structured decision system.',
    href: '/workflows/diligence',
    summary:
      'Organize workstreams, requests, documents, findings, risks, and owners across the full diligence effort \u2014 and trace every conclusion to its evidence.',
  },
  {
    slug: 'investment-committee',
    title: 'Investment Committee',
    shortLabel: 'IC',
    tagline: 'Give decision-makers the context behind the deal.',
    href: '/workflows/investment-committee',
    summary:
      'Prepare decision-ready IC packages where every conclusion is traceable to its source evidence \u2014 and AI supports the preparation, never the decision.',
  },
  {
    slug: 'transactions',
    title: 'Transaction Execution',
    shortLabel: 'Transaction',
    tagline: 'Move from LOI through closing with control.',
    href: '/workflows/transactions',
    summary:
      'Track milestones, approvals, advisors, financing, legal workflow, and closing conditions across the transaction \u2014 without replacing your advisors.',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio / Value Creation',
    shortLabel: 'Portfolio',
    tagline: 'Monitor the thesis after closing.',
    href: '/workflows/portfolio',
    summary:
      'Compare the underwritten case against actual performance, track covenants and KPIs, and keep the original thesis in view through operation and exit.',
  },
  {
    slug: 'exit',
    title: 'Exit',
    shortLabel: 'Exit',
    tagline: 'Realize returns and preserve what was learned.',
    href: '/workflows/portfolio',
    summary:
      'Prepare the exit with the full investment history in one place \u2014 and capture what the deal taught the firm for every future decision.',
  },
] as const satisfies readonly LifecycleStage[]

export type LifecycleItem = (typeof lifecycle)[number]

export const lifecycleCount = lifecycle.length
