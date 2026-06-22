import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle, Star, Zap } from 'lucide-react'
import { useT, O, N } from './AppDemo'
import type {
  DailyQuestion, DailyMCQ, DailySortBuckets, DailyMatchPairs, DailyQuizState,
} from '../data/dailyQuiz'
import { saveDailyQuizState } from '../data/dailyQuiz'

// ─── MCQ Question ─────────────────────────────────────────────────────────────

function MCQCard({
  q, onAnswer,
}: { q: DailyMCQ; onAnswer: (correct: boolean) => void }) {
  const { W, MT, ST, GT, CA, BR, SH } = useT()
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  function pick(i: number) {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    setTimeout(() => onAnswer(i === q.correctIndex), 900)
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-2">
      <div className="rounded-2xl p-5" style={{ background: W, boxShadow: SH }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: O }}>{q.topic}</p>
        <p className="text-[15px] font-bold leading-snug" style={{ color: MT }}>{q.question}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect  = i === q.correctIndex
          let bg  = CA
          let border = 'transparent'
          let textColor = ST
          if (revealed && isCorrect) { bg = 'rgba(22,163,74,0.14)'; border = '#16a34a'; textColor = '#16a34a' }
          if (revealed && isSelected && !isCorrect) { bg = 'rgba(220,38,38,0.12)'; border = '#dc2626'; textColor = '#dc2626' }

          return (
            <motion.button key={i}
              whileTap={{ scale: 0.97 }}
              onClick={() => pick(i)}
              className="w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3"
              style={{ background: bg, border: `1.5px solid ${border}`, transition: 'background 0.2s, border 0.2s' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: revealed && isCorrect ? '#16a34a' : revealed && isSelected ? '#dc2626' : BR, color: revealed ? '#fff' : GT }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[13px] font-medium leading-snug" style={{ color: textColor }}>{opt}</span>
              {revealed && isCorrect && <CheckCircle2 size={16} className="ml-auto flex-shrink-0" style={{ color: '#16a34a' }} />}
              {revealed && isSelected && !isCorrect && <XCircle size={16} className="ml-auto flex-shrink-0" style={{ color: '#dc2626' }} />}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <p className="text-[12px] leading-relaxed" style={{ color: '#16a34a' }}>{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Sort Buckets Game ────────────────────────────────────────────────────────

function SortBucketsCard({
  q, onAnswer,
}: { q: DailySortBuckets; onAnswer: (correct: boolean) => void }) {
  const { W, MT, ST, GT, CA, BR, SH } = useT()
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const unassigned = q.items.filter(it => !assignments[it.id])
  const allAssigned = unassigned.length === 0

  function selectItem(id: string) {
    if (submitted) return
    setSelectedItem(prev => prev === id ? null : id)
  }

  function assignToBucket(bucketId: string) {
    if (!selectedItem || submitted) return
    setAssignments(prev => ({ ...prev, [selectedItem]: bucketId }))
    setSelectedItem(null)
  }

  function submit() {
    let correct = 0
    q.items.forEach(it => { if (assignments[it.id] === it.correctBucket) correct++ })
    setScore(correct)
    setSubmitted(true)
    const pct = correct / q.items.length
    setTimeout(() => onAnswer(pct >= 0.7), 1200)
  }

  const bucketColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7']

  return (
    <div className="flex flex-col gap-4 px-5 py-2">
      <div className="rounded-2xl p-5" style={{ background: W, boxShadow: SH }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: O }}>{q.topic} · Sort It</p>
        <p className="text-[14px] font-bold leading-snug" style={{ color: MT }}>{q.prompt}</p>
        <p className="text-[11px] mt-2" style={{ color: GT }}>Tap an item, then tap its bucket.</p>
      </div>

      {/* Unassigned items */}
      {unassigned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unassigned.map(it => (
            <motion.button key={it.id} whileTap={{ scale: 0.95 }} onClick={() => selectItem(it.id)}
              className="px-3 py-2 rounded-xl text-[12px] font-semibold"
              style={{
                background: selectedItem === it.id ? N : CA,
                color: selectedItem === it.id ? '#fff' : ST,
                border: selectedItem === it.id ? `2px solid ${N}` : `2px solid transparent`,
                transition: 'all 0.15s',
              }}>
              {it.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Buckets */}
      <div className="flex flex-col gap-2.5">
        {q.buckets.map((bucket, bi) => {
          const assignedItems = q.items.filter(it => assignments[it.id] === bucket.id)
          const bColor = bucketColors[bi % bucketColors.length]
          return (
            <motion.button key={bucket.id} whileTap={{ scale: 0.985 }}
              onClick={() => assignToBucket(bucket.id)}
              className="w-full rounded-2xl p-3 text-left"
              style={{
                background: `${bColor}14`,
                border: selectedItem ? `2px solid ${bColor}` : `2px solid ${bColor}40`,
                transition: 'border 0.15s',
              }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: bColor }}>
                {bucket.emoji} {bucket.label}
              </p>
              <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                {assignedItems.map(it => {
                  const correct = it.correctBucket === bucket.id
                  return (
                    <motion.span key={it.id} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      style={{
                        background: submitted ? (correct ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.12)') : `${bColor}22`,
                        color: submitted ? (correct ? '#16a34a' : '#dc2626') : bColor,
                      }}>
                      {it.label} {submitted && (correct ? '✓' : '✗')}
                    </motion.span>
                  )
                })}
              </div>
            </motion.button>
          )
        })}
      </div>

      {allAssigned && !submitted && (
        <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          onClick={submit}
          className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white"
          style={{ background: N }}>
          Check Answers
        </motion.button>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <p className="text-[12px] font-bold mb-1" style={{ color: '#16a34a' }}>{score}/{q.items.length} correct</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#16a34a' }}>{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Match Pairs Game ─────────────────────────────────────────────────────────

function MatchPairsCard({
  q, onAnswer,
}: { q: DailyMatchPairs; onAnswer: (correct: boolean) => void }) {
  const { W, MT, ST, GT, CA, SH } = useT()

  // Shuffle right column once on mount
  const [rightOrder] = useState(() => {
    const arr = [...q.pairs.map((_, i) => i)]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  const [leftSel,  setLeftSel]  = useState<number | null>(null)
  const [rightSel, setRightSel] = useState<number | null>(null)
  const [matches,  setMatches]  = useState<Record<number, number>>({}) // leftIdx → rightIdx
  const [wrongs,   setWrongs]   = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const matchedLefts  = new Set(Object.keys(matches).map(Number))
  const matchedRights = new Set(Object.values(matches))

  // When both sides selected, try to match
  useEffect(() => {
    if (leftSel === null || rightSel === null) return
    const rightOrigIdx = rightOrder[rightSel]
    if (rightOrigIdx === leftSel) {
      // Correct
      setMatches(prev => ({ ...prev, [leftSel]: rightSel }))
      setLeftSel(null); setRightSel(null)
    } else {
      // Wrong flash
      const key = `${leftSel}-${rightSel}`
      setWrongs(prev => new Set(prev).add(key))
      setTimeout(() => {
        setWrongs(prev => { const s = new Set(prev); s.delete(key); return s })
        setLeftSel(null); setRightSel(null)
      }, 600)
    }
  }, [leftSel, rightSel])

  const allMatched = Object.keys(matches).length === q.pairs.length

  useEffect(() => {
    if (allMatched && !submitted) {
      setSubmitted(true)
      setTimeout(() => onAnswer(true), 800)
    }
  }, [allMatched])

  const pairColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#ef4444']

  function leftColor(i: number) {
    if (matchedLefts.has(i)) return pairColors[i % pairColors.length]
    if (leftSel === i) return N
    return 'transparent'
  }
  function rightColor(ri: number) {
    const origIdx = rightOrder[ri]
    if (matchedRights.has(ri)) return pairColors[origIdx % pairColors.length]
    if (rightSel === ri) return N
    return 'transparent'
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-2">
      <div className="rounded-2xl p-5" style={{ background: W, boxShadow: SH }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: O }}>{q.topic} · Match It</p>
        <p className="text-[14px] font-bold leading-snug" style={{ color: MT }}>{q.prompt}</p>
        <p className="text-[11px] mt-2" style={{ color: GT }}>Tap a term, then tap its definition.</p>
      </div>

      <div className="flex gap-2.5">
        {/* Left column — terms */}
        <div className="flex flex-col gap-2 flex-1">
          {q.pairs.map((pair, i) => {
            const isMatched = matchedLefts.has(i)
            const isSel = leftSel === i
            const c = leftColor(i)
            return (
              <motion.button key={i} whileTap={{ scale: 0.96 }}
                onClick={() => !isMatched && setLeftSel(prev => prev === i ? null : i)}
                className="w-full px-3 py-3 rounded-xl text-[11px] font-bold text-left"
                style={{
                  background: isMatched || isSel ? `${c}22` : CA,
                  border: `2px solid ${isMatched || isSel ? c : 'transparent'}`,
                  color: isMatched || isSel ? c : ST,
                  transition: 'all 0.2s',
                  opacity: isMatched ? 0.6 : 1,
                }}>
                {pair.left}
              </motion.button>
            )
          })}
        </div>

        {/* Right column — definitions */}
        <div className="flex flex-col gap-2 flex-1">
          {rightOrder.map((origIdx, ri) => {
            const pair = q.pairs[origIdx]
            const isMatched = matchedRights.has(ri)
            const isSel = rightSel === ri
            const isWrong = [...wrongs].some(w => w.endsWith(`-${ri}`))
            const c = rightColor(ri)
            return (
              <motion.button key={ri}
                whileTap={{ scale: 0.96 }}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.35 }}
                onClick={() => !isMatched && setRightSel(prev => prev === ri ? null : ri)}
                className="w-full px-3 py-3 rounded-xl text-[10px] font-medium text-left"
                style={{
                  background: isMatched ? `${c}22` : isSel ? `${N}22` : isWrong ? 'rgba(220,38,38,0.1)' : CA,
                  border: `2px solid ${isMatched ? c : isSel ? N : isWrong ? '#dc2626' : 'transparent'}`,
                  color: isMatched ? c : isSel ? N : isWrong ? '#dc2626' : ST,
                  transition: 'all 0.2s',
                  opacity: isMatched ? 0.6 : 1,
                  lineHeight: 1.4,
                }}>
                {pair.right}
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl px-4 py-3" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <p className="text-[12px] font-bold mb-1" style={{ color: '#16a34a' }}>All matched! 🎯</p>
            <p className="text-[12px] leading-relaxed" style={{ color: '#16a34a' }}>{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  answers, total, xpEarned, onDone,
}: { answers: Record<string, boolean>; total: number; xpEarned: number; onDone: () => void }) {
  const { BG, W, MT, GT, CA, SH } = useT()
  const correct = Object.values(answers).filter(Boolean).length
  const pct = Math.round((correct / total) * 100)

  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎯' : pct >= 60 ? '👍' : '📚'
  const msg   = pct === 100 ? 'Perfect score! Flawless.' : pct >= 80 ? 'Strong work!' : pct >= 60 ? 'Good effort.' : 'Keep studying!'

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 gap-6">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-6xl">
        {emoji}
      </motion.div>

      <div className="text-center">
        <p className="text-[28px] font-bold" style={{ color: MT }}>{correct}/{total}</p>
        <p className="text-[13px] mt-1" style={{ color: GT }}>{msg}</p>
      </div>

      {/* XP badge */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl"
        style={{ background: 'rgba(253,118,26,0.12)', border: '1.5px solid rgba(253,118,26,0.3)' }}>
        <Star size={18} style={{ color: O }} />
        <span className="text-[16px] font-bold" style={{ color: O }}>+{xpEarned} XP earned</span>
      </motion.div>

      {/* Breakdown */}
      <div className="w-full rounded-2xl p-4" style={{ background: W, boxShadow: SH }}>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: GT }}>Your answers</p>
        <div className="flex flex-col gap-2">
          {Object.entries(answers).map(([id, correct], i) => (
            <div key={id} className="flex items-center gap-3">
              {correct
                ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                : <XCircle size={14} style={{ color: '#dc2626' }} />}
              <span className="text-[12px]" style={{ color: correct ? '#16a34a' : '#dc2626' }}>
                Question {i + 1} — {correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={onDone}
        className="w-full py-4 rounded-2xl text-[15px] font-bold text-white"
        style={{ background: N }}>
        Done
      </motion.button>
    </div>
  )
}

// ─── Daily Quiz Screen ────────────────────────────────────────────────────────

interface Props {
  quizState: DailyQuizState
  onUpdate: (s: DailyQuizState) => void
  onBack: () => void
}

export function DailyQuizScreen({ quizState, onUpdate, onBack }: Props) {
  const { BG, W, MT, GT, CA, SH } = useT()
  const [idx, setIdx] = useState(() => Object.keys(quizState.answers).length)
  const [localState, setLocalState] = useState(quizState)

  const questions = localState.questions
  const total     = questions.length
  const done      = localState.completed
  const progress  = idx / total

  function handleAnswer(qId: string, correct: boolean) {
    const newAnswers = { ...localState.answers, [qId]: correct }
    const xpPer = correct ? 30 : 5
    const newXp  = (localState.xpEarned || 0) + xpPer
    const allDone = Object.keys(newAnswers).length >= total

    const next: DailyQuizState = {
      ...localState,
      answers: newAnswers,
      xpEarned: newXp,
      completed: allDone,
    }
    setLocalState(next)
    saveDailyQuizState(next)
    onUpdate(next)

    if (!allDone) {
      setTimeout(() => setIdx(i => i + 1), 400)
    }
  }

  const currentQ = questions[idx]

  const typeLabel: Record<string, string> = {
    'mcq': 'Knowledge Check',
    'sort-buckets': 'Sort It Out',
    'match-pairs': 'Match the Pairs',
  }

  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 flex-shrink-0">
        <button onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: CA }}>
          <ArrowLeft size={15} style={{ color: MT }} />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>
            Daily Quiz · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: CA }}>
              <motion.div
                animate={{ width: `${done ? 100 : progress * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: O }}
              />
            </div>
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color: GT }}>
              {done ? total : idx}/{total}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        {done ? (
          <ResultsScreen
            answers={localState.answers}
            total={total}
            xpEarned={localState.xpEarned}
            onDone={onBack}
          />
        ) : (
          <>
            {/* Question type badge */}
            <div className="px-5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: 'rgba(10,31,68,0.08)', color: N }}>
                  {currentQ ? typeLabel[currentQ.type] : ''}
                </span>
                <span className="text-[10px]" style={{ color: GT }}>
                  {idx + 1} of {total}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentQ && (
                <motion.div key={currentQ.id}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}>
                  {currentQ.type === 'mcq' && (
                    <MCQCard q={currentQ} onAnswer={c => handleAnswer(currentQ.id, c)} />
                  )}
                  {currentQ.type === 'sort-buckets' && (
                    <SortBucketsCard q={currentQ} onAnswer={c => handleAnswer(currentQ.id, c)} />
                  )}
                  {currentQ.type === 'match-pairs' && (
                    <MatchPairsCard q={currentQ} onAnswer={c => handleAnswer(currentQ.id, c)} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
