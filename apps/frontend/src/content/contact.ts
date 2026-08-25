import type { DemoRequest } from '~/lib/contact/schema'

export type FirmType =
  | 'Private Equity'
  | 'Independent Sponsor'
  | 'Family Office'
  | 'Venture / Growth'
  | 'Investment Banking / M&A'
  | 'Corporate Development'
  | 'Other'

export interface ContactFieldOption {
  value: string
  label: string
}

export interface ContactField {
  name: keyof DemoRequest
  label: string
  type: 'text' | 'email' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  options?: ContactFieldOption[]
}

export const firmTypes: FirmType[] = [
  'Private Equity',
  'Independent Sponsor',
  'Family Office',
  'Venture / Growth',
  'Investment Banking / M&A',
  'Corporate Development',
  'Other',
]

export const dealVolumes = [
  '1–5 deals per year',
  '5–15 deals per year',
  '15–50 deals per year',
  '50+ deals per year',
  'Not sure yet',
]

export const contactFields: ContactField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Jane Smith',
    required: true,
  },
  {
    name: 'email',
    label: 'Work email',
    type: 'email',
    placeholder: 'jane@firm.com',
    required: true,
  },
  {
    name: 'firm',
    label: 'Firm',
    type: 'text',
    placeholder: 'Firm name',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'text',
    placeholder: 'Partner, Principal, VP\u2026',
  },
  {
    name: 'firmType',
    label: 'Firm type',
    type: 'select',
    options: firmTypes.map((f) => ({ value: f, label: f })),
  },
  {
    name: 'dealVolume',
    label: 'Approximate deal volume',
    type: 'select',
    options: dealVolumes.map((d) => ({ value: d, label: d })),
  },
  {
    name: 'workflow',
    label: 'Current workflow',
    type: 'text',
    placeholder: 'CRM + Excel + email\u2026',
  },
  {
    name: 'problem',
    label: 'Primary problem',
    type: 'textarea',
    placeholder: 'What is the hardest part of your current process?',
  },
  {
    name: 'notes',
    label: 'Tell us about your current process',
    type: 'textarea',
    placeholder: 'Optional \u2014 anything else we should know.',
  },
]
