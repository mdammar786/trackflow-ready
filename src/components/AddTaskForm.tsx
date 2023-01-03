import { useState } from 'react'
import type { Task, Sprint, User, Label } from '../types'
import { generateId } from '../lib/utils'

interface AddTaskFormProps {
  sprints: Sprint[]
  users: User[]
  labels: Label[]
  defaultSprintId: string | null
  onAdd: (task: Task) => void
  onCancel: () => void
}

export function AddTaskForm({ sprints, users, labels, defaultSprintId, onAdd, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [status, setStatus] = useState<Task['status']>('todo')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [sprintId, setSprintId] = useState<string>(defaultSprintId ?? '')
  const [storyPoints, setStoryPoints] = useState(3)
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [customClass, setCustomClass] = useState('')

  function toggleLabel(id: string) {
    setLabelIds((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const now = new Date().toISOString()
    onAdd({
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assigneeId: assigneeId || null,
      sprintId: sprintId || null,
      labelIds,
      storyPoints,
      createdAt: now,
      updatedAt: now,
      dueDate: null,
    })
  }

  return (
    <div className={`add-task-form ${customClass}`}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="add-task-form__title">New task</h2>
        <div className="form-group">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-status">Status</label>
          <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as Task['status'])}>
            <option value="backlog">Backlog</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-assignee">Assignee</label>
          <select id="task-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-sprint">Sprint</label>
          <select id="task-sprint" value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
            <option value="">No sprint</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-points">Story points</label>
          <input
            id="task-points"
            type="number"
            min={1}
            max={21}
            value={storyPoints}
            onChange={(e) => setStoryPoints(Number(e.target.value))}
          />
        </div>
        <fieldset className="form-group">
          <legend>Labels</legend>
          <div className="label-picker">
            {labels.map((l) => (
              <label key={l.id} className="label-picker__option">
                <input
                  type="checkbox"
                  checked={labelIds.includes(l.id)}
                  onChange={() => toggleLabel(l.id)}
                />
                <span style={{ backgroundColor: l.color }}>{l.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="form-group">
          <label htmlFor="task-custom-class">Custom highlight class</label>
          <input
            id="task-custom-class"
            type="text"
            value={customClass}
            onChange={(e) => setCustomClass(e.target.value)}
            placeholder="e.g. highlight-urgent"
          />
        </div>
        <div className="add-task-form__actions">
          <button type="button" onClick={onCancel} className="btn btn--secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={!title.trim()}>
            Add task
          </button>
        </div>
      </form>
    </div>
  )
}
