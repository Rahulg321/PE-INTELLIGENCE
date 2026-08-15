const todosPath = './mcp-todos.json'

let todos: Todo[] | null = null

export type Todo = {
  id: number
  title: string
}

const isServer = () => typeof window === 'undefined'

const loadTodos = async (): Promise<Todo[]> => {
  if (todos !== null) return todos
  let loaded: Todo[] = []
  if (isServer()) {
    try {
      const fs = await import('node:fs')
      loaded = fs.existsSync(todosPath)
        ? JSON.parse(fs.readFileSync(todosPath, 'utf8'))
        : [
            {
              id: 1,
              title: 'Buy groceries',
            },
          ]
    } catch {
      loaded = []
    }
  }
  todos = loaded
  return loaded
}

export async function addTodo(title: string) {
  const current = await loadTodos()
  const todo = { id: (current.at(-1)?.id ?? 0) + 1, title }
  current.push(todo)
  if (isServer()) {
    try {
      const fs = await import('node:fs')
      fs.writeFileSync(todosPath, JSON.stringify(current, null, 2))
    } catch {}
  }
  return todo
}
