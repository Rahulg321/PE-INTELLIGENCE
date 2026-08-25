export interface ProductSurface {
  slug: string
  title: string
  /** One-line description */
  copy: string
  /** Where it fits in the workflow */
  context: string
  href: string
}

export const productSurfaces: ProductSurface[] = [
  {
    slug: 'deal-intelligence',
    title: 'Deal Intelligence',
    copy: 'Every deal \u2014 and everything known about it \u2014 in one structured record: economics, status, source, relationships, and history.',
    context: 'Sits at the center of the pipeline, referenced by every stage.',
    href: '/product',
  },
  {
    slug: 'company-intelligence',
    title: 'Company Intelligence',
    copy: 'The facts of the business \u2014 financials, contacts, history \u2014 owned separately from the deal, so the same company can appear across multiple opportunities.',
    context:
      'Grounds screening, underwriting, and diligence in verified company facts.',
    href: '/product',
  },
  {
    slug: 'relationship-intelligence',
    title: 'Relationship Intelligence',
    copy: 'Intermediaries, operators, founders, and introducers mapped to deals, so who-knows-whom is always one click away.',
    context: 'Shapes origination outreach and intermediary management.',
    href: '/workflows/origination',
  },
  {
    slug: 'investment-pipeline',
    title: 'Investment Pipeline',
    copy: 'Every opportunity in one view \u2014 stage, fit, source, owner, and next action \u2014 driven by your firm\u2019s criteria, not a manual tracker.',
    context: 'The operating view across origination and screening.',
    href: '/workflows/screening',
  },
  {
    slug: 'underwriting',
    title: 'Underwriting',
    copy: 'Financials, market, management, valuation, and risks assembled into a thesis that can be defended \u2014 and revisited after close.',
    context: 'The investment case, built from complete context.',
    href: '/workflows/underwriting',
  },
  {
    slug: 'due-diligence',
    title: 'Due Diligence',
    copy: 'Workstreams, requests, documents, findings, risks, and owners \u2014 unstructured material converted into a structured decision system.',
    context: 'Everything the team needs to verify the case.',
    href: '/workflows/diligence',
  },
  {
    slug: 'investment-committee',
    title: 'Investment Committee',
    copy: 'Decision-ready packages where every conclusion is traceable to its evidence, source, document, and page.',
    context: 'The bridge from analysis to decision.',
    href: '/workflows/investment-committee',
  },
  {
    slug: 'ai-agents',
    title: 'AI Agents',
    copy: 'Agents built around investment work \u2014 research, screening, CIM analysis, financial review, diligence, IC briefing, and portfolio monitoring.',
    context: 'Automate the repetitive work; humans review and decide.',
    href: '/ai',
  },
  {
    slug: 'portfolio-intelligence',
    title: 'Portfolio Intelligence',
    copy: 'The underwritten case measured against actual performance, with covenants, KPIs, and initiatives tracked for the life of the investment.',
    context: 'Value creation and monitoring after close.',
    href: '/workflows/portfolio',
  },
  {
    slug: 'institutional-memory',
    title: 'Institutional Memory',
    copy: 'Theses, decisions, evidence, and outcomes preserved \u2014 so the firm\u2019s intelligence compounds with every deal.',
    context: 'The compounding layer across the entire lifecycle.',
    href: '/about',
  },
]
