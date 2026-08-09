import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { onboardingService } from '../onboarding-service'
import { onboardingDraftSchema } from '../../schemas'

export const saveOnboardingDraft = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(onboardingDraftSchema)
  .handler(async ({ data, context }) => {
    await onboardingService.saveDraft(context.user.id, data)
    return { ok: true }
  })
