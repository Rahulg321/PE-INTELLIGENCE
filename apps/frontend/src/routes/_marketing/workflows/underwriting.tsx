import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/underwriting')({
  component: Underwriting,
  head: () => ({
    ...seo({
      title: 'Underwriting — Build the investment thesis from complete context',
      description:
        'Financials, market, management, valuation, assumptions, and risks in one connected workspace \u2014 the investment case built from complete context.',
      canonical: '/workflows/underwriting',
    }),
  }),
})

function Underwriting() {
  return <WorkflowPage workflow={getWorkflow('underwriting')!} />
}
