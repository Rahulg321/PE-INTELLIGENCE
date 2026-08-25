import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { workflows } from '~/content/workflows'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_marketing/workflows')({
  component: WorkflowsLayout,
})

function WorkflowsLayout() {
  const pathname = useLocation({ select: (s) => s.pathname })

  return (
    <>
      {/* Stage sub-nav */}
      <nav
        aria-label="Investment workflow stages"
        className="sticky top-16 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md"
      >
        <div className="marketing-container flex items-center gap-1 overflow-x-auto py-2">
          <Link
            to="/workflows"
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition',
              pathname === '/workflows'
                ? 'bg-ink text-white'
                : 'text-ink-muted-80 hover:bg-parchment hover:text-ink',
            )}
          >
            Overview
          </Link>
          {workflows.map((w) => {
            const active = pathname === `/workflows/${w.slug}`
            return (
              <Link
                key={w.slug}
                to={`/workflows/${w.slug}`}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition',
                  active
                    ? 'bg-ink text-white'
                    : 'text-ink-muted-80 hover:bg-parchment hover:text-ink',
                )}
              >
                {w.shortLabel}
              </Link>
            )
          })}
        </div>
      </nav>
      <Outlet />
    </>
  )
}
