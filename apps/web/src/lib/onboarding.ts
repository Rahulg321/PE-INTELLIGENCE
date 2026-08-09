import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'
import { db, firms, investmentMandates, mandateSectors, mandateCriteria } from 'db'
import { auth } from '#/lib/auth'

const onboardingSchema = z.object({
  firmName: z.string().min(1).max(200),
  website: z.string().url().optional().or(z.literal('')),
  geography: z.array(z.string()).min(1),
  investmentTypes: z.array(z.string()).min(1),
  minRevenue: z.coerce.number().int().positive().optional(),
  maxRevenue: z.coerce.number().int().positive().optional(),
  minEbitda: z.coerce.number().int().positive().optional(),
  maxEbitda: z.coerce.number().int().positive().optional(),
  preferredSectors: z.array(z.string()).min(1),
  excludedSectors: z.array(z.string()).default([]),
  criteria: z.record(z.string(), z.enum(['required', 'preferred', 'neutral'])),
})

export type OnboardingInput = z.input<typeof onboardingSchema>

const randomId = () => crypto.randomUUID()

export const saveOnboarding = createServerFn({ method: 'POST' })
  .validator(onboardingSchema)
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      throw new Error('unauthorized')
    }

    const firmId = randomId()
    const mandateId = randomId()

    await db.transaction(async (tx) => {
      await tx.insert(firms).values({
        id: firmId,
        ownerUserId: session.user.id,
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
        ...data.preferredSectors.map((sector) => ({ sector, type: 'preferred' as const })),
        ...data.excludedSectors.map((sector) => ({ sector, type: 'excluded' as const })),
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
  })
