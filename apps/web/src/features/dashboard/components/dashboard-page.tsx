import { authClient } from '#/features/auth/client'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { getDashboardData } from '../server/queries/get-dashboard-data'

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

export function DashboardPage({ data }: { data: DashboardData }) {
  const mandate = data?.mandate

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="kicker">Dashboard</span>
      <h1 className="mt-3 text-[40px] font-semibold leading-[1.1]">
        Your investment mandate is ready
      </h1>
      <p className="mt-3 max-w-xl text-[17px] leading-[1.47] tracking-[-0.374px] text-muted-foreground">
        Let's screen your first deal. Research will evaluate the company,
        industry, management team, and investment fit automatically.
      </p>
      {mandate && (
        <Card className="mt-10 rounded-lg border bg-card shadow-none">
          <CardHeader className="px-6">
            <CardTitle className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]">
              Mandate summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="mt-2 space-y-2.5 text-sm">
              <div className="flex gap-2">
                <dt className="w-32 text-muted-foreground">Geography</dt>
                <dd>
                  {mandate.primaryGeography ?? ''}
                  {mandate.primaryGeography && mandate.targetGeographies.length > 0
                    ? ' · '
                    : ''}
                  {mandate.targetGeographies
                    .filter((geo) => geo !== mandate.primaryGeography)
                    .join(', ')}
                </dd>
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
          </CardContent>
        </Card>
      )}
      <div className="mt-10">
        <Button size="lg" disabled>
          Screen your first deal
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Coming soon.</p>
      </div>
      <div className="mt-10">
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
