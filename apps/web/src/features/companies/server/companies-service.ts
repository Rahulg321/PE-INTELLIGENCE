import { and, eq } from 'drizzle-orm'
import { agentEvents, agentTasks, companies, db } from 'db'
import { env } from 'cloudflare:workers'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import { AGENT_KIND, AGENT_PRIORITY } from '../constants'
import type { CreateCompanyInput, UpdateCompanyInput } from '../schemas'

const AGENT_URL = process.env.AGENT_URL ?? 'http://localhost:4000'
const randomId = () => crypto.randomUUID()

const CLOSED_DEAL_STATUSES = new Set(['PASSED', 'LOST', 'WON'])

async function enqueueTask(input: {
  workspaceId: string
  kind: string
  entityType: string
  entityId: string
  reason: string
  priority: number
}) {
  await db.insert(agentTasks).values({
    id: randomId(),
    workspaceId: input.workspaceId,
    kind: input.kind,
    entityType: input.entityType,
    entityId: input.entityId,
    reason: input.reason,
    priority: input.priority,
    dueAt: new Date(),
  })

  await notifyAgent(input)
}

/**
 * In production, hand the task to the agent via its queue (the agent Worker's
 * queue consumer starts a durable Workflow per task). In local dev there is no
 * queue consumer running, so fall back to poking the local Bun agent directly.
 */
async function notifyAgent(input: {
  workspaceId: string
  kind: string
  entityType: string
  entityId: string
  reason: string
  priority: number
}) {
  if (!import.meta.env.DEV) {
    try {
      await env.AGENT_QUEUE.send(input)
      return
    } catch (error) {
      console.error('queue send failed, falling back to poke', error)
    }
  }
  void fetch(`${AGENT_URL}/internal/crm/dispatch`, { method: 'POST' }).catch(
    () => { },
  )
}

export const companiesService = {
  async create(userId: string, input: CreateCompanyInput) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')

    const companyId = randomId()
    await db.insert(companies).values({
      id: companyId,
      workspaceId: activeWorkspaceId,
      displayName: input.name.trim(),
      website: input.website?.trim() || null,
      enrichmentStatus: 'PENDING',
    })

    await enqueueTask({
      workspaceId: activeWorkspaceId,
      kind: AGENT_KIND.brand,
      entityType: 'company',
      entityId: companyId,
      reason: 'New company',
      priority: AGENT_PRIORITY.brand,
    })
    await enqueueTask({
      workspaceId: activeWorkspaceId,
      kind: AGENT_KIND.companyProfile,
      entityType: 'company',
      entityId: companyId,
      reason: 'New company',
      priority: AGENT_PRIORITY.companyProfile,
    })

    return { id: companyId }
  },

  async update(userId: string, input: UpdateCompanyInput) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')

    const updated = await db
      .update(companies)
      .set({
        displayName: input.name.trim(),
        website: input.website?.trim() || null,
      })
      .where(
        and(
          eq(companies.id, input.companyId),
          eq(companies.workspaceId, activeWorkspaceId),
        ),
      )
      .returning({ id: companies.id })

    if (updated.length === 0) throw new Error('Company not found')
    return { id: updated[0].id }
  },

  async delete(userId: string, companyId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) throw new Error('No workspace selected')

    await db.transaction(async (tx) => {
      await tx
        .delete(agentTasks)
        .where(
          and(
            eq(agentTasks.entityId, companyId),
            eq(agentTasks.entityType, 'company'),
          ),
        )
      await tx
        .delete(agentEvents)
        .where(
          and(
            eq(agentEvents.entityId, companyId),
            eq(agentEvents.entityType, 'company'),
          ),
        )
      const deleted = await tx
        .delete(companies)
        .where(
          and(
            eq(companies.id, companyId),
            eq(companies.workspaceId, activeWorkspaceId),
          ),
        )
        .returning({ id: companies.id })

      if (deleted.length === 0) throw new Error('Company not found')
    })

    return { ok: true as const }
  },

  async list(userId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return []

    const rows = await db.query.companies.findMany({
      where: { workspaceId: activeWorkspaceId },
      columns: {
        id: true,
        displayName: true,
        website: true,
        industry: true,
        subIndustry: true,
        logoUrl: true,
        description: true,
        employeeCount: true,
        headquartersCity: true,
        headquartersCountry: true,
        enrichmentStatus: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        contacts: { columns: { id: true } },
        deals: { columns: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return rows.map((row) => {
      const { contacts, deals, ...company } = row
      return {
        ...company,
        contactCount: contacts.length,
        openDealCount: deals.filter(
          (deal) => !CLOSED_DEAL_STATUSES.has(deal.status),
        ).length,
      }
    })
  },

  async get(userId: string, companyId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return null

    const company = await db.query.companies.findFirst({
      where: { id: companyId, workspaceId: activeWorkspaceId },
      with: {
        contacts: true,
        deals: { with: { economics: true } },
      },
    })
    if (!company) return null

    const [openTasks, events] = await Promise.all([
      db.query.agentTasks.findMany({
        where: {
          entityId: companyId,
          finishedAt: { isNull: true },
        },
        columns: { id: true, kind: true, outcome: true },
      }),
      db.query.agentEvents.findMany({
        where: {
          workspaceId: activeWorkspaceId,
          entityId: companyId,
        },
        columns: { id: true, kind: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        limit: 50,
      }),
    ])

    return { company, events, enriching: openTasks.length > 0 }
  },
}
