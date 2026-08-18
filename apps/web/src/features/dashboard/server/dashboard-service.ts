import { db } from 'db'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import type { DealStage } from '#/features/deals/schemas'

const OPEN_STATUSES = new Set(['NEW', 'ACTIVE', 'ON_HOLD'])
const LOST_STATUSES = new Set(['PASSED', 'LOST'])
const MONTH_COUNT = 5
const OPEN_DEALS_LIMIT = 8
const OVERDUE_TASKS_LIMIT = 8

export type DashboardOpenDeal = {
  id: string
  name: string
  companyName: string
  logoUrl: string | null
  stage: DealStage
  value: number
}

export type DashboardStageSlice = {
  stage: DealStage
  dealCount: number
  value: number
}

export type DashboardMonthPoint = {
  month: string
  newPipeline: number
  closedWon: number
}

export type DashboardOverdueTask = {
  id: string
  kind: string
  reason: string | null
  dueAt: Date
  entityType: string
  entityId: string
}

export type DashboardData = {
  userName: string
  closedThisMonth: {
    value: number
    dealCount: number
    lastMonthValue: number
    trendPct: number | null
  }
  openPipeline: {
    value: number
    dealCount: number
    closingValue: number
  }
  winRate90d: {
    rate: number
    won: number
    lost: number
  }
  averageDeal90d: {
    value: number
    cycleDays: number | null
  }
  monthly: DashboardMonthPoint[]
  pipelineByStage: DashboardStageSlice[]
  openDeals: DashboardOpenDeal[]
  overdueTasks: DashboardOverdueTask[]
}

function parseAmount(value: string | null | undefined) {
  if (value == null || value === '') return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function dealValue(economics: {
  enterpriseValue: string | null
  equityPurchasePrice: string | null
} | null) {
  return (
    parseAmount(economics?.enterpriseValue) ||
    parseAmount(economics?.equityPurchasePrice)
  )
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value)
}

