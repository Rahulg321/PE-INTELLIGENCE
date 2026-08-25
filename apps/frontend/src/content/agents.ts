export interface Agent {
  slug: string
  name: string
  /** What the agent takes in */
  input: string
  /** What the agent does */
  action: string
  /** What it produces */
  output: string
  /** What the human reviews */
  humanReview: string
}

export const agents: Agent[] = [
  {
    slug: 'deal-research',
    name: 'Deal Research Agent',
    input: 'Company, market, or sector',
    action:
      'Assembles structured research from documents, data sources, and web research \u2014 firmographics, market, competitive landscape, and positioning.',
    output: 'Structured research brief with sources',
    humanReview:
      'The team reviews the brief, fills context, and decides what to pursue.',
  },
  {
    slug: 'screening',
    name: 'Screening Agent',
    input: 'A new opportunity',
    action:
      'Evaluates the opportunity against the firm\u2019s encoded criteria \u2014 financial, market, quality, and strategic fit \u2014 and surfaces red flags and unknowns.',
    output: 'Investment-fit analysis with reasoning',
    humanReview:
      'The team reads the explanation, verifies the evidence, and advances or passes.',
  },
  {
    slug: 'cim',
    name: 'CIM Agent',
    input: 'A Confidential Information Memorandum (CIM)',
    action:
      'Reads the CIM and produces a company analysis, key questions, and red flags \u2014 each tied to the section it came from.',
    output: 'Company analysis + questions + red flags',
    humanReview:
      'The team verifies findings against the source document before acting.',
  },
  {
    slug: 'financial',
    name: 'Financial Agent',
    input: 'Financial statements',
    action:
      'Normalizes historical and LTM financials, analyzes trends and margins, and flags anomalies and inconsistencies.',
    output: 'Normalized analysis + anomalies',
    humanReview:
      'The team reviews the normalization and decides which anomalies matter.',
  },
  {
    slug: 'diligence',
    name: 'Diligence Agent',
    input: 'The diligence workspace',
    action:
      'Reads across workstreams and documents, surfaces missing items, contradictions, and findings, and links each to its evidence.',
    output: 'Missing items + contradictions + findings',
    humanReview:
      'The team triages findings, assigns owners, and resolves open items.',
  },
  {
    slug: 'ic',
    name: 'IC Agent',
    input: 'Underwriting and diligence record',
    action:
      'Drafts a decision-ready briefing \u2014 company, thesis, financials, valuation, risks, mitigants, returns \u2014 with every conclusion traced to its source.',
    output: 'Decision-ready IC briefing',
    humanReview:
      'The committee reads the briefing, interrogates the evidence, and decides.',
  },
  {
    slug: 'portfolio',
    name: 'Portfolio Agent',
    input: 'Portfolio data',
    action:
      'Monitors actual performance against the underwritten case and surfaces changes, variances, and covenant risk.',
    output: 'Performance changes + alerts',
    humanReview: 'The team reviews alerts and decides what requires action.',
  },
]
