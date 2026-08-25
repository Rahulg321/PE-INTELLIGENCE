export interface WorkflowCapability {
  title: string
  copy: string
}

export interface WorkflowDeepSection {
  title: string
  copy: string
  items: string[]
}

export interface WorkflowStage {
  slug: string
  label: string
  shortLabel: string
  /** H1 headline */
  title: string
  /** Lead paragraph under the title */
  description: string
  /** Bold positioning statement */
  positioning: string
  /** How-it-works pipeline (rendered with arrows) */
  pipeline: string[]
  /** Capability grid */
  capabilities: WorkflowCapability[]
  /** Deeper narrative section */
  deep: WorkflowDeepSection
  /** A highlighted principle (large quote) */
  principle: string
  /** Related stages for prev/next navigation */
  prev?: string
  next?: string
}

export const workflows = [
  {
    slug: 'origination',
    label: 'Origination',
    shortLabel: 'Origination',
    title: 'Origination',
    description:
      'Capture opportunities without forcing your team to manually re-enter information. Your existing systems become inputs \u2014 the platform turns fragmented deal flow into structured companies, deals, and relationships.',
    positioning:
      'Your existing systems become inputs. You do not need to migrate your entire CRM into the platform.',
    pipeline: [
      'Input',
      'Company',
      'Deal',
      'Enrichment',
      'Relationship',
      'Screening',
      'Pipeline',
    ],
    capabilities: [
      {
        title: 'Company creation',
        copy: 'A new opportunity becomes a company record with the facts that matter, pulled together from wherever the opportunity arrived.',
      },
      {
        title: 'Deal creation',
        copy: 'Each opportunity is tracked as its own deal, with source, status, and economics \u2014 separate from the facts of the business.',
      },
      {
        title: 'Enrichment',
        copy: 'Companies are enriched with firmographic, financial, and market context so you start with signal rather than a blank page.',
      },
      {
        title: 'Contact mapping',
        copy: 'Owners, intermediaries, operators, and introducers are linked to the deal so the relationship map is visible at a glance.',
      },
      {
        title: 'Intermediary tracking',
        copy: 'Track who introduced what, exclusivity windows, and correspondence with each intermediary across every deal.',
      },
      {
        title: 'Relationship intelligence',
        copy: 'See the full relationship context \u2014 who knows whom, prior interactions, and past deals \u2014 before you reach out.',
      },
      {
        title: 'Sourcing attribution',
        copy: 'Every opportunity keeps its source, so you can measure which channels actually produce the deals worth underwriting.',
      },
      {
        title: 'Automated research',
        copy: 'AI assembles an initial research brief on each new company, market, and management team before a human ever opens the record.',
      },
    ],
    deep: {
      title: 'Origination is a capture problem, not a pipeline problem',
      copy: 'Deal flow arrives through many channels: CRM, email, inbound submissions, spreadsheets, APIs, data providers, documents, and proprietary sourcing. Most teams lose the context of where an opportunity came from, who introduced it, and what was already discussed. The platform captures that context at the point of entry and carries it forward.',
      items: [
        'Inbound submissions and email become company and deal records without re-keying',
        'Spreadsheet trackers can be mapped in as an input, not a system to replace',
        'Duplicate detection keeps the same company from crowding your pipeline twice',
        'Every deal keeps its sourcing attribution and relationship history',
      ],
    },
    principle:
      'Capture once, enrich automatically, and let every downstream stage start from context instead of a blank spreadsheet.',
    prev: undefined,
    next: 'screening',
  },
  {
    slug: 'screening',
    label: 'Screening',
    shortLabel: 'Screening',
    title: 'Screening',
    description:
      'Know what deserves attention before you spend time underwriting it. Every opportunity is evaluated against your firm\u2019s criteria \u2014 and the result is an explanation, not a score.',
    positioning:
      'AI explains why the opportunity fits, where it does not, and what remains unknown. It never reduces a deal to a number.',
    pipeline: [
      'Deal',
      'Rules',
      'Analysis',
      'Red flags',
      'Unknown',
      'Fit',
      'Advance / Pass',
    ],
    capabilities: [
      {
        title: 'Financial fit',
        copy: 'Revenue, EBITDA, margins, growth, cash flow, and leverage are assessed against the thresholds your firm defines.',
      },
      {
        title: 'Market fit',
        copy: 'Market growth, fragmentation, competition, cyclicality, and disruption risk are surfaced from research and documents.',
      },
      {
        title: 'Business quality',
        copy: 'Recurring revenue, retention, pricing power, customer concentration, moat, and growth levers are evaluated qualitatively and quantitatively.',
      },
      {
        title: 'Strategic fit',
        copy: 'Sector, geography, transaction size, and ownership structure are matched against your investment mandate.',
      },
      {
        title: 'Red flags',
        copy: 'Issues that would change the underwriting path are surfaced early, each linked to the evidence that raised it.',
      },
      {
        title: 'Unknowns',
        copy: 'What you do not know yet is listed explicitly \u2014 the screening output is honest about information gaps.',
      },
      {
        title: 'Criteria as rules',
        copy: 'Your investment criteria become machine-readable rules that can be applied consistently across every deal.',
      },
      {
        title: 'Advance or pass',
        copy: 'The output is a recommendation to advance, pass, or gather more information \u2014 always with reasoning a human can follow.',
      },
    ],
    deep: {
      title: 'Screening is about explaining fit, not scoring it',
      copy: 'A generic score tells you nothing about whether a company belongs in your pipeline. The platform evaluates each opportunity against the specific criteria your firm has encoded, surfaces red flags and unknowns, and explains its reasoning in terms your team can verify. Human judgment stays in the loop: AI lays out the fit, the team decides what to advance.',
      items: [
        'Each evaluation is traceable to the criteria, data, and documents behind it',
        'Firm-specific thresholds and mandates drive the analysis, not generic templates',
        'Unknowns are as visible as strengths, so no deal advances on assumptions alone',
        'The screening record survives into underwriting as the starting point',
      ],
    },
    principle:
      'The goal is not a score. It is a clear explanation of fit, risk, and what remains unknown \u2014 so the team can decide where to spend its time.',
    prev: 'origination',
    next: 'underwriting',
  },
  {
    slug: 'underwriting',
    label: 'Underwriting',
    shortLabel: 'Underwriting',
    title: 'Underwriting',
    description:
      'Underwriting means developing the investment case for a company. The platform brings the company, financials, market, management, transaction, and valuation into one connected workspace so the thesis is built from complete context.',
    positioning:
      'The investment thesis becomes a living document \u2014 built from assumptions, pressure-tested across scenarios, and traceable to its sources.',
    pipeline: [
      'Company',
      'Financials',
      'Market',
      'Management',
      'Valuation',
      'Assumptions',
      'Returns',
      'Risks',
      'Thesis',
    ],
    capabilities: [
      {
        title: 'Financial analysis',
        copy: 'LTM and historical financials are normalized and analyzed for trends, margins, and anomalies \u2014 not transcribed by hand.',
      },
      {
        title: 'Historical trends',
        copy: 'Revenue, EBITDA, margin, and cash flow trends are presented across periods so the trajectory is visible at a glance.',
      },
      {
        title: 'Customer analysis',
        copy: 'Concentration, retention, and growth drivers are brought together from documents and data.',
      },
      {
        title: 'Market research',
        copy: 'Market size, growth, competitive dynamics, and positioning are assembled into the underwriting context.',
      },
      {
        title: 'Management assessment',
        copy: 'Management track record and fit are documented in one place, linked to the evidence behind each observation.',
      },
      {
        title: 'Valuation & returns',
        copy: 'Transaction assumptions, debt structure, returns, and sensitivity analysis are organized around your underwriting methodology.',
      },
      {
        title: 'Scenario analysis',
        copy: 'Base, upside, and downside cases are built on explicit assumptions so every outcome can be revisited.',
      },
      {
        title: 'Thesis capture',
        copy: 'The investment thesis is recorded alongside its supporting evidence \u2014 the case the firm is actually buying.',
      },
    ],
    deep: {
      title: 'The thesis is only as good as its assumptions',
      copy: 'Most underwriting effort is spent assembling and reconciling information, not thinking about the investment. The platform compresses the assembly work \u2014 normalizing financials, pulling market and management context, and organizing valuation inputs \u2014 so the team can focus on the assumptions, the risks, and the case. Every assumption can be traced back to the data and documents it came from.',
      items: [
        'Financial analysis and normalization are done with AI assistance, reviewed by the team',
        'Returns and sensitivities sit on explicit, revisable assumptions',
        'The thesis is written alongside its evidence, not in a separate memo',
        'Risks are documented with the same rigor as the upside',
      ],
    },
    principle:
      'Assumptions are made explicit, scenarios are pressure-tested, and the thesis is recorded with the evidence that supports it \u2014 so the case can be defended at IC and revisited after closing.',
    prev: 'screening',
    next: 'diligence',
  },
  {
    slug: 'diligence',
    label: 'Due Diligence',
    shortLabel: 'Diligence',
    title: 'Due Diligence',
    description:
      'Turn diligence into structured investment intelligence. A large body of unstructured material becomes organized workstreams, findings, risks, owners, and deadlines \u2014 a decision system, not a pile of PDFs.',
    positioning:
      'The value is not uploading documents and asking questions. It is converting a large body of unstructured diligence material into a structured decision system.',
    pipeline: [
      'Request',
      'Document',
      'Extraction',
      'Evidence',
      'Finding',
      'Risk',
      'Question',
      'Resolution',
      'IC',
    ],
    capabilities: [
      {
        title: 'Workstreams',
        copy: 'Financial, commercial, legal, tax, operational, technology, HR, and environmental where relevant \u2014 organized the way your diligence runs.',
      },
      {
        title: 'Request lists',
        copy: 'Diligence requests are tracked per workstream, with owners, deadlines, and status.',
      },
      {
        title: 'Document classification',
        copy: 'Documents are classified and routed to the right workstream automatically.',
      },
      {
        title: 'Extraction',
        copy: 'Key facts, figures, and provisions are extracted and linked to the document and page they came from.',
      },
      {
        title: 'Evidence linking',
        copy: 'Every finding references its source document and location, so nothing is asserted without provenance.',
      },
      {
        title: 'Findings & risks',
        copy: 'Findings, risks, contradictions, and missing information are surfaced with owners and resolution status.',
      },
      {
        title: 'Q&A',
        copy: 'Questions are tracked with answers and evidence, resolved or escalated as the timeline requires.',
      },
      {
        title: 'Diligence summaries',
        copy: 'A structured diligence summary is assembled for the investment committee, workstream by workstream.',
      },
    ],
    deep: {
      title: 'From document dump to decision system',
      copy: 'Diligence produces thousands of pages across dozens of sources. Most teams lose time re-finding facts, reconciling contradictions, and hunting for the source of a conclusion. The platform organizes material into workstreams, extracts facts with evidence, and turns findings into a structured picture of risk \u2014 so the IC sees what was verified, what was contradicted, and what remains open.',
      items: [
        'Every finding is linked to its source document, page, and section',
        'Contradictions and gaps are surfaced as first-class items, not buried in notes',
        'Workstreams carry owners, deadlines, and status through to close',
        'The diligence output feeds directly into the IC package',
      ],
    },
    principle:
      'Diligence should produce a structured picture of risk, not a searchable pile of documents.',
    prev: 'underwriting',
    next: 'investment-committee',
  },
  {
    slug: 'investment-committee',
    label: 'Investment Committee',
    shortLabel: 'IC',
    title: 'Investment Committee',
    description:
      'Give decision-makers the context behind the deal. The IC package brings together the company, thesis, financials, valuation, structure, management, market, diligence, risks, and returns \u2014 every conclusion traceable to its evidence.',
    positioning:
      'Every important conclusion should be traceable to its evidence. AI assists in preparing the IC. It does not make the investment decision.',
    pipeline: [
      'Underwriting',
      'Diligence',
      'IC package',
      'Evidence',
      'Risks',
      'Mitigants',
      'Returns',
      'Decision',
    ],
    capabilities: [
      {
        title: 'Company overview',
        copy: 'The business, market, and model summarized from the full record.',
      },
      {
        title: 'Investment thesis',
        copy: 'The case for the investment, stated clearly and tied to its assumptions.',
      },
      {
        title: 'Financial performance',
        copy: 'Historical and projected performance with the key drivers called out.',
      },
      {
        title: 'Valuation & structure',
        copy: 'Valuation, transaction structure, financing, and returns across scenarios.',
      },
      {
        title: 'Management & market',
        copy: 'Management assessment and market context, each with its evidence.',
      },
      {
        title: 'Diligence & risks',
        copy: 'Workstream findings, risks, mitigants, and open questions in one view.',
      },
      {
        title: 'Base, upside, downside',
        copy: 'Returns presented across cases so the decision spans scenarios, not a point estimate.',
      },
      {
        title: 'Evidence trace',
        copy: 'Each conclusion can be opened back to its source document, page, and section.',
      },
    ],
    deep: {
      title: 'Decision support, not decision making',
      copy: 'An IC package is only useful if it can be interrogated. The platform assembles the full context behind the deal and makes every conclusion traceable \u2014 from a headline statement back to the underlying evidence, source, document, and page. AI prepares the briefing and the analysis. The committee makes the decision.',
      items: [
        'Conclusions link to evidence, evidence links to sources, sources link to pages',
        'Open questions and mitigants are presented alongside risks, not hidden',
        'AI drafts the package from the underwriting and diligence record; humans own the decision',
        'The decision and its rationale are captured as part of the firm\u2019s institutional memory',
      ],
    },
    principle:
      'The committee should be able to ask "where does that come from?" and get an answer in one click.',
    prev: 'diligence',
    next: 'transactions',
  },
  {
    slug: 'transactions',
    label: 'Transaction Execution',
    shortLabel: 'Transaction',
    title: 'Transaction Execution',
    description:
      'Execute from LOI through closing with control. Milestones, approvals, advisors, financing, legal workflow, and closing conditions are tracked in one place \u2014 alongside the full diligence and underwriting record.',
    positioning:
      'The platform supports execution and coordination. It does not replace legal counsel or transaction advisors.',
    pipeline: [
      'LOI',
      'Diligence',
      'Negotiation',
      'Financing',
      'Legal',
      'Approvals',
      'Closing',
      'Post-close',
    ],
    capabilities: [
      {
        title: 'Transaction checklist',
        copy: 'Every step from LOI to close is tracked with status and owners.',
      },
      {
        title: 'Deal milestones',
        copy: 'Key dates and milestones are visible to the whole deal team.',
      },
      {
        title: 'Document tracking',
        copy: 'Execution versions, signature status, and document flow are tracked without losing history.',
      },
      {
        title: 'Approvals',
        copy: 'Internal approvals and their evidence are recorded as the transaction advances.',
      },
      {
        title: 'Advisors',
        copy: 'Legal, financial, tax, and other advisors are tracked with their deliverables and deadlines.',
      },
      {
        title: 'Financing',
        copy: 'Financing steps and conditions are tracked alongside the transaction.',
      },
      {
        title: 'Closing conditions',
        copy: 'Closing conditions are tracked to completion, each tied to its source.',
      },
      {
        title: 'Post-close handover',
        copy: 'The full record carries into portfolio monitoring \u2014 nothing is lost at close.',
      },
    ],
    deep: {
      title: 'Control without replacing your advisors',
      copy: 'Transaction execution is coordination-heavy: advisors, financing, legal, approvals, and a deadline that does not move. The platform keeps every step, owner, document, and condition in one view so the deal team knows what is done, what is at risk, and what happens next \u2014 while the experts you already work with stay in charge of their domains.',
      items: [
        'A single execution view replaces scattered trackers and email chains',
        'Approvals and their evidence are recorded for the record',
        'Closing conditions are tracked to completion against their sources',
        'The complete investment record flows into portfolio monitoring',
      ],
    },
    principle:
      'Execution is coordination. Give the team one view of every step, owner, and condition \u2014 and let the advisors do the advising.',
    prev: 'investment-committee',
    next: 'portfolio',
  },
  {
    slug: 'portfolio',
    label: 'Portfolio / Value Creation',
    shortLabel: 'Portfolio',
    title: 'Portfolio / Value Creation',
    description:
      'The investment thesis should not disappear after closing. The platform keeps the underwritten case visible against actual performance, so monitoring, value creation, and exit are one continuous thread \u2014 not a fresh start.',
    positioning:
      'The underwritten case is the baseline. Actual performance is measured against it, for the life of the investment.',
    pipeline: ['Underwrite', 'Acquire', 'Operate', 'Monitor', 'Exit'],
    capabilities: [
      {
        title: 'Underwritten vs actual',
        copy: 'Revenue, EBITDA, margin, cash flow, working capital, and leverage tracked against the original case.',
      },
      {
        title: 'KPIs',
        copy: 'The metrics your firm cares about, monitored on the cadence you set.',
      },
      {
        title: 'Operating initiatives',
        copy: 'Value creation initiatives are tracked with owners and progress.',
      },
      {
        title: 'Budgets & forecasts',
        copy: 'Budgets and forecasts sit alongside actuals so variance is always visible.',
      },
      {
        title: 'Covenants',
        copy: 'Covenant headroom and compliance are tracked before they become a surprise.',
      },
      {
        title: 'Alerts',
        copy: 'Significant changes and threshold breaches are surfaced for review.',
      },
      {
        title: 'Continuity',
        copy: 'The thesis, diligence, and transaction record remain attached to the investment.',
      },
      {
        title: 'Exit readiness',
        copy: 'The full investment history is ready to support an exit when the firm decides the time is right.',
      },
    ],
    deep: {
      title: 'Continuity across the entire investment',
      copy: 'The same thesis that won IC is the baseline the portfolio is measured against. Actual performance, operating initiatives, budgets, forecasts, and covenants live next to the original case \u2014 so the firm always knows whether the investment is tracking to plan, and why. When it is time to exit, the complete record \u2014 thesis, diligence, decisions, and outcomes \u2014 is ready to support the process and the next decision.',
      items: [
        'The underwritten case is the baseline for monitoring, not a forgotten memo',
        'Variance is explained against the original assumptions',
        'Operating initiatives and covenants are tracked alongside the numbers',
        'The exit is prepared from the full investment history',
      ],
    },
    principle:
      'The investment thesis should not disappear after closing. It is the baseline for every monitoring decision and the foundation of the next one.',
    prev: 'transactions',
    next: undefined,
  },
] as const satisfies readonly WorkflowStage[]

export type WorkflowItem = (typeof workflows)[number]
export type WorkflowSlug = WorkflowItem['slug']

export function getWorkflow(slug: string): WorkflowItem | undefined {
  return workflows.find((w) => w.slug === slug)
}

export const workflowSlugs = workflows.map((w) => w.slug)
