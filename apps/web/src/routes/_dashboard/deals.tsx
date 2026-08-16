import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/deals')({
  component: DealsRoute,
})

function DealsRoute() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="kicker">Deals</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">Deals</h1>
    </div>
  )
}
