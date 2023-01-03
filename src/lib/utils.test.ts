import { describe, it, expect } from 'vitest'
import { filterTasks, formatDate, priorityRank, sprintProgress, groupByStatus, generateId } from './utils'
import type { Task, FilterState } from '../types'

const BASE_TASK: Task = {
  id: 't1',
  title: 'Fix auth bug',
  description: 'Token expires too early',
  status: 'todo',
  priority: 'high',
  assigneeId: 'u1',
  sprintId: 's1',
  labelIds: ['l1'],
  storyPoints: 5,
  createdAt: '2023-01-10T09:00:00Z',
  updatedAt: '2023-01-10T09:00:00Z',
  dueDate: '2023-01-20',
}

const BASE_FILTER: FilterState = {
  query: '',
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  labelId: 'all',
}

describe('filterTasks', () => {
  it('returns all tasks when filter is empty', () => {
    const tasks = [BASE_TASK, { ...BASE_TASK, id: 't2', title: 'Setup CI' }]
    expect(filterTasks(tasks, BASE_FILTER)).toHaveLength(2)
  })

  it('filters by query against title', () => {
    const tasks = [BASE_TASK, { ...BASE_TASK, id: 't2', title: 'Setup CI' }]
    const result = filterTasks(tasks, { ...BASE_FILTER, query: 'auth' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('t1')
  })

  it('filters by query against description', () => {
    const tasks = [BASE_TASK]
    const result = filterTasks(tasks, { ...BASE_FILTER, query: 'token' })
    expect(result).toHaveLength(1)
  })

  it('filters by status', () => {
    const tasks = [
      BASE_TASK,
      { ...BASE_TASK, id: 't2', status: 'done' as const },
    ]
    const result = filterTasks(tasks, { ...BASE_FILTER, status: 'todo' })
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('todo')
  })

  it('filters by priority', () => {
    const tasks = [
      BASE_TASK,
      { ...BASE_TASK, id: 't2', priority: 'low' as const },
    ]
    const result = filterTasks(tasks, { ...BASE_FILTER, priority: 'high' })
    expect(result).toHaveLength(1)
    expect(result[0].priority).toBe('high')
  })

  it('filters by assigneeId', () => {
    const tasks = [
      BASE_TASK,
      { ...BASE_TASK, id: 't2', assigneeId: 'u2' },
    ]
    const result = filterTasks(tasks, { ...BASE_FILTER, assigneeId: 'u1' })
    expect(result).toHaveLength(1)
  })

  it('filters by labelId', () => {
    const tasks = [
      BASE_TASK,
      { ...BASE_TASK, id: 't2', labelIds: ['l2'] },
    ]
    const result = filterTasks(tasks, { ...BASE_FILTER, labelId: 'l1' })
    expect(result).toHaveLength(1)
  })

  it('combines multiple filters', () => {
    const tasks = [
      BASE_TASK,
      { ...BASE_TASK, id: 't2', priority: 'low' as const, status: 'done' as const },
    ]
    const result = filterTasks(tasks, { ...BASE_FILTER, priority: 'high', status: 'todo' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('t1')
  })
})

describe('formatDate', () => {
  it('returns em dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('formats an ISO date string', () => {
    const result = formatDate('2023-01-20')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2023/)
  })
})

describe('priorityRank', () => {
  it('ranks critical above high', () => {
    expect(priorityRank('critical')).toBeLessThan(priorityRank('high'))
  })

  it('ranks high above medium', () => {
    expect(priorityRank('high')).toBeLessThan(priorityRank('medium'))
  })

  it('ranks medium above low', () => {
    expect(priorityRank('medium')).toBeLessThan(priorityRank('low'))
  })
})

describe('sprintProgress', () => {
  it('returns 0 when no tasks', () => {
    expect(sprintProgress([])).toBe(0)
  })

  it('returns 100 when all tasks done', () => {
    const tasks: Task[] = [
      { ...BASE_TASK, status: 'done', storyPoints: 5 },
      { ...BASE_TASK, id: 't2', status: 'done', storyPoints: 3 },
    ]
    expect(sprintProgress(tasks)).toBe(100)
  })

  it('calculates partial progress by story points', () => {
    const tasks: Task[] = [
      { ...BASE_TASK, status: 'done', storyPoints: 5 },
      { ...BASE_TASK, id: 't2', status: 'todo', storyPoints: 5 },
    ]
    expect(sprintProgress(tasks)).toBe(50)
  })
})

describe('groupByStatus', () => {
  it('groups tasks into correct buckets', () => {
    const tasks: Task[] = [
      { ...BASE_TASK, id: 't1', status: 'todo' },
      { ...BASE_TASK, id: 't2', status: 'done' },
      { ...BASE_TASK, id: 't3', status: 'in-progress' },
    ]
    const groups = groupByStatus(tasks)
    expect(groups.todo).toHaveLength(1)
    expect(groups.done).toHaveLength(1)
    expect(groups['in-progress']).toHaveLength(1)
    expect(groups.backlog).toHaveLength(0)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})
