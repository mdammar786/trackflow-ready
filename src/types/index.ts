export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type SprintStatus = 'planning' | 'active' | 'completed'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  role: 'admin' | 'member' | 'viewer'
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string | null
  sprintId: string | null
  labelIds: string[]
  storyPoints: number
  createdAt: string
  updatedAt: string
  dueDate: string | null
}

export interface Sprint {
  id: string
  name: string
  goal: string
  status: SprintStatus
  startDate: string
  endDate: string
  velocity: number
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  body: string
  createdAt: string
}

export interface AppState {
  tasks: Task[]
  sprints: Sprint[]
  users: User[]
  labels: Label[]
  comments: Comment[]
  activeSprint: string | null
  selectedTaskId: string | null
  filter: FilterState
}

export interface FilterState {
  query: string
  status: TaskStatus | 'all'
  priority: Priority | 'all'
  assigneeId: string | 'all'
  labelId: string | 'all'
}
