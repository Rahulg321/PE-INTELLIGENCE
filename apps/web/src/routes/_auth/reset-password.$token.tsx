import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '#/features/auth/components/reset-password-page'

export const Route = createFileRoute('/_auth/reset-password/$token')({
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { token } = Route.useParams()
  return <ResetPasswordPage token={token} />
}
