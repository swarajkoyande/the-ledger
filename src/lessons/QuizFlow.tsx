// Quiz flow — question-by-question (mcq + calculation), passing-score gate, and a
// results screen with score, pass/fail, XP, and per-question explanations. Empty
// quizzes (scaffold courses with 0 questions) render a graceful "in production" state.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Construction } from 'lucide-react'
import type { Quiz, QuizQuestion } from './types'
import type { T } from './theme'
import { O, N, GREEN, RED } from './theme'

export function QuizFlow({ quiz, t, onPass, onExit }: {
  quiz: Quiz; t: T; onPass: (xp: number) => void; onExit: () => void
}) {
  const questions = quiz.questions.slice(0, quiz.maxQuestions)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState(false)
  const [calcInput, setCalcInput] = useState('')

  // ── Empty scaffold ──
  if (questions.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ background: t.BG }}>
        <button onClick={onExit} className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: t.CA }}>
          <ChevronLeft size={16} style={{ color: t.MT }} />
        </button>
        <Construction size={40} style={{ color: t.GT }} className="mb-3" />
        <h2 className="text-lg font-bold mb-1" style={{ color: t.MT }}>{quiz.title}</h2>
        <p className="text-[13px] leading-relaxed" style={{ color: t.GT }}>This quiz is defined but has no questions yet — content is in production.</p>
        <button onClick={onExit} className="mt-5 rounded-xl px-6 py-2.5 text-[13px] font-bold text-white" style={{ background: O }}>Back</button>
      </div>
    )
  }

  const q: QuizQuestion = questions[idx]
  const isRevealed = revealed[q.id]
  const isLast = idx === questions.length - 1

  function answerMcq(letter: string) {
    if (isRevealed) return
    setAnswers(a => ({ ...a, [q.id]: letter }))
    setRevealed(r => ({ ...r, [q.id]: true }))
  }
  function submitCalc() {
    if (isRevealed || calcInput.trim() === '') return
    setAnswers(a => ({ ...a, [q.id]: calcInput.trim() }))
    setRevealed(r => ({ ...r, [q.id]: true }))
  }
  function next() {
    if (isLast) { finish() } else { setIdx(i => i + 1); setCalcInput('') }
  }
  function isCorrect(question: QuizQuestion): boolean {
    const a = answers[question.id]
    if (a == null) return false
    if (question.type === 'calculation') return Math.abs(Number(a) - Number(question.correctAnswer)) < 0.01
    return a === question.correctAnswer
  }
  function finish() {
    const correct = questions.filter(isCorrect).length
    const pct = Math.round((correct / questions.length) * 100)
    if (pct >= quiz.passingScore) onPass(quiz.xpReward)
    setDone(true)
  }

  const correctCount = questions.filter(isCorrect).length
  const pct = Math.round((correctCount / questions.length) * 100)
  const passed = pct >= quiz.passingScore

  // ── Results ──
  if (done) {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ background: t.BG }}>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-24">
          <div className="rounded-2xl p-6 text-center mb-4" style={{ background: N }}>
            <Trophy size={36} style={{ color: passed ? O : '#7687b2' }} className="mx-auto mb-2" />
            <h2 className="text-2xl font-extrabold text-white mb-1">{pct}%</h2>
            <p className="text-[13px] font-bold mb-1" style={{ color: passed ? GREEN : RED }}>{passed ? 'Passed!' : 'Not passed'}</p>
            <p className="text-[11px]" style={{ color: '#7687b2' }}>
              {correctCount} / {questions.length} correct · needed {quiz.passingScore}%
              {passed && ` · +${quiz.xpReward} XP`}
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {questions.map((question, i) => {
              const ok = isCorrect(question)
              return (
                <div key={question.id} className="rounded-xl p-3" style={{ background: t.W, boxShadow: t.SH }}>
                  <div className="flex items-start gap-2 mb-1.5">
                    {ok ? <CheckCircle2 size={15} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
                        : <XCircle size={15} style={{ color: RED }} className="flex-shrink-0 mt-0.5" />}
                    <p className="text-[12px] font-semibold leading-snug" style={{ color: t.MT }}>{i + 1}. {question.questionText}</p>
                  </div>
                  <p className="text-[11.5px] leading-relaxed pl-6" style={{ color: t.ST }}>{question.explanation}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-safe flex gap-2" style={{ background: t.BG, borderTop: `1px solid ${t.LINE}` }}>
          {!passed && (
            <button onClick={() => { setDone(false); setIdx(0); setAnswers({}); setRevealed({}); setCalcInput('') }}
              className="flex items-center justify-center gap-1.5 rounded-xl py-3 px-4 font-bold text-[13px]" style={{ background: t.CA, color: t.MT }}>
              <RotateCcw size={15} /> Retry
            </button>
          )}
          <button onClick={onExit} className="flex-1 rounded-xl py-3 font-bold text-white text-[14px]" style={{ background: O }}>Done</button>
        </div>
      </div>
    )
  }

  // ── Question ──
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: t.BG }}>
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={onExit} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.CA }}>
            <ChevronLeft size={16} style={{ color: t.MT }} />
          </button>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: t.CA }}>
            <motion.div className="h-full rounded-full" style={{ background: O }} animate={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color: t.GT }}>{idx + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-28">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: t.CA, color: t.GT }}>
            {q.type === 'calculation' ? 'Calculation' : 'Multiple Choice'}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>{quiz.title}</span>
        </div>
        <h2 className="text-base font-bold leading-snug mb-4" style={{ color: t.MT }}>{q.questionText}</h2>

        {q.type === 'mcq' && q.options && (
          <div className="flex flex-col gap-2">
            {q.options.map(opt => {
              const isPicked = answers[q.id] === opt.label
              let bg = t.W, border = t.LINE
              if (isRevealed) {
                if (opt.isCorrect) { bg = 'rgba(22,163,74,0.10)'; border = GREEN }
                else if (isPicked) { bg = 'rgba(220,38,38,0.08)'; border = RED }
              }
              return (
                <button key={opt.label} onClick={() => answerMcq(opt.label)} disabled={isRevealed}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                  style={{ background: bg, border: `1.5px solid ${border}`, opacity: isRevealed && !opt.isCorrect && !isPicked ? 0.5 : 1 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                       style={{ border: `1.5px solid ${isRevealed && opt.isCorrect ? GREEN : isRevealed && isPicked ? RED : t.GT}`, color: isRevealed && opt.isCorrect ? GREEN : isRevealed && isPicked ? RED : t.GT }}>
                    {isRevealed && opt.isCorrect ? <CheckCircle2 size={14} /> : isRevealed && isPicked ? <XCircle size={14} /> : opt.label}
                  </div>
                  <span className="text-[13px] leading-snug" style={{ color: t.MT }}>{opt.value}</span>
                </button>
              )
            })}
          </div>
        )}

        {q.type === 'calculation' && (
          <div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-3 border" style={{ background: t.W, borderColor: isRevealed ? (isCorrect(q) ? GREEN : RED) : t.LINE }}>
              <span className="text-[15px] font-bold" style={{ color: t.GT }}>{q.calculationData?.unit === '$' ? '$' : ''}</span>
              <input type="number" inputMode="decimal" value={calcInput} disabled={isRevealed}
                onChange={e => setCalcInput(e.target.value)} placeholder="Your answer"
                className="flex-1 bg-transparent outline-none text-[15px] font-semibold" style={{ color: t.MT }} />
              {q.calculationData?.unit && q.calculationData.unit !== '$' && <span className="text-[13px]" style={{ color: t.GT }}>{q.calculationData.unit}</span>}
            </div>
            {!isRevealed && (
              <button onClick={submitCalc} disabled={calcInput.trim() === ''}
                className="w-full mt-3 rounded-xl py-3 font-bold text-white text-[13px] disabled:opacity-40" style={{ background: O }}>
                Submit Answer
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {isRevealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl px-3 py-3" style={{ background: isCorrect(q) ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.06)' }}>
              <p className="text-[12px] font-bold mb-1" style={{ color: isCorrect(q) ? GREEN : RED }}>
                {isCorrect(q) ? 'Correct!' : `Correct answer: ${q.correctAnswer}`}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>{q.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isRevealed && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-safe" style={{ background: t.BG, borderTop: `1px solid ${t.LINE}` }}>
          <button onClick={next} className="w-full rounded-xl py-3.5 font-bold text-white text-[14px]" style={{ background: O }}>
            {isLast ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
