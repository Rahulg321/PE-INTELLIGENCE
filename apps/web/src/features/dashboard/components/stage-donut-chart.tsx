import { Label, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '#/components/ui/empty'
import { DEAL_STAGE_LABEL } from '#/features/deals/components/columns'
import { formatCompactCurrency } from '../helpers'
import type { DashboardStageSlice } from '../server/dashboard-service'

const STAGE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

export function StageDonutChart({
  data,
  totalValue,
}: {
  data: DashboardStageSlice[]
  totalValue: number
}) {
  const chartConfig = {
    value: { label: 'Pipeline' },
    ...Object.fromEntries(
      data.map((slice, index) => [
        slice.stage,
        {
          label: DEAL_STAGE_LABEL[slice.stage],
          color: STAGE_COLORS[index % STAGE_COLORS.length],
        },
      ]),
    ),
  } satisfies ChartConfig

  const chartData = data.map((slice) => ({
    stage: slice.stage,
    value: slice.value,
    dealCount: slice.dealCount,
    fill: `var(--color-${slice.stage})`,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Open pipeline by stage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {data.length === 0 ? (
          <Empty className="min-h-[220px] border-0">
            <EmptyHeader>
              <EmptyTitle>No open pipeline</EmptyTitle>
              <EmptyDescription>
                Open deals will appear here by stage.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px] min-h-[180px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="stage"
                      formatter={(value, name) => (
                        <div className="flex flex-1 items-center justify-between gap-8">
                          <span className="text-muted-foreground">
                            {DEAL_STAGE_LABEL[name as keyof typeof DEAL_STAGE_LABEL] ??
                              name}
                          </span>
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {formatCompactCurrency(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="stage"
                  innerRadius={58}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) {
                        return null
                      }
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl font-bold"
                          >
                            {formatCompactCurrency(totalValue)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            open
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex flex-col gap-2">
              {data.map((slice, index) => (
                <li
                  key={slice.stage}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: STAGE_COLORS[index % STAGE_COLORS.length],
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {DEAL_STAGE_LABEL[slice.stage]}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {slice.dealCount} {slice.dealCount === 1 ? 'deal' : 'deals'}
                  </span>
                  <span className="w-16 text-right font-medium tabular-nums">
                    {formatCompactCurrency(slice.value)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
