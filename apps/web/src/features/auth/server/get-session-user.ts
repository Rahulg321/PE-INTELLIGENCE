import { getRequest } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

export const getSessionUser = async () => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user ?? null
}

export const requireUser = async () => {
  const user = await getSessionUser()
  if (!user) throw new Error('unauthorized')
  return user
}
