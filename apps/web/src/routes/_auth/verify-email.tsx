import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmailPage } from '#/features/auth/components/verify-email-page'
import { verifyEmailSearchSchema } from '#/features/auth/schemas'

export const Route = createFileRoute('/_auth/verify-email')({
  component: VerifyEmailRoute,
  validateSearch: verifyEmailSearchSchema,
})

function VerifyEmailRoute() {
  const { token, callbackURL } = Route.useSearch()
  return <VerifyEmailPage token={token} callbackURL={callbackURL} />
}
