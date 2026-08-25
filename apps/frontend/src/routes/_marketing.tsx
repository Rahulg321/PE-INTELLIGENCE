import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Navbar } from '~/components/marketing/Navbar'
import { Footer } from '~/components/marketing/Footer'
import { track } from '~/lib/analytics'

/** Fires a `page_view` analytics event whenever the route changes (client-side). */
function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    track('page_view', { page: location.pathname })
  }, [location.pathname])
  return null
}

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <PageViewTracker />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
