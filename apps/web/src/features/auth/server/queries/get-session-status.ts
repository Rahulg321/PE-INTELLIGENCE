import { createServerFn } from '@tanstack/react-start'
import { getSessionUser } from '../get-session-user'

export const getSessionStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getSessionUser()
    return { signedIn: Boolean(user) }
  },
)
