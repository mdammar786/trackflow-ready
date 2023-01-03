import { useState, useEffect } from 'react'
import type { Task, Sprint } from '../types'
import { sprintProgress } from '../lib/utils'

interface SprintStatsProps {
  sprint: Sprint
  tasks: Task[]
}

export function SprintStats({ sprint, tasks }: SprintStatsProps) {
  const [totalPoints, setTotalPoints] = useState(0)
  const [donePoints, setDonePoints] = useState(0)
  const [progress, setProgress] = useState(0)
  const [taskCount, setTaskCount] = useState(0)

  useEffect(() => {
    const total = tasks.reduce((s, t) => s + t.storyPoints, 0)
    const done = tasks.filter((t) => t.status === 'done').reduce((s, t) => s + t.storyPoints, 0)
    setTotalPoints(total)
    setDonePoints(done)
    setProgress(sprintProgress(tasks))
    setTaskCount(tasks.length)
  }, [tasks])

  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const review = tasks.filter((t) => t.status === 'review').length
  const remaining = totalPoints - donePoints

  return (
    <div className="sprint-stats">
      <div className="sprint-stats__header">
        <h2 className="sprint-stats__name">{sprint.name}</h2>
        <span className={`sprint-status sprint-status--${sprint.status}`}>{sprint.status}</span>
      </div>
      <p className="sprint-stats__goal">{sprint.goal}</p>
      <div className="sprint-stats__progress">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Sprint progress" />
        </div>
        <span className="progress-bar__label">{progress}%</span>
      </div>
      <div className="sprint-stats__metrics">
        <div className="metric">
          <span className="metric__value">{taskCount}</span>
          <span className="metric__label">Total tasks</span>
        </div>
        <div className="metric">
          <span className="metric__value">{donePoints}</span>
          <span className="metric__label">Points done</span>
        </div>
        <div className="metric">
          <span className="metric__value">{remaining}</span>
          <span className="metric__label">Points left</span>
        </div>
        <div className="metric">
          <span className="metric__value">{inProgress}</span>
          <span className="metric__label">In progress</span>
        </div>
        <div className="metric">
          <span className="metric__value">{review}</span>
          <span className="metric__label">In review</span>
        </div>
      </div>
    </div>
  )
}
