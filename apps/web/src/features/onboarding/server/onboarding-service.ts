import {
  db,
  firms,
  investmentMandates,
  mandateSectors,
  mandateCriteria,
} from 'db'
import type { OnboardingOutput } from '../schemas'

const randomId = () => crypto.randomUUID()

export const onboardingService = {
  async getStatus(userId: string) {
    const firm = await db.query.firms.findFirst({
      where: { ownerUserId: userId },
    })
    return { hasFirm: Boolean(firm) }
  },

  async save(userId: string, data: OnboardingOutput) {
    const firmId = randomId()
    const mandateId = randomId()

    await db.transaction(async (tx) => {
      await tx.insert(firms).values({
        id: firmId,
        ownerUserId: userId,
        name: data.firmName,
        website: data.website || null,
      })

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

    return { firmId, mandateId }
  },
}
