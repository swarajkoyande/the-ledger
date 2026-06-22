import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send, Check, Paperclip, Trophy } from 'lucide-react'

import { useCompetitions } from '../../hooks/useCompetitions'
import { useJoinState } from '../../hooks/useJoinState'
import type { Challenge, UpcomingEvent } from '../../data/competitionsData'

import { CompetitionsHero } from '../compete/CompetitionsHero'
import { ChallengeCard } from '../compete/ChallengeCard'
import { ChallengeDetailModal } from '../compete/ChallengeDetailModal'
import { PastResultsModal } from '../compete/PastResultsModal'
import { FullLeaderboard } from '../compete/FullLeaderboard'
import { YourStatsSidebar } from '../compete/YourStatsSidebar'
import { UpcomingEventsSidebar } from '../compete/UpcomingEventsSidebar'
import { SkeletonLoader } from '../compete/SkeletonLoader'

// ─── Local design tokens (self-contained mirror of AppDemoDesktop) ──────────────
const N  = '#0A1F44'
const O  = '#fd761a'
const W  = '#ffffff'
const MT = '#191c1e'
const GT = '#75777f'
const SH = '0 4px 16px rgba(0,0,0,0.06)'

// Desktop filter scope: All / Active / Ended (parity simplification of mobile's
// All/Active/Upcoming/Ended — desktop surfaces upcoming via the sidebar strip).
type DeskFilter = 'all' | 'active' | 'ended'
const FILTER_TABS: { key: DeskFilter; label: string }[] = [
  { key: 'all',    label: 'All'    },
  { key: 'active', label: 'Active' },
  { key: 'ended',  label: 'Ended'  },
]

