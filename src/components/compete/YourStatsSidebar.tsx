import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import type { UserCompeteStats } from '../../data/competitionsData'

interface StatRowProps {
  label: string
  value: number
  suffix?: string
  reduced: boolean
}

function StatRow({ label, value, suffix = '', reduced }: StatRowProps) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, v => Math.round(v).toLocaleString() + suffix)

  useEffect(() => {
    if (reduced) { mv.set(value); return }
    const start = performance.now()
    const duration = 800
    let raf: number

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease out expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      mv.set(eased * value)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduced, mv])

  return (
    <div className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #eceef0' }}>
      <span className="text-xs" style={{ color: '#75777f' }}>{label}</span>
      <motion.span className="text-xs font-bold" style={{ color: '#191c1e' }}>
        {display}
      </motion.span>
    </div>
  )
}

interface Props {
  userStats: UserCompeteStats
}

export function YourStatsSidebar({ userStats }: Props) {
  const reduced = useReducedMotion() ?? false

  const stats: Array<{ label: string; value: number; suffix?: string }> = [
    { label: 'Challenges joined',  value: userStats.challengesJoined },
    { label: 'Top 10 finishes',    value: userStats.top10Finishes    },
    { label: 'XP from challenges', value: 680                        },
    { label: 'Current streak',     value: userStats.currentStreak, suffix: 'd' },
  ]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #eceef0' }}>
        <p className="text-sm font-bold" style={{ color: '#191c1e' }}>Your Stats</p>
      </div>
      <div className="px-4">
        {stats.map((s, i) => (
          <div key={s.label} style={{ borderBottom: i < stats.length - 1 ? '1px solid #eceef0' : 'none' }}>
            <StatRow label={s.label} value={s.value} suffix={s.suffix} reduced={reduced} />
          </div>
        ))}
      </div>
    </div>
  )
}
