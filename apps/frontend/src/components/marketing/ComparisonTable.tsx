import { comparisonColumns, comparisonRows } from '~/content/comparison'
import { cn } from '~/lib/utils'

/**
 * Fragmented stack vs generic AI vs traditional software vs our approach.
 * Desktop renders a table; mobile renders stacked cards.
 */
export function ComparisonTable({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[14%] border-b border-hairline pb-4 pr-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
                &nbsp;
              </th>
              {comparisonColumns.map((col) => (
                <th
                  key={col.slug}
                  className={cn(
                    'border-b pb-4 pr-4 align-top',
                    col.accent ? 'border-primary/40' : 'border-hairline',
                  )}
                >
                  <span
                    className={cn(
                      'block text-[15px] font-semibold leading-tight',
                      col.accent ? 'text-primary' : 'text-ink',
                    )}
                  >
                    {col.title}
                  </span>
                  <span className="mt-1 block text-[12px] font-normal leading-[1.4] text-ink-muted-48">
                    {col.subtitle}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.dimension}>
                <td className="border-b border-divider-soft py-4 pr-4 text-[14px] font-semibold text-ink">
                  {row.dimension}
                </td>
                {comparisonColumns.map((col) => (
                  <td
                    key={col.slug}
                    className={cn(
                      'border-b border-divider-soft py-4 pr-4 align-top text-[14px] leading-[1.5]',
                      col.accent ? 'text-primary' : 'text-ink-muted-80',
                    )}
                  >
                    {row.values[col.slug]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {comparisonRows.map((row) => (
          <div
            key={row.dimension}
            className="rounded-lg border border-hairline bg-canvas p-5"
          >
            <h3 className="text-[14px] font-semibold text-ink">
              {row.dimension}
            </h3>
            <div className="mt-3 space-y-3">
              {comparisonColumns.map((col) => (
                <div key={col.slug} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 h-2 w-2 shrink-0 rounded-full',
                      col.accent ? 'bg-primary' : 'bg-chip',
                    )}
                  />
                  <div>
                    <p className="text-[13px] font-medium text-ink">
                      {col.title}
                    </p>
                    <p className="text-[13px] leading-[1.45] text-ink-muted-48">
                      {row.values[col.slug]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