export default function DesktopChallenges() {
  const reduced = useReducedMotion() ?? false
  const { challenges, leaderboard, upcomingEvents, userStats, isLoading } = useCompetitions()
  const joinState = useJoinState(challenges)

  const [filter, setFilter] = useState<DeskFilter>('all')
  const [detailChallenge, setDetailChallenge] = useState<Challenge | null>(null)
  const [pastResultsOpen, setPastResultsOpen] = useState(false)
  const [pastResultsFocus, setPastResultsFocus] = useState<Challenge | null>(null)
  const [rankingsExpanded, setRankingsExpanded] = useState(false)
  const rankingsRef = useRef<HTMLDivElement>(null)

  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set())
  const [submitChallenge, setSubmitChallenge] = useState<Challenge | null>(null)
  const [submitInput, setSubmitInput] = useState('')
  const [showSubmitToast, setShowSubmitToast] = useState(false)

  const endedChallenges = challenges.filter(c => c.status === 'ended')
  const joinedChallenges = challenges.filter(c => joinState.isJoined(c.id))

  const scrollToRankings = () =>
    rankingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const openDetail = (c: Challenge) => setDetailChallenge(c)
  const openResults = (c: Challenge) => { setPastResultsFocus(c); setPastResultsOpen(true) }

  const handleUpcomingEventClick = (ev: UpcomingEvent) => {
    const match = challenges.find(c => c.title === ev.title || c.id === ev.id)
    if (match) openDetail(match)
  }

  const handleOpenSubmit = (c: Challenge) => {
    setSubmitChallenge(c)
    setSubmitInput('')
  }

  const handleConfirmSubmit = () => {
    if (!submitChallenge || submitInput.trim().length < 50) return
    setSubmittedIds(prev => new Set([...prev, submitChallenge.id]))
    setSubmitChallenge(null)
    setSubmitInput('')
    setDetailChallenge(null)
    setShowSubmitToast(true)
    setTimeout(() => setShowSubmitToast(false), 2500)
  }

  const fade = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: reduced ? 0 : i * 0.05,
    },
  })

  return (
    <div className="relative w-full">
      {/* Header */}
      <motion.div {...fade(0)} className="mb-6">
        <h1 className="text-3xl font-black" style={{ color: MT, letterSpacing: '-0.02em' }}>
          Challenges
        </h1>
        <p className="text-sm mt-1" style={{ color: GT }}>
          Compete in trading simulations, case competitions, and quizzes. Climb the global leaderboard.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div {...fade(1)} className="mb-6">
        <CompetitionsHero
          userStats={userStats}
          leaderboard={leaderboard}
          onPastResults={() => { setPastResultsFocus(null); setPastResultsOpen(true) }}
          onScrollToRankings={scrollToRankings}
        />
      </motion.div>

      {/* Two-column desktop grid: main content + right rail */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        {/* ── Main column ──────────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Your Challenges row */}
          {!isLoading && joinedChallenges.length > 0 && (
            <motion.div {...fade(2)} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold" style={{ color: MT }}>Your Challenges</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
                  {joinedChallenges.length} joined
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {joinedChallenges.map((c, i) => (
                  <motion.div key={c.id} {...fade(i + 2)} layout>
                    <ChallengeCard
                      challenge={c}
                      isJoined
                      isSubmitted={submittedIds.has(c.id)}
                      entrantCount={joinState.getEntrantCount(c)}
                      onJoin={() => joinState.join(c.id)}
                      onLeave={() => joinState.leave(c.id)}
                      onClick={() => openDetail(c)}
                      onViewResults={() => openResults(c)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Challenges header + filter tabs */}
          <motion.div {...fade(3)} className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold" style={{ color: MT }}>All Challenges</h2>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#eceef0' }}>
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{ color: filter === tab.key ? MT : GT }}
                >
                  {filter === tab.key && (
                    <motion.div
                      layoutId="desktop-compete-filter-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: W, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
                      transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Wide multi-column challenges grid */}
          <motion.div {...fade(4)} className="mb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonLoader count={2} />
                <SkeletonLoader count={2} />
              </div>
            ) : (
              <DesktopChallengesGrid
                filter={filter}
                challenges={challenges}
                joinState={joinState}
                submittedIds={submittedIds}
                onOpenDetail={openDetail}
                onViewResults={openResults}
                onBrowseAll={() => setFilter('all')}
              />
            )}
          </motion.div>

          {/* Full leaderboard */}
          {!isLoading && leaderboard.length > 0 && (
            <motion.div {...fade(5)} className="pb-2">
              <FullLeaderboard
                ref={rankingsRef}
                leaderboard={leaderboard}
                isExpanded={rankingsExpanded}
                onExpand={() => setRankingsExpanded(true)}
                onCollapse={() => setRankingsExpanded(false)}
              />
            </motion.div>
          )}
        </div>

        {/* ── Right rail ───────────────────────────────────────────────── */}
        <motion.aside {...fade(3)} className="hidden xl:flex flex-col gap-4 sticky top-4">
          {!isLoading && <YourStatsSidebar userStats={userStats} />}
          {!isLoading && upcomingEvents.length > 0 && (
            <UpcomingEventsSidebar events={upcomingEvents} onEventClick={handleUpcomingEventClick} />
          )}
          {/* Quick "Past results" entry */}
          {!isLoading && endedChallenges.length > 0 && (
            <button
              onClick={() => { setPastResultsFocus(null); setPastResultsOpen(true) }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-left w-full"
              style={{ background: W, boxShadow: SH }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: N, color: O }}>
                <Trophy size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: MT }}>Past results</p>
                <p className="text-[11px]" style={{ color: GT }}>
                  {endedChallenges.length} completed challenge{endedChallenges.length !== 1 ? 's' : ''}
                </p>
              </div>
            </button>
          )}
        </motion.aside>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <ChallengeDetailModal
        challenge={detailChallenge}
        isJoined={detailChallenge ? joinState.isJoined(detailChallenge.id) : false}
        isSubmitted={detailChallenge ? submittedIds.has(detailChallenge.id) : false}
        entrantCount={detailChallenge ? joinState.getEntrantCount(detailChallenge) : 0}
        onJoin={() => detailChallenge && joinState.join(detailChallenge.id)}
        onLeave={() => detailChallenge && joinState.leave(detailChallenge.id)}
        onClose={() => setDetailChallenge(null)}
        onSubmitEntry={() => detailChallenge && handleOpenSubmit(detailChallenge)}
      />

      <PastResultsModal
        isOpen={pastResultsOpen}
        endedChallenges={endedChallenges}
        focusedChallenge={pastResultsFocus}
        onClose={() => { setPastResultsOpen(false); setPastResultsFocus(null) }}
      />

      {/* ── Submit Entry sheet (centered modal on desktop) ─────────────── */}
      <AnimatePresence>
        {submitChallenge && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60]"
              style={{ background: 'rgba(0,0,0,0.50)' }}
              onClick={() => setSubmitChallenge(null)}
              aria-hidden="true"
            />
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Submit Your Entry"
              className="fixed left-1/2 top-1/2 z-[61] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-3xl overflow-hidden"
              style={{ background: '#f7f9fb', boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}
            >
              <div className="px-6 pt-5 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #eceef0' }}>
                <p className="text-lg font-bold" style={{ color: MT }}>Submit Your Entry</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: GT }}>{submitChallenge.title}</p>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: '#44464e' }}>Your submission</p>
                  <textarea
                    value={submitInput}
                    onChange={e => setSubmitInput(e.target.value)}
                    placeholder="Describe your analysis, thesis, or answer…"
                    rows={7}
                    autoFocus
                    className="w-full text-sm rounded-2xl px-4 py-3"
                    style={{ background: W, color: MT, border: 'none', outline: 'none', resize: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                  />
                  <p className="text-[11px] mt-1 text-right"
                     style={{ color: submitInput.trim().length >= 50 ? '#16a34a' : GT }}>
                    {submitInput.trim().length}/50 min chars
                  </p>
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: '#eceef0', color: '#44464e' }}
                  onClick={e => e.stopPropagation()}
                >
                  <Paperclip size={14} /> Attach file
                </button>
              </div>

              <div className="px-6 pt-3 pb-5 flex-shrink-0 flex gap-3" style={{ borderTop: '1px solid #eceef0' }}>
                <button
                  onClick={() => setSubmitChallenge(null)}
                  className="px-5 py-3 rounded-2xl text-sm font-bold"
                  style={{ background: '#eceef0', color: '#44464e' }}
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={submitInput.trim().length >= 50 ? { scale: 0.96 } : {}}
                  onClick={handleConfirmSubmit}
                  disabled={submitInput.trim().length < 50}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                  style={{
                    background: submitInput.trim().length >= 50 ? N : '#eceef0',
                    color: submitInput.trim().length >= 50 ? W : GT,
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  <Send size={15} /> Submit
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Success toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSubmitToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: '#16a34a', color: W, boxShadow: '0 4px 20px rgba(22,163,74,0.35)' }}
          >
            <Check size={16} />
            <span className="text-sm font-semibold">Entry submitted! Results posted after the deadline.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Desktop wide grid (multi-column wrapper around ChallengeCard) ───────────────
