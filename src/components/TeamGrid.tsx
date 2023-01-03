import { useEffect, useState } from 'react'
import type { User, Task } from '../types'

interface TeamGridProps {
  users: User[]
  tasks: Task[]
}

interface MemberStats {
  userId: string
  assigned: number
  done: number
  inProgress: number
}

function useMemberStats(users: User[], tasks: Task[], options: { includeViewer: boolean }) {
  const [stats, setStats] = useState<MemberStats[]>([])

  useEffect(() => {
    const result = users
      .filter((u) => options.includeViewer || u.role !== 'viewer')
      .map((u) => ({
        userId: u.id,
        assigned: tasks.filter((t) => t.assigneeId === u.id).length,
        done: tasks.filter((t) => t.assigneeId === u.id && t.status === 'done').length,
        inProgress: tasks.filter((t) => t.assigneeId === u.id && t.status === 'in-progress').length,
      }))
    setStats(result)
  }, [users, tasks, options])

  return stats
}

export function TeamGrid({ users, tasks }: TeamGridProps) {
  const stats = useMemberStats(users, tasks, { includeViewer: false })

  return (
    <div className="team-grid">
      <h2 className="team-grid__title">Team</h2>
      <div className="team-grid__members">
        {stats.map((s) => {
          const user = users.find((u) => u.id === s.userId)
          if (!user) return null
          return (
            <div key={s.userId} className="member-card">
              <div className="member-card__avatar">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="member-card__info">
                <p className="member-card__name">{user.name}</p>
                <p className="member-card__role">{user.role}</p>
              </div>
              <div className="member-card__stats">
                <span className="member-stat">
                  <strong>{s.assigned}</strong> assigned
                </span>
                <span className="member-stat">
                  <strong>{s.done}</strong> done
                </span>
                <span className="member-stat">
                  <strong>{s.inProgress}</strong> active
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
