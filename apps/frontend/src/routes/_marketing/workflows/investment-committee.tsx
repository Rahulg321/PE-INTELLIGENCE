import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute(
  '/_marketing/workflows/investment-committee',
)({
  component: InvestmentCommittee,
  head: () => ({
    ...seo({
      title:
        'Investment Committee — Give decision-makers the context behind the deal',
      description:
        'Investment committee software that prepares decision-ready IC packages where every conclusion is traceable to its evidence. AI prepares; the committee decides.',
      canonical: '/workflows/investment-committee',
    }),
  }),
})

function InvestmentCommittee() {
  return <WorkflowPage workflow={getWorkflow('investment-committee')!} />
}
