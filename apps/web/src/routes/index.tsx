import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { getSessionStatus } from '#/features/auth/server/queries/get-session-status'

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async () => {
    const status = await getSessionStatus()
    if (!status.signedIn) {
      throw redirect({ to: '/login' })
    }
  },
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">PE Intelligence</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Deal intake, research, and screening for investment firms.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  )
}
