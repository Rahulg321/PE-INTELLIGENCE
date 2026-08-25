import { MockChip, MockLabel, MockStat } from './primitives'

/** Deal Intelligence surface: deal header, KPIs, financial snapshot, source panel. */
export function DealIntelMockup() {
  return (
    <div className="flex bg-canvas text-left">
      {/* Sidebar */}
      <aside className="hidden w-40 shrink-0 border-r border-hairline bg-parchment/60 p-3 sm:block">
        <div className="flex flex-col gap-1">
          {[
            'Overview',
            'Financials',
            'Documents',
            'Relationships',
            'Diligence',
            'IC',
            'Activity',
          ].map((item, i) => (
            <span
              key={item}
              className={
                i === 0
                  ? 'rounded-[6px] bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary'
                  : 'rounded-[6px] px-2.5 py-1.5 text-[11px] text-ink-muted-48'
              }
            >
              {item}
            </span>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold text-ink">
                Meridian Logistics Group
              </h3>
              <MockChip tone="primary">Screening</MockChip>
            </div>
            <p className="mt-0.5 text-[12px] text-ink-muted-48">
              Industrial services · Midwest · Introduced by Sequoia Capital
              Advisors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MockChip>Revenue $48M</MockChip>
            <MockChip>EBITDA $9.4M</MockChip>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MockStat
            label="LTM Revenue"
            value="$48.2M"
            delta="+11.4% YoY"
            deltaTone="success"
          />
          <MockStat label="LTM EBITDA" value="$9.4M" delta="19.5% margin" />
          <MockStat label="Growth" value="11.4%" delta="2-yr CAGR" />
          <MockStat label="Concentration" value="23%" delta="Top customer" />
        </div>

        <div className="mt-3 overflow-hidden rounded-[8px] border border-hairline">
          <div className="flex items-center justify-between border-b border-hairline bg-parchment/60 px-3 py-1.5">
            <MockLabel>Financial snapshot</MockLabel>
            <span className="text-[10px] text-ink-muted-48">
              Source: LTM · FY24 · FY23
            </span>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-ink-muted-48">
                <th className="px-3 py-1.5 text-left font-medium">Metric</th>
                <th className="px-3 py-1.5 text-right font-medium tabular-nums">
                  LTM
                </th>
                <th className="px-3 py-1.5 text-right font-medium tabular-nums">
                  FY24
                </th>
                <th className="px-3 py-1.5 text-right font-medium tabular-nums">
                  FY23
                </th>
              </tr>
            </thead>
            <tbody className="text-ink-muted-80">
              {[
                ['Revenue', '48.2', '44.1', '39.8'],
                ['EBITDA', '9.4', '8.3', '6.9'],
                ['EBITDA margin', '19.5%', '18.8%', '17.3%'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-divider-soft">
                  <td className="px-3 py-1.5 font-medium text-ink">{row[0]}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row[1]}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row[2]}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source panel */}
      <aside className="hidden w-52 shrink-0 border-l border-hairline bg-parchment/40 p-3 lg:block">
        <MockLabel>Enrichment</MockLabel>
        <ul className="mt-2 flex flex-col gap-1.5 text-[11px] text-ink-muted-80">
          <li className="rounded-[6px] border border-hairline bg-canvas px-2.5 py-1.5">
            Market: fragmented, top-4 share 18%
          </li>
          <li className="rounded-[6px] border border-hairline bg-canvas px-2.5 py-1.5">
            Ownership: founder-led, 2 locations
          </li>
          <li className="rounded-[6px] border border-hairline bg-canvas px-2.5 py-1.5">
            Customer concentration: top 5 = 54%
          </li>
        </ul>
        <MockLabel className="mt-3 block">Relationship</MockLabel>
        <div className="mt-2 flex items-center gap-2 rounded-[6px] border border-hairline bg-canvas px-2.5 py-1.5 text-[11px] text-ink-muted-80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary">
            JD
          </span>
          J. Davis · Partner, 3 prior deals
        </div>
      </aside>
    </div>
  )
}
