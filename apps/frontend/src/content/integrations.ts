export type IntegrationStatus = 'available' | 'beta' | 'coming-soon'

export interface IntegrationCategory {
  slug: string
  title: string
  copy: string
  status: IntegrationStatus
  examples: string[]
}

/**
 * Integration statuses are reported honestly. Nothing is claimed as
 * "Available" until it actually ships.
 */
export const integrationCategories: IntegrationCategory[] = [
  {
    slug: 'crm',
    title: 'CRM',
    copy: 'Sync companies, deals, contacts, and activities so your CRM stays the system of record \u2014 and the platform reads from it.',
    status: 'coming-soon',
    examples: ['Salesforce', 'HubSpot', 'Pipedrive', 'Attio', 'Close'],
  },
  {
    slug: 'email',
    title: 'Email',
    copy: 'Connect mailboxes so inbound deal flow, correspondence, and intermediary notes become structured records.',
    status: 'coming-soon',
    examples: ['Gmail', 'Microsoft 365', 'Outlook'],
  },
  {
    slug: 'cloud-storage',
    title: 'Cloud Storage',
    copy: 'Index documents where they already live \u2014 without forcing a migration into the platform.',
    status: 'coming-soon',
    examples: ['Google Drive', 'SharePoint', 'Dropbox', 'Box', 'OneDrive'],
  },
  {
    slug: 'data-rooms',
    title: 'Data Rooms',
    copy: 'Connect diligence rooms so requested documents and their contents flow into the workstreams that need them.',
    status: 'coming-soon',
    examples: ['Intralinks', 'Datasite', 'DocSend', 'iDeals', 'DealRoom'],
  },
  {
    slug: 'financial-systems',
    title: 'Financial Systems',
    copy: 'Bring actuals and projections in from accounting and FP&A tools for underwriting and portfolio monitoring.',
    status: 'coming-soon',
    examples: ['QuickBooks', 'Xero', 'NetSuite', 'Anaplan', 'Adaptive'],
  },
  {
    slug: 'market-data',
    title: 'Market Data',
    copy: 'Enrich companies and markets with firmographic and financial data from external providers.',
    status: 'coming-soon',
    examples: ['PitchBook', 'Crunchbase', 'S&P Capital IQ', 'ZoomInfo'],
  },
  {
    slug: 'research',
    title: 'Research',
    copy: 'Keep market research, industry reports, and sector notes connected to the deals they inform.',
    status: 'coming-soon',
    examples: ['internal research', 'industry reports', 'news feeds'],
  },
  {
    slug: 'communication',
    title: 'Communication',
    copy: 'Capture meeting notes and call transcripts so decisions and context are preserved automatically.',
    status: 'coming-soon',
    examples: ['Zoom', 'Teams', 'Meet', 'Slack'],
  },
  {
    slug: 'spreadsheets',
    title: 'Spreadsheets',
    copy: 'Map existing trackers and models as inputs so the platform can read them without replacing them.',
    status: 'coming-soon',
    examples: ['Excel', 'Google Sheets', 'CSV imports'],
  },
  {
    slug: 'apis',
    title: 'APIs',
    copy: 'A documented API and webhooks for the firm\u2019s proprietary sourcing and internal systems.',
    status: 'coming-soon',
    examples: ['REST API', 'webhooks', 'bulk import'],
  },
]
