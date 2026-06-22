import { motion, useReducedMotion } from 'framer-motion'
import { ChevronUp, Trophy } from 'lucide-react'
import type { UserCompeteStats, LeaderboardEntry } from '../../data/competitionsData'

interface Props {
  userStats: UserCompeteStats
  leaderboard: LeaderboardEntry[]
  onPastResults: () => void
  onScrollToRankings: () => void
}

export function CompetitionsHero({ userStats, leaderboard, onPastResults, onScrollToRankings }: Props) {
  const reduced = useReducedMotion() ?? false
  const xpPct = Math.min(100, Math.round((userStats.totalXp / userStats.nextRankXp) * 100))
  const top3 = leaderboard.filter(e => e.rank <= 3)
  const nextRankUser = leaderboard.find(e => e.rank === userStats.rank - 1)?.username ?? userStats.nextRankUsername
  const xpGap = userStats.nextRankXp - userStats.totalXp

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-5 mb-4"
      style={{
        background: '#0A1F44',
        boxShadow: '0 12px 24px rgba(10,31,68,0.18)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left — XP + rank */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>
            Your Global Rank
          </p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black text-white leading-none">#{userStats.rank}</span>
            <span className="text-sm font-semibold mb-0.5" style={{ color: '#7687b2' }}>of 1,240</span>
            {userStats.rankDelta > 0 && (
              <div className="flex items-center gap-0.5 mb-1">
                <ChevronUp size={13} style={{ color: '#22c55e' }} />
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>+{userStats.rankDelta}</span>
              </div>
            )}
          </div>

          {/* XP bar */}
          <div className="mt-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: '#7687b2' }}>
                {userStats.totalXp.toLocaleString()} XP
              </span>
              <span className="text-[10px]" style={{ color: '#7687b2' }}>
                Next: {userStats.nextRankXp.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: '#fd761a' }}
              />
            </div>

            {/* Progress to next rank tooltip (desktop only, hidden on small screens) */}
            <p className="hidden lg:block text-[10px] mt-1" style={{ color: '#7687b2' }}>
              {xpGap.toLocaleString()} XP to overtake {nextRankUser}
            </p>
          </div>
        </div>

        {/* Right — top 3 avatars (desktop only) */}
        <div className="hidden lg:flex flex-col items-end gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Top 3</p>
          {top3.map(e => (
            <div key={e.rank} className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-semibold text-white">{e.username}</p>
                <p className="text-[10px]" style={{ color: e.returnPercent >= 0 ? '#22c55e' : '#f87171' }}>
                  {e.returnPercent >= 0 ? '+' : ''}{e.returnPercent.toFixed(2)}%
                </p>
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                   style={{ background: e.rank === 1 ? '#fbbf24' : e.rank === 2 ? '#9ca3af' : '#cd7c2f' }}>
                {e.avatarInitials}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onPastResults}
          className="text-[11px] font-semibold"
          style={{ color: '#fd761a' }}
        >
          Past results
        </button>
        <span style={{ color: '#4c5e86' }}>·</span>
        <Trophy size={11} style={{ color: '#7687b2' }} />
        <span className="text-[11px]" style={{ color: '#7687b2' }}>
          {userStats.top10Finishes} top-10 finish{userStats.top10Finishes !== 1 ? 'es' : ''}
        </span>

        {/* Liquid glass "More" pill — scrolls to full rankings */}
        <motion.button
          onClick={onScrollToRankings}
          whileTap={reduced ? {} : { scale: 0.93 }}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
          style={{
            borderRadius: 20,
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#e2eaff',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          Full rankings
          <span style={{ color: '#7687b2', fontSize: 11 }}>↓</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
