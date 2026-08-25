export interface Persona {
  slug: string
  group: string
  title: string
  copy: string
}

export const personas: Persona[] = [
  {
    slug: 'private-equity',
    group: 'Private Equity',
    title: 'Partners to Analysts',
    copy: 'Investment teams running a full lifecycle of sourcing, diligence, IC, and portfolio work across multiple funds.',
  },
  {
    slug: 'independent-sponsors',
    group: 'Independent Sponsors',
    title: 'Deal leads, analysts, capital formation',
    copy: 'Small teams running multiple deals at once who cannot afford to lose context across fragmented tools.',
  },
  {
    slug: 'family-offices',
    group: 'Family Offices',
    title: 'Investment professionals, direct investing teams',
    copy: 'Direct investment teams managing relationships, diligence, and portfolios with a long-term view.',
  },
  {
    slug: 'venture-growth',
    group: 'Venture / Growth',
    title: 'Investors, deal teams, platform teams',
    copy: 'High-volume pipelines where disciplined screening and structured research separate signal from noise.',
  },
  {
    slug: 'investment-banking',
    group: 'Investment Banking / M&A',
    title: 'M&A and transaction teams',
    copy: 'Teams running processes, managing data, and coordinating advisors under hard deadlines.',
  },
  {
    slug: 'corporate-development',
    group: 'Corporate Development',
    title: 'Corporate development and strategy',
    copy: 'In-house M&A teams who need the target, the thesis, and the diligence in one place for internal stakeholders.',
  },
]
