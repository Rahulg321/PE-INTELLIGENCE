import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPasswordPage } from '#/features/auth/components/forgot-password-page'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (status.signedIn) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
