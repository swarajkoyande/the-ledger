import { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Award } from 'lucide-react'
import { useT, DarkCtx, O, N } from './AppDemo'

interface CourseDetailProps {
  course: {
    slug: string; title: string; tag: string; difficulty: string
    hrs: number; lessons: number; quizzes: number; xp: number; mins: number
    cat: string; progress: number; comingSoon: boolean
  }
  onStart: () => void
  onBack: () => void
}

const BULLETS: Record<string, string[]> = {
  'Personal Finance':   ['Build a budget that actually works', 'Understand savings accounts and interest', 'Make smart investment decisions'],
  'Markets':            ['Read stock charts and price movements', 'Understand market indices and benchmarks', 'Analyse company fundamentals'],
  'Corporate Finance':  ['Read income statements, balance sheets, cash flow', 'Build financial models from scratch', 'Value companies using DCF and comparables'],
  'Investment Banking': ['Understand the M&A deal process end-to-end', 'Build LBO and merger models', 'Navigate pitch books and client mandates'],
  'Private Equity':     ['Source and evaluate buyout targets', 'Structure leveraged buyouts', 'Understand fund economics and carried interest'],
  'M&A':                ['Analyse strategic rationale for deals', 'Run accretion/dilution analysis', 'Navigate regulatory and due diligence processes'],
}
const DEFAULT_BULLETS = ['Build real-world financial skills', 'Learn from industry examples', 'Test your knowledge with quizzes']

const DIFF_COLOR: Record<string, string> = {
  Beginner:     '#16a34a',
  Intermediate: '#d97706',
  Advanced:     '#dc2626',
}

const TOTAL = 5000 // ms
const RADIUS = 28
const CIRC = 2 * Math.PI * RADIUS

// ─── Countdown Widget ─────────────────────────────────────────────────────────

function Countdown({ onDone, color }: { onDone: () => void; color: string }) {
  const [remaining, setRemaining] = useState(TOTAL) // ms remaining
  const startRef = useRef<number | null>(null)
  const rafRef   = useRef<number | null>(null)
  const doneRef  = useRef(false)

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const left = Math.max(0, TOTAL - elapsed)
      setRemaining(left)
      if (left > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        onDone()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [onDone])

  const fraction = remaining / TOTAL           // 1 → 0
  const strokeDash = fraction * CIRC           // shrinks as time passes
  const secs = remaining / 1000               // fractional seconds left

  // Display: integer until ≤ 2s, then 2dp
  const displayKey = remaining > 2000 ? Math.ceil(secs) : null
  const displayText = remaining > 2000
    ? String(Math.ceil(secs))
    : secs.toFixed(2)

  // Pulse only on whole-second transitions above 2s
  const intSec = Math.ceil(secs)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 4 }}>
      {/* Number */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="popLayout">
          {remaining > 2000 ? (
            // Whole-number: swap with pop animation
            <motion.span
              key={intSec}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{ fontSize: 32, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
            >
              {Math.ceil(secs)}
            </motion.span>
          ) : (
            // Decimal: single persistent element, no key swap
            <motion.span
              key="decimal"
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 26, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, fontFeatureSettings: '"tnum"' }}
            >
              {displayText}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Circular progress */}
      <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={36} cy={36} r={RADIUS}
          fill="none"
          stroke={color + '22'}
          strokeWidth={4}
        />
        {/* Progress arc */}
        <circle
          cx={36} cy={36} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={CIRC - strokeDash}
          style={{ transition: 'stroke-dashoffset 0.016s linear' }}
        />
      </svg>
    </div>
  )
}

// ─── Course Detail Screen ─────────────────────────────────────────────────────

export function CourseDetailScreen({ course, onStart, onBack }: CourseDetailProps) {
  const t = useT()
  const dark = useContext(DarkCtx)
  const bullets = BULLETS[course.cat] ?? DEFAULT_BULLETS
  const diffColor = DIFF_COLOR[course.difficulty] ?? '#888'
  const pct = Math.round(course.progress * 100)

  const btnLabel = course.comingSoon ? 'Coming Soon' : pct > 0 ? 'Continue Course' : 'Start Course'
  const btnBg    = course.comingSoon ? (dark ? '#464b5d' : '#9ca3af') : pct > 0 ? O : N
  const btnDisabled = course.comingSoon

  const card: React.CSSProperties = {
    background: t.W,
    borderRadius: 20,
    padding: '18px 20px',
    boxShadow: t.SH,
  }

  return (
    <div className="flex flex-col h-full" style={{ background: t.BG }}>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: t.CA }}
          >
            <ArrowLeft size={15} style={{ color: t.ST }} />
          </button>
          <span style={{
            background: dark ? 'rgba(180,198,244,0.15)' : '#dbeafe',
            color: dark ? '#b4c6f4' : N,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            padding: '3px 10px', borderRadius: 20,
          }}>
            {course.tag}
          </span>
        </div>

        <div className="flex flex-col gap-3 px-5 pb-6">
          {/* Hero card */}
          <div style={card}>
            <h1 style={{ color: t.MT, fontSize: 22, fontWeight: 800, lineHeight: 1.25, margin: '0 0 14px' }}>
              {course.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: diffColor + '22', color: diffColor,
                fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
              }}>
                {course.difficulty}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.GT, fontSize: 13 }}>
                <Clock size={13} /> {course.hrs}h
              </span>
              <span style={{
                marginLeft: 'auto',
                background: dark ? 'rgba(253,118,26,0.15)' : '#fff7ed',
                color: O, fontSize: 13, fontWeight: 700,
                padding: '4px 12px', borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Award size={14} /> {course.xp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* What you'll learn card */}
          <div style={card}>
            <h2 style={{ color: t.GT, fontSize: 11, fontWeight: 700, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              What you'll learn
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map((b, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={15} style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: t.ST, fontSize: 14, lineHeight: 1.5 }}>{b}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div style={card}>
            <h2 style={{ color: t.GT, fontSize: 11, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Course overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: <BookOpen size={15} />, label: 'Lessons', value: course.lessons },
                { icon: <CheckCircle2 size={15} />, label: 'Quizzes', value: course.quizzes },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: t.BG, borderRadius: 12, padding: '12px 14px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <span style={{ color: t.GT, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    {icon} {label}
                  </span>
                  <span style={{ color: t.MT, fontSize: 20, fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress card (only if started) */}
          {pct > 0 && (
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: t.ST, fontSize: 13 }}>Your progress</span>
                <span style={{ color: O, fontSize: 13, fontWeight: 700 }}>{pct}% complete</span>
              </div>
              <div style={{ background: t.BG, borderRadius: 99, height: 6, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ height: '100%', background: O, borderRadius: 99 }}
                />
              </div>
            </div>
          )}

          {/* CTA button */}
          {!btnDisabled && (
            <button
              onClick={onStart}
              style={{
                width: '100%', padding: '16px 0',
                background: btnBg, color: '#fff',
                border: 'none', borderRadius: 16,
                fontSize: 16, fontWeight: 700,
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              {btnLabel}
            </button>
          )}

          {btnDisabled && (
            <button disabled style={{
              width: '100%', padding: '16px 0',
              background: btnBg, color: '#fff',
              border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 700,
              cursor: 'not-allowed', opacity: 0.7, marginTop: 4,
            }}>
              {btnLabel}
            </button>
          )}

          {/* Countdown (only for non-coming-soon courses) */}
          {!btnDisabled && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, paddingBottom: 8 }}>
              <p style={{ color: t.GT, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 2 }}>
                AUTO-STARTING IN
              </p>
              <Countdown onDone={onStart} color={pct > 0 ? O : N} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
