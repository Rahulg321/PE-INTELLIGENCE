import type { Persona } from '~/content/personas'

export function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-hairline bg-canvas p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted-48">
        {persona.group}
      </p>
      <h3 className="text-[15px] font-semibold text-ink">{persona.title}</h3>
      <p className="text-[14px] leading-[1.5] text-ink-muted-80">
        {persona.copy}
      </p>
    </div>
  )
}
