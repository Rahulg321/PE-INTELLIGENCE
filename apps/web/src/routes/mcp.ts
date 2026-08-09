import { createFileRoute } from '@tanstack/react-router'

import { handleMcpRequest } from '#/utils/mcp-handler'

export const Route = createFileRoute('/mcp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { server } = await import('#/mcp-server')
        return handleMcpRequest(request, server)
      },
    },
  },
})
