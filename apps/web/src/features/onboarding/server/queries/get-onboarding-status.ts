import { createServerFn } from '@tanstack/react-start'
import { getSessionUser } from '#/features/auth/server/get-session-user'
import { onboardingService } from '../onboarding-service'

export const getOnboardingStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getSessionUser()
    if (!user) return { signedIn: false as const, hasFirm: false as const }
    const { hasFirm } = await onboardingService.getStatus(user.id)
    return { signedIn: true as const, hasFirm }
  },
)
