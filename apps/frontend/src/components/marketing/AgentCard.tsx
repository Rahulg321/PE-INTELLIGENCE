import type { Agent } from '~/content/agents'

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-canvas p-6">
      <h3 className="text-[17px] font-semibold text-ink">{agent.name}</h3>

      <dl className="flex flex-col gap-3">
        {[
          { label: 'Input', value: agent.input },
          { label: 'AI action', value: agent.action },
          { label: 'Output', value: agent.output },
          { label: 'Human review', value: agent.humanReview },
        ].map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-l-2 border-hairline pl-3"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
              {row.label}
            </dt>
            <dd className="text-[13px] leading-[1.5] text-ink-muted-80">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
