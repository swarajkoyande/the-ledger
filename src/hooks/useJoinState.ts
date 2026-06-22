import { useState, useCallback } from 'react'
import type { Challenge } from '../data/competitionsData'

const STORAGE_KEY = 'ledger_joined_challenges'

function readStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

function writeStorage(ids: Set<string>): void {
  // TODO: replace with Supabase upsert to competition_participants
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export interface JoinStateResult {
  joinedIds: Set<string>
  join: (id: string) => void
  leave: (id: string) => void
  isJoined: (id: string) => boolean
  getEntrantCount: (challenge: Challenge) => number
}

export function useJoinState(challenges: Challenge[]): JoinStateResult {
  const [joinedIds, setJoinedIds] = useState<Set<string>>(readStorage)
  // Map from id → override count (optimistic increments)
  const [entrantOverrides, setEntrantOverrides] = useState<Map<string, number>>(() => new Map())

  const join = useCallback((id: string) => {
    setJoinedIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      // TODO: replace with Supabase upsert to competition_participants
      writeStorage(next)
      return next
    })
    setEntrantOverrides(prev => {
      const base = challenges.find(c => c.id === id)?.entrants ?? 0
      const next = new Map(prev)
      next.set(id, (prev.get(id) ?? base) + 1)
      return next
    })
  }, [challenges])

  const leave = useCallback((id: string) => {
    setJoinedIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      // TODO: replace with Supabase upsert to competition_participants
      writeStorage(next)
      return next
    })
    setEntrantOverrides(prev => {
      const base = challenges.find(c => c.id === id)?.entrants ?? 0
      const next = new Map(prev)
      const current = prev.get(id) ?? base + 1
      next.set(id, Math.max(base, current - 1))
      return next
    })
  }, [challenges])

  const isJoined = useCallback((id: string) => joinedIds.has(id), [joinedIds])

  const getEntrantCount = useCallback(
    (challenge: Challenge) => entrantOverrides.get(challenge.id) ?? challenge.entrants,
    [entrantOverrides]
  )

  return { joinedIds, join, leave, isJoined, getEntrantCount }
}
