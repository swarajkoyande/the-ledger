import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Trophy } from 'lucide-react'
import type { Challenge } from '../../data/competitionsData'

// Mock past-result data per ended challenge
const MOCK_RESULTS: Record<string, { userRank: number; xpEarned: number; top3: string[] }> = {
  ch5: { userRank: 12, xpEarned: 1200, top3: ['CapitalKing', 'AlphaHunterX', 'BullMarketQ'] },
  ch6: { userRank: 8,  xpEarned: 850,  top3: ['SofiaL', 'BondKingJ', 'QuietPortfolio'] },
}

interface Props {
  isOpen: boolean
  endedChallenges: Challenge[]
  focusedChallenge: Challenge | null
  onClose: () => void
}

export function PastResultsModal({ isOpen, endedChallenges, focusedChallenge, onClose }: Props) {
  const reduced = useReducedMotion() ?? false
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, onClose])

  const toShow = focusedChallenge ? [focusedChallenge] : endedChallenges

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.40)' }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Past Results"
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
            style={{ background: '#ffffff', borderRadius: '24px 24px 0 0', maxHeight: '85%' }}
            tabIndex={-1}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: '#eceef0' }} />
            </div>

            <div className="flex items-center justify-between px-5 pt-2 pb-3 flex-shrink-0"
                 style={{ borderBottom: '1px solid #eceef0' }}>
              <p className="text-base font-bold" style={{ color: '#191c1e' }}>
                {focusedChallenge ? 'Results' : 'Past Results'}
              </p>
              <button
                ref={closeRef}
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#eceef0' }}
                aria-label="Close"
              >
                <X size={14} style={{ color: '#44464e' }} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 pt-4 pb-safe">
              {toShow.map(ch => {
                const result = MOCK_RESULTS[ch.id]
                return (
                  <div key={ch.id} className="mb-5">
                    <p className="text-sm font-bold mb-1" style={{ color: '#191c1e' }}>{ch.title}</p>
                    <p className="text-[11px] mb-3" style={{ color: '#75777f' }}>
                      Ended {ch.endsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {result ? (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                               style={{ background: 'rgba(10,31,68,0.08)' }}>
                            <Trophy size={11} style={{ color: '#0A1F44' }} />
                            <span className="text-xs font-bold" style={{ color: '#0A1F44' }}>
                              Your rank: #{result.userRank}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                               style={{ background: 'rgba(253,118,26,0.12)' }}>
                            <span className="text-xs font-bold" style={{ color: '#fd761a' }}>
                              +{result.xpEarned.toLocaleString()} XP earned
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#75777f' }}>Top 3</p>
                        {result.top3.map((name, i) => (
                          <div key={name} className="flex items-center gap-3 py-2"
                               style={{ borderBottom: i < 2 ? '1px solid #eceef0' : 'none' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                 style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : '#cd7c2f' }}>
                              {i + 1}
                            </div>
                            <span className="text-sm font-semibold" style={{ color: '#191c1e' }}>{name}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: '#75777f' }}>No results available for this challenge.</p>
                    )}
                    {toShow.length > 1 && <div className="mt-4" style={{ borderTop: '1px solid #eceef0' }} />}
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
