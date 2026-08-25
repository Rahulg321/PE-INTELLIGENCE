export interface ProductLayer {
  slug: string
  name: string
  copy: string
  items: string[]
}

export const productLayers: ProductLayer[] = [
  {
    slug: 'data',
    name: 'Layer 1 — Data',
    copy: 'The connected foundation: companies, deals, contacts, relationships, documents, financials, activities, and notes.',
    items: [
      'Companies',
      'Deals',
      'Contacts',
      'Relationships',
      'Documents',
      'Financials',
      'Activities',
      'Notes',
    ],
  },
  {
    slug: 'intelligence',
    name: 'Layer 2 — Intelligence',
    copy: 'The platform turns raw data into structured, searchable knowledge about every company, deal, and market.',
    items: [
      'Extraction',
      'Enrichment',
      'Research',
      'Analysis',
      'Scoring',
      'Knowledge graph',
      'Search',
    ],
  },
  {
    slug: 'workflows',
    name: 'Layer 3 — Workflows',
    copy: 'Structured processes across the investment lifecycle, configured around how your firm actually invests.',
    items: [
      'Origination',
      'Screening',
      'Underwriting',
      'Diligence',
      'IC',
      'Transaction',
      'Portfolio',
    ],
  },
  {
    slug: 'ai',
    name: 'Layer 4 — AI',
    copy: 'Agents and automations that operate inside your data and workflows \u2014 always with the firm\u2019s context and permissions.',
    items: ['Agents', 'Copilots', 'Automations', 'Monitoring', 'Reasoning'],
  },
  {
    slug: 'decisions',
    name: 'Layer 5 — Human Decision',
    copy: 'The people who decide. Every layer below serves the analyst, the deal team, the IC, and management.',
    items: [
      'Analyst',
      'Associate',
      'VP',
      'Principal',
      'Partner',
      'IC',
      'Management',
    ],
  },
]
