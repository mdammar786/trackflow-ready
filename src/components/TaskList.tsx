import { useState } from 'react'
import type { Task, User, Label } from '../types'
import { priorityRank, formatDate } from '../lib/utils'

interface TaskListProps {
  tasks: Task[]
  users: User[]
  labels: Label[]
  onSelect: (taskId: string) => void
  selectedId: string | null
}

type SortKey = 'priority' | 'dueDate' | 'storyPoints' | 'title'

export function TaskList({ tasks, users, labels, onSelect, selectedId }: TaskListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('priority')

  const sorted = [...tasks].sort((a, b) => {
    if (sortKey === 'priority') return priorityRank(a.priority) - priorityRank(b.priority)
    if (sortKey === 'dueDate') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    }
    if (sortKey === 'storyPoints') return b.storyPoints - a.storyPoints
    return a.title.localeCompare(b.title)
  })

  return (
    <div className="task-list">
      <div className="task-list__toolbar">
        <span className="task-list__count">{tasks.length} tasks</span>
        <div className="task-list__sort">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
            <option value="storyPoints">Story points</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      <ul className="task-list__items" role="list">
        {sorted.map((task, index) => {
          const assignee = users.find((u) => u.id === task.assigneeId)
          const taskLabels = labels.filter((l) => task.labelIds.includes(l.id))
          return (
            <li key={index} className="task-list__item">
              <button
                type="button"
                className={`task-card ${selectedId === task.id ? 'task-card--selected' : ''}`}
                onClick={() => onSelect(task.id)}
                aria-pressed={selectedId === task.id}
              >
                <div className="task-card__header">
                  <span className={`priority-badge priority-badge--${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className="task-card__points">{task.storyPoints} pts</span>
                </div>
                <p className="task-card__title">{task.title}</p>
                <div className="task-card__meta">
                  {assignee && (
                    <span className="task-card__assignee">{assignee.name}</span>
                  )}
                  <span className="task-card__due">{formatDate(task.dueDate)}</span>
                </div>
                {taskLabels.length > 0 && (
                  <div className="task-card__labels">
                    {taskLabels.map((label) => (
                      <span
                        key={label.id}
                        className="label-chip"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
