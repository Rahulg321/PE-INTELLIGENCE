import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '#/features/auth/components/login-page'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (status.signedIn) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
