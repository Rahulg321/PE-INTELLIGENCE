import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart'
import { formatCompactCurrency } from '../helpers'
import type { DashboardMonthPoint } from '../server/dashboard-service'

const chartConfig = {
  newPipeline: {
    label: 'New pipeline',
    color: 'var(--chart-2)',
  },
  closedWon: {
    label: 'Closed won',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function PipelineAreaChart({ data }: { data: DashboardMonthPoint[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Closed won vs. new pipeline</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex flex-1 items-center justify-between gap-8">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ??
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
            <Area
              dataKey="closedWon"
              type="natural"
              fill="var(--color-closedWon)"
              fillOpacity={0.4}
              stroke="var(--color-closedWon)"
              stackId="a"
            />
            <Area
              dataKey="newPipeline"
              type="natural"
              fill="var(--color-newPipeline)"
              fillOpacity={0.4}
              stroke="var(--color-newPipeline)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
