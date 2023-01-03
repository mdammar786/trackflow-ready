import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { VelocityChart } from '../components/VelocityChart'
import { SprintStats } from '../components/SprintStats'

export function ReportsPage() {
  const { state } = useApp()
  const [focusedSprintId, setFocusedSprintId] = useState<string>(state.sprints[0]?.id ?? '')

  const focusedSprint = state.sprints.find((s) => s.id === focusedSprintId) ?? state.sprints[0]
  const sprintTasks = state.tasks.filter((t) => t.sprintId === focusedSprintId)

  return (
    <div className="reports-page">
      <h1 className="reports-page__title">Reports</h1>
      <div className="reports-page__body">
        <div className="reports-page__chart">
          <VelocityChart
            sprints={state.sprints}
            tasks={state.tasks}
            onBarClick={setFocusedSprintId}
          />
        </div>
        {focusedSprint && (
          <div className="reports-page__detail">
            <SprintStats sprint={focusedSprint} tasks={sprintTasks} />
          </div>
        )}
      </div>
    </div>
  )
}
