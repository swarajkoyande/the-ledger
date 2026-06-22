import { motion, useReducedMotion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface Props {
  onBrowse: () => void
}

export function EmptyState({ onBrowse }: Props) {
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
           style={{ background: '#0A1F44' }}>
        <Trophy size={36} style={{ color: '#fd761a' }} />
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: '#191c1e' }}>No challenges yet</h3>
      <p className="text-sm mb-5" style={{ color: '#75777f' }}>
        Join a competition to start earning XP and climbing the rankings
      </p>
      <motion.button
        whileTap={reduced ? {} : { scale: 0.94 }}
        onClick={onBrowse}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: '#fd761a' }}
      >
        Browse active challenges
      </motion.button>
    </motion.div>
  )
}
