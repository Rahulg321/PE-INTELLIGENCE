import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/portfolio')({
  component: Portfolio,
  head: () => ({
    ...seo({
      title:
        'Portfolio — The investment thesis should not disappear after closing',
      description:
        'Track the underwritten case against actual performance, with covenants, KPIs, budgets, and value creation initiatives \u2014 through operation and exit.',
      canonical: '/workflows/portfolio',
    }),
  }),
})

function Portfolio() {
  return <WorkflowPage workflow={getWorkflow('portfolio')!} />
}
