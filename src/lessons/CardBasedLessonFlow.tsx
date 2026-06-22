// Card-based retrieval-first lesson flow — data-driven version.
// Supports HOOK_CARD, CONTENT_CARD, CHECK_CARD, and EXERCISE_CARD types.
// Progress bar has one segment per card; CHECK_CARD wrong → 50% fill, correct/2nd attempt → 100%.
// EXERCISE_CARD always fills fully on Check (no penalty).
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ArrowRight, CheckCircle2, Trophy,
  Sparkles, GitBranch, Calculator as CalcIcon,
} from 'lucide-react'
import type { T } from './theme'
import { O, GREEN, RED, N } from './theme'
import type {
  InteractiveExercise, ScenarioConfig, DragDropConfig, CalculatorConfig,
} from './types'
import { computeResult } from './evalFormula'

// ─── Card data types ───────────────────────────────────────────────────────────
export type HookCard = {
  kind: 'hook'
  question: string
  subtext: string
}

export type ContentCard = {
  kind: 'content'
  insight?: string
  body: string
  boldTerms: string[]
}

export type CheckCard = {
  kind: 'check'
  question: string
  options: string[]
  correctIndex: number
  correctFeedback: string
  wrongFeedback: string
}

export type ExerciseCard = {
  kind: 'exercise'
  exercise: InteractiveExercise
}

export type Card = HookCard | ContentCard | CheckCard | ExerciseCard

// ─── Hardcoded intro-stock-market card stack (named export) ───────────────────
export const INTRO_STOCK_MARKET_CARDS: Card[] = [
  {
    kind: 'hook',
    question: 'If you bought $1,000 of Apple stock in 2004, how much would it be worth today?',
    subtext: 'Think about it before you continue',
  },
  {
    kind: 'content',
    insight: 'Stocks are ownership stakes, not loans.',
    body: 'When a company sells stock, it\'s selling a piece of itself. Buy one share of Toyota and you own a fraction of every factory, patent, and profit Toyota generates. Unlike a bond, there\'s no repayment — your return comes from the company growing.',
    boldTerms: ['equity ownership'],
  },
  {
    kind: 'check',
    question: 'What does buying a share of stock actually give you?',
    options: [
      'A loan to the company that gets repaid with interest',
      'A small ownership stake in the company',
      'A guaranteed annual dividend payment',
    ],
    correctIndex: 1,
    correctFeedback: 'Exactly. Shares represent equity — ownership, not debt.',
    wrongFeedback: 'Stock is equity, not debt. Bondholders lend money; shareholders own a piece of the business.',
  },
  {
    kind: 'content',
    insight: 'Exchanges are just organized marketplaces.',
    body: 'The New York Stock Exchange and Tokyo Stock Exchange are physical and digital venues where buyers and sellers meet. A stock\'s price at any moment is simply the last price two parties agreed on. Nothing more — no formula, no authority setting it.',
    boldTerms: ['price discovery'],
  },
  {
    kind: 'content',
    body: 'Between every buyer and seller sits a bid-ask spread. The bid is the highest price a buyer will pay. The ask is the lowest a seller will accept. The spread is the market maker\'s cut — usually fractions of a yen or cent on liquid stocks.',
    boldTerms: ['bid', 'ask', 'spread'],
  },
  {
    kind: 'check',
    question: 'The \'bid\' price in a stock transaction is:',
    options: [
      'The price the seller is asking for',
      'The price set by the stock exchange',
      'The highest price a buyer is currently willing to pay',
    ],
    correctIndex: 2,
    correctFeedback: 'Right. Bid = buyer\'s maximum. Ask = seller\'s minimum.',
    wrongFeedback: 'The bid is always the buyer\'s side. The ask is the seller\'s. The spread is the gap between them.',
  },
  {
    kind: 'content',
    insight: 'Indices are the market\'s scoreboard.',
    body: 'The Nikkei 225 tracks Japan\'s 225 largest companies. The S&P 500 tracks 500 US companies. When you hear "the market was up today," someone is reading an index. These indices don\'t tell you about every stock — just their weighted slice of the market.',
    boldTerms: ['index'],
  },
  {
    kind: 'check',
    question: 'The Nikkei 225 went up 2% today. What does this tell you?',
    options: [
      'Every stock in Japan rose by 2%',
      'The 225 largest Japanese companies rose on average by roughly 2%',
      'The Japanese government increased interest rates by 2%',
    ],
    correctIndex: 1,
    correctFeedback: 'Correct. An index is an average, not a guarantee about any individual stock.',
    wrongFeedback: 'An index is a weighted average of a specific basket of stocks — not every stock, and not a policy change.',
  },
  {
    kind: 'content',
    body: 'Stock prices move on information — or the expectation of it. Earnings beat expectations? Price jumps. Central bank surprises with a rate hike? Prices fall broadly. A CEO resigns? That stock drops. Markets are a continuous real-time vote on the future value of a business.',
    boldTerms: ['price-sensitive information'],
  },
  {
    kind: 'check',
    question: 'A company announces earnings that are much better than analysts expected. What typically happens to its stock price immediately after?',
    options: [
      'It falls, because expectations were already priced in',
      'It rises, because the positive surprise wasn\'t priced in',
      'Nothing changes until the next trading day',
    ],
    correctIndex: 1,
    correctFeedback: 'Yes — markets react to surprises, not just good news. Better than expected = upward pressure.',
    wrongFeedback: 'When results beat expectations, markets typically react positively because the surprise wasn\'t already "priced in."',
  },
]

