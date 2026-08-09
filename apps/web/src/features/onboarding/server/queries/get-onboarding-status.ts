import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { getSessionUser } from '#/features/auth/server/get-session-user'
import { onboardingService } from '../onboarding-service'

export const ONBOARDED_COOKIE = 'app.onboarded'
const ONBOARDED_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const getOnboardingStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    if (getCookie(ONBOARDED_COOKIE) === '1') {
      return { onboarded: true }
    }

    const user = await getSessionUser()
    if (!user) return { onboarded: false }

    try {
      const { onboarded } = await onboardingService.getStatus(user.id)
      if (onboarded) {
        setCookie(ONBOARDED_COOKIE, '1', {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: ONBOARDED_COOKIE_MAX_AGE,
          path: '/',
        })
      }
      return { onboarded }
    } catch {
      return { onboarded: true }
    }
  },
)