function wonAt(deal: { announcedDate: Date | null; updatedAt: Date }) {
  return deal.announcedDate ? toDate(deal.announcedDate) : toDate(deal.updatedAt)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function inRange(date: Date, start: Date, end: Date) {
  return date >= start && date < end
}

function lastMonths(count: number, now: Date) {
  return Array.from({ length: count }, (_, index) => {
    const offset = count - 1 - index
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    return {
      label: start.toLocaleString('en-US', { month: 'short' }),
      start,
      end: new Date(start.getFullYear(), start.getMonth() + 1, 1),
    }
  })
}

function trendPct(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

function emptyDashboard(userName: string, now = new Date()): DashboardData {
  return {
    userName,
    closedThisMonth: {
      value: 0,
      dealCount: 0,
      lastMonthValue: 0,
      trendPct: 0,
    },
    openPipeline: { value: 0, dealCount: 0, closingValue: 0 },
    winRate90d: { rate: 0, won: 0, lost: 0 },
    averageDeal90d: { value: 0, cycleDays: null },
    monthly: lastMonths(MONTH_COUNT, now).map((month) => ({
      month: month.label,
      newPipeline: 0,
      closedWon: 0,
    })),
    pipelineByStage: [],
    openDeals: [],
    overdueTasks: [],
  }
}

export const dashboardService = {
  async getData(user: { id: string; name: string }): Promise<DashboardData> {
    const now = new Date()
    const { activeWorkspaceId } = await workspacesService.list(user.id)
    if (!activeWorkspaceId) return emptyDashboard(user.name, now)

    const [dealRows, openTasks] = await Promise.all([
      db.query.deals.findMany({
        where: { workspaceId: activeWorkspaceId },
        with: { companies: true, economics: true },
      }),
      db.query.agentTasks.findMany({
        where: {
          workspaceId: activeWorkspaceId,
          finishedAt: { isNull: true },
        },
        columns: {
          id: true,
          kind: true,
          reason: true,
          dueAt: true,
          entityType: true,
          entityId: true,
        },
        orderBy: { dueAt: 'asc' },
        limit: 50,
      }),
    ])

    const deals = dealRows
    const thisMonthStart = startOfMonth(now)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const since90d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const openDeals = deals.filter((deal) => OPEN_STATUSES.has(deal.status))
    const wonDeals = deals.filter((deal) => deal.status === 'WON')

    const closedThisMonthDeals = wonDeals.filter((deal) =>
      inRange(wonAt(deal), thisMonthStart, new Date(now.getFullYear(), now.getMonth() + 1, 1)),
    )
    const closedLastMonthDeals = wonDeals.filter((deal) =>
      inRange(wonAt(deal), lastMonthStart, thisMonthStart),
    )
    const closedThisMonthValue = closedThisMonthDeals.reduce(
      (sum, deal) => sum + dealValue(deal.economics),
      0,
    )
    const closedLastMonthValue = closedLastMonthDeals.reduce(
      (sum, deal) => sum + dealValue(deal.economics),
      0,
    )

    const openValue = openDeals.reduce((sum, deal) => sum + dealValue(deal.economics), 0)
    const closingValue = openDeals
      .filter((deal) => deal.stage === 'CLOSING' || deal.stage === 'LOI')
      .reduce((sum, deal) => sum + dealValue(deal.economics), 0)

    const resolved90d = deals.filter((deal) => {
      if (deal.status !== 'WON' && !LOST_STATUSES.has(deal.status)) return false
      return wonAt(deal) >= since90d
    })
    const won90d = resolved90d.filter((deal) => deal.status === 'WON')
    const lost90d = resolved90d.filter((deal) => LOST_STATUSES.has(deal.status))
    const won90dValue = won90d.reduce((sum, deal) => sum + dealValue(deal.economics), 0)
    const cycleDays =
      won90d.length === 0
        ? null
        : Math.round(
            won90d.reduce((sum, deal) => {
              const created = toDate(deal.createdAt).getTime()
              const closed = wonAt(deal).getTime()
              return sum + Math.max(0, closed - created)
            }, 0) /
              won90d.length /
              86_400_000,
          )

    const stageTotals = new Map<DealStage, DashboardStageSlice>()
    for (const deal of openDeals) {
      const current = stageTotals.get(deal.stage) ?? {
        stage: deal.stage,
        dealCount: 0,
        value: 0,
      }
      current.dealCount += 1
      current.value += dealValue(deal.economics)
      stageTotals.set(deal.stage, current)
    }

    return {
      userName: user.name,
      closedThisMonth: {
        value: closedThisMonthValue,
        dealCount: closedThisMonthDeals.length,
        lastMonthValue: closedLastMonthValue,
        trendPct: trendPct(closedThisMonthValue, closedLastMonthValue),
      },
      openPipeline: {
        value: openValue,
        dealCount: openDeals.length,
        closingValue,
      },
      winRate90d: {
        rate: resolved90d.length === 0 ? 0 : won90d.length / resolved90d.length,
        won: won90d.length,
        lost: lost90d.length,
      },
      averageDeal90d: {
        value: won90d.length === 0 ? 0 : won90dValue / won90d.length,
        cycleDays,
      },
      monthly: lastMonths(MONTH_COUNT, now).map((month) => ({
        month: month.label,
        newPipeline: deals
          .filter((deal) => inRange(toDate(deal.createdAt), month.start, month.end))
          .reduce((sum, deal) => sum + dealValue(deal.economics), 0),
        closedWon: wonDeals
          .filter((deal) => inRange(wonAt(deal), month.start, month.end))
          .reduce((sum, deal) => sum + dealValue(deal.economics), 0),
      })),
      pipelineByStage: [...stageTotals.values()].sort((a, b) => b.value - a.value),
      openDeals: [...openDeals]
        .sort((a, b) => toDate(b.updatedAt).getTime() - toDate(a.updatedAt).getTime())
        .slice(0, OPEN_DEALS_LIMIT)
        .map((deal) => ({
          id: deal.id,
          name: deal.name,
          companyName: deal.companies?.displayName ?? '—',
          logoUrl: deal.companies?.logoUrl ?? null,
          stage: deal.stage,
          value: dealValue(deal.economics),
        })),
      overdueTasks: openTasks
        .filter((task) => toDate(task.dueAt) < now)
        .slice(0, OVERDUE_TASKS_LIMIT)
        .map((task) => ({
          id: task.id,
          kind: task.kind,
          reason: task.reason,
          dueAt: task.dueAt,
          entityType: task.entityType,
          entityId: task.entityId,
        })),
    }
  },
}
