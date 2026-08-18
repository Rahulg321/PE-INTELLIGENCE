import { createFileRoute } from '@tanstack/react-router'
import { CompaniesPage } from '#/features/companies/components/companies-page'
import { companiesSearchSchema } from '#/features/companies/schemas'
import { getCompanies } from '#/features/companies/server/queries/get-companies'

export const Route = createFileRoute('/_dashboard/companies')({
  component: CompaniesRoute,
  validateSearch: companiesSearchSchema,
  loader: async () => getCompanies(),
})

function CompaniesRoute() {
  const initialCompanies = Route.useLoaderData()
  const { companyId, tab, add } = Route.useSearch()
  return (
    <CompaniesPage
      initialCompanies={initialCompanies}
      companyId={companyId}
      tab={tab}
      add={add}
    />
  )
}
