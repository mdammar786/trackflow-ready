import { createContext, useReducer, type ReactNode } from 'react'
import type { AppState } from '../types'
import { reducer, type Action } from './reducer'
import { USERS, LABELS, TASKS, SPRINTS, COMMENTS } from '../data/seed'

const initialState: AppState = {
  tasks: TASKS,
  sprints: SPRINTS,
  users: USERS,
  labels: LABELS,
  comments: COMMENTS,
  activeSprint: 's3',
  selectedTaskId: null,
  filter: {
    query: '',
    status: 'all',
    priority: 'all',
    assigneeId: 'all',
    labelId: 'all',
  },
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

export const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}
