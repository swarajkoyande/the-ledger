import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Trophy, Users, Check, Plus, Star, Send } from 'lucide-react'
import type { Challenge } from '../../data/competitionsData'
import { LiveCountdown } from './LiveCountdown'

interface Props {
  challenge: Challenge | null
  isJoined: boolean
  isSubmitted: boolean
  entrantCount: number
  onJoin: () => void
  onLeave: () => void
  onClose: () => void
  onSubmitEntry: () => void
}

export function ChallengeDetailModal({ challenge, isJoined, isSubmitted, entrantCount, onJoin, onLeave, onClose, onSubmitEntry }: Props) {
  const reduced = useReducedMotion() ?? false
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!challenge) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [challenge, onClose])

  const backdropAnim = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }

  const sheetAnim = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial:    { y: '100%' },
        animate:    { y: 0 },
        exit:       { y: '100%' },
        transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
      }

  const isEnded = challenge?.status === 'ended'
  const isActive = challenge?.status === 'active'
  const canSubmit = isJoined && isActive && !isSubmitted

  return (
    <AnimatePresence>
      {challenge && (
        <>
          {/* Backdrop */}
          <motion.div
            {...backdropAnim}
            className="absolute inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.40)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            {...sheetAnim}
            role="dialog"
            aria-modal="true"
            aria-label={challenge.title}
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col"
            style={{
              background: '#ffffff',
              borderRadius: '24px 24px 0 0',
              maxHeight: '90%',
            }}
            tabIndex={-1}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: '#eceef0' }} />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-3 flex-shrink-0"
                 style={{ borderBottom: '1px solid #eceef0' }}>
              <div className="flex-1 pr-3">
                <p className="text-base font-bold leading-snug" style={{ color: '#191c1e' }}>{challenge.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#75777f' }}>{challenge.organizer}</p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#eceef0' }}
                aria-label="Close"
              >
                <X size={14} style={{ color: '#44464e' }} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              {/* Prize + XP row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                     style={{ background: 'rgba(212,175,55,0.12)' }}>
                  <Trophy size={12} style={{ color: '#d4af37' }} />
                  <span className="text-xs font-bold" style={{ color: '#d4af37' }}>{challenge.prize}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                     style={{ background: 'rgba(253,118,26,0.12)' }}>
                  <Star size={12} style={{ color: '#fd761a' }} />
                  <span className="text-xs font-bold" style={{ color: '#fd761a' }}>{challenge.xpReward.toLocaleString()} XP</span>
                </div>
                {isSubmitted && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{ background: 'rgba(22,163,74,0.12)' }}>
                    <Check size={12} style={{ color: '#16a34a' }} />
                    <span className="text-xs font-bold" style={{ color: '#16a34a' }}>Submitted</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#44464e' }}>{challenge.description}</p>

              {/* Countdown if active */}
              {isActive && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: '#f7f9fb' }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4c5e86' }}>Ends in</span>
                  <LiveCountdown endsAt={challenge.endsAt} />
                </div>
              )}

              {/* Entrants */}
              <div className="flex items-center gap-2 mb-4">
                <Users size={13} style={{ color: '#75777f' }} />
                <span className="text-sm" style={{ color: '#44464e' }}>
                  {entrantCount.toLocaleString()} entered
                  {challenge.maxEntrants ? ` / ${challenge.maxEntrants.toLocaleString()} max` : ''}
                </span>
              </div>

              {/* Rules */}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#75777f' }}>Rules</p>
              <ul className="flex flex-col gap-2 mb-4">
                {challenge.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#44464e' }}>
                    <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                          style={{ background: '#0A1F44' }}>{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-full font-semibold"
                        style={{ background: '#eceef0', color: '#44464e' }}>{t}</span>
                ))}
                {challenge.isTeamBased && (
                  <span className="text-[10px] px-2 py-1 rounded-full font-semibold"
                        style={{ background: 'rgba(10,31,68,0.08)', color: '#0A1F44' }}>Team-based</span>
                )}
              </div>
            </div>

            {/* Sticky footer CTA */}
            {isActive && (
              <div className="px-5 pt-4 pb-safe flex-shrink-0 flex flex-col gap-2" style={{ borderTop: '1px solid #eceef0' }}>
                {canSubmit && (
                  <motion.button
                    whileTap={reduced ? {} : { scale: 0.94 }}
                    onClick={onSubmitEntry}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                    style={{ background: '#0A1F44', color: '#ffffff' }}
                  >
                    <Send size={15} /> Submit Entry
                  </motion.button>
                )}
                <motion.button
                  whileTap={reduced ? {} : { scale: 0.94 }}
                  onClick={isJoined ? onLeave : onJoin}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                  style={{
                    background: isJoined ? '#dcfce7' : '#fd761a',
                    color: isJoined ? '#16a34a' : '#ffffff',
                    border: isJoined ? '1.5px solid #22c55e' : 'none',
                  }}
                >
                  {isJoined ? <><Check size={16} /> Joined</> : <><Plus size={16} /> Join Challenge</>}
                </motion.button>
              </div>
            )}
            {isEnded && (
              <div className="px-5 pt-4 pb-safe flex-shrink-0" style={{ borderTop: '1px solid #eceef0' }}>
                <button
                  className="w-full flex items-center justify-center py-3 rounded-2xl text-sm font-bold"
                  style={{ background: '#eceef0', color: '#44464e' }}
                >
                  Competition Ended
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
