import { useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronUp, ChevronDown, Minus, X, Crown } from 'lucide-react'
import type { LeaderboardEntry } from '../../data/competitionsData'

interface Props {
  leaderboard: LeaderboardEntry[]
  isExpanded: boolean
  onExpand: () => void
  onCollapse: () => void
}

function DeltaChip({ delta }: { delta: number }) {
  if (delta > 0) return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: '#22c55e' }}>
      <ChevronUp size={10} />{delta}
    </span>
  )
  if (delta < 0) return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: '#f87171' }}>
      <ChevronDown size={10} />{Math.abs(delta)}
    </span>
  )
  return <Minus size={10} style={{ color: '#75777f' }} />
}

export const FullLeaderboard = forwardRef<HTMLDivElement, Props>(
  function FullLeaderboard({ leaderboard, isExpanded, onExpand, onCollapse }, ref) {
    const reduced = useReducedMotion() ?? false
    const closeBtnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
      if (!isExpanded) return
      closeBtnRef.current?.focus()
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCollapse() }
      document.addEventListener('keydown', onKey)
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = prev
      }
    }, [isExpanded, onCollapse])

    // Preview card (collapsed) — always rendered at bottom of page
    const preview = leaderboard.slice(0, 3)

    return (
      <>
        {/* Preview card — tap to expand */}
        <div ref={ref}>
          <motion.button
            onClick={onExpand}
            whileTap={reduced ? {} : { scale: 0.985 }}
            className="w-full rounded-2xl overflow-hidden text-left"
            style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
                 style={{ borderBottom: '1px solid #eceef0' }}>
              <p className="text-sm font-bold" style={{ color: '#191c1e' }}>Full Rankings</p>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(10,31,68,0.07)', color: '#0A1F44' }}>
                Tap to expand ↑
              </span>
            </div>

            {/* Top 3 preview rows */}
            {preview.map((e, i) => (
              <div key={e.userId} className="flex items-center gap-3 px-4 py-2.5"
                   style={{
                     background: e.isCurrentUser ? '#f0f4ff' : '#ffffff',
                     borderLeft: e.isCurrentUser ? '3px solid #fd761a' : '3px solid transparent',
                     borderBottom: i < preview.length - 1 ? '1px solid #eceef0' : 'none',
                   }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                     style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : '#cd7c2f' }}>
                  <Crown size={11} />
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                     style={{ background: '#0A1F44' }}>
                  {e.avatarInitials}
                </div>
                <p className="flex-1 text-xs font-semibold" style={{ color: e.isCurrentUser ? '#0A1F44' : '#191c1e' }}>
                  {e.username}{e.isCurrentUser ? ' (You)' : ''}
                </p>
                <p className="text-xs font-bold" style={{ color: e.returnPercent >= 0 ? '#22c55e' : '#f87171' }}>
                  {e.returnPercent >= 0 ? '+' : ''}{e.returnPercent.toFixed(2)}%
                </p>
              </div>
            ))}

            {/* Fade hint */}
            <div className="flex items-center justify-center py-2.5 gap-1" style={{ borderTop: '1px solid #eceef0' }}>
              <span className="text-[10px]" style={{ color: '#c5c6cf' }}>• • •</span>
              <span className="text-[10px]" style={{ color: '#75777f' }}>{leaderboard.length} entries</span>
            </div>
          </motion.button>
        </div>

        {/* Full-screen expanded overlay */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.45)' }}
                onClick={onCollapse}
                aria-hidden="true"
              />

              {/* Expanded card */}
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                role="dialog"
                aria-modal="true"
                aria-label="Full Rankings"
                className="absolute inset-x-3 bottom-3 top-4 z-50 flex flex-col rounded-3xl overflow-hidden"
                style={{ background: '#ffffff', boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}
                tabIndex={-1}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                     style={{ borderBottom: '1px solid #eceef0' }}>
                  <div>
                    <p className="text-base font-bold" style={{ color: '#191c1e' }}>Full Rankings</p>
                    <p className="text-[11px]" style={{ color: '#75777f' }}>{leaderboard.length} participants</p>
                  </div>
                  <button
                    ref={closeBtnRef}
                    onClick={onCollapse}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#eceef0' }}
                    aria-label="Close rankings"
                  >
                    <X size={14} style={{ color: '#44464e' }} />
                  </button>
                </div>

                {/* Column headers */}
                <div className="flex items-center gap-2 px-5 py-2 flex-shrink-0"
                     style={{ background: '#f7f9fb', borderBottom: '1px solid #eceef0' }}>
                  {['#', '', 'Student', 'Return', 'Δ'].map((h, i) => (
                    <span key={i}
                      className={`text-[9px] font-bold uppercase tracking-widest ${
                        i === 0 ? 'w-7' : i === 1 ? 'w-7' : i === 2 ? 'flex-1' : i === 3 ? 'w-14 text-right' : 'w-6 text-center'
                      }`}
                      style={{ color: '#75777f' }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                <div className="overflow-y-auto flex-1">
                  {leaderboard.map((e, i) => (
                    <motion.div
                      key={e.userId}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduced ? 0 : i * 0.03, duration: 0.25 }}
                      className="flex items-center gap-2 px-5 py-3"
                      style={{
                        background: e.isCurrentUser ? '#f0f4ff' : '#ffffff',
                        borderLeft: e.isCurrentUser ? '3px solid #fd761a' : '3px solid transparent',
                        borderBottom: i < leaderboard.length - 1 ? '1px solid #eceef0' : 'none',
                      }}
                    >
                      {/* Rank number */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                           style={{
                             background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : e.isCurrentUser ? '#0A1F44' : '#eceef0',
                           }}>
                        {i < 3
                          ? <Crown size={11} className="text-white" />
                          : <span className="text-[10px] font-bold" style={{ color: e.isCurrentUser ? '#ffffff' : '#75777f' }}>
                              {e.rank}
                            </span>
                        }
                      </div>

                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                           style={{ background: '#0A1F44' }}>
                        {e.avatarInitials}
                      </div>

                      {/* Name */}
                      <p className="flex-1 text-sm font-semibold truncate"
                         style={{ color: e.isCurrentUser ? '#0A1F44' : '#191c1e' }}>
                        {e.username}{e.isCurrentUser ? ' (You)' : ''}
                      </p>

                      {/* Return % */}
                      <p className="w-14 text-xs font-bold text-right"
                         style={{ color: e.returnPercent >= 0 ? '#22c55e' : '#f87171' }}>
                        {e.returnPercent >= 0 ? '+' : ''}{e.returnPercent.toFixed(2)}%
                      </p>

                      {/* Delta */}
                      <div className="w-6 flex justify-center">
                        <DeltaChip delta={e.rankDelta} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }
)