// ─── Internal types ────────────────────────────────────────────────────────────
type SegFill = 0 | 0.5 | 1

type CheckState =
  | { phase: 'idle' }
  | { phase: 'selected'; picked: number; attempt: number }
  | { phase: 'checked'; picked: number; correct: boolean; attempt: number }

interface ExerciseResult {
  correct: boolean
  explanation: string
  xpEarned: number
}

// ─── Main component ────────────────────────────────────────────────────────────
export function CardBasedLessonFlow({
  cards = INTRO_STOCK_MARKET_CARDS,
  t, xpReward, onAward, onComplete, onBack,
}: {
  cards?: Card[]
  t: T; xpReward: number; onAward: (xp: number) => void; onComplete: () => void; onBack: () => void
}) {
  const total = cards.length
  const [cardIdx, setCardIdx] = useState(0)
  const [segFills, setSegFills] = useState<SegFill[]>(Array(total).fill(0))
  const [checkState, setCheckState] = useState<CheckState>({ phase: 'idle' })
  const [showComplete, setShowComplete] = useState(false)

  // Exercise state
  const [exCanCheck, setExCanCheck] = useState(false)
  const [exResult, setExResult] = useState<ExerciseResult | null>(null)
  const exCheckFnRef = useRef<(() => ExerciseResult) | null>(null)

  const card = cards[cardIdx]
  const isCheck = card.kind === 'check'
  const isExercise = card.kind === 'exercise'

  function fillSeg(idx: number, fill: SegFill) {
    setSegFills(prev => {
      const next = [...prev] as SegFill[]
      next[idx] = fill
      return next
    })
  }

  function advance() {
    fillSeg(cardIdx, 1)
    if (cardIdx === total - 1) {
      onAward(xpReward)
      setShowComplete(true)
    } else {
      setCardIdx(i => i + 1)
      setCheckState({ phase: 'idle' })
      setExCanCheck(false)
      setExResult(null)
      exCheckFnRef.current = null
    }
  }

  // Hook / Content
  function handleGotIt() {
    advance()
  }

  // Check card
  function handlePick(i: number) {
    if (checkState.phase === 'checked' && checkState.correct) return
    const attempt = checkState.phase === 'selected' ? checkState.attempt : 1
    setCheckState({ phase: 'selected', picked: i, attempt })
  }

  function handleCheck() {
    if (card.kind !== 'check') return
    if (checkState.phase !== 'selected') return
    const picked = checkState.picked
    const correct = picked === card.correctIndex
    const attempt = checkState.attempt
    setCheckState({ phase: 'checked', picked, correct, attempt })
    if (correct) {
      fillSeg(cardIdx, 1)
    } else {
      setSegFills(prev => {
        const next = [...prev] as SegFill[]
        if (next[cardIdx] === 0) next[cardIdx] = 0.5
        return next
      })
    }
  }

  function handleTryAgain() {
    const prevAttempt = checkedState?.attempt ?? 1
    setCheckState({ phase: 'selected', picked: checkedState!.picked, attempt: prevAttempt + 1 })
  }

  function handleContinueAfterWrong() {
    fillSeg(cardIdx, 1)
    if (cardIdx === total - 1) {
      onAward(xpReward)
      setShowComplete(true)
    } else {
      setCardIdx(i => i + 1)
      setCheckState({ phase: 'idle' })
      setExCanCheck(false)
      setExResult(null)
      exCheckFnRef.current = null
    }
  }

  // Exercise card
  const onExReady = useCallback((fn: () => ExerciseResult) => {
    exCheckFnRef.current = fn
    setExCanCheck(true)
  }, [])

  const onExNotReady = useCallback(() => {
    exCheckFnRef.current = null
    setExCanCheck(false)
  }, [])

  function handleExCheck() {
    if (!exCheckFnRef.current) return
    const result = exCheckFnRef.current()
    setExResult(result)
    fillSeg(cardIdx, 1)
  }

  function handleExContinue() {
    advance()
  }

  const checkedState = checkState.phase === 'checked' ? checkState : null
  const isWrong = checkedState && !checkedState.correct
  const isCorrect = checkedState && checkedState.correct

  // CTA
  let ctaLabel: string
  let ctaAction: () => void
  let ctaDisabled = false

  if (card.kind === 'hook' || card.kind === 'content') {
    ctaLabel = 'Got it'
    ctaAction = handleGotIt
  } else if (card.kind === 'exercise') {
    if (exResult !== null) {
      ctaLabel = 'Continue →'
      ctaAction = handleExContinue
    } else {
      ctaLabel = 'Check →'
      ctaAction = handleExCheck
      ctaDisabled = !exCanCheck
    }
  } else {
    // check card
    if (checkState.phase === 'idle') {
      ctaLabel = 'Check →'
      ctaAction = () => {}
      ctaDisabled = true
    } else if (checkState.phase === 'selected') {
      ctaLabel = 'Check →'
      ctaAction = handleCheck
    } else if (isCorrect) {
      ctaLabel = 'Continue →'
      ctaAction = advance
    } else {
      const attempt = checkedState!.attempt
      if (attempt === 1) {
        ctaLabel = 'Try again →'
        ctaAction = handleTryAgain
      } else {
        ctaLabel = 'Continue →'
        ctaAction = handleContinueAfterWrong
      }
    }
  }

  // Complete screen
  if (showComplete) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ background: t.BG }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
          style={{ background: N }}>
          <Trophy size={44} style={{ color: O }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="text-center mb-6">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: t.MT }}>Lesson Complete!</h1>
          <p className="text-[13px]" style={{ color: t.ST }}>
            You earned <span className="font-bold" style={{ color: O }}>+{xpReward} XP</span>
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          onClick={onComplete}
          className="w-full rounded-xl py-4 font-bold text-white text-[15px]"
          style={{ background: O, boxShadow: '0 4px 20px rgba(249,115,22,0.4)' }}>
          Continue
        </motion.button>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: t.BG }}>
      {/* Segmented progress bar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2" style={{ background: t.BG }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: t.CA }}>
            <ChevronLeft size={16} style={{ color: t.MT }} />
          </button>
          <div className="flex-1 flex gap-1">
            {segFills.map((fill, i) => (
              <div key={i} className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: t.CA }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: i === cardIdx && fill === 0.5 ? '#d97706' : O }}
                  animate={{ width: `${fill * 100}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            ))}
          </div>
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color: t.GT }}>
            {cardIdx + 1}/{total}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}>
            {card.kind === 'hook' && <HookCardView card={card} t={t} />}
            {card.kind === 'content' && <ContentCardView card={card} t={t} />}
            {card.kind === 'check' && (
              <CheckCardView card={card} t={t} checkState={checkState} onPick={handlePick} />
            )}
            {card.kind === 'exercise' && (
              <ExerciseCardView
                key={`ex-${cardIdx}`}
                exercise={card.exercise}
                t={t}
                onReady={onExReady}
                onNotReady={onExNotReady}
                result={exResult}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback banner for CHECK_CARD */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            key="correct-banner"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-4 right-4 bottom-[80px] px-4 py-3.5 border-2 rounded-2xl"
            style={{
              background: 'rgba(22,163,74,0.08)',
              borderColor: GREEN,
              boxShadow: '0 4px 20px rgba(22,163,74,0.18)',
            }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} style={{ color: GREEN }} />
              <span className="text-[13px] font-bold" style={{ color: GREEN }}>Correct!</span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>
              {(card as CheckCard).correctFeedback}
            </p>
          </motion.div>
        )}
        {isWrong && (
          <motion.div
            key="wrong-banner"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-4 right-4 bottom-[80px] px-4 py-3.5 border-2 rounded-2xl"
            style={{
              background: 'rgba(220,38,38,0.07)',
              borderColor: RED,
              boxShadow: '0 4px 20px rgba(220,38,38,0.18)',
            }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-bold" style={{ color: RED }}>Not quite.</span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>
              {(card as CheckCard).wrongFeedback}
            </p>
            {checkedState!.attempt >= 2 && (
              <p className="text-[11.5px] mt-1.5 font-semibold" style={{ color: GREEN }}>
                Correct answer: {(card as CheckCard).options[(card as CheckCard).correctIndex]}
              </p>
            )}
          </motion.div>
        )}
        {/* Exercise feedback banner */}
        {isExercise && exResult !== null && (
          <motion.div
            key="ex-banner"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute left-4 right-4 bottom-[80px] px-4 py-3.5 border-2 rounded-2xl"
            style={{
              background: exResult.correct ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.07)',
              borderColor: exResult.correct ? GREEN : RED,
              boxShadow: exResult.correct
                ? '0 4px 20px rgba(22,163,74,0.18)'
                : '0 4px 20px rgba(220,38,38,0.18)',
            }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} style={{ color: exResult.correct ? GREEN : RED }} />
              <span className="text-[13px] font-bold" style={{ color: exResult.correct ? GREEN : RED }}>
                {exResult.correct ? 'Nice work!' : 'Keep going!'}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>
              {exResult.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA bar */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-safe"
        style={{ background: t.BG, borderTop: `1px solid ${t.LINE}` }}>
        <button
          onClick={ctaAction}
          disabled={ctaDisabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-white text-[14px] disabled:opacity-35"
          style={{ background: O }}>
          {ctaLabel} {(card.kind === 'hook' || card.kind === 'content') && <ArrowRight size={17} />}
        </button>
      </div>
    </div>
  )
}

// ─── HOOK_CARD ─────────────────────────────────────────────────────────────────
function HookCardView({ card, t }: { card: HookCard; t: T }) {
  return (
    <div className="flex flex-col min-h-[60vh] justify-center">
      <div className="rounded-3xl px-6 py-8"
        style={{ background: 'rgba(253,118,26,0.06)', border: '1.5px solid rgba(253,118,26,0.15)' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: O }}>
          Think about it
        </p>
        <h2 className="text-[22px] font-extrabold leading-snug mb-6" style={{ color: t.MT, letterSpacing: '-0.02em' }}>
          {card.question}
        </h2>
        <p className="text-[13px] italic" style={{ color: t.GT }}>{card.subtext}</p>
      </div>
    </div>
  )
}

// ─── CONTENT_CARD ──────────────────────────────────────────────────────────────
function ContentCardView({ card, t }: { card: ContentCard; t: T }) {
  const bodyWithBold = boldTermsInText(card.body, card.boldTerms)
  return (
    <div className="flex flex-col gap-4">
      {card.insight && (
        <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
          style={{ background: 'rgba(22,163,74,0.10)', border: '1.5px solid rgba(22,163,74,0.25)' }}>
          <span className="text-[13px]">💡</span>
          <p className="text-[12.5px] font-semibold leading-snug" style={{ color: '#14532d' }}>
            {card.insight}
          </p>
        </div>
      )}
      <p className="text-[14.5px] leading-relaxed" style={{ color: t.MT }}
        dangerouslySetInnerHTML={{ __html: bodyWithBold }} />
    </div>
  )
}

function boldTermsInText(text: string, terms: string[]): string {
  // Parse markdown: **bold**, *italic*, newlines
  let result = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  // Additionally bold any explicitly named terms (used by hand-authored cards)
  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(new RegExp(`(?<!<strong>)(${escaped})(?!</strong>)`, 'gi'), '<strong>$1</strong>')
  }
  return result
}

// ─── CHECK_CARD ────────────────────────────────────────────────────────────────
function CheckCardView({
  card, t, checkState, onPick,
}: {
  card: CheckCard; t: T; checkState: CheckState; onPick: (i: number) => void
}) {
  const checked = checkState.phase === 'checked'
  const correct = checked && checkState.correct
  const pickedIdx = checkState.phase !== 'idle' ? checkState.picked : null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          style={{ background: 'rgba(253,118,26,0.12)', color: O }}>
          Knowledge Check
        </span>
      </div>
      <h2 className="text-[16px] font-bold leading-snug mb-5" style={{ color: t.MT }}>
        {card.question}
      </h2>
      <div className="flex flex-col gap-2.5">
        {card.options.map((opt, i) => {
          const isPicked = i === pickedIdx
          const isCorrectOpt = i === card.correctIndex
          const revealCorrect = checked && !correct && checkState.attempt >= 2 && isCorrectOpt

          let bg = t.W
          let border = t.LINE
          let labelBg = t.CA
          let labelColor = t.GT

          if (isPicked && !checked) {
            bg = 'rgba(253,118,26,0.10)'; border = O; labelBg = O; labelColor = '#fff'
          } else if (isPicked && checked && correct) {
            bg = 'rgba(22,163,74,0.10)'; border = GREEN; labelBg = GREEN; labelColor = '#fff'
          } else if (isPicked && checked && !correct) {
            bg = 'rgba(220,38,38,0.08)'; border = RED; labelBg = RED; labelColor = '#fff'
          } else if (revealCorrect) {
            bg = 'rgba(22,163,74,0.06)'; border = GREEN; labelBg = GREEN; labelColor = '#fff'
          }

          return (
            <button key={i}
              onClick={() => !checked || (!correct && checkState.attempt < 2) ? onPick(i) : undefined}
              className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition-all w-full"
              style={{ background: bg, border: `2px solid ${border}`, boxShadow: t.SH }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                style={{ background: labelBg, color: labelColor }}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-[13px] leading-snug" style={{ color: t.MT }}>{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── EXERCISE_CARD — dispatches to the right game view ────────────────────────
function ExerciseCardView({
  exercise, t, onReady, onNotReady, result,
}: {
  exercise: InteractiveExercise
  t: T
  onReady: (fn: () => ExerciseResult) => void
  onNotReady: () => void
  result: ExerciseResult | null
}) {
  switch (exercise.type) {
    case 'scenario':
      return <ScenarioCardView config={exercise.config} t={t} onReady={onReady} locked={result !== null} />
    case 'drag-drop':
      return <DragDropCardView config={exercise.config} t={t} onReady={onReady} onNotReady={onNotReady} locked={result !== null} />
    case 'calculator':
      return <CalculatorCardView config={exercise.config} t={t} onReady={onReady} locked={result !== null} />
    default:
      return null
  }
}

// ── Scenario ──────────────────────────────────────────────────────────────────
function ScenarioCardView({
  config, t, onReady, locked,
}: { config: ScenarioConfig; t: T; onReady: (fn: () => ExerciseResult) => void; locked: boolean }) {
  const [picked, setPicked] = useState<string | null>(null)

  function pick(id: string) {
    if (locked) return
    setPicked(id)
    const opt = config.options.find(o => o.id === id)!
    onReady(() => ({
      correct: opt.isCorrect,
      explanation: opt.feedback + (opt.isCorrect ? '' : ' ' + config.correctExplanation),
      xpEarned: config.xpReward,
    }))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <GitBranch size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>
          Scenario · +{config.xpReward} XP
        </span>
      </div>
      <p className="text-[14px] font-medium leading-relaxed mb-5" style={{ color: t.MT }}>{config.scenario}</p>
      <div className="flex flex-col gap-2.5">
        {config.options.map(opt => {
          const isSelected = opt.id === picked
          return (
            <button key={opt.id} onClick={() => pick(opt.id)}
              disabled={locked}
              className="flex items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition-all"
              style={{
                background: isSelected ? 'rgba(253,118,26,0.10)' : t.W,
                border: `2px solid ${isSelected ? O : t.LINE}`,
                boxShadow: t.SH,
                opacity: locked && !isSelected ? 0.5 : 1,
              }}>
              <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border-2 transition-colors"
                style={{ borderColor: isSelected ? O : t.GT, background: isSelected ? O : 'transparent' }} />
              <span className="text-[13px] leading-snug" style={{ color: t.MT }}>{opt.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Drag-Drop ─────────────────────────────────────────────────────────────────
function DragDropCardView({
  config, t, onReady, onNotReady, locked,
}: {
  config: DragDropConfig; t: T
  onReady: (fn: () => ExerciseResult) => void
  onNotReady: () => void
  locked: boolean
}) {
  const [placement, setPlacement] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const placementRef = useRef<Record<string, string>>({})

  const unplaced = config.items.filter(i => !placement[i.id])

  function updatePlacement(fn: (p: Record<string, string>) => Record<string, string>) {
    setPlacement(prev => {
      const next = fn(prev)
      placementRef.current = next
      return next
    })
  }

  function place(catId: string) {
    if (!picked || locked) return
    const id = picked
    setPicked(null)
    updatePlacement(p => ({ ...p, [id]: catId }))
  }

  function pickUp(itemId: string) {
    if (locked) return
    updatePlacement(p => { const n = { ...p }; delete n[itemId]; return n })
    setPicked(itemId)
  }

  useEffect(() => {
    const p = placementRef.current
    const unplacedNow = config.items.filter(i => !p[i.id])
    if (unplacedNow.length === 0 && !locked) {
      onReady(() => {
        const pl = placementRef.current
        const correct = config.items.filter(i => pl[i.id] === i.correctCategory).length
        return {
          correct: correct === config.items.length,
          explanation: config.correctExplanation,
          xpEarned: config.xpReward,
        }
      })
    } else if (!locked) {
      onNotReady()
    }
  }, [placement]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <Sparkles size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>
          Sort it · +{config.xpReward} XP
        </span>
      </div>
      <p className="text-[13px] font-medium leading-relaxed mb-4" style={{ color: t.MT }}>{config.scenario}</p>

      {/* Unplaced tray */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
        {unplaced.length === 0
          ? <span className="text-[11px] italic" style={{ color: t.GT }}>All items placed — tap Check.</span>
          : unplaced.map(item => (
            <button key={item.id}
              onClick={() => !locked && setPicked(picked === item.id ? null : item.id)}
              className="text-[11.5px] font-medium rounded-xl px-3 py-2 transition-all"
              style={{
                background: picked === item.id ? O : t.CA,
                color: picked === item.id ? '#fff' : t.MT,
                border: `1.5px solid ${picked === item.id ? O : t.LINE}`,
                transform: picked === item.id ? 'scale(1.04)' : 'none',
              }}>
              {item.label}
            </button>
          ))
        }
      </div>
      {picked && !locked && (
        <p className="text-[10.5px] mb-2.5" style={{ color: O }}>Tap a category to place it.</p>
      )}

      {/* Buckets */}
      <div className="flex flex-col gap-2.5">
        {config.categories.map(cat => {
          const inBucket = config.items.filter(i => placement[i.id] === cat.id)
          return (
            <button key={cat.id} onClick={() => place(cat.id)}
              disabled={!picked || locked}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background: t.BG,
                border: `2px dashed ${picked && !locked ? cat.color : t.LINE}`,
                cursor: picked && !locked ? 'pointer' : 'default',
              }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                <span className="text-[12px] font-bold" style={{ color: t.MT }}>{cat.label}</span>
              </div>
              {cat.description && (
                <p className="text-[10px] mb-2" style={{ color: t.GT }}>{cat.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {inBucket.length === 0
                  ? <span className="text-[10.5px] italic" style={{ color: t.GT }}>Empty</span>
                  : inBucket.map(item => (
                    <span key={item.id}
                      onClick={e => { e.stopPropagation(); pickUp(item.id) }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium rounded-lg px-2 py-1"
                      style={{ background: t.W, border: `1px solid ${t.LINE}`, color: t.MT }}>
                      {item.label}
                    </span>
                  ))
                }
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Calculator ────────────────────────────────────────────────────────────────
function CalculatorCardView({
  config, t, onReady, locked,
}: { config: CalculatorConfig; t: T; onReady: (fn: () => ExerciseResult) => void; locked: boolean }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(config.fields.map(f => [f.id, f.defaultValue])),
  )
  const [interacted, setInteracted] = useState(false)
  const valuesRef = useRef(values)

  const result = useMemo(() => computeResult(config.calculationType, config.formula, values), [values, config])
  const showGrowthBar = config.calculationType === 'compound-interest' && isFinite(result)
  const invested = showGrowthBar ? (values.principal || 0) + (values.monthlyContribution || 0) * (values.years || 0) * 12 : 0
  const growth = showGrowthBar ? Math.max(0, result - invested) : 0

  function update(id: string, v: number) {
    if (locked) return
    const next = { ...valuesRef.current, [id]: v }
    valuesRef.current = next
    setValues(next)
    if (!interacted) {
      setInteracted(true)
      onReady(() => {
        const r = computeResult(config.calculationType, config.formula, valuesRef.current)
        return {
          correct: true,
          explanation: `${config.resultLabel}: ${config.resultPrefix || ''}${isFinite(r) ? (Math.abs(r) >= 1000 ? Math.round(r).toLocaleString() : r.toFixed(2)) : '—'}${config.resultSuffix || ''}`,
          xpEarned: config.xpReward,
        }
      })
    }
  }

  function fmt(n: number) {
    if (!isFinite(n)) return '—'
    return (Math.abs(n) >= 1000 ? Math.round(n).toLocaleString() : n.toFixed(2))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <CalcIcon size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>
          Calculator · +{config.xpReward} XP
        </span>
      </div>
      {!interacted && !locked && (
        <p className="text-[12px] mb-3" style={{ color: t.GT }}>Adjust the sliders to explore, then tap Check.</p>
      )}

      <div className="flex flex-col gap-4">
        {config.fields.map(f => (
          <div key={f.id}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-semibold" style={{ color: t.MT }}>{f.label}</label>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: O }}>
                {f.type === 'currency' ? '$' : ''}{values[f.id].toLocaleString()}{f.unit || ''}
              </span>
            </div>
            <input type="range"
              min={f.min} max={f.max}
              step={f.type === 'slider' ? (f.step || 1) : Math.max(1, Math.round((f.max - f.min) / 100))}
              value={values[f.id]}
              disabled={locked}
              onChange={e => update(f.id, Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-60"
              style={{ accentColor: O, background: t.CA }} />
            <div className="flex justify-between mt-1">
              <span className="text-[9px]" style={{ color: t.GT }}>{f.type === 'currency' ? '$' : ''}{f.min.toLocaleString()}</span>
              <span className="text-[9px]" style={{ color: t.GT }}>{f.type === 'currency' ? '$' : ''}{f.max.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl p-4 text-center" style={{ background: N }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#7687b2' }}>
          {config.resultLabel}
        </p>
        <p className="text-2xl font-extrabold tabular-nums" style={{ color: O }}>
          {config.resultPrefix || ''}{fmt(result)}{config.resultSuffix || ''}
        </p>
        {showGrowthBar && (
          <div className="mt-3">
            <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.10)' }}>
              <div style={{ width: `${result > 0 ? (invested / result) * 100 : 0}%`, background: '#7687b2' }} />
              <div style={{ width: `${result > 0 ? (growth / result) * 100 : 0}%`, background: O }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[9px]">
              <span style={{ color: '#7687b2' }}>Contributed ${Math.round(invested).toLocaleString()}</span>
              <span style={{ color: O }}>Growth ${Math.round(growth).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
