import { and, eq } from 'drizzle-orm'
import {
  db,
  investmentMandates,
  mandateCriteria,
  mandateSectors,
  workspaces,
} from 'db'
import { onboardingDraftDataSchema } from '#/features/onboarding/schemas'
import type { OnboardingDraftData } from '#/features/onboarding/schemas'
import { workspacesService } from '#/features/workspaces/server/workspaces-service'
import {
  DEFAULT_RESEARCH_MODEL,
  isResearchModelId,
} from '../constants'
import type { ResearchModelId } from '../constants'
import type { UpdateMandateData, UpdateWorkspaceData } from '../schemas'

const randomId = () => crypto.randomUUID()

async function getOwnedWorkspace(userId: string) {
  const workspaceId = await workspacesService.requireActiveId(userId)
  const workspace = await db.query.workspaces.findFirst({
    where: { id: workspaceId, ownerUserId: userId },
    columns: {
      id: true,
      name: true,
      website: true,
      contextApiKey: true,
      researchModel: true,
    },
  })
  if (!workspace) throw new Error('Workspace not found')
  return workspace
}

async function getMandateDraft(workspaceId: string): Promise<OnboardingDraftData> {
  const mandate = await db.query.investmentMandates.findFirst({
    where: { workspaceId },
    with: { sectors: true, criteria: true },
  })

  if (!mandate) return onboardingDraftDataSchema.parse({})

  const preferredSectors = mandate.sectors
    .filter((sector) => sector.type === 'preferred')
    .map((sector) => sector.sector)
  const excludedSectors = mandate.sectors
    .filter((sector) => sector.type === 'excluded')
    .map((sector) => sector.sector)

  const criteria: Record<string, 'preferred' | 'required'> = {}
  const dealbreakers: string[] = []
  for (const row of mandate.criteria) {
    if (row.importance === 'dealbreaker') {
      dealbreakers.push(row.criterion)
    } else if (row.importance === 'preferred' || row.importance === 'required') {
      criteria[row.criterion] = row.importance
    }
  }

  return onboardingDraftDataSchema.parse({
    geography: [...mandate.targetGeographies],
    investmentTypes: [...mandate.investmentTypes],
    minRevenue: mandate.minRevenue == null ? '' : String(mandate.minRevenue),
    maxRevenue: mandate.maxRevenue == null ? '' : String(mandate.maxRevenue),
    minEbitda: mandate.minEbitda == null ? '' : String(mandate.minEbitda),
    maxEbitda: mandate.maxEbitda == null ? '' : String(mandate.maxEbitda),
    preferredSectors,
    excludedSectors,
    noSectorPreference: mandate.noSectorPreference,
    criteria,
    dealbreakers,
  })
}

export const settingsService = {
  async get(userId: string) {
    const workspace = await getOwnedWorkspace(userId)
    const mandate = await getMandateDraft(workspace.id)
    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        website: workspace.website ?? '',
      },
      contextApiConnected: Boolean(workspace.contextApiKey),
      researchModel:
        workspace.researchModel && isResearchModelId(workspace.researchModel)
          ? workspace.researchModel
          : DEFAULT_RESEARCH_MODEL,
      mandate,
    }
  },

  async updateMandate(userId: string, input: UpdateMandateData) {
    const workspace = await getOwnedWorkspace(userId)

    await db.transaction(async (tx) => {
      const existing = await tx.query.investmentMandates.findFirst({
        where: { workspaceId: workspace.id },
        columns: { id: true, version: true },
      })
      if (!existing) throw new Error('Investment mandate not found')

      await tx
        .update(investmentMandates)
        .set({
          primaryGeography: input.geography[0] ?? null,
          targetGeographies: input.geography,
          investmentTypes: input.investmentTypes,
          minRevenue: input.minRevenue ?? null,
          maxRevenue: input.maxRevenue ?? null,
          minEbitda: input.minEbitda,
          maxEbitda: input.maxEbitda ?? null,
          noSectorPreference: input.noSectorPreference,
          version: existing.version + 1,
        })
        .where(eq(investmentMandates.id, existing.id))

      const sectors = [
        ...input.preferredSectors.map((sector) => ({
          sector,
          type: 'preferred' as const,
        })),
        ...input.excludedSectors.map((sector) => ({
          sector,
          type: 'excluded' as const,
        })),
      ]
      await tx
        .delete(mandateSectors)
        .where(eq(mandateSectors.mandateId, existing.id))
      if (sectors.length > 0) {
        await tx.insert(mandateSectors).values(
          sectors.map(({ sector, type }) => ({
            id: randomId(),
            mandateId: existing.id,
            sector,
            type,
          })),
        )
      }

      const criteria = [
        ...Object.entries(input.criteria).map(([criterion, importance]) => ({
          criterion,
          importance,
        })),
        ...input.dealbreakers.map((criterion) => ({
          criterion,
          importance: 'dealbreaker' as const,
        })),
      ]
      await tx
        .delete(mandateCriteria)
        .where(eq(mandateCriteria.mandateId, existing.id))
      if (criteria.length > 0) {
        await tx.insert(mandateCriteria).values(
          criteria.map(({ criterion, importance }) => ({
            id: randomId(),
            mandateId: existing.id,
            criterion,
            importance,
          })),
        )
      }
    })

    return { ok: true as const }
  },

  async updateWorkspace(userId: string, input: UpdateWorkspaceData) {
    const workspace = await getOwnedWorkspace(userId)
    await db
      .update(workspaces)
      .set({
        name: input.name,
        website: input.website || null,
      })
      .where(
        and(
          eq(workspaces.id, workspace.id),
          eq(workspaces.ownerUserId, userId),
        ),
      )
    return { ok: true as const }
  },

  async updateContextKey(userId: string, key: string) {
    const workspace = await getOwnedWorkspace(userId)
    await db
      .update(workspaces)
      .set({ contextApiKey: key })
      .where(
        and(
          eq(workspaces.id, workspace.id),
          eq(workspaces.ownerUserId, userId),
        ),
      )
    return { ok: true as const, contextApiConnected: true as const }
  },

  async updateResearchModel(userId: string, model: ResearchModelId) {
    const workspace = await getOwnedWorkspace(userId)
    await db
      .update(workspaces)
      .set({ researchModel: model })
      .where(
        and(
          eq(workspaces.id, workspace.id),
          eq(workspaces.ownerUserId, userId),
        ),
      )
    return { ok: true as const, researchModel: model }
  },
}
