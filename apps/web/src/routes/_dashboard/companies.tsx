import { createFileRoute } from '@tanstack/react-router'
import { CompaniesPage } from '#/features/companies/components/companies-page'
import { getCompanies } from '#/features/companies/server/queries/get-companies'

export const Route = createFileRoute('/_dashboard/companies')({
  component: CompaniesRoute,
  loader: async () => getCompanies(),
})

function CompaniesRoute() {
  const initialCompanies = Route.useLoaderData()
  return <CompaniesPage initialCompanies={initialCompanies} />
}
