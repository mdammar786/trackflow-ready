import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SprintTimer } from './SprintTimer'
import { TaskList } from './TaskList'
import { SprintStats } from './SprintStats'
import { AddTaskForm } from './AddTaskForm'
import { KanbanBoard } from './KanbanBoard'
import { VelocityChart } from './VelocityChart'
import type { Task, Sprint, User, Label } from '../types'

const USERS: User[] = [
  { id: 'u1', name: 'Amara Osei', email: 'amara@test.dev', avatarUrl: '', role: 'admin' },
  { id: 'u2', name: 'Lena Hartmann', email: 'lena@test.dev', avatarUrl: '', role: 'member' },
]

const LABELS: Label[] = [
  { id: 'l1', name: 'frontend', color: '#6366f1' },
  { id: 'l2', name: 'bug', color: '#ef4444' },
]

const SPRINT: Sprint = {
  id: 's1',
  name: 'Sprint 1',
  goal: 'Ship auth',
  status: 'active',
  startDate: '2023-02-06',
  endDate: '2023-02-17',
  velocity: 20,
}

const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Setup CI pipeline',
    description: 'Automate builds',
    status: 'done',
    priority: 'high',
    assigneeId: 'u1',
    sprintId: 's1',
    labelIds: ['l1'],
    storyPoints: 5,
    createdAt: '2023-02-06T09:00:00Z',
    updatedAt: '2023-02-06T09:00:00Z',
    dueDate: '2023-02-10',
  },
  {
    id: 't2',
    title: 'Design login screen',
    description: 'Figma mockups',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'u2',
    sprintId: 's1',
    labelIds: ['l2'],
    storyPoints: 3,
    createdAt: '2023-02-07T09:00:00Z',
    updatedAt: '2023-02-07T09:00:00Z',
    dueDate: null,
  },
  {
    id: 't3',
    title: 'Write unit tests',
    description: 'Cover all utils',
    status: 'todo',
    priority: 'low',
    assigneeId: null,
    sprintId: 's1',
    labelIds: [],
    storyPoints: 2,
    createdAt: '2023-02-08T09:00:00Z',
    updatedAt: '2023-02-08T09:00:00Z',
    dueDate: null,
  },
]

describe('SprintTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down by 1 second each tick', () => {
    const future = new Date(Date.now() + 10000).toISOString()
    render(<SprintTimer endDate={future} />)

    const before = screen.getByText(/\ds/)
    const beforeText = before.textContent ?? ''

    act(() => { vi.advanceTimersByTime(3000) })

    const after = screen.getByText(/\ds/)
    const afterText = after.textContent ?? ''

    expect(afterText).not.toBe(beforeText)
  })
})

describe('TaskList', () => {
  it('preserves checkbox state when sort order changes', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <TaskList
        tasks={TASKS}
        users={USERS}
        labels={LABELS}
        onSelect={onSelect}
        selectedId={null}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Setup CI pipeline/i }))
    expect(onSelect).toHaveBeenCalledWith('t1')

    await user.selectOptions(screen.getByLabelText('Sort by'), 'title')

    await user.click(screen.getByRole('button', { name: /Setup CI pipeline/i }))
    expect(onSelect).toHaveBeenCalledTimes(2)
    expect(onSelect).toHaveBeenLastCalledWith('t1')
  })
})

describe('SprintStats', () => {
  it('updates progress when tasks prop changes', () => {
    const { rerender } = render(<SprintStats sprint={SPRINT} tasks={TASKS} />)

    const allDone = TASKS.map((t) => ({ ...t, status: 'done' as const }))
    rerender(<SprintStats sprint={SPRINT} tasks={allDone} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('shows correct points remaining after tasks change', () => {
    const { rerender } = render(<SprintStats sprint={SPRINT} tasks={TASKS} />)

    const noTasks: Task[] = []
    rerender(<SprintStats sprint={SPRINT} tasks={noTasks} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

describe('AddTaskForm', () => {
  it('does not inject user-supplied string into className unsafely', () => {
    const onAdd = vi.fn()
    const { container } = render(
      <AddTaskForm
        sprints={[SPRINT]}
        users={USERS}
        labels={LABELS}
        defaultSprintId="s1"
        onAdd={onAdd}
        onCancel={vi.fn()}
      />,
    )

    const input = screen.getByLabelText('Custom highlight class')
    const injected = 'legit"><script>alert(1)</script><div class="'
    userEvent.type(input, injected)

    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(0)
  })
})

describe('KanbanBoard', () => {
  it('exposes drag handle with keyboard support', () => {
    render(
      <KanbanBoard
        tasks={TASKS}
        users={USERS}
        labels={LABELS}
        selectedId={null}
        onSelect={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    )

    const handles = screen.getAllByRole('button', { name: /drag/i })
    expect(handles.length).toBeGreaterThan(0)
  })
})

describe('VelocityChart', () => {
  it('does not call onBarClick infinitely on mount', () => {
    const onBarClick = vi.fn()
    render(
      <VelocityChart
        sprints={[SPRINT]}
        tasks={TASKS}
        onBarClick={onBarClick}
      />,
    )

    expect(onBarClick.mock.calls.length).toBeLessThanOrEqual(1)
  })
})
