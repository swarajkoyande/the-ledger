import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

// ─── Storage keys ───────────────────────────────────────────────────────────
const LS_XP        = 'ledger_xp'
const LS_STREAK    = 'ledger_streak'
const LS_FREEZES   = 'ledger_freezes'
const LS_LASTVISIT = 'ledger_lastVisit'
const LS_PROGRESS  = 'ledger_progress'

// ─── Defaults ───────────────────────────────────────────────────────────────
const DEFAULT_XP      = 340
const DEFAULT_STREAK  = 12
const DEFAULT_FREEZES = 1

type CourseProgress = Record<string, number>

// ─── Helpers ────────────────────────────────────────────────────────────────
function readNumber(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const n = Number(raw)
    return Number.isFinite(n) ? n : fallback
  } catch {
    return fallback
  }
}

function readProgress(): CourseProgress {
  try {
    const raw = localStorage.getItem(LS_PROGRESS)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as CourseProgress) : {}
  } catch {
    return {}
  }
}

/** Local calendar day key, e.g. "2026-06-17" */
function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// ─── Context ────────────────────────────────────────────────────────────────
interface ProgressCtx {
  xp: number
  addXp: (n: number) => void
  streak: number
  freezes: number
  useFreeze: () => boolean
  courseProgress: CourseProgress
  getProgress: (courseId: string) => number
  setProgress: (courseId: string, value: number) => void
  resetProgress: () => void
}

const Ctx = createContext<ProgressCtx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Lazy-initialised persistent state
  const [xp, setXp]                       = useState<number>(() => readNumber(LS_XP, DEFAULT_XP))
  const [streak, setStreak]               = useState<number>(() => readNumber(LS_STREAK, DEFAULT_STREAK))
  const [freezes, setFreezes]             = useState<number>(() => readNumber(LS_FREEZES, DEFAULT_FREEZES))
  const [courseProgress, setCourseProgress] = useState<CourseProgress>(() => readProgress())

  // New-calendar-day streak increment (runs once on mount)
  useEffect(() => {
    let last: string | null = null
    try {
      last = localStorage.getItem(LS_LASTVISIT)
    } catch { /* ignore */ }

    const today = dayKey()
    if (last !== today) {
      // Only bump the streak if there was a previous visit on a different day.
      if (last) setStreak(s => s + 1)
      try {
        localStorage.setItem(LS_LASTVISIT, today)
      } catch { /* ignore */ }
    }
  }, [])

  // Persist each slice
  useEffect(() => {
    try { localStorage.setItem(LS_XP, String(xp)) } catch { /* ignore */ }
  }, [xp])

  useEffect(() => {
    try { localStorage.setItem(LS_STREAK, String(streak)) } catch { /* ignore */ }
  }, [streak])

  useEffect(() => {
    try { localStorage.setItem(LS_FREEZES, String(freezes)) } catch { /* ignore */ }
  }, [freezes])

  useEffect(() => {
    try { localStorage.setItem(LS_PROGRESS, JSON.stringify(courseProgress)) } catch { /* ignore */ }
  }, [courseProgress])

  // ─── Actions ───────────────────────────────────────────────────────────────
  const addXp = (n: number) => setXp(x => Math.max(0, x + n))

  const useFreeze = (): boolean => {
    let used = false
    setFreezes(f => {
      if (f > 0) { used = true; return f - 1 }
      return f
    })
    return used
  }

  const getProgress = (courseId: string): number => courseProgress[courseId] ?? 0

  const setProgress = (courseId: string, value: number) => {
    const clamped = Math.max(0, Math.min(100, value))
    setCourseProgress(prev => ({ ...prev, [courseId]: clamped }))
  }

  const resetProgress = () => {
    setXp(DEFAULT_XP)
    setStreak(DEFAULT_STREAK)
    setFreezes(DEFAULT_FREEZES)
    setCourseProgress({})
    try {
      localStorage.removeItem(LS_XP)
      localStorage.removeItem(LS_STREAK)
      localStorage.removeItem(LS_FREEZES)
      localStorage.removeItem(LS_LASTVISIT)
      localStorage.removeItem(LS_PROGRESS)
    } catch { /* ignore */ }
  }

  return (
    <Ctx.Provider
      value={{
        xp, addXp,
        streak,
        freezes, useFreeze,
        courseProgress, getProgress, setProgress,
        resetProgress,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
