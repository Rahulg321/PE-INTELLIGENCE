import { createFileRoute } from '@tanstack/react-router'
import { WorkflowPage } from '~/components/marketing/WorkflowPage'
import { getWorkflow } from '~/content/workflows'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_marketing/workflows/diligence')({
  component: Diligence,
  head: () => ({
    ...seo({
      title:
        'Due Diligence — Turn material into structured investment intelligence',
      description:
        'Private equity due diligence software that organizes workstreams, requests, documents, findings, risks, and owners \u2014 a decision system, not a pile of PDFs.',
      canonical: '/workflows/diligence',
    }),
  }),
})

function Diligence() {
  return <WorkflowPage workflow={getWorkflow('diligence')!} />
}
