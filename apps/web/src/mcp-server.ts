import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import z from 'zod'
import { addTodo } from '#/mcp-todos'

export const server = new McpServer({
  name: 'start-server',
  version: '1.0.0',
})

server.registerTool(
  'addTodo',
  {
    title: 'Tool to add a todo to a list of todos',
    description: 'Add a todo to a list of todos',
    inputSchema: {
      title: z.string().describe('The title of the todo'),
    },
  },
  async ({ title }) => ({
    content: [{ type: 'text', text: String((await addTodo(title)).title) }],
  }),
)
