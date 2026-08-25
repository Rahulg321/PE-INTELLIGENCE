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
