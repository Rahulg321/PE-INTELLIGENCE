import { db, deals } from 'db'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import type { CreateDealInput } from '../schemas'

const randomId = () => crypto.randomUUID()

export const dealsService = {
  async create(userId: string, input: CreateDealInput) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')

    const company = await db.query.companies.findFirst({
      where: { id: input.companyId, workspaceId: activeWorkspaceId },
      columns: { id: true },
    })
    if (!company) throw new Error('Company not found in this workspace')

    const dealId = randomId()
    await db.insert(deals).values({
      id: dealId,
      workspaceId: activeWorkspaceId,
      companyId: input.companyId,
      name: input.name.trim(),
      status: input.status ?? 'NEW',
      stage: input.stage ?? 'INITIAL_REVIEW',
      dealType: input.dealType,
      source: input.source?.trim() || null,
    })

    return { id: dealId }
  },

  async list(userId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return []

    const rows = await db.query.deals.findMany({
      where: { workspaceId: activeWorkspaceId },
      with: { companies: true },
      orderBy: { updatedAt: 'desc' },
    })

    return rows.map(({ companies: company, ...deal }) => ({ ...deal, company }))
  },

  async get(userId: string, dealId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return null

    const deal = await db.query.deals.findFirst({
      where: { id: dealId, workspaceId: activeWorkspaceId },
      with: {
        companies: { with: { contacts: true } },
        economics: true,
      },
    })
    if (!deal) return null

    const events = await db.query.agentEvents.findMany({
      where: {
        workspaceId: activeWorkspaceId,
        entityId: dealId,
      },
      columns: { id: true, kind: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      limit: 50,
    })

    return { deal, events }
  },
}
