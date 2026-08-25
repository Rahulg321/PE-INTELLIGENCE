import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/screening')({
  component: Screening,
  head: () => ({
    ...seo({
      title: 'Screening — Evaluate deals against your investment criteria',
      description:
        'Screen every opportunity against your firm\u2019s criteria \u2014 and understand why it fits, where it does not, and what remains unknown.',
      canonical: '/workflows/screening',
    }),
  }),
})

function Screening() {
  return <WorkflowPage workflow={getWorkflow('screening')!} />
}
