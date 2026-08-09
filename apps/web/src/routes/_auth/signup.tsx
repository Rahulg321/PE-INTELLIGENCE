import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignupPage } from '#/features/auth/components/signup-page'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (status.signedIn) {
      throw redirect({ to: '/dashboard' })
    }
  },
})
