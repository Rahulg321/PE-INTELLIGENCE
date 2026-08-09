import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data: session, isPending } = authClient.useSession()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <div className="mt-8">
        {isPending ? (
          <p>Loading session...</p>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{session.user.name}</p>
              <p className="text-sm text-neutral-500">{session.user.email}</p>
            </div>
            <Button onClick={() => void authClient.signOut()} variant="outline">
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            onClick={() =>
              void authClient.signIn.social({ provider: 'google' })
            }
          >
            Continue with Google
          </Button>
        )}
      </div>
    </div>
  )
}
