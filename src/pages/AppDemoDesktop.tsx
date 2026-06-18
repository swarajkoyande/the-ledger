import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Compass, Trophy, Users, User,
  Flame, Snowflake, Lock, ChevronRight,
  TrendingUp, BarChart2, DollarSign, Zap,
  CheckCircle2, ArrowRight, Star, BookOpen,
  Award, Target, PieChart, Lightbulb, X,
  Check, HelpCircle, Search, Bell, Globe,
  Medal, Crown, MessageCircle, Heart, Share2,
  Plus, Settings, Shield, LogOut, Clock,
  Play, Filter, ChevronUp, BarChart3,
  Layers, CircleDot, Minus, Square, ArrowLeft, Moon, Sun
} from 'lucide-react'
import { LessonsFlow } from '../lessons/LessonsFlow'
import { CourseDetailScreen } from './CourseDetailScreen'
import { DailyQuizScreen } from './DailyQuizScreen'
import { TradingScreen } from './trading/TradingScreen'
import { StockDetailScreen } from './trading/StockDetailScreen'
import { PortfolioScreen } from './trading/PortfolioScreen'
import { SettingsScreen } from '../components/settings/SettingsScreen'
import { PrivacySecurityScreen } from '../components/settings/PrivacySecurityScreen'
import { NotificationsScreen } from '../components/settings/NotificationsScreen'
import { LanguageRegionScreen } from '../components/settings/LanguageRegionScreen'
import { PortfolioProvider } from '../store/portfolioStore'
import { ProgressProvider, useProgress } from '../store/progressStore'
import { loadDailyQuizState } from '../data/dailyQuiz'
import type { DailyQuizState } from '../data/dailyQuiz'
import { FEATURED_STOCKS } from '../data/stockData'
import type { Stock } from '../data/stockData'
import { DarkCtx } from './AppDemo'
import DesktopChallenges from '../components/desktop/DesktopChallenges'
import DesktopClubs from '../components/desktop/DesktopClubs'
import DesktopDiscover from '../components/desktop/DesktopDiscover'
import DesktopRightPanel from '../components/desktop/DesktopRightPanel'

// ─── Design tokens ────────────────────────────────────────────────────────────
const N  = '#0A1F44'
const O  = '#fd761a'
const BG = '#f7f9fb'
const W  = '#ffffff'
const MT = '#191c1e'
const ST = '#44464e'
const GT = '#75777f'
const CA = '#eceef0'
const DIVIDER = 'rgba(0,0,0,0.035)'
const SH = '0 2px 12px rgba(0,0,0,0.06)'
const SHD = '0 8px 24px rgba(10,31,68,0.14)'

type Tab    = 'home' | 'discover' | 'challenges' | 'clubs' | 'profile'
type Screen = 'main' | 'course-detail' | 'lesson' | 'daily-quiz' | 'trading'
           | 'stock-detail' | 'portfolio' | 'settings' | 'settingsPrivacy'
           | 'settingsNotifications' | 'settingsLanguage'

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'home',       Icon: Home,    label: 'Home'       },
  { id: 'discover',   Icon: Compass, label: 'Discover'   },
  { id: 'challenges', Icon: Trophy,  label: 'Challenges' },
  { id: 'clubs',      Icon: Users,   label: 'Clubs'      },
  { id: 'profile',    Icon: User,    label: 'Profile'    },
] as const

const WEEK = ['M','T','W','T','F','S','S']

