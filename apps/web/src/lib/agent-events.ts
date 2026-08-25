/**
 * Shapes and helpers for `agent_events` rows.
 *
 * Lives in `lib/` (not a component) so server fns can map DB rows to a
 * JSON-safe payload type that passes TanStack Start's serializability check,
 * and the UI can render the same shape.
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Payload stored by the agent's audit hook (kind "step") and by low-confidence
 * fact recording (kind "proposal").
 */
export type AgentActivityPayload = {
  text?: string | null
  toolCalls?: { toolName?: string | null; args?: JsonValue }[] | null
  finishReason?: string | null
  usage?: {
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
  } | null
  field?: string | null
  value?: JsonValue
  evidence?: string | null
  confidence?: number | null
}

type AgentEventRow = { payload?: unknown }

export function isAgentEventPayload(value: unknown): value is AgentActivityPayload {
  return typeof value === 'object' && value !== null
}

/**
 * Casts the raw jsonb payload to the typed JSON-safe payload. Server fns return
 * the result, so the `unknown` from drizzle's jsonb column must be narrowed here.
 */
export function mapAgentEvents<T extends AgentEventRow>(rows: T[]): Array<T & { payload: AgentActivityPayload | null }> {
  return rows.map((row) => ({
    ...row,
    payload: isAgentEventPayload(row.payload) ? row.payload : null,
  }))
}
