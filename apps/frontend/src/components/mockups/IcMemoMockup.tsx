import { MockChip, MockLabel } from './primitives'

/** Investment Committee surface: memo sections with an evidence trace. */
export function IcMemoMockup() {
  return (
    <div className="flex flex-col gap-4 bg-canvas p-4 text-left sm:flex-row">
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <MockLabel>IC package · 14 pages</MockLabel>
            <MockChip tone="primary">Decision-ready</MockChip>
          </div>
          <h3 className="mt-1 text-[16px] font-semibold text-ink">
            Meridian Logistics Group
          </h3>
          <p className="mt-0.5 text-[12px] text-ink-muted-48">
            Industrial services · $48M revenue · Enterprise value $72M
          </p>
        </div>

        {[
          {
            title: 'Investment thesis',
            lines: [
              'Fragmented niche consolidator with pricing power',
              'Replicable acquisition playbook across 3 add-ons',
            ],
          },
          {
            title: 'Key risks & mitigants',
            lines: [
              'Customer concentration 54% — two contracts signed through 2027',
              'Owner transition — 6-month operator transition plan',
            ],
          },
          {
            title: 'Returns',
            lines: [
              'Base 2.1x MOIC · 19% IRR',
              'Downside 1.3x MOIC · flat IRR',
            ],
          },
        ].map((s) => (
          <div
            key={s.title}
            className="rounded-[8px] border border-hairline p-3"
          >
            <p className="text-[11px] font-semibold text-ink">{s.title}</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {s.lines.map((l) => (
                <li
                  key={l}
                  className="text-[12px] leading-[1.5] text-ink-muted-80"
                >
                  · {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="w-full sm:w-56">
        <MockLabel>Conclusion · traceable to evidence</MockLabel>
        <div className="mt-2 flex flex-col gap-1.5 rounded-[8px] border border-hairline bg-parchment/50 p-3 text-[11px]">
          {[
            ['Conclusion', 'Recurring revenue is limited'],
            ['Evidence', '28% of revenue under contract'],
            ['Source', 'FY24 financials, customer list'],
            ['Document', 'Meridian_Info_Memo.pdf'],
            ['Page / section', '§ Financials, p. 12'],
          ].map(([k, v], i) => (
            <div key={k} className="flex flex-col gap-0.5">
              <span className="font-semibold text-primary">{k}</span>
              <span
                className={
                  i === 0 ? 'font-medium text-ink' : 'text-ink-muted-80'
                }
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
