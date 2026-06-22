import { motion, useReducedMotion } from 'framer-motion'
import { Trophy, Briefcase, Brain, TrendingUp, Mic } from 'lucide-react'
import type { UpcomingEvent, ChallengeType } from '../../data/competitionsData'

interface Props {
  events: UpcomingEvent[]
  onEventClick: (event: UpcomingEvent) => void
}

const TYPE_ICON: Record<ChallengeType, React.ReactNode> = {
  'trading':          <Trophy size={13} />,
  'case-competition': <Briefcase size={13} />,
  'quiz-challenge':   <Brain size={13} />,
  'ma-simulation':    <TrendingUp size={13} />,
  'pitch':            <Mic size={13} />,
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function UpcomingEventsSidebar({ events, onEventClick }: Props) {
  const reduced = useReducedMotion() ?? false

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(10,22,40,0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#b4c6f4' }}>Upcoming</p>
      <div className="flex flex-col gap-2">
        {events.map((ev, i) => (
          <motion.button
            key={ev.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            onClick={() => onEventClick(ev)}
            className="flex items-center gap-3 p-3 rounded-xl text-left"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(253,118,26,0.18)', color: '#fd761a' }}>
              {TYPE_ICON[ev.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{ev.title}</p>
              <p className="text-[10px]" style={{ color: '#7687b2' }}>{formatDate(ev.date)}</p>
            </div>
            {ev.spotsLeft !== undefined && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(253,118,26,0.2)', color: '#fd761a' }}>
                {ev.spotsLeft} left
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
