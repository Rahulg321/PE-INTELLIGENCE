import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { SETTINGS_NAV } from '../constants'

export function SettingsLayout() {
  const pathname = useLocation().pathname

  return (
    <div className="-m-4 flex min-h-0 flex-1">
      <nav
        aria-label="Settings"
        className="w-52 shrink-0 border-r border-hairline bg-background px-3 py-6"
      >
        <ul className="flex flex-col gap-0.5">
          {SETTINGS_NAV.map((item) => {
            const isActive = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(`${item.to}/`)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-sm',
                    isActive
                      ? 'bg-muted font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="min-w-0 flex-1 overflow-y-auto px-8 py-8">
        <Outlet />
      </div>
    </div>
  )
}
