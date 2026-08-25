import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/transactions')({
  component: Transactions,
  head: () => ({
    ...seo({
      title: 'Transaction Execution — From LOI through closing with control',
      description:
        'Track milestones, approvals, advisors, financing, legal workflow, and closing conditions across the transaction \u2014 without replacing your advisors.',
      canonical: '/workflows/transactions',
    }),
  }),
})

function Transactions() {
  return <WorkflowPage workflow={getWorkflow('transactions')!} />
}
