export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'Is this another AI chatbot?',
    answer:
      'No. The platform is an intelligence and workflow layer for the investment process. AI operates inside the context of your deals, criteria, documents, and workflow state \u2014 preparing analysis and automating repetitive work. It is not a blank chat window.',
  },
  {
    question: 'Do we have to replace our existing systems?',
    answer:
      'No. The platform is designed to connect to the systems you already use \u2014 CRM, email, cloud storage, data rooms, and spreadsheets \u2014 so they become inputs. You do not have to migrate everything into the platform to get value from it.',
  },
  {
    question: 'Can it work with our firm\u2019s investment criteria?',
    answer:
      'Yes. The platform is configured around how your firm invests \u2014 sectors, geographies, check sizes, financial thresholds, and process \u2014 and encodes those criteria as rules that apply consistently across deals. Nothing is hard-coded to one firm\u2019s approach.',
  },
  {
    question: 'Can we trust what the AI says?',
    answer:
      'Every AI output is designed to be verifiable. Conclusions link to evidence, evidence links to sources, and sources link to the document and page they came from. AI prepares and analyzes; humans decide.',
  },
  {
    question: 'Does it replace our financial modeling software?',
    answer:
      'No. The platform organizes the context around underwriting \u2014 financials, market, management, valuation inputs, and assumptions \u2014 so the thesis is built from complete context. Your modeling approach stays yours.',
  },
  {
    question: 'How is sensitive deal information protected?',
    answer:
      'Each firm operates in an isolated tenant, access is role-based and permission-scoped down to the document, sensitive actions are audited, and AI processing respects the firm\u2019s permissions. We publish our security posture on the Security page and do not overstate certifications.',
  },
  {
    question: 'Who is this built for?',
    answer:
      'Private equity, independent sponsors, family offices, venture and growth firms, investment banking and M&A teams, and corporate development teams \u2014 any professional investment organization with a repeatable lifecycle.',
  },
]
