const todosPath = './mcp-todos.json'

let todos: Todo[] | null = null

let subscribers: ((todos: Todo[]) => void)[] = []

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

export async function getTodos(): Promise<Todo[]> {
  return loadTodos()
}

export async function addTodo(title: string) {
  const current = await loadTodos()
  const todo = { id: current.length + 1, title }
  current.push(todo)
  if (isServer()) {
    try {
      const fs = await import('node:fs')
      fs.writeFileSync(todosPath, JSON.stringify(current, null, 2))
    } catch {}
  }
  notifySubscribers()
  return todo
}

export function subscribeToTodos(callback: (todos: Todo[]) => void) {
  subscribers.push(callback)
  void loadTodos().then(callback)
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback)
  }
}

function notifySubscribers() {
  for (const cb of subscribers) {
    try {
      cb(todos ?? [])
    } catch {}
  }
}
