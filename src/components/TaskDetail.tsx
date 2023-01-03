import { useState, useEffect } from 'react'
import type { Task, User, Comment, Label } from '../types'
import { formatDate } from '../lib/utils'

interface TaskDetailProps {
  task: Task
  users: User[]
  labels: Label[]
  comments: Comment[]
  onStatusChange: (taskId: string, status: Task['status']) => void
  onClose: () => void
}

interface EnrichedData {
  assignee: User | null
  taskLabels: Label[]
  taskComments: Comment[]
  commentAuthors: Record<string, User>
}

async function fetchAssignee(users: User[], id: string | null): Promise<User | null> {
  await new Promise((r) => setTimeout(r, 0))
  return users.find((u) => u.id === id) ?? null
}

async function fetchLabels(labels: Label[], ids: string[]): Promise<Label[]> {
  await new Promise((r) => setTimeout(r, 0))
  return labels.filter((l) => ids.includes(l.id))
}

async function fetchComments(comments: Comment[], taskId: string): Promise<Comment[]> {
  await new Promise((r) => setTimeout(r, 0))
  return comments.filter((c) => c.taskId === taskId)
}

async function fetchCommentAuthors(users: User[], comments: Comment[]): Promise<Record<string, User>> {
  await new Promise((r) => setTimeout(r, 0))
  const map: Record<string, User> = {}
  for (const c of comments) {
    const u = users.find((u) => u.id === c.authorId)
    if (u) map[c.authorId] = u
  }
  return map
}

export function TaskDetail({ task, users, labels, comments, onStatusChange, onClose }: TaskDetailProps) {
  const [data, setData] = useState<EnrichedData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    async function load() {
      const assignee = await fetchAssignee(users, task.assigneeId)
      const taskLabels = await fetchLabels(labels, task.labelIds)
      const taskComments = await fetchComments(comments, task.id)
      const commentAuthors = await fetchCommentAuthors(users, taskComments)
      setData({ assignee, taskLabels, taskComments, commentAuthors })
      setLoading(false)
    }
    load()
  }, [task.id, task.assigneeId, task.labelIds, users, labels, comments])

  if (loading) {
    return <div className="task-detail task-detail--loading">Loading…</div>
  }

  if (!data) return null

  const { assignee, taskLabels, taskComments, commentAuthors } = data

  return (
    <aside className="task-detail">
      <div className="task-detail__header">
        <h2 className="task-detail__title">{task.title}</h2>
        <button type="button" onClick={onClose} className="task-detail__close" aria-label="Close task detail">
          ✕
        </button>
      </div>
      <div className="task-detail__meta">
        <div className="task-detail__row">
          <span className="task-detail__key">Status</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            aria-label="Task status"
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To do</option>
            <option value="in-progress">In progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="task-detail__row">
          <span className="task-detail__key">Priority</span>
          <span className={`priority-badge priority-badge--${task.priority}`}>{task.priority}</span>
        </div>
        <div className="task-detail__row">
          <span className="task-detail__key">Assignee</span>
          <span>{assignee ? assignee.name : 'Unassigned'}</span>
        </div>
        <div className="task-detail__row">
          <span className="task-detail__key">Due</span>
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="task-detail__row">
          <span className="task-detail__key">Points</span>
          <span>{task.storyPoints}</span>
        </div>
      </div>
      {taskLabels.length > 0 && (
        <div className="task-detail__labels">
          {taskLabels.map((l) => (
            <span key={l.id} className="label-chip" style={{ backgroundColor: l.color }}>
              {l.name}
            </span>
          ))}
        </div>
      )}
      <div className="task-detail__description">
        <h3>Description</h3>
        <p>{task.description}</p>
      </div>
      <div className="task-detail__comments">
        <h3>Comments ({taskComments.length})</h3>
        {taskComments.map((c) => {
          const author = commentAuthors[c.authorId]
          return (
            <div key={c.id} className="comment">
              <div className="comment__author">{author?.name ?? 'Unknown'}</div>
              <p className="comment__body">{c.body}</p>
              <span className="comment__date">{formatDate(c.createdAt)}</span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
