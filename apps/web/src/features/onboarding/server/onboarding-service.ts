import { eq } from 'drizzle-orm'
import {
  db,
  users,
  firms,
  investmentMandates,
  mandateSectors,
  mandateCriteria,
  onboardingDrafts,
} from 'db'
import type { OnboardingOutput, OnboardingDraft, OnboardingDraftData } from '../schemas'

const randomId = () => crypto.randomUUID()

export const onboardingService = {
  async getStatus(userId: string) {
    const user = await db.query.users.findFirst({
      where: { id: userId },
      columns: { onboardedAt: true },
    })
    return { onboarded: Boolean(user?.onboardedAt) }
  },

  async getDraft(userId: string): Promise<OnboardingDraft | null> {
    const draft = await db.query.onboardingDrafts.findFirst({
      where: { userId },
    })
    if (!draft) return null
    return {
      data: draft.data as OnboardingDraftData,
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
    const existing = await db.query.firms.findFirst({
      where: { ownerUserId: userId },
      columns: { id: true },
    })
    if (existing) {
      return { firmId: existing.id, alreadyOnboarded: true }
    }

    const firmId = randomId()
    const mandateId = randomId()

    await db.transaction(async (tx) => {
      await tx.insert(firms).values({
        id: firmId,
        ownerUserId: userId,
        name: data.firmName,
        website: data.website || null,
      })

      await tx
        .update(users)
        .set({ onboardedAt: new Date() })
        .where(eq(users.id, userId))

      await tx.insert(investmentMandates).values({
        id: mandateId,
        firmId,
        geography: data.geography,
        investmentTypes: data.investmentTypes,
        minRevenue: data.minRevenue ?? null,
        maxRevenue: data.maxRevenue ?? null,
        minEbitda: data.minEbitda ?? null,
        maxEbitda: data.maxEbitda ?? null,
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

      const criteria = Object.entries(data.criteria)
      if (criteria.length > 0) {
        await tx.insert(mandateCriteria).values(
          criteria.map(([criterion, importance]) => ({
            id: randomId(),
            mandateId,
            criterion,
            importance,
          })),
        )
      }
    })

    await this.clearDraft(userId)

    return { firmId, mandateId }
  },
}
