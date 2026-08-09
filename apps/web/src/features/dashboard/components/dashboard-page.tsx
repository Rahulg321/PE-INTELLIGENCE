import { authClient } from '#/features/auth/client'
import { Button } from '#/components/ui/button'
import type { getDashboardData } from '../server/queries/get-dashboard-data'

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

export function DashboardPage({ data }: { data: DashboardData }) {
  const mandate = data?.mandate

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Your investment mandate is ready</h1>
      <p className="mt-3 text-muted-foreground">
        Let's screen your first deal. Research will evaluate the company,
        industry, management team, and investment fit automatically.
      </p>
      {mandate && (
        <div className="mt-8 rounded-md border bg-muted/30 p-6">
          <h2 className="font-semibold">Mandate summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-32 text-muted-foreground">Geography</dt>
              <dd>{mandate.geography.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 text-muted-foreground">Investment type</dt>
              <dd>{mandate.investmentTypes.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 text-muted-foreground">EBITDA</dt>
              <dd>
                {mandate.minEbitda != null
                  ? `$${(mandate.minEbitda / 1e6).toFixed(0)}M`
                  : '—'}
                {' – '}
                {mandate.maxEbitda != null
                  ? `$${(mandate.maxEbitda / 1e6).toFixed(0)}M`
                  : '—'}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-32 text-muted-foreground">Version</dt>
              <dd>v{mandate.version}</dd>
            </div>
          </dl>
        </div>
      )}
      <div className="mt-8">
        <Button disabled>Screen your first deal</Button>
        <p className="mt-2 text-xs text-muted-foreground">Coming soon.</p>
      </div>
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => {
            void authClient.signOut()
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
