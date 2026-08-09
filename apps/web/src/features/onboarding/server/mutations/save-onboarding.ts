import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { onboardingService } from '../onboarding-service'
import { onboardingSchema } from '../../schemas'

export const saveOnboarding = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(onboardingSchema)
  .handler(async ({ data, context }) => {
    return onboardingService.save(context.user.id, data)
  })
