import { useEffect, useRef, useState } from 'react'
import type { Sprint, Task } from '../types'

interface VelocityChartProps {
  sprints: Sprint[]
  tasks: Task[]
  onBarClick: (sprintId: string) => void
}

interface BarData {
  sprintId: string
  name: string
  planned: number
  actual: number
}

export function VelocityChart({ sprints, tasks, onBarClick }: VelocityChartProps) {
  const [bars, setBars] = useState<BarData[]>([])
  const [activeBar, setActiveBar] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data: BarData[] = sprints.map((s) => {
      const sprintTasks = tasks.filter((t) => t.sprintId === s.id)
      const actual = sprintTasks
        .filter((t) => t.status === 'done')
        .reduce((sum, t) => sum + t.storyPoints, 0)
      return {
        sprintId: s.id,
        name: s.name,
        planned: s.velocity,
        actual,
      }
    })
    setBars(data)
    onBarClick(sprints[0]?.id ?? '')
  }, [sprints, tasks, onBarClick])

  const maxValue = Math.max(...bars.map((b) => Math.max(b.planned, b.actual)), 1)

  return (
    <div className="velocity-chart" ref={containerRef}>
      <h3 className="velocity-chart__title">Team Velocity</h3>
      <div className="velocity-chart__legend">
        <span className="legend-item legend-item--planned">Planned</span>
        <span className="legend-item legend-item--actual">Actual</span>
      </div>
      <div className="velocity-chart__bars">
        {bars.map((bar) => (
          <div
            key={bar.sprintId}
            className={`velocity-bar ${activeBar === bar.sprintId ? 'velocity-bar--active' : ''}`}
            onClick={() => { setActiveBar(bar.sprintId); onBarClick(bar.sprintId) }}
          >
            <div className="velocity-bar__group">
              <div
                className="velocity-bar__fill velocity-bar__fill--planned"
                style={{ height: `${(bar.planned / maxValue) * 100}%` }}
                title={`Planned: ${bar.planned} pts`}
              />
              <div
                className="velocity-bar__fill velocity-bar__fill--actual"
                style={{ height: `${(bar.actual / maxValue) * 100}%` }}
                title={`Actual: ${bar.actual} pts`}
              />
            </div>
            <span className="velocity-bar__label">{bar.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
