import { Activity, Lightbulb, Sparkles } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import type { AgentActivityPayload } from '#/lib/agent-events'
import { isAgentEventPayload } from '#/lib/agent-events'

export type AgentActivityEvent = {
  id: string
  kind: string
  stepNumber?: number | null
  createdAt: Date | string
  payload?: unknown
}

function getPayload(payload: unknown): AgentActivityPayload {
  return isAgentEventPayload(payload) ? payload : {}
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function argsSummary(args: unknown): string {
  if (args === null || args === undefined) return ''
  const raw = typeof args === 'string' ? args : JSON.stringify(args)
  return raw.length > 120 ? `${raw.slice(0, 120)}…` : raw
}

function StepEvent({
  event,
  payload,
}: {
  event: AgentActivityEvent
  payload: AgentActivityPayload
}) {
  const toolCalls = payload.toolCalls ?? []
  const finished = payload.finishReason === 'stop' || payload.finishReason === 'done'

  return (
    <li className="rounded-md border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium">Turn {event.stepNumber ?? '—'}</span>
          {finished ? (
            <Badge variant="secondary">finished</Badge>
          ) : (
            <Badge variant="outline">{payload.finishReason ?? 'running'}</Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(event.createdAt)}
        </span>
      </div>

      {payload.text ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {payload.text}
        </p>
      ) : null}

      {toolCalls.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">called</span>
          {toolCalls.map((call, index) => {
            const name = call.toolName ?? 'tool'
            const summary = argsSummary(call.args)
            return (
              <Badge key={index} variant="outline" title={summary ? `${name}: ${summary}` : name}>
                {name}
              </Badge>
            )
          })}
        </div>
      ) : null}

      {payload.usage ? (
        <p className="mt-2 text-xs text-muted-foreground/70">
          {payload.usage.inputTokens ?? 0} in · {payload.usage.outputTokens ?? 0} out
        </p>
      ) : null}
    </li>
  )
}

function ProposalEvent({
  payload,
  createdAt,
}: {
  payload: AgentActivityPayload
  createdAt: AgentActivityEvent['createdAt']
}) {
  const confidence = Math.round((payload.confidence ?? 0) * 100)
  return (
    <li className="rounded-md border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium">Proposed fact</span>
          <Badge variant="secondary">{confidence}% confidence</Badge>
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
      </div>
      <p className="mt-2 text-sm">
        <span className="font-medium">{payload.field ?? 'field'}</span>
        {' = '}
        {displayValue(payload.value)}
      </p>
      {payload.evidence ? (
        <p className="mt-1 text-sm text-muted-foreground">{payload.evidence}</p>
      ) : null}
    </li>
  )
}

function GenericEvent({ event }: { event: AgentActivityEvent }) {
  const payload = getPayload(event.payload)
  const summary = JSON.stringify(payload)
  return (
    <li className="rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{event.kind}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(event.createdAt)}
        </span>
      </div>
      {summary && summary !== '{}' ? (
        <p className="mt-1 break-all text-xs text-muted-foreground">{summary}</p>
      ) : null}
    </li>
  )
}

export function AgentActivity({
  events,
  emptyTitle = 'No activity yet',
  emptyDescription = 'Agent runs and updates will show up here.',
}: {
  events: AgentActivityEvent[]
  emptyTitle?: string
  emptyDescription?: string
}) {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event) => {
        const payload = getPayload(event.payload)
        if (event.kind === 'step') {
          return <StepEvent key={event.id} event={event} payload={payload} />
        }
        if (event.kind === 'proposal') {
          return <ProposalEvent key={event.id} payload={payload} createdAt={event.createdAt} />
        }
        return <GenericEvent key={event.id} event={event} />
      })}
    </ul>
  )
}
