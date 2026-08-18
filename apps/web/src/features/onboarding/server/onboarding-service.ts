import { eq } from 'drizzle-orm'
import {
  db,
  workspaces,
  investmentMandates,
  mandateSectors,
  mandateCriteria,
  onboardingDrafts,
} from 'db'
import { onboardingDraftDataSchema } from '../schemas'
import type { OnboardingOutput, OnboardingDraft } from '../schemas'

const randomId = () => crypto.randomUUID()

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'workspace'

async function uniqueSlug(base: string) {
  const slug = slugify(base)
  let candidate = slug
  for (;;) {
    const rows = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.slug, candidate))
      .limit(1)
    if (rows.length === 0) return candidate
    candidate = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  }
}

export const onboardingService = {
  async getStatus(userId: string) {
    const workspace = await db.query.workspaces.findFirst({
      where: { ownerUserId: userId, deletedAt: { isNull: true } },
      columns: { id: true },
    })
    return { onboarded: Boolean(workspace) }
  },

  async getDraft(userId: string): Promise<OnboardingDraft | null> {
    const draft = await db.query.onboardingDrafts.findFirst({
      where: { userId },
    })
    if (!draft) return null
    return {
      data: onboardingDraftDataSchema.parse(draft.data),
      step: draft.step,
    }
  },

  async saveDraft(userId: string, draft: OnboardingDraft) {
    await db
      .insert(onboardingDrafts)
      .values({ userId, data: draft.data, step: draft.step })
      .onConflictDoUpdate({
        target: onboardingDrafts.userId,
        set: { data: draft.data, step: draft.step },
      })
  },

  async clearDraft(userId: string) {
    await db
      .delete(onboardingDrafts)
      .where(eq(onboardingDrafts.userId, userId))
  },

  async save(userId: string, data: OnboardingOutput) {
    const result = await db.transaction(async (tx) => {
      const workspaceId = randomId()
      const slug = await uniqueSlug(data.firmName)

      await tx.insert(workspaces).values({
        id: workspaceId,
        ownerUserId: userId,
        name: data.firmName,
        slug,
        website: data.website || null,
      })

      const mandateId = randomId()

      await tx.insert(investmentMandates).values({
        id: mandateId,
        workspaceId,
        primaryGeography: data.geography[0] ?? null,
        targetGeographies: data.geography,
        investmentTypes: data.investmentTypes,
        minRevenue: data.minRevenue ?? null,
        maxRevenue: data.maxRevenue ?? null,
        minEbitda: data.minEbitda,
        maxEbitda: data.maxEbitda ?? null,
        noSectorPreference: data.noSectorPreference,
        version: 1,
      })

      const sectors = [
        ...data.preferredSectors.map((sector) => ({
          sector,
          type: 'preferred' as const,
        })),
        ...data.excludedSectors.map((sector) => ({
          sector,
          type: 'excluded' as const,
        })),
      ]
      await tx.delete(mandateSectors).where(eq(mandateSectors.mandateId, mandateId))
      if (sectors.length > 0) {
        await tx.insert(mandateSectors).values(
          sectors.map(({ sector, type }) => ({
            id: randomId(),
            mandateId,
            sector,
            type,
          })),
        )
      }

      const criteria = [
        ...Object.entries(data.criteria).map(([criterion, importance]) => ({
          criterion,
          importance,
        })),
        ...data.dealbreakers.map((criterion) => ({
          criterion,
          importance: 'dealbreaker' as const,
        })),
      ]
      await tx.delete(mandateCriteria).where(eq(mandateCriteria.mandateId, mandateId))
      if (criteria.length > 0) {
        await tx.insert(mandateCriteria).values(
          criteria.map(({ criterion, importance }) => ({
            id: randomId(),
            mandateId,
            criterion,
            importance,
          })),
        )
      }

      return { workspaceId, mandateId }
    })

    await this.clearDraft(userId)

    return result
  },
}
