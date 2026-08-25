export interface ComparisonColumn {
  slug: string
  title: string
  subtitle: string
  accent?: boolean
}

export interface ComparisonRow {
  dimension: string
  values: Record<string, string>
}

export const comparisonColumns: ComparisonColumn[] = [
  {
    slug: 'fragmented',
    title: 'Fragmented stack',
    subtitle: 'CRM + Excel + email + documents + manual workflows',
  },
  {
    slug: 'generic-ai',
    title: 'Generic AI',
    subtitle: 'Chat + prompts + isolated answers',
  },
  {
    slug: 'traditional',
    title: 'Traditional investment software',
    subtitle: 'Rigid workflows + data silos + manual processes',
  },
  {
    slug: 'ours',
    title: 'Our approach',
    subtitle: 'Connected data + investment context + AI + evidence',
    accent: true,
  },
]

export const comparisonRows: ComparisonRow[] = [
  {
    dimension: 'Context across the deal',
    values: {
      fragmented: 'Split across tools; assembled by hand',
      'generic-ai': 'Answers without firm or deal context',
      traditional: 'Confined to the module you are in',
      ours: 'One connected view across the lifecycle',
    },
  },
  {
    dimension: 'What AI does',
    values: {
      fragmented: 'No AI layer',
      'generic-ai': 'Answers questions in isolation',
      traditional: 'Rules without reasoning',
      ours: 'Analyses inside your data, criteria, and workflows',
    },
  },
  {
    dimension: 'Evidence',
    values: {
      fragmented: 'Held in people\u2019s heads and inboxes',
      'generic-ai': 'Sources are unclear or absent',
      traditional: 'Buried in attachments',
      ours: 'Every conclusion links to its source',
    },
  },
  {
    dimension: 'Firm criteria',
    values: {
      fragmented: 'Applied inconsistently by memory',
      'generic-ai': 'Not configured to your firm',
      traditional: 'Hard-coded to one process',
      ours: 'Configured around how your firm invests',
    },
  },
  {
    dimension: 'Institutional memory',
    values: {
      fragmented: 'Lives with the people who leave',
      'generic-ai': 'None',
      traditional: 'Siloed and unreadable',
      ours: 'Decisions, evidence, and outcomes compound',
    },
  },
  {
    dimension: 'Who decides',
    values: {
      fragmented: 'The person who can find the files',
      'generic-ai': 'Unverified AI output',
      traditional: 'The process, inflexibly',
      ours: 'The investment team, with full context',
    },
  },
]
