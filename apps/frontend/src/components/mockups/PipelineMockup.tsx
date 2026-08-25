import { MockChip } from './primitives'

/** Investment pipeline surface: kanban columns driven by firm criteria. */
export function PipelineMockup() {
  const columns = [
    {
      title: 'New',
      tone: 'neutral' as const,
      deals: [
        { name: 'Highline Packaging', meta: '$22M rev · introduced 08/20' },
        { name: 'Northwind Fulfillment', meta: '$9M rev · inbound' },
      ],
    },
    {
      title: 'Screening',
      tone: 'primary' as const,
      deals: [
        { name: 'Meridian Logistics', meta: 'Fit analysis ready' },
        { name: 'Bayside Components', meta: 'Red flag: concentration' },
      ],
    },
    {
      title: 'Underwriting',
      tone: 'warn' as const,
      deals: [
        { name: 'Cascade Health Services', meta: 'Model v3 · thesis drafting' },
      ],
    },
    {
      title: 'Diligence',
      tone: 'success' as const,
      deals: [{ name: 'Union Industrial', meta: 'Financial · 12/31 requests' }],
    },
  ]
  return (
    <div className="grid gap-3 bg-canvas p-4 text-left sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => (
        <div
          key={col.title}
          className="flex flex-col gap-2 rounded-[8px] border border-hairline bg-parchment/50 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-ink">
              {col.title}
            </span>
            <MockChip tone={col.tone}>{col.deals.length}</MockChip>
          </div>
          {col.deals.map((d) => (
            <div
              key={d.name}
              className="rounded-[6px] border border-hairline bg-canvas p-2.5"
            >
              <p className="text-[12px] font-medium text-ink">{d.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-muted-48">{d.meta}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
