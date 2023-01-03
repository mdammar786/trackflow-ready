import type { Task, FilterState, User, Sprint } from '../types'

export function filterTasks(tasks: Task[], filter: FilterState): Task[] {
  return tasks.filter((task) => {
    if (filter.query) {
      const q = filter.query.toLowerCase()
      if (!task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) {
        return false
      }
    }
    if (filter.status !== 'all' && task.status !== filter.status) return false
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false
    if (filter.assigneeId !== 'all' && task.assigneeId !== filter.assigneeId) return false
    if (filter.labelId !== 'all' && !task.labelIds.includes(filter.labelId)) return false
    return true
  })
}

export function getUserById(users: User[], id: string | null): User | undefined {
  return users.find((u) => u.id === id)
}

export function getSprintById(sprints: Sprint[], id: string | null): Sprint | undefined {
  return sprints.find((s) => s.id === id)
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function priorityRank(p: Task['priority']): number {
  return { critical: 0, high: 1, medium: 2, low: 3 }[p]
}

export function sprintProgress(tasks: Task[]): number {
  const total = tasks.reduce((s, t) => s + t.storyPoints, 0)
  const done = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.storyPoints, 0)
  if (total === 0) return 0
  return Math.round((done / total) * 100)
}

export function groupByStatus(tasks: Task[]): Record<Task['status'], Task[]> {
  const groups: Record<Task['status'], Task[]> = {
    backlog: [],
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  }
  for (const task of tasks) {
    groups[task.status].push(task)
  }
  return groups
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}
