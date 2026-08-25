import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { brand } from '~/lib/brand'
import { primaryNav, navCta, navSecondary } from '~/content/site'
import { cn } from '~/lib/utils'
import { BrandMark } from './BrandMark'
import { Button } from './Button'
import { Cta } from './Cta'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const signIn = navSecondary.href ? (
    <Button
      to={navSecondary.href}
      variant="ghost"
      size="sm"
      className="hidden sm:inline-flex"
    >
      {navSecondary.label}
    </Button>
  ) : (
    <span
      className="hidden cursor-not-allowed text-[13px] text-ink-muted-48 sm:inline-flex"
      title="Sign in becomes available when the application launches"
    >
      {navSecondary.label}
    </span>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="marketing-container flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          aria-label={`${brand.name} home`}
        >
          <BrandMark className="h-6 w-6 text-ink" />
          <span className="text-[15px] font-semibold tracking-[-0.28px] text-ink">
            {brand.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex">
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="text-[13px] font-normal text-ink-muted-80 transition hover:text-ink"
                  activeProps={{ className: 'text-ink' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {signIn}
          <Cta
            event="demo_requested"
            page={pathname}
            section="navbar"
            source="navbar"
            location="header"
            label={navCta.label}
            to={navCta.href}
            size="sm"
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-[8px] text-ink transition hover:bg-parchment lg:hidden"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          'grid lg:hidden transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden border-t border-hairline bg-canvas">
          <nav aria-label="Primary mobile" className="marketing-container py-4">
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block border-b border-divider-soft py-3.5 text-[17px] text-ink transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3">
              {navSecondary.href ? (
                <Button
                  to={navSecondary.href}
                  variant="dark"
                  size="md"
                  className="w-full"
                >
                  {navSecondary.label}
                </Button>
              ) : null}
              <Cta
                event="demo_requested"
                page={pathname}
                section="navbar"
                source="mobile-menu"
                location="header"
                label={navCta.label}
                to={navCta.href}
                className="w-full"
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
