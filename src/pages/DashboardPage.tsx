import { useMemo } from 'react'
import { useApp } from '../hooks/useApp'
import { SprintStats } from '../components/SprintStats'
import { SprintTimer } from '../components/SprintTimer'
import { TaskList } from '../components/TaskList'
import { TeamGrid } from '../components/TeamGrid'

export function DashboardPage() {
  const { state, dispatch } = useApp()

  const activeSprint = state.sprints.find((s) => s.id === state.activeSprint) ?? null
  const sprintTasks = useMemo(
    () => state.tasks.filter((t) => t.sprintId === state.activeSprint),
    [state.tasks, state.activeSprint],
  )
  const recentTasks = useMemo(
    () => [...state.tasks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [state.tasks],
  )

  function handleSelect(taskId: string) {
    dispatch({ type: 'SELECT_TASK', taskId })
  }

  if (!activeSprint) {
    return (
      <div className="dashboard dashboard--empty">
        <p>No active sprint. Start a sprint to see the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard__top">
        <SprintStats sprint={activeSprint} tasks={sprintTasks} />
        <SprintTimer endDate={activeSprint.endDate} />
      </div>
      <div className="dashboard__body">
        <section className="dashboard__section">
          <h2>Recent activity</h2>
          <TaskList
            tasks={recentTasks}
            users={state.users}
            labels={state.labels}
            onSelect={handleSelect}
            selectedId={state.selectedTaskId}
          />
        </section>
        <section className="dashboard__section">
          <TeamGrid users={state.users} tasks={state.tasks} />
        </section>
      </div>
    </div>
  )
}