const COURSES: (CourseInfo & { locked: boolean })[] = [
  { slug: 'personal-finance-fundamentals', tag: 'PERSONAL FINANCE',       title: 'Personal Finance Fundamentals',           cat: 'Personal Finance',   difficulty: 'Beginner',     hrs: 8,  lessons: 7,  quizzes: 3, xp: 500,  mins: 8,  progress: 0.38, comingSoon: false, locked: false },
  { slug: 'stock-market-essentials',       tag: 'STOCK MARKETS',          title: 'Stock Market Essentials',                 cat: 'Markets',            difficulty: 'Beginner',     hrs: 10, lessons: 5,  quizzes: 2, xp: 750,  mins: 10, progress: 0,    comingSoon: false, locked: false },
  { slug: 'corporate-finance-deep-dive',   tag: 'CORPORATE FINANCE',      title: 'Corporate Finance Deep Dive',             cat: 'Corporate Finance',  difficulty: 'Intermediate', hrs: 12, lessons: 3,  quizzes: 1, xp: 1000, mins: 12, progress: 0,    comingSoon: false, locked: false },
  { slug: 'investment-banking',            tag: 'INVESTMENT BANKING',     title: 'Investment Banking',                      cat: 'Investment Banking', difficulty: 'Advanced',     hrs: 15, lessons: 5,  quizzes: 2, xp: 1500, mins: 15, progress: 0,    comingSoon: false, locked: false },
  { slug: 'private-equity-fundamentals',   tag: 'PRIVATE EQUITY',         title: 'Private Equity Fundamentals',             cat: 'Private Equity',     difficulty: 'Advanced',     hrs: 12, lessons: 4,  quizzes: 2, xp: 1200, mins: 12, progress: 0,    comingSoon: false, locked: false },
  { slug: 'ma-strategy-execution',         tag: 'M&A',                    title: 'M&A Strategy and Execution',              cat: 'M&A',                difficulty: 'Advanced',     hrs: 10, lessons: 5,  quizzes: 2, xp: 1100, mins: 10, progress: 0,    comingSoon: false, locked: false },
  { slug: 'financial-institutions',        tag: 'FINANCIAL INSTITUTIONS', title: 'Financial Institutions',                  cat: 'Markets',            difficulty: 'Beginner',     hrs: 6,  lessons: 8,  quizzes: 3, xp: 300,  mins: 6,  progress: 0,    comingSoon: false, locked: false },
  { slug: 'business-101',                  tag: 'BUSINESS',               title: 'Business 101',                            cat: 'Business',           difficulty: 'Beginner',     hrs: 6,  lessons: 18, quizzes: 6, xp: 500,  mins: 6,  progress: 0,    comingSoon: false, locked: false },
  { slug: 'leverage-trading-advanced',     tag: 'TRADING',                title: 'Leverage Trading: The Advanced Playbook', cat: 'Trading',            difficulty: 'Intermediate', hrs: 1,  lessons: 7,  quizzes: 7, xp: 725,  mins: 1,  progress: 0,    comingSoon: false, locked: false },
  { slug: 'reading-financial-statements',  tag: 'CORPORATE FINANCE',      title: 'Reading Financial Statements',            cat: 'Corporate Finance',  difficulty: 'Intermediate', hrs: 2,  lessons: 9,  quizzes: 4, xp: 500,  mins: 2,  progress: 0,    comingSoon: true,  locked: false },
]

const LEADERBOARD = [
  { rank: 1, name: 'Aiko T.',  chapter: 'Tokyo',     xp: 4820, delta: +120 },
  { rank: 2, name: 'Rohan M.', chapter: 'Mumbai',    xp: 4710, delta: +85  },
  { rank: 3, name: 'Sofia L.', chapter: 'Madrid',    xp: 4605, delta: +60  },
  { rank: 4, name: 'You',      chapter: 'Singapore', xp: 4340, delta: +340, isMe: true },
  { rank: 5, name: 'Jin W.',   chapter: 'Singapore', xp: 4290, delta: +30  },
  { rank: 6, name: 'Priya S.', chapter: 'Singapore', xp: 4100, delta: +15  },
  { rank: 7, name: 'Lucas B.', chapter: 'Madrid',    xp: 3980, delta: +42  },
]

const CHALLENGES = [
  { id: 'ch1', title: 'Weekly Stock Pitch',       ends: '2d 14h', prize: '500 XP', entrants: 142, joined: true  },
  { id: 'ch2', title: 'M&A Case Study Sprint',    ends: '5d 3h',  prize: '800 XP', entrants: 88,  joined: false },
  { id: 'ch3', title: 'Macro Forecasting Round',  ends: '6d 22h', prize: '350 XP', entrants: 67,  joined: false },
  { id: 'ch4', title: 'Valuation Speed Round',    ends: '8d 1h',  prize: '600 XP', entrants: 110, joined: false },
]

const POSTS = [
  { author: 'Rohan M.',  time: '2h ago',  text: "Great breakdown on the Fed's latest move. Anyone catching the FOMC meeting tomorrow?",  likes: 12, comments: 4 },
  { author: 'Aisha K.',  time: '5h ago',  text: "Shared my DCF model for Apple — feedback welcome. Assuming 8% WACC and 3% terminal growth.", likes: 8,  comments: 6 },
  { author: 'James T.',  time: '1d ago',  text: "Reminder: chapter meeting on Friday. We'll be doing a live stock pitch competition.",      likes: 21, comments: 9 },
  { author: 'Priya S.',  time: '2d ago',  text: "Just finished the IB module — accretion/dilution finally makes sense! Highly recommend.",  likes: 15, comments: 3 },
]

const BADGES = [
  { emoji: '🔥', label: '30-Day Streak',  desc: 'Study 30 days in a row'     },
  { emoji: '📈', label: 'Market Maven',   desc: 'Complete all markets courses' },
  { emoji: '🏆', label: 'Top 10%',        desc: 'Reach global top 10%'        },
  { emoji: '⚡', label: 'Speed Learner',  desc: 'Finish 3 lessons in one day' },
  { emoji: '💼', label: 'IB Expert',      desc: 'Complete IB track'           },
  { emoji: '🌏', label: 'Global Rank',    desc: 'Compete in 5 challenges'     },
]

