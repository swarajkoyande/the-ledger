import { useState, useEffect } from 'react'

export interface CountdownResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function useCountdown(endsAt: Date): CountdownResult {
  const getRemaining = (): CountdownResult => {
    const diff = endsAt.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    const days    = Math.floor(diff / 86_400_000)
    const hours   = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor((diff % 3_600_000) / 60_000)
    const seconds = Math.floor((diff % 60_000) / 1_000)
    return { days, hours, minutes, seconds, isExpired: false }
  }

  const [remaining, setRemaining] = useState<CountdownResult>(getRemaining)

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return remaining
}
