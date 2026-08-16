import { and, eq, isNull } from 'drizzle-orm'
import { agentTasks, companies, db } from 'db'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import { AGENT_KIND, AGENT_PRIORITY } from '../constants'
import type { CreateCompanyInput } from '../schemas'

const AGENT_URL = process.env.AGENT_URL ?? 'http://localhost:4000'
const randomId = () => crypto.randomUUID()

async function enqueueTask(input: {
  workspaceId: string
  kind: string
  entityType: string
  entityId: string
  reason: string
  priority: number
  budget: number
}) {
  await db.insert(agentTasks).values({
    id: randomId(),
    workspaceId: input.workspaceId,
    kind: input.kind,
    entityType: input.entityType,
    entityId: input.entityId,
    reason: input.reason,
    priority: input.priority,
    budget: input.budget,
    dueAt: new Date(),
  })
}

function pokeAgent() {
  void fetch(`${AGENT_URL}/internal/crm/dispatch`, { method: 'POST' }).catch(() => {})
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
      budget: 0,
    })
    await enqueueTask({
      workspaceId: activeWorkspaceId,
      kind: AGENT_KIND.companyProfile,
      entityType: 'company',
      entityId: companyId,
      reason: 'New company',
      priority: AGENT_PRIORITY.companyProfile,
      budget: 2,
    })

    pokeAgent()
    return { id: companyId }
  },

  async list(userId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return []
    return db.query.companies.findMany({
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
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    })
  },

  async get(userId: string, companyId: string) {
    const { activeWorkspaceId } = await workspacesService.list(userId)
    if (!activeWorkspaceId) return null

    const company = await db.query.companies.findFirst({
      where: { id: companyId, workspaceId: activeWorkspaceId },
      with: { contacts: true },
    })
    if (!company) return null

    const openTasks = await db
      .select({ id: agentTasks.id, kind: agentTasks.kind, outcome: agentTasks.outcome })
      .from(agentTasks)
      .where(and(eq(agentTasks.entityId, companyId), isNull(agentTasks.finishedAt)))

    return { company, enriching: openTasks.length > 0 }
  },
}
