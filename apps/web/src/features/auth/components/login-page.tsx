import { authClient } from '../client'
import { Button } from '#/components/ui/button'

export function LoginPage() {
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
