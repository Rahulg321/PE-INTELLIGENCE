import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/companies')({
  component: CompaniesRoute,
})

function CompaniesRoute() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="kicker">Companies</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">
        Companies
      </h1>
    </div>
  )
}
