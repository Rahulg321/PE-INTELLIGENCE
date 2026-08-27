import { brand } from '~/lib/brand'

export interface NavItem {
  label: string
  href: string
}

export const primaryNav: NavItem[] = [
  { label: 'Product', href: '/product' },
  { label: 'Workflows', href: '/workflows' },
  { label: 'AI', href: '/ai' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Security', href: '/security' },
  { label: 'Resources', href: '/resources' },
]

export const navCta = {
  label: 'Request a Demo',
  href: '/contact',
}

export const navSecondary = {
  label: 'Sign In',
  href: null, // set to `appUrl` when the application domain is finalised
}

export interface FooterColumn {
  title: string
  links: NavItem[]
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Product', href: '/product' },
      { label: 'AI', href: '/ai' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    title: 'Workflows',
    links: [
      { label: 'Origination', href: '/workflows/origination' },
      { label: 'Screening', href: '/workflows/screening' },
      { label: 'Underwriting', href: '/workflows/underwriting' },
      { label: 'Due Diligence', href: '/workflows/diligence' },
      {
        label: 'Investment Committee',
        href: '/workflows/investment-committee',
      },
      { label: 'Transaction Execution', href: '/workflows/transactions' },
      { label: 'Portfolio', href: '/workflows/portfolio' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Resources', href: '/resources' },
      { label: 'Glossary', href: '/glossary' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Security', href: '/legal/security' },
    ],
  },
]

export interface PublicPage {
  /** Site path, e.g. '/' or '/workflows/screening' */
  path: string
  /** Page <title> (matches the route's seo() title) */
  title: string
  /** Page meta description (matches the route's seo() description) */
  description: string
  /** ISO date the page content was last meaningfully changed */
  lastmod: string
}

/** Last date any page content was meaningfully updated. Bump when content changes. */
export const contentUpdatedAt = '2026-08-25'

/**
 * Every public, indexable page. This is the single source of truth consumed by:
 * the sitemap/llms/robots generator, the agent-readability verifier, and the
 * SEO alternate-link/JSON-LD plumbing. Legal pages (noindex) are excluded.
 */
export const publicPages: PublicPage[] = [
  {
    path: '/',
    title: `${brand.name} — AI-native infrastructure for investment teams`,
    description: brand.description,
    lastmod: contentUpdatedAt,
  },
  {
    path: '/product',
    title: 'Product — AI-native investment intelligence and workflow infrastructure',
    description:
      'A five-layer architecture: connected data, intelligence, workflows, AI, and human decision \u2014 one intelligent layer across the investment lifecycle.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows',
    title: 'Investment Workflows — Built around the way investment teams work',
    description:
      'Origination, screening, underwriting, diligence, IC, transaction, portfolio, and exit \u2014 a configurable investment lifecycle, each stage supported by the platform.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/origination',
    title: 'Origination — Capture deal flow without re-entering information',
    description:
      'Turn fragmented deal flow into structured companies, deals, and relationships. Your existing systems become inputs \u2014 no CRM migration required.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/screening',
    title: 'Screening — Evaluate deals against your investment criteria',
    description:
      'Screen every opportunity against your firm\u2019s criteria \u2014 and understand why it fits, where it does not, and what remains unknown.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/underwriting',
    title: 'Underwriting — Build the investment thesis from complete context',
    description:
      'Bring the company, financials, market, management, transaction, and valuation into one connected workspace so the thesis is built from complete context.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/diligence',
    title: 'Due Diligence — Turn documents into a structured decision system',
    description:
      'Convert a large body of unstructured diligence material into organized workstreams, findings, risks, owners, and deadlines \u2014 not a pile of PDFs.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/investment-committee',
    title: 'Investment Committee — Every conclusion traceable to its evidence',
    description:
      'Give decision-makers the context behind the deal. The IC package brings together the company, thesis, financials, valuation, risks, and returns.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/transactions',
    title: 'Transaction Execution — Execute from LOI through closing with control',
    description:
      'Milestones, approvals, advisors, financing, legal workflow, and closing conditions tracked in one place alongside the full diligence and underwriting record.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/workflows/portfolio',
    title: 'Portfolio & Value Creation — The thesis stays the baseline after closing',
    description:
      'Keep the underwritten case visible against actual performance, so monitoring, value creation, and exit are one continuous thread \u2014 not a fresh start.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/ai',
    title: 'AI — Agents built around investment work',
    description:
      'AI agents for investment teams: deal research, screening, CIM analysis, financial review, diligence, IC briefing, and portfolio monitoring. AI prepares; humans decide.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/integrations',
    title: 'Integrations — Your investment stack should work together',
    description:
      'Connect CRM, email, cloud storage, data rooms, financial systems, market data, research, communication, and spreadsheets. Your existing systems become inputs.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/security',
    title: 'Security — Built for sensitive investment information',
    description:
      'Encryption, tenant isolation, role-based access, document permissions, audit trails, and AI data handling \u2014 designed for firms handling extremely sensitive deal information.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/resources',
    title: 'Resources — Frameworks for investment teams',
    description:
      'Investment strategy, deal sourcing, screening, underwriting, due diligence, IC, AI in investing, portfolio management, and M&A \u2014 practical frameworks for investment teams.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/about',
    title: 'About — Why investment-specific infrastructure matters',
    description:
      'Why we are building an AI-native investment intelligence and workflow platform \u2014 and why human judgment stays at the center of every decision.',
    lastmod: contentUpdatedAt,
  },
  {
    path: '/contact',
    title: 'Contact — Request a Demo',
    description:
      'See what your investment workflow could look like. Request a demo of the AI-native investment intelligence and workflow platform.',
    lastmod: contentUpdatedAt,
  },
]

/** Markdown mirror path for a public page, e.g. '/' → '/docs/index.md'. */
export function pageMirrorPath(pagePath: string): string {
  return `/docs${pagePath === '/' ? '/index' : pagePath}.md`
}

/** Target audience shown as text chips — not fabricated logos. */
export const audienceChips = [
  'Private Equity',
  'Independent Sponsors',
  'Family Offices',
  'Venture',
  'Growth Equity',
  'Investment Banking',
  'Corporate Development',
]
