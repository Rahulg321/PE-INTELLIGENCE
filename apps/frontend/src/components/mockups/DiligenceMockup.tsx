import { MockChip } from './primitives'

/** Due diligence surface: workstreams, findings with evidence, and status. */
export function DiligenceMockup() {
  const workstreams = [
    'Financial',
    'Commercial',
    'Legal',
    'Tax',
    'Operational',
    'IT',
  ]
  const findings = [
    {
      ws: 'Financial',
      text: 'FY24 gross margin restated from 42% to 38% after adjusting for capitalized labor.',
      evidence: 'P&L FY24.xlsx · p.3',
      tone: 'warn' as const,
    },
    {
      ws: 'Legal',
      text: 'Master services agreement auto-renews unless terminated 120 days prior.',
      evidence: 'MSA Acme Corp.pdf · §7.2',
      tone: 'neutral' as const,
    },
    {
      ws: 'Commercial',
      text: 'Top customer contract under negotiation; renewal share-of-wallet risk.',
      evidence: 'Customer interview notes',
      tone: 'danger' as const,
    },
    {
      ws: 'Operational',
      text: 'Two suppliers represent 71% of COGS; no dual-sourcing in place.',
      evidence: 'Supplier spend report',
      tone: 'warn' as const,
    },
  ]
  return (
    <div className="grid gap-4 bg-canvas p-4 text-left sm:grid-cols-[auto_1fr]">
      <div className="flex gap-1.5 sm:flex-col">
        {workstreams.map((ws, i) => (
          <span
            key={ws}
            className={
              i === 0
                ? 'rounded-[6px] bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary'
                : 'rounded-[6px] px-2.5 py-1.5 text-[11px] text-ink-muted-48'
            }
          >
            {ws}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-ink">
            Financial · Findings
          </h3>
          <div className="flex gap-1.5">
            <MockChip>42 requests</MockChip>
            <MockChip tone="primary">31 closed</MockChip>
            <MockChip tone="warn">6 open</MockChip>
          </div>
        </div>
        {findings.map((f) => (
          <div
            key={f.text}
            className="rounded-[6px] border border-hairline p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[12px] leading-[1.5] text-ink-muted-80">
                {f.text}
              </p>
              <MockChip tone={f.tone}>
                {f.tone === 'warn'
                  ? 'Risk'
                  : f.tone === 'danger'
                    ? 'Risk'
                    : 'Finding'}
              </MockChip>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-ink-muted-48">Evidence:</span>
              <span className="rounded-[4px] bg-parchment px-1.5 py-0.5 text-[10px] font-medium text-ink-muted-80">
                {f.evidence}
              </span>
              <span className="ml-auto text-[10px] text-ink-muted-48">
                Owner: VP · Due 09/12
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
