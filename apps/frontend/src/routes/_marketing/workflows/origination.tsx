import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/origination')({
  component: Origination,
  head: () => ({
    ...seo({
      title: 'Origination — Capture deal flow without re-entering it',
      description:
        'Investment deal sourcing across CRM, email, inbound submissions, spreadsheets, and data providers \u2014 your existing systems become inputs.',
      canonical: '/workflows/origination',
    }),
  }),
})

function Origination() {
  return <WorkflowPage workflow={getWorkflow('origination')!} />
}
