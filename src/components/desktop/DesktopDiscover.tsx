import { useState, useMemo, useContext } from 'react'
import { motion } from 'framer-motion'
import {
  Search, X, Star, Clock, Play, Lock, BookOpen,
  TrendingUp, Sparkles, Flame,
} from 'lucide-react'
import { DarkCtx } from '../../pages/AppDemo'

// ─── Local design tokens (self-contained mirror of AppDemoDesktop) ──────────────
const N  = '#0A1F44'
const O  = '#fd761a'

function useTokens() {
  const dark = useContext(DarkCtx)
  return {
    dark,
    BG:  dark ? '#1c1e24' : '#f7f9fb',
    W:   dark ? '#272932' : '#ffffff',
    MT:  dark ? '#eef0f5' : '#191c1e',
    ST:  dark ? '#c2c7d6' : '#44464e',
    GT:  dark ? '#9aa0b4' : '#75777f',
    CA:  dark ? '#464b5d' : '#eceef0',
    BR:  dark ? 'rgba(255,255,255,0.08)' : '#eceef0',
    SH:  dark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
    SHD: dark ? '0 8px 24px rgba(0,0,0,0.55)' : '0 8px 24px rgba(10,31,68,0.14)',
  }
}

// ─── Course data (mirrors COURSES in AppDemoDesktop) ────────────────────────────
type Course = {
  slug: string; title: string; tag: string; cat: string; difficulty: string
  hrs: number; lessons: number; quizzes: number; xp: number; mins: number
  progress: number; comingSoon: boolean
}

const COURSES: Course[] = [
  { slug: 'personal-finance-fundamentals', tag: 'PERSONAL FINANCE',       title: 'Personal Finance Fundamentals',           cat: 'Personal Finance',   difficulty: 'Beginner',     hrs: 8,  lessons: 7,  quizzes: 3, xp: 500,  mins: 8,  progress: 0.38, comingSoon: false },
  { slug: 'stock-market-essentials',       tag: 'STOCK MARKETS',          title: 'Stock Market Essentials',                 cat: 'Markets',            difficulty: 'Beginner',     hrs: 10, lessons: 5,  quizzes: 2, xp: 750,  mins: 10, progress: 0,    comingSoon: false },
  { slug: 'corporate-finance-deep-dive',   tag: 'CORPORATE FINANCE',      title: 'Corporate Finance Deep Dive',             cat: 'Corporate Finance',  difficulty: 'Intermediate', hrs: 12, lessons: 3,  quizzes: 1, xp: 1000, mins: 12, progress: 0,    comingSoon: false },
  { slug: 'investment-banking',            tag: 'INVESTMENT BANKING',     title: 'Investment Banking',                      cat: 'Investment Banking', difficulty: 'Advanced',     hrs: 15, lessons: 5,  quizzes: 2, xp: 1500, mins: 15, progress: 0,    comingSoon: false },
  { slug: 'private-equity-fundamentals',   tag: 'PRIVATE EQUITY',         title: 'Private Equity Fundamentals',             cat: 'Private Equity',     difficulty: 'Advanced',     hrs: 12, lessons: 4,  quizzes: 2, xp: 1200, mins: 12, progress: 0,    comingSoon: false },
  { slug: 'ma-strategy-execution',         tag: 'M&A',                    title: 'M&A Strategy and Execution',              cat: 'M&A',                difficulty: 'Advanced',     hrs: 10, lessons: 5,  quizzes: 2, xp: 1100, mins: 10, progress: 0,    comingSoon: false },
  { slug: 'financial-institutions',        tag: 'FINANCIAL INSTITUTIONS', title: 'Financial Institutions',                  cat: 'Markets',            difficulty: 'Beginner',     hrs: 6,  lessons: 8,  quizzes: 3, xp: 300,  mins: 6,  progress: 0,    comingSoon: false },
  { slug: 'business-101',                  tag: 'BUSINESS',               title: 'Business 101',                            cat: 'Business',           difficulty: 'Beginner',     hrs: 6,  lessons: 18, quizzes: 6, xp: 500,  mins: 6,  progress: 0,    comingSoon: false },
  { slug: 'leverage-trading-advanced',     tag: 'TRADING',                title: 'Leverage Trading: The Advanced Playbook', cat: 'Trading',            difficulty: 'Intermediate', hrs: 1,  lessons: 7,  quizzes: 7, xp: 725,  mins: 1,  progress: 0,    comingSoon: false },
  { slug: 'reading-financial-statements',  tag: 'CORPORATE FINANCE',      title: 'Reading Financial Statements',            cat: 'Corporate Finance',  difficulty: 'Intermediate', hrs: 2,  lessons: 9,  quizzes: 4, xp: 500,  mins: 2,  progress: 0,    comingSoon: true },
]