// Mirrors ChallengesGrid's filter/empty logic but lays cards out in a 2-up grid.
function DesktopChallengesGrid({
  filter, challenges, joinState, submittedIds, onOpenDetail, onViewResults, onBrowseAll,
}: {
  filter: DeskFilter
  challenges: Challenge[]
  joinState: ReturnType<typeof useJoinState>
  submittedIds: Set<string>
  onOpenDetail: (c: Challenge) => void
  onViewResults: (c: Challenge) => void
  onBrowseAll: () => void
}) {
  const reduced = useReducedMotion() ?? false

  // Reuse the shared ChallengesGrid for stacked layouts on narrow viewports,
  // but render a true multi-column grid here for desktop width.
  const filtered = challenges.filter(c => (filter === 'all' ? true : c.status === filter))

  if (filtered.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ background: W, boxShadow: SH }}>
        <p className="text-sm font-semibold mb-1" style={{ color: MT }}>No challenges here yet</p>
        <p className="text-xs mb-4" style={{ color: GT }}>Try another filter to see more.</p>
        <button
          onClick={onBrowseAll}
          className="text-xs font-semibold px-4 py-2 rounded-xl"
          style={{ background: O, color: W }}
        >
          Browse all
        </button>
      </div>
    )
  }

  const stagger = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: reduced ? 0 : i * 0.05,
    },
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
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
      </AnimatePresence>
    </div>
  )
}
