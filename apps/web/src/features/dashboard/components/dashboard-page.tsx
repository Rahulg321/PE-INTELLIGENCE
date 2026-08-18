import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CircleCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '#/components/ui/toggle-group'
import { DEAL_STAGE_LABEL } from '#/features/deals/components/columns'
import type { getDashboardData } from '../server/queries/get-dashboard-data'
import {
  firstName,
  formatCompactCurrency,
  formatPercent,
  humanizeToken,
} from '../helpers'
import { PipelineAreaChart } from './pipeline-area-chart'
import { StageDonutChart } from './stage-donut-chart'

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>

function formatDueDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function taskLink(task: DashboardData['overdueTasks'][number]) {
  switch (task.entityType) {
    case 'company':
      return { to: '/companies' as const, search: { companyId: task.entityId } }
    case 'deal':
      return { to: '/deals' as const, search: { dealId: task.entityId } }
    default:
      return null
  }
}

function KpiCard({
  title,
  value,
  hint,
  footer,
}: {
  title: string
  value: string
  hint?: ReactNode
  footer: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {hint}
      </CardHeader>
      <CardFooter>
        <p className="text-sm text-muted-foreground">{footer}</p>
      </CardFooter>
    </Card>
  )
}

export function DashboardPage({ data }: { data: DashboardData }) {
  const [scope, setScope] = useState('everyone')
  const closed = data.closedThisMonth
  const trend =
    closed.trendPct == null ? null : (
      <span
        className={
          closed.trendPct < 0
            ? 'flex items-center gap-1 text-sm text-destructive'
            : 'flex items-center gap-1 text-sm text-muted-foreground'
        }
      >
        {closed.trendPct < 0 ? (
          <TrendingDown className="size-4" />
        ) : (
          <TrendingUp className="size-4" />
        )}
        {`${closed.trendPct > 0 ? '+' : ''}${Math.round(closed.trendPct)}% vs. last month`}
      </span>
    )

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-4 md:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {firstName(data.userName)}
          </h1>
          <p className="text-muted-foreground">
            What the team has closed, what is still in play, and what needs you
            today.
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={scope}
          onValueChange={(value) => {
            if (value) setScope(value)
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="me">Me</ToggleGroupItem>
          <ToggleGroupItem value="everyone">Everyone</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Closed won this month"
          value={formatCompactCurrency(closed.value)}
          hint={trend}
          footer={`${closed.dealCount} ${closed.dealCount === 1 ? 'deal' : 'deals'} · ${formatCompactCurrency(closed.lastMonthValue)} last month`}
        />
        <KpiCard
          title="Open pipeline"
          value={formatCompactCurrency(data.openPipeline.value)}
          footer={`${data.openPipeline.dealCount} ${data.openPipeline.dealCount === 1 ? 'deal' : 'deals'} in progress · ${formatCompactCurrency(data.openPipeline.closingValue)} in closing`}
        />
        <KpiCard
          title="Win rate (90d)"
          value={formatPercent(data.winRate90d.rate)}
          footer={`${data.winRate90d.won} won · ${data.winRate90d.lost} lost`}
        />
        <KpiCard
          title="Average deal (90d)"
          value={formatCompactCurrency(data.averageDeal90d.value)}
          footer={
            data.averageDeal90d.cycleDays == null
              ? 'No closed deals in the last 90 days'
              : `${data.averageDeal90d.cycleDays}-day average cycle`
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PipelineAreaChart data={data.monthly} />
        </div>
        <div className="lg:col-span-2">
          <StageDonutChart
            data={data.pipelineByStage}
            totalValue={data.openPipeline.value}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Deals in progress</CardTitle>
            <CardDescription>
              Active opportunities still moving through the pipeline.
            </CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm">
                <Link to="/deals">
                  Open deals
                  <ArrowUpRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {data.openDeals.length === 0 ? (
              <Empty className="border-0 py-8">
                <EmptyHeader>
                  <EmptyTitle>No open deals</EmptyTitle>
                  <EmptyDescription>
                    Screen a company to start a deal in this workspace.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.openDeals.map((deal) => (
                    <TableRow key={deal.id} className="cursor-pointer">
                      <TableCell>
                        <Link
                          to="/deals"
                          search={{ dealId: deal.id }}
                          className="flex min-w-0 items-center gap-3"
                        >
                          {deal.logoUrl ? (
                            <img
                              src={deal.logoUrl}
                              alt=""
                              className="size-8 shrink-0 rounded-md border bg-background object-contain p-0.5"
                            />
                          ) : (
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-semibold">
                              {deal.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="truncate font-medium">{deal.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {DEAL_STAGE_LABEL[deal.stage]}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompactCurrency(deal.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Overdue tasks</CardTitle>
            <CardDescription>
              Research work that is past due and still open.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.overdueTasks.length === 0 ? (
              <Empty className="min-h-[180px] border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CircleCheck />
                  </EmptyMedia>
                  <EmptyTitle>You are caught up</EmptyTitle>
                  <EmptyDescription>
                    Every task you have logged is either done or still to come.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.overdueTasks.map((task) => {
                    const href = taskLink(task)
                    const label = task.reason?.trim() || humanizeToken(task.kind)
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          {href ? (
                            <Link
                              {...href}
                              className="font-medium hover:underline"
                            >
                              {label}
                            </Link>
                          ) : (
                            <span className="font-medium">{label}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {formatDueDate(task.dueAt)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
