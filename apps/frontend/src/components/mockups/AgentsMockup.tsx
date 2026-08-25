import { MockChip, MockLabel } from './primitives'

/** AI agents surface: an agent acting inside deal context with citations. */
export function AgentsMockup() {
  return (
    <div className="bg-canvas p-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            C
          </span>
          <h3 className="text-[14px] font-semibold text-ink">CIM Agent</h3>
          <MockChip tone="primary">Reading Meridian_Info_Memo.pdf</MockChip>
        </div>
        <MockLabel>Human in the loop</MockLabel>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="ml-7 rounded-[8px] border border-hairline p-3">
          <p className="text-[12px] leading-[1.5] text-ink-muted-80">
            Analyzed the CIM (43 pages). Key observations with source locations:
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[12px] leading-[1.5] text-ink-muted-80">
            <li>
              · Revenue growth driven by 2 add-on acquisitions —{' '}
              <span className="rounded-[4px] bg-parchment px-1.5 py-0.5 text-[10px] text-ink-muted-80">
                § Company Overview, p. 8
              </span>
            </li>
            <li>
              · EBITDA margin expansion assumes freight cost normalization —{' '}
              <span className="rounded-[4px] bg-parchment px-1.5 py-0.5 text-[10px] text-ink-muted-80">
                § Financials, p. 21
              </span>
            </li>
            <li>
              · Customer concentration not disclosed in the CIM — flag to
              request during diligence.
            </li>
          </ul>
        </div>

        <div className="ml-7 flex items-center gap-2 rounded-[8px] border border-primary/30 bg-primary/5 p-3 text-[12px] text-ink-muted-80">
          <span className="font-semibold text-primary">2 open questions</span>
          generated for the diligence request list — pending your review before
          sending.
        </div>

        <div className="ml-7 flex items-center gap-2 rounded-[8px] border border-hairline bg-parchment/50 p-3 text-[12px] text-ink-muted-80">
          <span className="font-semibold text-ink">
            AI prepares and analyzes.
          </span>{' '}
          The team reviews every output before it becomes part of the deal
          record.
        </div>
      </div>
    </div>
  )
}