const FEATURED = [
  { tag: 'TRENDING', title: 'Stock Market Essentials',       mins: 10, xp: 750,  color: N,         slug: 'stock-market-essentials'       },
  { tag: 'NEW',      title: 'Private Equity Fundamentals',   mins: 12, xp: 1200, color: '#1a1000', slug: 'private-equity-fundamentals'   },
  { tag: 'POPULAR',  title: 'Personal Finance Fundamentals', mins: 8,  xp: 500,  color: '#0a2b1f', slug: 'personal-finance-fundamentals' },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: W, boxShadow: SH, ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold" style={{ color: MT }}>{children}</h2>
      {action && <button className="text-xs font-semibold" style={{ color: O }}>{action}</button>}
    </div>
  )
}

function XpBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full" style={{ background: O }}>
      <Star size={11} className="text-white" />
      <span className="text-xs font-bold text-white">{xp} XP</span>
    </div>
  )
}

type CourseInfo = {
  slug: string; title: string; tag: string; difficulty: string
  hrs: number; lessons: number; quizzes: number; xp: number; mins: number
  cat: string; progress: number; comingSoon: boolean
}

function TodayLessons({ courses, onOpen }: { courses: (CourseInfo & { locked: boolean })[]; onOpen: (c: CourseInfo) => void }) {
  const active = courses[0]
  const next   = courses[1]
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <motion.button onClick={() => onOpen(active)} whileTap={{ scale: 0.98 }}
        className="text-left rounded-2xl p-4" style={{ background: N, boxShadow: SHD }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>{active.cat}</span>
            <p className="text-sm font-semibold text-white mt-1 leading-snug">{active.title}</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.2)' }}>
            <BookOpen size={14} style={{ color: O }}/>
          </div>
        </div>
        <div className="mb-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.round(active.progress * 100)}%`, background: O }}/>
          </div>
          <span className="text-[10px]" style={{ color: '#7687b2' }}>{Math.round(active.progress * 100)}% complete</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={10} style={{ color: '#7687b2' }}/><span className="text-xs" style={{ color: '#7687b2' }}>{active.mins} min</span>
            <Star size={10} style={{ color: O }}/><span className="text-xs" style={{ color: O }}>+{active.xp} XP</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: O }}>
            <span className="text-xs font-semibold text-white">Continue</span>
            <ChevronRight size={11} className="text-white"/>
          </div>
        </div>
      </motion.button>
      <div className="rounded-2xl p-4 cursor-pointer" style={{ background: W, boxShadow: SH }} onClick={() => onOpen(next)}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>{next.cat}</span>
            <p className="text-sm font-semibold mt-1" style={{ color: MT }}>{next.title}</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: CA }}>
            <Play size={13} style={{ color: N }}/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={10} style={{ color: GT }}/><span className="text-xs" style={{ color: GT }}>{next.mins} min</span>
          <Star size={10} style={{ color: O }}/><span className="text-xs" style={{ color: O }}>+{next.xp} XP</span>
        </div>
      </div>
    </div>
  )
}

