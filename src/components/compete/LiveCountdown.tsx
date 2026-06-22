import { useReducedMotion } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountdown } from '../../hooks/useCountdown'

interface Props {
  endsAt: Date
}

interface DigitProps {
  value: number
  label: string
  urgent: boolean
  reduced: boolean
}

function Digit({ value, label, urgent, reduced }: DigitProps) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden h-5 w-7 flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={str}
            initial={reduced ? { opacity: 0 } : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute text-xs font-bold tabular-nums"
            style={{ color: urgent ? '#fd761a' : '#b4c6f4' }}
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[8px] uppercase tracking-widest" style={{ color: '#4c5e86' }}>{label}</span>
    </div>
  )
}

export function LiveCountdown({ endsAt }: Props) {
  const reduced = useReducedMotion() ?? false
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt)

  if (isExpired) {
    return <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4c5e86' }}>Ended</span>
  }

  const urgent = days === 0 && hours < 24

  return (
    <div className="flex items-end gap-2">
      {days > 0 && <Digit value={days}    label="d"  urgent={urgent} reduced={reduced} />}
      <Digit value={hours}   label="h"  urgent={urgent} reduced={reduced} />
      <Digit value={minutes} label="m"  urgent={urgent} reduced={reduced} />
      <Digit value={seconds} label="s"  urgent={urgent} reduced={reduced} />
    </div>
  )
}
