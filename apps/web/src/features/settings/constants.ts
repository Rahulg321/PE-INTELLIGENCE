export const SETTINGS_NAV = [
  { to: '/settings', label: 'General', exact: true },
  { to: '/settings/security', label: 'Security', exact: true },
  { to: '/settings/mandate', label: 'Investment mandate', exact: true },
  { to: '/settings/members', label: 'Members', exact: true },
  { to: '/settings/sso', label: 'SSO', exact: true },
  { to: '/settings/connections', label: 'Connections', exact: true },
] as const

export const CONTEXT_API_SIGNUP_URL = 'https://context.ai'

export const RESEARCH_MODELS = [
  {
    id: 'deepseek:deepseek-chat',
    label: 'Default — DeepSeek Chat',
  },
  {
    id: 'openai:gpt-4o-mini',
    label: 'OpenAI GPT-4o mini',
  },
] as const

export const RESEARCH_MODEL_IDS = [
  RESEARCH_MODELS[0].id,
  RESEARCH_MODELS[1].id,
] as const

export type ResearchModelId = (typeof RESEARCH_MODEL_IDS)[number]

export const DEFAULT_RESEARCH_MODEL: ResearchModelId = RESEARCH_MODEL_IDS[0]

export function isResearchModelId(value: string): value is ResearchModelId {
  return (RESEARCH_MODEL_IDS as readonly string[]).includes(value)
}
