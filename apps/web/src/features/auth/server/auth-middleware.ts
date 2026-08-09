import { createMiddleware } from '@tanstack/react-start'
import { getSessionUser } from './get-session-user'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getSessionUser()
  if (!user) throw new Error('unauthorized')
  return next({ context: { user } })
})
