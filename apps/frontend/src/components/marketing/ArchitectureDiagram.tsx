import { productLayers } from '~/content/product'

/**
 * The five-layer product architecture. Each layer is a band; bands stack with
 * downward connectors. Data flows up, intent flows down.
 */
export function ArchitectureDiagram({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ol className="flex flex-col">
        {productLayers.map((layer, i) => {
          const last = i === productLayers.length - 1
          return (
            <li key={layer.slug}>
              <div className="rounded-lg border border-hairline bg-canvas p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="sm:max-w-xs">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-muted-48">
                      {layer.name}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.55] text-ink-muted-80">
                      {layer.copy}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-hairline bg-surface-pearl px-3 py-1.5 text-[12px] text-ink-muted-80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {!last ? (
                <div aria-hidden="true" className="flex justify-center py-1.5">
                  <svg
                    viewBox="0 0 16 24"
                    className="h-6 w-4 text-ink-muted-48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 1v22M4 18l4 4 4-4" />
                  </svg>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