// Sub-screen back button for desktop content area
function SubScreenBack({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button onClick={onBack}
      className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
      style={{ background: CA, color: MT }}>
      <ArrowLeft size={14}/>{label}
    </button>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function AppDemoDesktopInner() {
  const [tab, setTab]         = useState<Tab>('home')
  const [screen, setScreen]   = useState<Screen>('main')
  const [portfolio, setPort]  = useState(14200)
  const { xp, streak, freezes, addXp, useFreeze, resetProgress } = useProgress()
  const [activeCourseSlug, setActiveCourseSlug] = useState('intro-stock-market')
  const [activeStock, setActiveStock] = useState<Stock | null>(null)
  const [livePrices, setLivePrices]   = useState<Record<string, { price: number; change: number; changePct: number }>>({})
  const [quizState, setQuizState]     = useState<DailyQuizState | null>(null)
  const [activeCourseDetail, setActiveCourseDetail] = useState<CourseInfo | null>(null)
  const [country, setCountry] = useState<import('./AppDemo').Country>({ name: 'Singapore', flag: '🇸🇬' })
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setPort(v => Math.round(v + (Math.random() - 0.48) * 40)), 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setQuizState(loadDailyQuizState())
  }, [])

  const isUp = portfolio >= 14200

  function goMain() { setScreen('main') }
  function goLesson(slug: string) { setActiveCourseSlug(slug); setScreen('lesson') }
  function goTrading() { setScreen('trading') }
  function goPortfolio() { setScreen('portfolio') }
  function goStock(stock: Stock) { setActiveStock(stock); setScreen('stock-detail') }
  function goQuiz() { setScreen('daily-quiz') }
  function goSettings() { setScreen('settings') }
  function goCourseDetail(course: CourseInfo) { setActiveCourseDetail(course); setScreen('course-detail') }

  const slide = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit:    { opacity: 0, y: -6, transition: { duration: 0.16 } },
  }

  // Keyboard nav for lesson player
  const lessonRef = useRef<{ advance?: () => void; goBack?: () => void }>({})
  useEffect(() => {
    if (screen !== 'lesson') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); lessonRef.current.advance?.() }
      if (e.key === 'ArrowLeft')                   { e.preventDefault(); lessonRef.current.goBack?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen])

  // Navigate sidebar tabs and reset sub-screen
  function switchTab(id: Tab) { setTab(id); setScreen('main') }

  return (
    <PortfolioProvider>
      <DarkCtx.Provider value={dark}>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* App body */}
            <div className="flex h-screen" style={{ background: BG }}>

              {/* ── Sidebar ── */}
              <div className="w-56 flex flex-col flex-shrink-0" style={{ background: N }}>
                <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: O }}>
                      <BookOpen size={15} className="text-white"/>
                    </div>
                    <span className="font-bold text-white text-sm">The Ledger</span>
                  </div>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                  <p className="px-2 text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Menu</p>
                  {NAV.map(({ id, Icon, label }) => {
                    const active = tab === id && screen === 'main'
                    return (
                      <button key={id} onClick={() => switchTab(id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all w-full"
                        style={{
                          background: active ? 'rgba(253,118,26,0.18)' : 'transparent',
                          borderLeft: active ? `2px solid ${O}` : '2px solid transparent',
                        }}>
                        <Icon size={16} style={{ color: active ? O : 'rgba(255,255,255,0.5)' }}/>
                        <span className="text-sm font-medium" style={{ color: active ? W : 'rgba(255,255,255,0.6)' }}>{label}</span>
                        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: O }}/>}
                      </button>
                    )
                  })}

                  <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="px-2 text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Quick Stats</p>
                    <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Flame size={12} style={{ color: O }}/>
                          <span className="text-xs font-semibold text-white">{streak}-day streak</span>
                        </div>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>🔥</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star size={12} style={{ color: O }}/>
                          <span className="text-xs font-semibold text-white">{xp} XP</span>
                        </div>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Lv.1</span>
                      </div>
                    </div>
                  </div>
                </nav>

                <div className="px-3 pb-4">
                  <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: O }}>S</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">Swasmac</p>
                      <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Singapore · Analyst</p>
                    </div>
                    <button onClick={goSettings}>
                      <Settings size={13} style={{ color: 'rgba(255,255,255,0.4)' }}/>
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Content area ── */}
              <div className="flex-1 overflow-hidden relative">

                <AnimatePresence mode="wait">

                  {/* ══ SUB-SCREENS (overlay the tab content) ══ */}

                  {screen === 'course-detail' && activeCourseDetail && (
                    <motion.div key="course-detail" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <CourseDetailScreen
                        course={activeCourseDetail}
                        onStart={() => goLesson(activeCourseDetail.slug)}
                        onBack={goMain}/>
                    </motion.div>
                  )}

                  {screen === 'lesson' && (
                    <motion.div key="lesson" {...slide} className="absolute inset-0 overflow-hidden flex flex-col">
                      {/* Desktop lesson wrapper: centred column, keyboard hint */}
                      <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
                           style={{ borderColor: CA, background: W }}>
                        <button onClick={goMain} className="flex items-center gap-2 text-xs font-semibold"
                                style={{ color: MT }}>
                          <ArrowLeft size={14}/> Back to lessons
                        </button>
                        <span className="text-[10px]" style={{ color: GT }}>← → or Space to navigate cards</span>
                      </div>
                      <div className="flex-1 overflow-hidden relative">
                        <LessonsFlowDesktop slug={activeCourseSlug} onExit={goMain}
                          onXp={(earned) => addXp(earned)} lessonRef={lessonRef}/>
                      </div>
                    </motion.div>
                  )}

                  {screen === 'daily-quiz' && quizState && (
                    <motion.div key="quiz" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <div className="px-6 pt-4">
                        <SubScreenBack label="Back" onBack={goMain}/>
                      </div>
                      <DailyQuizScreen
                        quizState={quizState}
                        onUpdate={(s) => { setQuizState(s); if (s.completed) { addXp(s.xpEarned ?? 50); goMain() } }}
                        onBack={goMain}/>
                    </motion.div>
                  )}

                  {screen === 'trading' && (
                    <motion.div key="trading" {...slide} className="absolute inset-0 overflow-hidden">
                      <TradingScreen
                        onBack={goMain}
                        onStock={goStock}
                        onPortfolio={goPortfolio}
                        livePrices={livePrices}
                        onPricesUpdate={setLivePrices}/>
                    </motion.div>
                  )}

                  {screen === 'stock-detail' && activeStock && (
                    <motion.div key="stock-detail" {...slide} className="absolute inset-0 overflow-hidden">
                      <StockDetailScreen
                        stock={activeStock}
                        liveData={livePrices[activeStock.ticker]}
                        onBack={() => setScreen('trading')}/>
                    </motion.div>
                  )}

                  {screen === 'portfolio' && (
                    <motion.div key="portfolio" {...slide} className="absolute inset-0 overflow-hidden">
                      <PortfolioScreen
                        onBack={goMain}
                        onStock={goStock}
                        onStartTrading={goTrading}
                        onLearnMore={() => { switchTab('discover') }}
                        livePrices={livePrices}/>
                    </motion.div>
                  )}

                  {screen === 'settings' && (
                    <motion.div key="settings" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <SettingsScreen
                        onOpenPrivacy={() => setScreen('settingsPrivacy')}
                        onOpenNotifications={() => setScreen('settingsNotifications')}
                        onOpenLanguage={() => setScreen('settingsLanguage')}
                        onBack={goMain}/>
                    </motion.div>
                  )}

                  {screen === 'settingsPrivacy' && (
                    <motion.div key="settingsPrivacy" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <PrivacySecurityScreen onBack={() => setScreen('settings')}/>
                    </motion.div>
                  )}

                  {screen === 'settingsNotifications' && (
                    <motion.div key="settingsNotifications" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <NotificationsScreen onBack={() => setScreen('settings')}/>
                    </motion.div>
                  )}

                  {screen === 'settingsLanguage' && (
                    <motion.div key="settingsLanguage" {...slide} className="absolute inset-0 overflow-y-auto" style={{ background: BG }}>
                      <LanguageRegionScreen country={country} onSetCountry={setCountry} onBack={() => setScreen('settings')}/>
                    </motion.div>
                  )}

                  {/* ══ MAIN TAB CONTENT ══ */}
                  {screen === 'main' && (
                    <motion.div key={`main-${tab}`} {...slide} className="h-full overflow-hidden flex">

                      {/* ══ HOME ══ */}
                      {tab === 'home' && (
                        <>
                          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
                            <div className="flex items-center justify-between mb-5">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GT }}>Good morning</p>
                                <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.02em' }}>Dashboard</h1>
                              </div>
                              <div className="flex items-center gap-3">
                                <XpBadge xp={xp}/>
                                <button onClick={goQuiz} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: N }}>
                                  <Flame size={12} style={{ color: O }}/><span className="text-xs font-bold text-white">{streak}</span>
                                </button>
                              </div>
                            </div>

                            {/* Streak card */}
                            <Card className="p-4 mb-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Flame size={15} style={{ color: O }}/>
                                  <span className="text-sm font-semibold" style={{ color: MT }}>{streak}-day streak 🔥</span>
                                </div>
                                <button onClick={() => useFreeze()}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                  style={{ background: freezes > 0 ? '#d9e2ff' : '#eceef0', color: freezes > 0 ? N : '#75777f', cursor: freezes > 0 ? 'pointer' : 'default' }}
                                  disabled={freezes === 0}>
                                  <Snowflake size={10}/> {freezes > 0 ? `${freezes} freeze${freezes !== 1 ? 's' : ''} available` : 'No freezes left'}
                                </button>
                              </div>
                              <div className="flex gap-2">
                                {WEEK.map((d, i) => {
                                  const done = i < 5
                                  return (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: i * 0.04 } }}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: done ? N : CA }}>
                                        {done ? <Check size={14} className="text-white"/> : <span className="text-xs" style={{ color: GT }}>{d}</span>}
                                      </motion.div>
                                      <span className="text-[9px] font-medium" style={{ color: done ? N : '#c5c6cf' }}>{d}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </Card>

                            {/* Today's quiz CTA */}
                            {quizState && (
                              <motion.button onClick={goQuiz} whileTap={{ scale: 0.98 }}
                                className="w-full text-left rounded-2xl p-4 mb-4 flex items-center gap-4"
                                style={{ background: O, boxShadow: SHD }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                  <Zap size={18} className="text-white"/>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-bold uppercase tracking-widest text-white opacity-80">Daily Challenge</p>
                                  <p className="text-sm font-bold text-white">{((quizState.questions[0] as any)?.prompt ?? (quizState.questions[0] as any)?.question ?? 'Today\'s Quiz')?.slice(0,60)}…</p>
                                </div>
                                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                  <Star size={11} className="text-white"/><span className="text-xs font-bold text-white">+50 XP</span>
                                </div>
                              </motion.button>
                            )}

                            {/* Lessons */}
                            <SectionTitle action="See all">Today's Lessons</SectionTitle>
                            <TodayLessons courses={COURSES} onOpen={goCourseDetail} />

                            {/* Course table + Social — side by side */}
                            <div className="flex gap-4 items-start">
                              {/* Courses – half width */}
                              <div className="flex-1 min-w-0">
                                <SectionTitle action="Browse all">All Courses</SectionTitle>
                                <Card>
                                  {COURSES.map((c, i) => (
                                    <button key={i} onClick={() => !c.comingSoon && goCourseDetail(c)}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                                      style={{ borderBottom: i < COURSES.length - 1 ? `1px solid ${CA}` : 'none', opacity: c.comingSoon ? 0.5 : 1 }}>
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                           style={{ background: c.comingSoon ? CA : N }}>
                                        {c.comingSoon ? <Lock size={12} style={{ color: GT }}/> : <Play size={12} className="text-white"/>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>{c.tag}</p>
                                        <p className="text-sm font-medium truncate" style={{ color: MT }}>{c.title}</p>
                                      </div>
                                      <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-xs" style={{ color: GT }}>{c.mins} min</span>
                                        <div className="flex items-center gap-1"><Star size={10} style={{ color: O }}/><span className="text-xs font-medium" style={{ color: O }}>+{c.xp}</span></div>
                                        {c.progress > 0 && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: CA }}>
                                              <div className="h-full rounded-full" style={{ width: `${c.progress*100}%`, background: O }}/>
                                            </div>
                                            <span className="text-[10px] font-semibold" style={{ color: O }}>{Math.round(c.progress*100)}%</span>
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </Card>
                              </div>

                              {/* Social card – half width */}
                              <div className="flex-1 min-w-0">
                                <SectionTitle>Social</SectionTitle>
                                <Card>
                                  {/* Direct Messages */}
                                  <div className="px-4 pt-3 pb-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: GT }}>Direct Messages</p>
                                    {[
                                      { name: 'Aiko T.',  avatar: 'A', msg: 'Nice trade on NVDA 🔥',            time: '2m',  unread: 2 },
                                      { name: 'Rohan M.', avatar: 'R', msg: 'Are you joining the IB challenge?', time: '14m', unread: 0 },
                                      { name: 'Sofia L.', avatar: 'S', msg: 'Check out this M&A breakdown',     time: '1h',  unread: 0 },
                                    ].map((dm, i, arr) => (
                                      <div key={i} className="flex items-center gap-3 py-2.5 cursor-pointer"
                                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${CA}` : 'none' }}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: N }}>
                                          {dm.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold truncate" style={{ color: MT }}>{dm.name}</p>
                                          <p className="text-[11px] truncate" style={{ color: GT }}>{dm.msg}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                          <span className="text-[10px]" style={{ color: GT }}>{dm.time}</span>
                                          {dm.unread > 0 && (
                                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: O }}>{dm.unread}</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mx-4" style={{ borderTop: `1px solid ${CA}` }}/>

                                  {/* Club Activity */}
                                  <div className="px-4 pt-2 pb-3">
                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: GT }}>Club Activity</p>
                                    {[
                                      { club: 'NUS Finance',     avatar: 'N', action: 'posted a new challenge',    time: '5m'  },
                                      { club: 'Tokyo Markets',   avatar: 'T', action: 'shared a market breakdown', time: '32m' },
                                      { club: 'Gold Coast Inv.', avatar: 'G', action: '3 new members joined',      time: '2h'  },
                                    ].map((ev, i, arr) => (
                                      <div key={i} className="flex items-center gap-3 py-2.5 cursor-pointer"
                                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${CA}` : 'none' }}>
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: N }}>
                                          {ev.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold truncate" style={{ color: MT }}>{ev.club}</p>
                                          <p className="text-[11px] truncate" style={{ color: GT }}>{ev.action}</p>
                                        </div>
                                        <span className="text-[10px] flex-shrink-0" style={{ color: GT }}>{ev.time}</span>
                                      </div>
                                    ))}
                                  </div>
                                </Card>
                              </div>
                            </div>
                          </div>

                          {/* Right panel */}
                          <div className="w-64 flex-shrink-0 px-4 py-5 overflow-y-auto no-scrollbar" style={{ borderLeft: `1px solid ${DIVIDER}` }}>
                            <div className="rounded-2xl p-4 mb-4 cursor-pointer" onClick={goTrading} style={{ background: N, boxShadow: SHD }}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <DollarSign size={12} style={{ color: O }}/>
                                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Portfolio Sim</span>
                              </div>
                              <motion.p key={portfolio} initial={{ opacity: 0.6, y: -3 }} animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-black text-white mb-1">${portfolio.toLocaleString()}</motion.p>
                              <p className="text-xs" style={{ color: isUp ? '#22c55e' : '#ef4444' }}>
                                {isUp ? '▲ +' : '▼ '}{Math.abs(portfolio - 14200)} today
                              </p>
                              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="flex items-center gap-1.5">
                                  <TrendingUp size={11} style={{ color: '#22c55e' }}/>
                                  <span className="text-[10px]" style={{ color: '#7687b2' }}>Market: <span style={{ color: '#22c55e' }}>Bullish</span> · S&P +1.4%</span>
                                </div>
                              </div>
                            </div>

                            <Card className="p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold" style={{ color: MT }}>Level 1 — Analyst</p>
                                <Medal size={14} style={{ color: O }}/>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: CA }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1 }}
                                  className="h-full rounded-full" style={{ background: O }}/>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[10px]" style={{ color: GT }}>{xp} XP</span>
                                <span className="text-[10px]" style={{ color: GT }}>500 XP</span>
                              </div>
                            </Card>

                            <SectionTitle>Top Ranks</SectionTitle>
                            <Card className="mb-4">
                              {LEADERBOARD.slice(0,5).map((e, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2"
                                  style={{ background: e.isMe ? '#f0f4ff' : W, borderBottom: i < 4 ? `1px solid ${CA}` : 'none' }}>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                                       style={{ background: i===0?'#fbbf24':i===1?'#9ca3af':i===2?'#cd7c2f':e.isMe?N:CA,
                                                color: (i<3||e.isMe)?W:GT }}>
                                    {i<3?<Crown size={10}/>:e.rank}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate" style={{ color: e.isMe?N:MT }}>{e.name}</p>
                                  </div>
                                  <span className="text-xs font-bold flex-shrink-0" style={{ color: e.isMe?O:MT }}>{e.xp.toLocaleString()}</span>
                                </div>
                              ))}
                            </Card>

                            <SectionTitle>Badges</SectionTitle>
                            <div className="grid grid-cols-3 gap-2">
                              {BADGES.map((b,i) => (
                                <div key={i} className="rounded-xl p-2 flex flex-col items-center gap-1" style={{ background: W, boxShadow: SH }}>
                                  <span className="text-lg">{b.emoji}</span>
                                  <p className="text-[8px] font-semibold text-center leading-tight" style={{ color: GT }}>{b.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* ══ DISCOVER ══ */}
                      {tab === 'discover' && (
                        <>
                          <DesktopDiscover
                            onOpenCourse={(slug) => {
                              const c = COURSES.find(x => x.slug === slug)
                              if (c) goCourseDetail(c)
                            }}
                          />
                          <DesktopRightPanel tab="discover" />
                        </>
                      )}

                      {/* ══ CHALLENGES ══ */}
                      {tab === 'challenges' && (
                        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
                          <DesktopChallenges />
                        </div>
                      )}

                      {/* ══ CLUBS ══ */}
                      {tab === 'clubs' && (
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                          <DesktopClubs country={country} />
                        </div>
                      )}

                      {/* ══ PROFILE ══ */}
                      {tab === 'profile' && (
                        <>
                          <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5">
                            <div className="flex items-center justify-between mb-5">
                              <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.02em' }}>Profile</h1>
                              <button onClick={goSettings} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: CA }}>
                                <Settings size={15} style={{ color: ST }}/>
                              </button>
                            </div>

                            <div className="rounded-2xl p-6 mb-5 flex items-center gap-6" style={{ background: N, boxShadow: SHD }}>
                              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
                                   style={{ background: O, boxShadow: `0 0 0 4px ${N}, 0 0 0 6px ${O}` }}>S</div>
                              <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-0.5">Swasmac</h2>
                                <p className="text-sm mb-3" style={{ color: '#7687b2' }}>Singapore Chapter · Member since Jun 2025</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(253,118,26,0.18)' }}>
                                    <Medal size={13} style={{ color: O }}/>
                                    <span className="text-xs font-bold" style={{ color: O }}>Level 1 — Analyst</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <Trophy size={13} style={{ color: '#fbbf24' }}/>
                                    <span className="text-xs font-bold text-white">Global Rank #4</span>
                                  </div>
                                </div>
                              </div>
                              <div className="w-48">
                                <div className="flex justify-between mb-1.5">
                                  <span className="text-[10px]" style={{ color: '#7687b2' }}>{xp} XP</span>
                                  <span className="text-[10px]" style={{ color: '#7687b2' }}>Lv.2: 500 XP</span>
                                </div>
                                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1 }}
                                    className="h-full rounded-full" style={{ background: O }}/>
                                </div>
                                <p className="text-[10px] mt-1" style={{ color: '#7687b2' }}>160 XP to level up</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-5">
                              {[
                                { icon: <Flame size={18} style={{ color: O }}/>,         val: streak, label: 'Day Streak'  },
                                { icon: <BookOpen size={18} style={{ color: N }}/>,      val: 14,     label: 'Lessons Done' },
                                { icon: <Trophy size={18} style={{ color: '#fbbf24' }}/>,val: '#4',   label: 'Global Rank'  },
                                { icon: <Star size={18} style={{ color: O }}/>,          val: xp,     label: 'Total XP'     },
                              ].map((s, i) => (
                                <Card key={i} className="p-4 text-center">
                                  <div className="flex justify-center mb-2">{s.icon}</div>
                                  <p className="text-xl font-extrabold" style={{ color: MT }}>{s.val}</p>
                                  <p className="text-xs" style={{ color: GT }}>{s.label}</p>
                                </Card>
                              ))}
                            </div>

                            <SectionTitle action="6 earned">Badges</SectionTitle>
                            <div className="grid grid-cols-3 gap-3 mb-5">
                              {BADGES.map((b,i) => (
                                <Card key={i} className="p-4 flex items-center gap-3">
                                  <span className="text-2xl flex-shrink-0">{b.emoji}</span>
                                  <div>
                                    <p className="text-sm font-semibold" style={{ color: MT }}>{b.label}</p>
                                    <p className="text-[10px]" style={{ color: GT }}>{b.desc}</p>
                                  </div>
                                </Card>
                              ))}
                            </div>

                            <SectionTitle>Account Settings</SectionTitle>
                            <Card>
                              {[
                                { icon: <Shield size={14} style={{ color: N }}/>,   label: 'Privacy & Security', sub: 'Two-factor auth enabled',  action: () => setScreen('settingsPrivacy') },
                                { icon: <Bell size={14} style={{ color: N }}/>,     label: 'Notifications',      sub: 'Daily streak reminders on',action: () => setScreen('settingsNotifications') },
                                { icon: <Globe size={14} style={{ color: N }}/>,    label: 'Language & Region',  sub: 'English · Singapore',      action: () => setScreen('settingsLanguage') },
                                { icon: <LogOut size={14} style={{ color: '#ef4444' }}/>, label: 'Sign Out', sub: 'See you tomorrow!', red: true, action: () => { localStorage.clear(); resetProgress(); window.location.reload() } },
                              ].map((item,i,arr) => (
                                <button key={i} onClick={item.action} className="w-full flex items-center gap-4 px-5 py-4"
                                  style={{ borderBottom: i<arr.length-1?`1px solid ${CA}`:'none' }}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                       style={{ background: item.red?'#fee2e2':'#d9e2ff' }}>{item.icon}</div>
                                  <div className="flex-1 text-left">
                                    <p className="text-sm font-semibold" style={{ color: item.red?'#ef4444':MT }}>{item.label}</p>
                                    <p className="text-[10px]" style={{ color: GT }}>{item.sub}</p>
                                  </div>
                                  {!item.red && <ChevronRight size={14} style={{ color: GT }}/>}
                                </button>
                              ))}
                            </Card>
                          </div>

                          <DesktopRightPanel tab="profile" />
                        </>
                      )}

                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
        </div>
      </DarkCtx.Provider>
    </PortfolioProvider>
  )
}

// ─── Public export — wraps inner component with ProgressProvider ──────────────
export default function AppDemoDesktop() {
  return (
    <ProgressProvider>
      <AppDemoDesktopInner />
    </ProgressProvider>
  )
}

// ─── Desktop Lesson Wrapper ────────────────────────────────────────────────────
// Wraps LessonsFlow with keyboard-nav forwarding and desktop-centred layout.
function LessonsFlowDesktop({
  slug, onExit, onXp,
  lessonRef,
}: {
  slug: string
  onExit: () => void
  onXp: (xp: number) => void
  lessonRef: React.MutableRefObject<{ advance?: () => void; goBack?: () => void }>
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center overflow-hidden" style={{ background: '#f7f9fb' }}>
      {/* Centred max-w-2xl column per desktop rule */}
      <div className="w-full max-w-2xl mx-auto h-full relative">
        <LessonsFlow
          slug={slug}
          dark={false}
          onExit={onExit}
          onXp={onXp}
        />
      </div>
    </div>
  )
}
