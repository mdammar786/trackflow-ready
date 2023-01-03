import { useApp } from '../hooks/useApp'
import { TeamGrid } from '../components/TeamGrid'

export function TeamPage() {
  const { state } = useApp()

  return (
    <div className="team-page">
      <h1 className="team-page__title">Team</h1>
      <TeamGrid users={state.users} tasks={state.tasks} />
    </div>
  )
}
