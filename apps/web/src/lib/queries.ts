import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { db } from 'db'
import { auth } from '#/lib/auth'

const getSessionUser = async () => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user ?? null
}

export const getSessionStatus = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getSessionUser()
  return { signedIn: Boolean(user) }
})

export const getOnboardingStatus = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getSessionUser()
  if (!user) return { signedIn: false as const, hasFirm: false as const }
  const firm = await db.query.firms.findFirst({
    where: { ownerUserId: user.id },
  })
  return { signedIn: true as const, hasFirm: Boolean(firm) }
})

export const getDashboardData = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getSessionUser()
  if (!user) return null
  const firm = await db.query.firms.findFirst({
    where: { ownerUserId: user.id },
  })
  if (!firm) return null
  const mandate = await db.query.investmentMandates.findFirst({
    where: { firmId: firm.id },
  })
  return { firm, mandate }
})
