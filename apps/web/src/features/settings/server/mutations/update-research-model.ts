import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '#/features/auth/server/auth-middleware'
import { updateResearchModelSchema } from '../../schemas'
import { settingsService } from '../settings-service'

export const updateResearchModel = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateResearchModelSchema)
  .handler(async ({ data, context }) =>
    settingsService.updateResearchModel(context.user.id, data.model),
  )
