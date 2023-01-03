import { useState, useEffect } from 'react'

interface SprintTimerProps {
  endDate: string
}

export function SprintTimer({ endDate }: SprintTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const end = new Date(endDate).getTime()
    return Math.max(0, Math.floor((end - Date.now()) / 1000))
  })

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60

  return (
    <div className="sprint-timer">
      <span className="sprint-timer__label">Sprint ends in</span>
      <span className="sprint-timer__value">
        {days}d {hours}h {minutes}m {secs}s
      </span>
    </div>
  )
}
