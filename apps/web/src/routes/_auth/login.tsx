import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '#/features/auth/components/login-page'
import { loginSearchSchema } from '#/features/auth/schemas'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/_auth/login')({
  component: LoginRoute,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (status.signedIn) {
      throw redirect({ to: '/dashboard' })
    }
  },
  validateSearch: loginSearchSchema,
})

function LoginRoute() {
  const { reset } = Route.useSearch()
  return <LoginPage resetSuccess={reset === 'success'} />
}
