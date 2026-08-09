import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { getSessionStatus } from '#/lib/queries'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (status.signedIn) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start screening deals.
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() =>
            void authClient.signIn.social({
              provider: 'google',
              callbackURL: '/dashboard',
            })
          }
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
