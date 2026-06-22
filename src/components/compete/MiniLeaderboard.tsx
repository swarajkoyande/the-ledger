import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'
import type { LeaderboardEntry } from '../../data/competitionsData'

interface Props {
  leaderboard: LeaderboardEntry[]
  onFullTable: () => void
}

function DeltaIcon({ delta }: { delta: number }) {
  if (delta > 0) return <ChevronUp size={11} style={{ color: '#22c55e' }} />
  if (delta < 0) return <ChevronDown size={11} style={{ color: '#f87171' }} />
  return <Minus size={10} style={{ color: '#75777f' }} />
}

export function MiniLeaderboard({ leaderboard, onFullTable }: Props) {
  const reduced = useReducedMotion() ?? false
  const top5 = leaderboard.filter(e => e.rank <= 5)
  const me = leaderboard.find(e => e.isCurrentUser)
  const meInTop5 = me ? me.rank <= 5 : false

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #eceef0' }}>
        <p className="text-sm font-bold" style={{ color: '#191c1e' }}>Leaderboard</p>
        <button onClick={onFullTable} className="text-[11px] font-semibold" style={{ color: '#fd761a' }}>
          Full table →
        </button>
      </div>

      <AnimatePresence>
        {top5.map((e, i) => (
          <motion.div
            key={e.userId}
            layout={!reduced}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{
              background: e.isCurrentUser ? '#f0f4ff' : '#ffffff',
              borderLeft: e.isCurrentUser ? '3px solid #fd761a' : '3px solid transparent',
              borderBottom: i < top5.length - 1 || !meInTop5 ? '1px solid #eceef0' : 'none',
            }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                 style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : e.isCurrentUser ? '#0A1F44' : '#eceef0',
                          color: i < 3 || e.isCurrentUser ? '#ffffff' : '#75777f' }}>
              {e.rank}
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                 style={{ background: '#0A1F44' }}>
              {e.avatarInitials}
            </div>
            <p className="flex-1 text-xs font-semibold truncate" style={{ color: e.isCurrentUser ? '#0A1F44' : '#191c1e' }}>
              {e.username}{e.isCurrentUser ? ' (You)' : ''}
            </p>
            <p className="text-xs font-bold" style={{ color: e.returnPercent >= 0 ? '#22c55e' : '#f87171' }}>
              {e.returnPercent >= 0 ? '+' : ''}{e.returnPercent.toFixed(1)}%
            </p>
            <DeltaIcon delta={e.rankDelta} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Ellipsis + current user if not in top 5 */}
      {!meInTop5 && me && (
        <>
          <div className="flex items-center justify-center py-1.5" style={{ borderBottom: '1px solid #eceef0' }}>
            <span className="text-[10px]" style={{ color: '#c5c6cf' }}>• • •</span>
          </div>
          <motion.div
            layout={!reduced}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ background: '#f0f4ff', borderLeft: '3px solid #fd761a' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                 style={{ background: '#0A1F44' }}>
              {me.rank}
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                 style={{ background: '#0A1F44' }}>
              {me.avatarInitials}
            </div>
            <p className="flex-1 text-xs font-semibold truncate" style={{ color: '#0A1F44' }}>
              {me.username} (You)
            </p>
            <p className="text-xs font-bold" style={{ color: me.returnPercent >= 0 ? '#22c55e' : '#f87171' }}>
              {me.returnPercent >= 0 ? '+' : ''}{me.returnPercent.toFixed(1)}%
            </p>
            <DeltaIcon delta={me.rankDelta} />
          </motion.div>
        </>
      )}
    </div>
  )
}
