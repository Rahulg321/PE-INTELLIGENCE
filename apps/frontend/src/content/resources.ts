export interface ResourceCategory {
  slug: string
  title: string
}

export interface Resource {
  slug: string
  title: string
  category: string
  summary: string
  /** Published items vs planned frameworks */
  status: 'published' | 'coming-soon'
}

export const resourceCategories: ResourceCategory[] = [
  { slug: 'investment-strategy', title: 'Investment Strategy' },
  { slug: 'deal-sourcing', title: 'Deal Sourcing' },
  { slug: 'deal-screening', title: 'Deal Screening' },
  { slug: 'underwriting', title: 'Underwriting' },
  { slug: 'due-diligence', title: 'Due Diligence' },
  { slug: 'investment-committee', title: 'Investment Committee' },
  { slug: 'ai-in-investing', title: 'AI in Investing' },
  { slug: 'portfolio-management', title: 'Portfolio Management' },
  { slug: 'ma', title: 'M&A' },
  { slug: 'investment-operations', title: 'Investment Operations' },
]

export const resources: Resource[] = [
  {
    slug: 'investment-screening-framework',
    title: 'Investment Screening Framework',
    category: 'deal-screening',
    summary:
      'A structured framework for evaluating opportunities across financial, market, quality, and strategic fit \u2014 and the questions that expose what you do not yet know.',
    status: 'coming-soon',
  },
  {
    slug: 'due-diligence-request-framework',
    title: 'Due Diligence Request Framework',
    category: 'due-diligence',
    summary:
      'A workstream-by-workstream approach to diligence requests, evidence, findings, and resolution \u2014 built for teams that need the material to become a decision system.',
    status: 'coming-soon',
  },
  {
    slug: 'investment-committee-memo-framework',
    title: 'Investment Committee Memo Framework',
    category: 'investment-committee',
    summary:
      'How to structure an IC package so every conclusion is traceable to its evidence \u2014 and what decision-makers actually need to interrogate a deal.',
    status: 'coming-soon',
  },
  {
    slug: 'how-ai-can-automate-investment-workflows',
    title: 'How AI Can Automate Investment Workflows',
    category: 'ai-in-investing',
    summary:
      'Where AI meaningfully removes work across origination, screening, underwriting, diligence, and monitoring \u2014 and where human judgment remains irreplaceable.',
    status: 'coming-soon',
  },
  {
    slug: 'investment-team-data-architecture',
    title: 'Investment Team Data Architecture',
    category: 'investment-operations',
    summary:
      'How investment firms should think about their data layer: what lives where, how systems connect, and why a unified model beats another export.',
    status: 'coming-soon',
  },
  {
    slug: 'building-institutional-memory',
    title: 'Building Institutional Memory in Investment Firms',
    category: 'investment-strategy',
    summary:
      'Why the firm that preserves decisions, evidence, and outcomes compounds faster \u2014 and how to make institutional memory a system, not a memory.',
    status: 'coming-soon',
  },
]