const CATEGORIES = ['All', 'Personal Finance', 'Markets', 'Corporate Finance', 'Investment Banking', 'Private Equity', 'M&A', 'Business', 'Trading']

const DIFF_FILTERS = [
  { key: 'Beginner',     label: 'Easy',   dot: '#16a34a' },
  { key: 'Intermediate', label: 'Medium', dot: '#d97706' },
  { key: 'Advanced',     label: 'Hard',   dot: '#dc2626' },
] as const

const FEATURED = [
  { tag: 'TRENDING', icon: TrendingUp, title: 'Stock Market Essentials',       mins: 10, xp: 750,  color: N,         slug: 'stock-market-essentials'       },
  { tag: 'NEW',      icon: Sparkles,   title: 'Private Equity Fundamentals',   mins: 12, xp: 1200, color: '#1a1000', slug: 'private-equity-fundamentals'   },
  { tag: 'POPULAR',  icon: Flame,      title: 'Personal Finance Fundamentals', mins: 8,  xp: 500,  color: '#0a2b1f', slug: 'personal-finance-fundamentals' },
]

function diffColor(d: string) {
  return d === 'Beginner'     ? { bg: 'rgba(22,163,74,0.12)', fg: '#16a34a' } :
         d === 'Intermediate' ? { bg: 'rgba(217,119,6,0.12)', fg: '#d97706' } :
                                { bg: 'rgba(220,38,38,0.12)', fg: '#dc2626' }
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function DesktopDiscover({ onOpenCourse }: { onOpenCourse: (slug: string) => void }) {
  const t = useTokens()
  const [cat, setCat] = useState('All')
  const [diff, setDiff] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const searchActive = query.trim().length > 0

  const visible = useMemo(() => {
    if (searchActive) {
      const q = query.toLowerCase()
      return COURSES.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.cat.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q)
      )
    }
    return COURSES.filter(c =>
      (cat === 'All' || c.cat === cat) &&
      (diff === null || c.difficulty === diff)
    )
  }, [searchActive, query, cat, diff])

  const resultLabel = searchActive
    ? 'Results'
    : diff
      ? `${DIFF_FILTERS.find(d => d.key === diff)!.label} Courses`
      : cat === 'All' ? 'All Courses' : `${cat} Courses`

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6" style={{ background: t.BG }}>

      {/* Header + search */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: t.GT }}>Explore the catalogue</p>
          <h1 className="text-2xl font-bold" style={{ color: t.MT, letterSpacing: '-0.02em' }}>Discover</h1>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border w-80"
             style={{ background: t.W, borderColor: t.BR }}>
          <Search size={16} style={{ color: t.GT, flexShrink: 0 }}/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses, topics…"
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            style={{ color: t.MT }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="flex-shrink-0">
              <X size={14} style={{ color: t.GT }}/>
            </button>
          )}
        </div>
      </div>

      {/* Featured row */}
      {!searchActive && (
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold" style={{ color: t.MT }}>Featured</h2>
            <span className="text-xs font-semibold" style={{ color: O }}>See all</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {FEATURED.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.button
                  key={f.slug}
                  onClick={() => onOpenCourse(f.slug)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left rounded-2xl p-5 transition-shadow"
                  style={{ background: f.color, boxShadow: t.SHD }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: O }}>
                      <Icon size={12}/> {f.tag}
                    </span>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.2)' }}>
                      <BookOpen size={14} style={{ color: O }}/>
                    </div>
                  </div>
                  <p className="text-base font-semibold text-white mb-3 leading-snug">{f.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#b4c6f4' }}>
                      <Clock size={11}/> {f.mins} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: O }}>
                      <Star size={10}/> +{f.xp} XP
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(c => {
          const active = !searchActive && cat === c
          return (
            <button
              key={c}
              onClick={() => { setCat(c); setQuery('') }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? N : t.W,
                color: active ? '#ffffff' : t.ST,
                border: `1px solid ${active ? N : t.BR}`,
                boxShadow: active ? t.SH : 'none',
              }}>
              {c}
            </button>
          )
        })}
      </div>

      {/* Difficulty toggles + result label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold" style={{ color: t.MT }}>
          {resultLabel} <span className="font-normal" style={{ color: t.GT }}>· {visible.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: t.GT }}>Difficulty</span>
          {DIFF_FILTERS.map(d => {
            const active = diff === d.key
            return (
              <button
                key={d.key}
                onClick={() => { setDiff(active ? null : d.key); setQuery('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: active ? d.dot : t.W,
                  color: active ? '#ffffff' : t.ST,
                  border: `1px solid ${active ? d.dot : t.BR}`,
                }}>
                <span className="w-2 h-2 rounded-full" style={{ background: active ? '#ffffff' : d.dot }}/>
                {d.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Course grid */}
      {visible.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: t.W, boxShadow: t.SH }}>
          <Search size={28} style={{ color: t.GT, margin: '0 auto 12px' }}/>
          <p className="text-sm font-semibold" style={{ color: t.MT }}>No courses found</p>
          <p className="text-xs mt-1" style={{ color: t.GT }}>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((c, i) => {
            const dc = diffColor(c.difficulty)
            const disabled = c.comingSoon
            return (
              <motion.button
                key={c.slug}
                onClick={() => !disabled && onOpenCourse(c.slug)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.04 } }}
                whileHover={disabled ? {} : { y: -3 }}
                whileTap={disabled ? {} : { scale: 0.98 }}
                className="group text-left rounded-2xl p-5 flex flex-col transition-shadow"
                style={{ background: t.W, boxShadow: t.SH, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'default' : 'pointer' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: disabled ? t.CA : N }}>
                    {disabled
                      ? <Lock size={15} style={{ color: t.GT }}/>
                      : <Play size={15} className="text-white"/>}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                        style={{ background: dc.bg, color: dc.fg }}>{c.difficulty}</span>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: t.GT }}>{c.tag}</span>
                <p className="text-base font-semibold leading-snug mb-3" style={{ color: t.MT }}>{c.title}</p>

                <div className="flex items-center gap-3 mb-4 mt-auto">
                  <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: t.GT }}>
                    <Clock size={11}/> {c.mins} min
                  </span>
                  <span className="text-[11px]" style={{ color: t.GT }}>{c.lessons} lessons</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: O }}>
                    <Star size={10}/> +{c.xp} XP
                  </span>
                </div>

                {disabled ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full self-start"
                        style={{ background: t.CA, color: t.GT }}>In production</span>
                ) : c.progress > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px]" style={{ color: t.GT }}>Continue</span>
                      <span className="text-[10px] font-semibold" style={{ color: O }}>{Math.round(c.progress * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.CA }}>
                      <div className="h-full rounded-full" style={{ width: `${c.progress * 100}%`, background: O }}/>
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white self-start transition-opacity group-hover:opacity-90"
                        style={{ background: O }}>
                    Start course
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
