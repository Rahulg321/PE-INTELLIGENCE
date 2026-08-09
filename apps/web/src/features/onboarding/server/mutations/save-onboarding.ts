import { createServerFn } from '@tanstack/react-start'
import { requireUser } from '#/features/auth/server/get-session-user'
import { onboardingService } from '../onboarding-service'
import { onboardingSchema } from '../../schemas'

export const saveOnboarding = createServerFn({ method: 'POST' })
  .validator(onboardingSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    return onboardingService.save(user.id, data)
  })
