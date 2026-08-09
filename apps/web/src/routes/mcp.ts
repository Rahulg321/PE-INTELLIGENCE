import { createFileRoute } from '@tanstack/react-router'

import { handleMcpRequest } from '#/features/mcp/handler'

export const Route = createFileRoute('/mcp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { server } = await import('#/features/mcp/server')
        return handleMcpRequest(request, server)
      },
    },
  },
})
