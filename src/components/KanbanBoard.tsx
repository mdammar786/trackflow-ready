import { useState } from 'react'
import type { Task, User, Label } from '../types'
import { groupByStatus, formatDate } from '../lib/utils'

const COLUMNS: Array<{ key: Task['status']; label: string }> = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

interface KanbanBoardProps {
  tasks: Task[]
  users: User[]
  labels: Label[]
  selectedId: string | null
  onSelect: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
}

export function KanbanBoard({ tasks, users, labels, selectedId, onSelect, onStatusChange }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<Task['status'] | null>(null)

  const groups = groupByStatus(tasks)

  function handleDragEnd(status: Task['status']) {
    if (draggingId) {
      onStatusChange(draggingId, status)
    }
    setDraggingId(null)
    setOverColumn(null)
  }

  return (
    <div className="kanban-board">
      {COLUMNS.map(({ key, label }) => (
        <div
          key={key}
          className={`kanban-column ${overColumn === key ? 'kanban-column--over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOverColumn(key) }}
          onDragLeave={() => setOverColumn(null)}
          onDrop={() => handleDragEnd(key)}
        >
          <div className="kanban-column__header">
            <h3 className="kanban-column__label">{label}</h3>
            <span className="kanban-column__count">{groups[key].length}</span>
          </div>
          <div className="kanban-column__cards">
            {groups[key].map((task) => {
              const assignee = users.find((u) => u.id === task.assigneeId)
              const taskLabels = labels.filter((l) => task.labelIds.includes(l.id))
              return (
                <div
                  key={task.id}
                  className={`kanban-card ${selectedId === task.id ? 'kanban-card--selected' : ''} ${draggingId === task.id ? 'kanban-card--dragging' : ''}`}
                  onClick={() => onSelect(task.id)}
                  draggable
                  onDragStart={() => setDraggingId(task.id)}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <div className="kanban-card__drag-handle">
                    <span>⣿</span>
                  </div>
                  <div className="kanban-card__body">
                    <div className="kanban-card__header">
                      <span className={`priority-badge priority-badge--${task.priority}`}>
                        {task.priority}
                      </span>
                      <span className="kanban-card__points">{task.storyPoints}p</span>
                    </div>
                    <p className="kanban-card__title">{task.title}</p>
                    {taskLabels.length > 0 && (
                      <div className="kanban-card__labels">
                        {taskLabels.map((l) => (
                          <span key={l.id} className="label-chip" style={{ backgroundColor: l.color }}>
                            {l.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="kanban-card__footer">
                      {assignee && (
                        <span className="kanban-card__assignee">{assignee.name.split(' ')[0]}</span>
                      )}
                      {task.dueDate && (
                        <span className="kanban-card__due">{formatDate(task.dueDate)}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
