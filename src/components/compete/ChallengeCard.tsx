import { motion, useReducedMotion } from 'framer-motion'
import { Trophy, Briefcase, Brain, TrendingUp, Mic, Users, Star, Check, Plus, Eye } from 'lucide-react'
import type { Challenge } from '../../data/competitionsData'
import { LiveCountdown } from './LiveCountdown'

interface Props {
  challenge: Challenge
  isJoined: boolean
  isSubmitted?: boolean
  entrantCount: number
  onJoin: () => void
  onLeave: () => void
  onClick: () => void
  onViewResults?: () => void
}

const TYPE_ICON: Record<Challenge['type'], React.ReactNode> = {
  'trading':          <Trophy size={16} />,
  'case-competition': <Briefcase size={16} />,
  'quiz-challenge':   <Brain size={16} />,
  'ma-simulation':    <TrendingUp size={16} />,
  'pitch':            <Mic size={16} />,
}

const DIFF_COLORS: Record<Challenge['difficulty'], { bg: string; text: string }> = {
  beginner:     { bg: 'rgba(22,163,74,0.12)',  text: '#16a34a' },
  intermediate: { bg: 'rgba(217,119,6,0.12)',  text: '#d97706' },
  advanced:     { bg: 'rgba(220,38,38,0.12)',  text: '#dc2626' },
}

export function ChallengeCard({ challenge, isJoined, isSubmitted = false, entrantCount, onJoin, onLeave, onClick, onViewResults }: Props) {
  const reduced = useReducedMotion() ?? false
  const { status, difficulty, type } = challenge
  const dc = DIFF_COLORS[difficulty]
  const isEnded = status === 'ended'
  const isUpcoming = status === 'upcoming'

  const hoverAnim = reduced
    ? {}
    : { y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.22)' }

  const joinedGlow = isJoined ? '0 0 0 1.5px rgba(34,197,94,0.4), 0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.06)'

  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: isEnded ? 0.62 : 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
      whileHover={hoverAnim}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer"
      style={{ background: '#ffffff', boxShadow: joinedGlow }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: '#0A1F44', color: '#fd761a' }}>
            {TYPE_ICON[type]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug truncate" style={{ color: '#191c1e' }}>
              {challenge.title}
            </p>
            <p className="text-[10px]" style={{ color: '#75777f' }}>{challenge.organizer}</p>
          </div>
        </div>
        {/* XP badge */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
             style={{ background: 'rgba(253,118,26,0.12)' }}>
          <Star size={9} style={{ color: '#fd761a' }} />
          <span className="text-[10px] font-bold" style={{ color: '#fd761a' }}>{challenge.xpReward.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
              style={{ background: dc.bg, color: dc.text }}>
          {difficulty}
        </span>
        <div className="flex items-center gap-1">
          <Users size={10} style={{ color: '#75777f' }} />
          <motion.span
            key={entrantCount}
            initial={reduced ? {} : { scale: 1.3, color: '#fd761a' }}
            animate={{ scale: 1, color: '#75777f' }}
            transition={{ duration: 0.3 }}
            className="text-[10px]"
            style={{ color: '#75777f' }}
          >
            {entrantCount.toLocaleString()}
          </motion.span>
          {challenge.maxEntrants && (
            <span className="text-[10px]" style={{ color: '#75777f' }}>/ {challenge.maxEntrants.toLocaleString()}</span>
          )}
        </div>
        {isSubmitted && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0"
                style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>
            Submitted ✓
          </span>
        )}
      </div>

      {/* Countdown / date */}
      <div className="mb-3">
        {status === 'active' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4c5e86' }}>Ends in</span>
            <LiveCountdown endsAt={challenge.endsAt} />
          </div>
        )}
        {isUpcoming && (
          <span className="text-[10px] font-semibold" style={{ color: '#75777f' }}>
            Starts {challenge.startsAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {isEnded && (
          <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold"
                style={{ background: '#eceef0', color: '#75777f' }}>Ended</span>
        )}
      </div>

      {/* Prize row */}
      <div className="flex items-center gap-1.5 mb-3">
        <Trophy size={10} style={{ color: '#d4af37' }} />
        <span className="text-[10px] font-semibold" style={{ color: '#44464e' }}>{challenge.prize}</span>
        {challenge.isTeamBased && (
          <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(10,31,68,0.08)', color: '#0A1F44' }}>Team</span>
        )}
      </div>

      {/* CTA button */}
      {status === 'active' && (
        isSubmitted ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
               style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a' }}>
            <Check size={14} /> Submitted ✓
          </div>
        ) : (
          <motion.button
            whileTap={reduced ? {} : { scale: 0.94 }}
            onClick={e => { e.stopPropagation(); isJoined ? onLeave() : onJoin() }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: isJoined ? '#dcfce7' : '#fd761a',
              color: isJoined ? '#16a34a' : '#ffffff',
              border: isJoined ? '1.5px solid #22c55e' : 'none',
            }}
          >
            {isJoined
              ? <><Check size={14} /> Joined</>
              : <><Plus size={14} /> Join Challenge</>
            }
          </motion.button>
        )
      )}
      {isUpcoming && (
        <button
          onClick={e => e.stopPropagation()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#eceef0', color: '#44464e' }}
        >
          Remind me
        </button>
      )}
      {isEnded && (
        <button
          onClick={e => { e.stopPropagation(); onViewResults?.() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#eceef0', color: '#44464e' }}
        >
          <Eye size={14} /> View Results
        </button>
      )}
    </motion.div>
  )
}
