import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Challenge } from '../../data/competitionsData'
import type { JoinStateResult } from '../../hooks/useJoinState'
import { ChallengeCard } from './ChallengeCard'
import { EmptyState } from './EmptyState'

export type FilterTab = 'all' | 'active' | 'upcoming' | 'ended'

interface Props {
  challenges: Challenge[]
  filter: FilterTab
  joinState: JoinStateResult
  submittedIds: Set<string>
  onOpenDetail: (challenge: Challenge) => void
  onViewResults: (challenge: Challenge) => void
  onBrowseAll: () => void
}

export function ChallengesGrid({ challenges, filter, joinState, submittedIds, onOpenDetail, onViewResults, onBrowseAll }: Props) {
  const reduced = useReducedMotion() ?? false

  const filtered = challenges.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  const showEmpty =
    joinState.joinedIds.size === 0 &&
    (filter === 'all' || filter === 'active') &&
    filtered.filter(c => c.status === 'active').length > 0

  const stagger = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: reduced ? 0 : i * 0.06,
    },
  })

  return (
    <div>
      {showEmpty && <EmptyState onBrowse={onBrowseAll} />}
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col gap-3">
          {filtered.map((c, i) => (
            <motion.div key={c.id} {...stagger(i)} layout>
              <ChallengeCard
                challenge={c}
                isJoined={joinState.isJoined(c.id)}
                isSubmitted={submittedIds.has(c.id)}
                entrantCount={joinState.getEntrantCount(c)}
                onJoin={() => joinState.join(c.id)}
                onLeave={() => joinState.leave(c.id)}
                onClick={() => onOpenDetail(c)}
                onViewResults={() => onViewResults(c)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
