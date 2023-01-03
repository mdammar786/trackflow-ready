import type { AppState, Task, TaskStatus, FilterState } from '../types'

export type Action =
  | { type: 'SET_TASK_STATUS'; taskId: string; status: TaskStatus }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'SELECT_TASK'; taskId: string | null }
  | { type: 'SET_FILTER'; filter: Partial<FilterState> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_ACTIVE_SPRINT'; sprintId: string | null }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, status: action.status, updatedAt: new Date().toISOString() }
            : t,
        ),
      }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.task.id ? action.task : t)),
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.taskId),
        selectedTaskId: state.selectedTaskId === action.taskId ? null : state.selectedTaskId,
      }
    case 'SELECT_TASK':
      return { ...state, selectedTaskId: action.taskId }
    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.filter } }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filter: { query: '', status: 'all', priority: 'all', assigneeId: 'all', labelId: 'all' },
      }
    case 'SET_ACTIVE_SPRINT':
      return { ...state, activeSprint: action.sprintId }
    default:
      return state
  }
}
