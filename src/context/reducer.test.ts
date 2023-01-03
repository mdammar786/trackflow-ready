import { describe, it, expect } from 'vitest'
import { reducer } from './reducer'
import type { AppState, Task } from '../types'

const BASE_TASK: Task = {
  id: 't1',
  title: 'Test task',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: null,
  sprintId: null,
  labelIds: [],
  storyPoints: 3,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  dueDate: null,
}

const BASE_STATE: AppState = {
  tasks: [BASE_TASK],
  sprints: [],
  users: [],
  labels: [],
  comments: [],
  activeSprint: null,
  selectedTaskId: null,
  filter: {
    query: '',
    status: 'all',
    priority: 'all',
    assigneeId: 'all',
    labelId: 'all',
  },
}

describe('reducer', () => {
  it('SET_TASK_STATUS updates status of the matching task', () => {
    const next = reducer(BASE_STATE, { type: 'SET_TASK_STATUS', taskId: 't1', status: 'done' })
    expect(next.tasks[0].status).toBe('done')
  })

  it('SET_TASK_STATUS does not mutate other tasks', () => {
    const other: Task = { ...BASE_TASK, id: 't2', status: 'todo' }
    const state = { ...BASE_STATE, tasks: [BASE_TASK, other] }
    const next = reducer(state, { type: 'SET_TASK_STATUS', taskId: 't1', status: 'in-progress' })
    expect(next.tasks[1].status).toBe('todo')
  })

  it('ADD_TASK appends the task', () => {
    const newTask: Task = { ...BASE_TASK, id: 't2', title: 'New task' }
    const next = reducer(BASE_STATE, { type: 'ADD_TASK', task: newTask })
    expect(next.tasks).toHaveLength(2)
    expect(next.tasks[1].id).toBe('t2')
  })

  it('DELETE_TASK removes the task by id', () => {
    const next = reducer(BASE_STATE, { type: 'DELETE_TASK', taskId: 't1' })
    expect(next.tasks).toHaveLength(0)
  })

  it('DELETE_TASK clears selectedTaskId if it matches', () => {
    const state = { ...BASE_STATE, selectedTaskId: 't1' }
    const next = reducer(state, { type: 'DELETE_TASK', taskId: 't1' })
    expect(next.selectedTaskId).toBeNull()
  })

  it('DELETE_TASK preserves selectedTaskId if it does not match', () => {
    const other: Task = { ...BASE_TASK, id: 't2' }
    const state = { ...BASE_STATE, tasks: [BASE_TASK, other], selectedTaskId: 't2' }
    const next = reducer(state, { type: 'DELETE_TASK', taskId: 't1' })
    expect(next.selectedTaskId).toBe('t2')
  })

  it('SELECT_TASK sets selectedTaskId', () => {
    const next = reducer(BASE_STATE, { type: 'SELECT_TASK', taskId: 't1' })
    expect(next.selectedTaskId).toBe('t1')
  })

  it('SELECT_TASK can clear selection with null', () => {
    const state = { ...BASE_STATE, selectedTaskId: 't1' }
    const next = reducer(state, { type: 'SELECT_TASK', taskId: null })
    expect(next.selectedTaskId).toBeNull()
  })

  it('SET_FILTER merges partial filter', () => {
    const next = reducer(BASE_STATE, { type: 'SET_FILTER', filter: { status: 'done' } })
    expect(next.filter.status).toBe('done')
    expect(next.filter.query).toBe('')
  })

  it('CLEAR_FILTERS resets all filter fields', () => {
    const state = {
      ...BASE_STATE,
      filter: { query: 'auth', status: 'done' as const, priority: 'high' as const, assigneeId: 'u1', labelId: 'l1' },
    }
    const next = reducer(state, { type: 'CLEAR_FILTERS' })
    expect(next.filter.query).toBe('')
    expect(next.filter.status).toBe('all')
    expect(next.filter.priority).toBe('all')
    expect(next.filter.assigneeId).toBe('all')
    expect(next.filter.labelId).toBe('all')
  })

  it('SET_ACTIVE_SPRINT sets the active sprint id', () => {
    const next = reducer(BASE_STATE, { type: 'SET_ACTIVE_SPRINT', sprintId: 's1' })
    expect(next.activeSprint).toBe('s1')
  })

  it('UPDATE_TASK replaces the matching task', () => {
    const updated: Task = { ...BASE_TASK, title: 'Updated title', priority: 'critical' }
    const next = reducer(BASE_STATE, { type: 'UPDATE_TASK', task: updated })
    expect(next.tasks[0].title).toBe('Updated title')
    expect(next.tasks[0].priority).toBe('critical')
  })
})
