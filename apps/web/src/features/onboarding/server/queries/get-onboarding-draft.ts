import { createServerFn } from '@tanstack/react-start'
import { getSessionUser } from '#/features/auth/server/get-session-user'
import { onboardingService } from '../onboarding-service'

export const getOnboardingDraft = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getSessionUser()
    if (!user) return null
    return onboardingService.getDraft(user.id)
  },
)
