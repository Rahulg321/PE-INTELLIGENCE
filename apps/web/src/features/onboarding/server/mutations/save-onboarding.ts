import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { ACTIVE_WORKSPACE_COOKIE } from '#/features/workspaces/constants'
import { onboardingService } from '../onboarding-service'
import { onboardingSchema } from '../../schemas'

export const saveOnboarding = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(onboardingSchema)
  .handler(async ({ data, context }) => {
    const result = await onboardingService.save(context.user.id, data)
    setCookie(ACTIVE_WORKSPACE_COOKIE, result.workspaceId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
    return result
  })
