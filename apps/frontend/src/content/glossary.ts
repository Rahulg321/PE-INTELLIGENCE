export interface GlossaryTerm {
  /** The term as it appears in the product */
  term: string
  /** Plain-language definition */
  definition: string
}

/** Terms referenced across the site, in the plainest language we can manage. */
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'CIM',
    definition:
      'Confidential Information Memorandum. The marketing document a seller prepares about a business, used to generate buyer interest during a sale.',
  },
  {
    term: 'IC',
    definition:
      'Investment Committee. The group within a firm that reviews a deal and decides whether to proceed with the investment.',
  },
  {
    term: 'IC memo',
    definition:
      'Investment Committee memorandum. The package prepared for decision-makers that assembles the thesis, financials, valuation, risks, and evidence behind a deal.',
  },
  {
    term: 'EBITDA',
    definition:
      'Earnings Before Interest, Taxes, Depreciation, and Amortization. A common proxy for a business\u2019s operating profitability and a core input to valuation.',
  },
  {
    term: 'LTM',
    definition:
      'Last Twelve Months. The trailing twelve-month financial results, used as a current operating baseline for analysis and valuation.',
  },
  {
    term: 'LOI',
    definition:
      'Letter of Intent. A non-binding document outlining the proposed terms under which a buyer would acquire a business, issued early in a transaction.',
  },
  {
    term: 'Data room',
    definition:
      'A secure, shared repository of confidential documents that a seller makes available to buyers and their advisors during diligence.',
  },
  {
    term: 'Deal sourcing',
    definition:
      'The process of finding investment opportunities, through proprietary outreach, intermediaries, inbound submissions, platforms, or relationships.',
  },
  {
    term: 'Due diligence',
    definition:
      'The investigation a buyer runs before closing, covering financial, commercial, legal, tax, operational, technology, and other workstreams.',
  },
  {
    term: 'Underwriting',
    definition:
      'The process of developing the investment case for a company \u2014 financials, market, management, valuation, assumptions, and returns.',
  },
  {
    term: 'Investment thesis',
    definition:
      'The explicit reasoning for why an investment is expected to create value, stated with its assumptions so it can be tested and revisited.',
  },
  {
    term: 'Institutional memory',
    definition:
      'The preserved record of a firm\u2019s decisions, evidence, and outcomes, so every new deal is informed by what came before it.',
  },
  {
    term: 'Value creation',
    definition:
      'The initiatives and operating changes made after acquisition to grow the business and improve its value \u2014 tracked against the original thesis.',
  },
  {
    term: 'Red flag',
    definition:
      'An issue surfaced during screening or diligence that would change the underwriting path \u2014 always linked to the evidence that raised it.',
  },
  {
    term: 'Covenant',
    definition:
      'A condition in a financing or acquisition agreement that the borrower or company must maintain, such as leverage or interest-coverage thresholds.',
  },
  {
    term: 'Normalized financials',
    definition:
      'Financial statements adjusted for one-off, non-recurring, or discretionary items so they reflect the business\u2019s sustainable operating performance.',
  },
  {
    term: 'Exclusivity',
    definition:
      'A period, typically after an LOI, during which a seller agrees to negotiate only with the selected buyer.',
  },
  {
    term: 'Intermediary',
    definition:
      'A broker, investment bank, or advisor that introduces or facilitates deals and often manages the sale process.',
  },
  {
    term: 'Screening',
    definition:
      'Evaluating opportunities against a firm\u2019s investment criteria early in the funnel to decide what deserves underwriting time.',
  },
  {
    term: 'Exit',
    definition:
      'The point at which a firm sells or otherwise monetizes an investment \u2014 for example a trade sale, secondary, or IPO.',
  },
]
