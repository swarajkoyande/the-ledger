import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react'
import { buildGlassFilter, supportsBackdropFilterUrl } from '../utils/liquidGlass'
import { useDesktopAuth } from '../contexts/DesktopAuth'
import SettingsScreen from '../components/mobile/SettingsScreen'
import SocialTab from '../components/mobile/SocialTab'
import { JoinClubScreen, CreateClubScreen } from '../components/mobile/ClubFlowScreens'
import { useMyClub } from '../hooks/useClubData'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Compass, Trophy, Users, User,
  Flame, Snowflake, Lock, ChevronRight, ChevronUp, ChevronDown,
  TrendingUp, BarChart2, DollarSign, Zap,
  CheckCircle2, ArrowRight, Star,
  BookOpen, Award, Target, PieChart,
  Lightbulb, X, Check, HelpCircle,
  Search, Bell, Globe, Medal, Crown,
  MessageCircle, Heart, Share2, Plus,
  Settings, Shield, LogOut, BarChart3,
  Layers, Clock, Filter, Play
} from 'lucide-react'

// ─── Palette shorthand ────────────────────────────────────────────────────────
export const N = '#0A1F44'   // navy
export const O = '#fd761a'   // orange
const BG = '#f7f9fb'  // surface bg
const W = '#ffffff'
const MT = '#191c1e'  // main text
const ST = '#44464e'  // sub text
const GT = '#75777f'  // ghost text
const CA = '#eceef0'  // card alt
const SH = '0 4px 16px rgba(0,0,0,0.06)'
const SHD = '0 12px 24px rgba(10,31,68,0.18)'

// ─── Liquid glass style constants ─────────────────────────────────────────────
const GLASS = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.75)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 4px 18px rgba(10,31,68,0.09)',
}
const GLASS_ICON = {
  background: 'rgba(255,255,255,0.78)',
  backdropFilter: 'blur(12px) saturate(160%)',
  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.82)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 8px rgba(10,31,68,0.08)',
}
const GLASS_DARK = {
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px) saturate(160%)',
  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.20)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 4px 12px rgba(0,0,0,0.15)',
}
const GLASS_TRACK = {
  background: 'rgba(255,255,255,0.40)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.55)',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
}

// ─── Dark mode (light-only on desktop; exported for compatibility) ─────────────
export const DarkCtx = createContext(false)
export function useT() {
  const dark = useContext(DarkCtx)
  return {
    BG:   dark ? '#1c1e24' : BG,
    W:    dark ? '#272932' : W,
    MT:   dark ? '#eef0f5' : MT,
    ST:   dark ? '#c2c7d6' : ST,
    GT:   dark ? '#9aa0b4' : GT,
    CA:   dark ? '#464b5d' : CA,
    ACTX: dark ? '#b4c6f4' : N,
    ACBG: dark ? 'rgba(180,198,244,0.15)' : '#d9e2ff',
    BR:   dark ? 'rgba(255,255,255,0.08)' : '#eceef0',
    HL:   dark ? 'rgba(180,198,244,0.12)' : '#f0f4ff',
    SH:   dark ? '0 4px 16px rgba(0,0,0,0.4)'   : SH,
    SHD:  dark ? '0 12px 28px rgba(0,0,0,0.55)' : SHD,
  }
}

export type Country = { name: string; flag: string }
export const COUNTRIES: Country[] = [
  { name: 'Singapore',      flag: '🇸🇬' },
  { name: 'India',          flag: '🇮🇳' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States',  flag: '🇺🇸' },
  { name: 'Australia',      flag: '🇦🇺' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen  = 'onboarding' | 'main' | 'lesson' | 'streak' | 'settings' | 'joinClub' | 'createClub'
type NavTab  = 'home' | 'discover' | 'challenges' | 'clubs' | 'social' | 'profile'
type Topic   = { id: string; label: string; icon: React.ReactNode }

// ─── Static data ──────────────────────────────────────────────────────────────
const TOPICS: Topic[] = [
  { id: 'stocks',   label: 'Stock Markets',     icon: <TrendingUp size={18}/> },
  { id: 'ib',       label: 'Investment Banking', icon: <BarChart2 size={18}/> },
  { id: 'econ',     label: 'Economics',          icon: <PieChart size={18}/> },
  { id: 'strategy', label: 'Business Strategy',  icon: <Target size={18}/> },
  { id: 'personal', label: 'Personal Finance',   icon: <DollarSign size={18}/> },
  { id: 'modeling', label: 'Financial Modeling', icon: <Zap size={18}/> },
]

const WEEK_DAYS = ['M','T','W','T','F','S','S']

const QUIZ = {
  course: 'Investment Banking',
  module: 'How M&A Deals Are Structured',
  lesson: 3, total: 8, xp: 15,
  prompt: 'In an M&A deal, what does the term "accretion/dilution" refer to?',
  hint:   'Focus on the impact to the bottom line — what happens to earnings per share?',
  options: [
    { id: 'a', text: 'Change in EPS post-acquisition',  correct: true  },
    { id: 'b', text: 'Change in market capitalisation', correct: false },
    { id: 'c', text: 'Increase in total company debt',  correct: false },
    { id: 'd', text: 'Regulatory approval timeline',    correct: false },
  ],
}

const COURSES = [
  { id: 'c1', tag: 'INVESTMENT BANKING', title: 'How M&A Deals Are Structured',  mins: 8,  xp: 15, progress: 0.38, locked: false },
  { id: 'c2', tag: 'ACCOUNTING',         title: 'Reading a Balance Sheet',         mins: 6,  xp: 10, progress: 0,    locked: true  },
  { id: 'c3', tag: 'STOCK MARKETS',      title: 'Understanding the P/E Ratio',     mins: 5,  xp: 12, progress: 0,    locked: true  },
  { id: 'c4', tag: 'ECONOMICS',          title: 'Inflation & Central Banks',        mins: 9,  xp: 18, progress: 0,    locked: true  },
  { id: 'c5', tag: 'FINANCIAL MODELING', title: 'DCF from Scratch',                mins: 12, xp: 25, progress: 0,    locked: true  },
]

const LEADERBOARD = [
  { rank: 1,  name: 'Aiko T.',    chapter: 'Tokyo',     xp: 4820, delta: +120 },
  { rank: 2,  name: 'Rohan M.',   chapter: 'Mumbai',    xp: 4710, delta: +85  },
  { rank: 3,  name: 'Sofia L.',   chapter: 'Madrid',    xp: 4605, delta: +60  },
  { rank: 4,  name: 'You',        chapter: 'Singapore', xp: 4340, delta: +340, isMe: true },
  { rank: 5,  name: 'Jin W.',     chapter: 'Singapore', xp: 4290, delta: +30  },
]

const CHALLENGES_DATA = [
  { id: 'ch1', title: 'Weekly Stock Pitch',       ends: '2d 14h', prize: '500 XP', entrants: 142, joined: true  },
  { id: 'ch2', title: 'M&A Case Study Sprint',    ends: '5d 3h',  prize: '800 XP', entrants: 88,  joined: false },
  { id: 'ch3', title: 'Macro Forecasting Round',  ends: '6d 22h', prize: '350 XP', entrants: 67,  joined: false },
]

const CLUB_POSTS = [
  { author: 'Rohan M.',   time: '2h ago',  text: "Great breakdown on the Fed's latest move. Anyone catching the FOMC meeting tomorrow?", likes: 12, comments: 4  },
  { author: 'Aisha K.',   time: '5h ago',  text: "Shared my DCF model for Apple — feedback welcome. Assuming 8% WACC and 3% terminal growth.", likes: 8, comments: 6  },
  { author: 'James T.',   time: '1d ago',  text: "Reminder: chapter meeting on Friday. We'll be doing a live stock pitch competition.", likes: 21, comments: 9  },
]

const BADGES = [
  { emoji: '🔥', label: '30-Day Streak' },
  { emoji: '📈', label: 'Market Maven'  },
  { emoji: '🏆', label: 'Top 10%'       },
  { emoji: '⚡', label: 'Speed Learner' },
  { emoji: '💼', label: 'IB Expert'     },
  { emoji: '🌏', label: 'Global Rank'   },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────
const slide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
}

// ─── Glass toggle switch ──────────────────────────────────────────────────────
function GlassToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        flexShrink: 0,
        width: 51,
        height: 31,
        borderRadius: 16,
        background: value ? O : 'rgba(120,120,128,0.16)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: `1px solid ${value ? 'rgba(253,118,26,0.35)' : 'rgba(255,255,255,0.55)'}`,
        boxShadow: value
          ? '0 0 0 3px rgba(253,118,26,0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 8px rgba(10,31,68,0.06)',
        transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 27,
          height: 27,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '0.5px solid rgba(0,0,0,0.04)',
        }}
      />
    </motion.button>
  )
}

// ─── Glass bottom nav (displacement filter) ───────────────────────────────────
function GlassBottomNav({ active, setActive }: { active: NavTab; setActive: (id: NavTab) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [filterStyle, setFilterStyle] = useState<{ backdropFilter: string; WebkitBackdropFilter: string }>({
    backdropFilter: 'blur(32px) saturate(200%)',
    WebkitBackdropFilter: 'blur(32px) saturate(200%)',
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (w > 0 && h > 0) {
        setFilterStyle(buildGlassFilter({ width: w, height: h, radius: 0, depth: 8, strength: 55, blur: 8, saturate: 2.0, brightness: 1.04 }))
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="absolute bottom-0 inset-x-0 flex items-center justify-around px-1"
      style={{
        background: supportsBackdropFilterUrl ? 'rgba(247,249,251,0.55)' : 'rgba(255,255,255,0.82)',
        ...filterStyle,
        borderTop: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 -8px 32px rgba(10,31,68,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {NAV_ITEMS.map(({ id, Icon, label }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => setActive(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl">
            <motion.div animate={{ scale: isActive ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Icon size={20} style={{ color: isActive ? O : GT }}/>
            </motion.div>
            <span className="text-[9px] font-semibold" style={{ color: isActive ? O : GT }}>{label}</span>
            {isActive && (
              <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full" style={{ background: O }}/>
            )}
          </button>
        )
      })}
    </div>
  )
}

function Tag({ text }: { text: string }) {
  return (
    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4', letterSpacing: '0.07em' }}>
      {text}
    </span>
  )
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-bold" style={{ color: MT }}>{title}</h2>
      {action && <button className="text-xs font-semibold" style={{ color: O }}>{action}</button>}
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function AppDemo() {
  const { profile, user, signOut } = useDesktopAuth()

  const [screen,         setScreen]  = useState<Screen>('onboarding')
  const [navTab,         setNavTab]  = useState<NavTab>('home')
  const [selectedTopics, setTopics]  = useState<Set<string>>(new Set())
  const [xp,             setXp]      = useState(0)
  const [streak,         setStreak]  = useState(0)
  const [freezes,        setFreezes] = useState(1)
  const [portfolio,      setPortfolio] = useState(14200)
  const [answer,         setAnswer]  = useState<string|null>(null)
  const [showHint,       setShowHint] = useState(false)
  const [answered,       setAnswered] = useState(false)
  const [xpPop,          setXpPop]   = useState(false)

  // Seed xp/streak from real profile
  useEffect(() => {
    if (profile) {
      setXp(profile.xp)
      setStreak(profile.streak)
    }
  }, [profile])

  // Persist XP gain to Supabase
  const addXp = useCallback(async (amount: number) => {
    setXp(v => v + amount)
    setXpPop(true)
    setTimeout(() => setXpPop(false), 2000)
    if (user) {
      await supabase
        .from('profiles')
        .update({ xp: (profile?.xp ?? 0) + amount })
        .eq('id', user.id)
    }
  }, [user, profile])

  useEffect(() => {
    const t = setInterval(() => setPortfolio(v => Math.round(v + (Math.random() - 0.48) * 40)), 3000)
    return () => clearInterval(t)
  }, [])

  function toggleTopic(id: string) {
    setTopics(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function submitAnswer(id: string) {
    if (answered) return
    setAnswer(id); setAnswered(true)
    if (QUIZ.options.find(o => o.id === id)?.correct) {
      addXp(QUIZ.xp)
    }
  }

  function switchNav(tab: NavTab) { setNavTab(tab); setScreen('main') }

  const isCorrect = answered && QUIZ.options.find(o => o.id === answer)?.correct

  // which main-tab content to render
  const mainContent: Record<NavTab, React.ReactNode> = {
    home:       <HomeTab xp={xp} streak={streak} freezes={freezes} portfolio={portfolio}
                         displayName={profile?.display_name ?? undefined}
                         onLesson={() => setScreen('lesson')} onStreak={() => setScreen('streak')} />,
    discover:   <DiscoverTab onLesson={() => setScreen('lesson')} />,
    challenges: <ChallengesTab xp={xp} userId={user?.id} />,
    clubs:      <ClubsTab userId={user?.id} memberType={profile?.member_type}
                          onJoinClub={() => setScreen('joinClub')} onCreateClub={() => setScreen('createClub')} />,
    social:     <SocialTab userId={user?.id} memberType={profile?.member_type} onGoToClub={() => setNavTab('clubs')} />,
    profile:    <ProfileTab xp={xp} streak={streak} profile={profile} onSignOut={signOut} onSettings={() => setScreen('settings')} />,
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20" style={{ background: '#e5e7eb' }}>
      <div className="relative w-[390px] h-[844px] rounded-[44px] shadow-2xl overflow-hidden border-4 border-gray-300 flex flex-col"
           style={{ fontFamily: 'Inter, system-ui, sans-serif', background: BG }}>

        {/* SVG filter defs for liquid glass */}
        <svg style={{position:'absolute',width:0,height:0,overflow:'hidden'}} aria-hidden="true">
          <defs>
            <filter id="lg-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/>
            </filter>
          </defs>
        </svg>

        {/* Status bar */}
        <div className="h-11 flex items-center justify-between px-8 flex-shrink-0" style={{ background: BG }}>
          <span className="text-xs font-semibold" style={{ color: MT }}>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3.5 h-2 rounded-sm opacity-80" style={{ background: MT }}/>
            <div className="w-1 h-1 rounded-full opacity-60" style={{ background: MT }}/>
          </div>
        </div>

        {/* Screen area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">

            {/* ── Onboarding ── */}
            {screen === 'onboarding' && (
              <motion.div key="onboarding" {...slide} className="absolute inset-0 overflow-y-auto">
                <OnboardingScreen topics={selectedTopics} toggle={toggleTopic}
                  onContinue={() => { setScreen('main'); setNavTab('home') }} />
              </motion.div>
            )}

            {/* ── Main shell (tabs) ── */}
            {screen === 'main' && (
              <motion.div key={`main-${navTab}`} {...slide} className="absolute inset-0 flex flex-col">
                <div className="flex-1 overflow-y-auto pb-16">
                  {mainContent[navTab]}
                </div>
                <GlassBottomNav active={navTab} setActive={switchNav} />
              </motion.div>
            )}

            {/* ── Lesson ── */}
            {screen === 'lesson' && (
              <motion.div key="lesson" {...slide} className="absolute inset-0 overflow-y-auto">
                <LessonScreen xp={xp} answer={answer} answered={answered} showHint={showHint}
                  xpPop={xpPop} isCorrect={!!isCorrect}
                  onSelect={submitAnswer} onHint={() => setShowHint(true)}
                  onContinue={() => { setStreak(v => v + 1); setScreen('streak') }}
                  onBack={() => setScreen('main')} />
              </motion.div>
            )}

            {/* ── Streak ── */}
            {screen === 'streak' && (
              <motion.div key="streak" {...slide} className="absolute inset-0 overflow-y-auto">
                <StreakScreen streak={streak} freezes={freezes}
                  onKeep={() => setScreen('main')}
                  onFreeze={() => { setFreezes(v => Math.max(0, v - 1)); setScreen('main') }} />
              </motion.div>
            )}

            {/* ── Settings ── */}
            {screen === 'settings' && (
              <motion.div key="settings" {...slide} className="absolute inset-0 overflow-y-auto">
                <SettingsScreen onBack={() => setScreen('main')} />
              </motion.div>
            )}

            {/* ── Join Club ── */}
            {screen === 'joinClub' && (
              <motion.div key="joinClub" {...slide} className="absolute inset-0 overflow-y-auto">
                <JoinClubScreen
                  onBack={() => setScreen('main')}
                  onJoined={() => { setScreen('main'); setNavTab('clubs') }} />
              </motion.div>
            )}

            {/* ── Create Club ── */}
            {screen === 'createClub' && (
              <motion.div key="createClub" {...slide} className="absolute inset-0 overflow-y-auto">
                <CreateClubScreen
                  onBack={() => setScreen('main')}
                  onCreated={() => { setScreen('main'); setNavTab('clubs') }} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Home indicator */}
        <div className="h-6 flex items-center justify-center flex-shrink-0" style={{ background: BG }}>
          <div className="w-28 h-1 rounded-full" style={{ background: `${MT}30` }}/>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function OnboardingScreen({ topics, toggle, onContinue }: {
  topics: Set<string>; toggle: (id: string) => void; onContinue: () => void
}) {
  return (
    <div className="min-h-full px-5 pb-8" style={{ background: BG }}>
      <div className="pt-4 pb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: N }}>
            <BookOpen size={14} className="text-white"/>
          </div>
          <span className="font-bold text-sm" style={{ color: N }}>The Ledger</span>
        </div>
        <h1 className="text-2xl font-extrabold leading-tight mb-2" style={{ color: MT, letterSpacing: '-0.02em' }}>
          What do you want<br/>to master?
        </h1>
        <p className="text-sm" style={{ color: ST }}>Pick everything that interests you.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TOPICS.map((t, i) => {
          const sel = topics.has(t.id)
          return (
            <motion.button key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
              onClick={() => toggle(t.id)}
              className="relative flex flex-col items-start gap-2 rounded-2xl p-4 border-2 text-left"
              style={{
                background: sel ? N : W,
                borderColor: sel ? O : '#e6e8ea',
                boxShadow: sel ? '0 4px 16px rgba(10,31,68,0.12)' : SH,
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: sel ? 'rgba(253,118,26,0.2)' : CA, color: sel ? O : ST }}>
                {t.icon}
              </div>
              <span className="text-sm font-semibold leading-tight" style={{ color: sel ? W : MT }}>{t.label}</span>
              {sel && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                  <CheckCircle2 size={16} style={{ color: O }}/>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="text-xs text-center mb-5" style={{ color: GT }}>You can always change this later.</p>

      <motion.button whileTap={{ scale: 0.97 }} onClick={onContinue} disabled={topics.size === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-semibold"
        style={{
          background: topics.size > 0 ? O : CA,
          color: topics.size > 0 ? W : GT,
          boxShadow: topics.size > 0 ? '0 4px 20px rgba(249,115,22,0.35)' : 'none',
        }}>
        Continue <ArrowRight size={18}/>
      </motion.button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME TAB
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({ xp, streak, freezes, portfolio, displayName, onLesson, onStreak }: {
  xp: number; streak: number; freezes: number; portfolio: number
  displayName?: string
  onLesson: () => void; onStreak: () => void
}) {
  const isUp = portfolio >= 14200
  const firstName = displayName?.split(' ')[0] ?? 'there'
  return (
    <div className="px-5 pt-4 pb-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GT }}>Good morning, {firstName}</p>
          <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>The Ledger</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full" style={{ background: O }}>
            <Star size={11} className="text-white"/><span className="text-[11px] font-bold text-white">{xp} XP</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onStreak}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full" style={{ background: N }}>
            <Flame size={11} style={{ color: O }}/><span className="text-[11px] font-bold text-white">{streak}</span>
          </motion.button>
        </div>
      </div>

      {/* Streak card */}
      <div className="rounded-2xl p-4 mb-4" style={{ ...GLASS, boxShadow: SH }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={15} style={{ color: O }}/>
            <span className="text-sm font-semibold" style={{ color: MT }}>{streak}-day streak 🔥</span>
          </div>
          {freezes > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                 style={{ background: '#d9e2ff', color: N }}>
              <Snowflake size={10}/> Freeze
            </div>
          )}
        </div>
        <div className="flex justify-between">
          {WEEK_DAYS.map((d, i) => {
            const done = i < 5
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: i * 0.05 } }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={done ? { background: N, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' } : { ...GLASS_ICON }}>
                  {done ? <Check size={13} className="text-white"/> : <span className="text-[10px]" style={{ color: GT }}>{d}</span>}
                </motion.div>
                <span className="text-[9px] font-medium" style={{ color: done ? N : '#c5c6cf' }}>{d}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lessons */}
      <SectionHeader title="Today's Lessons" action="See all" />
      <motion.button whileTap={{ scale: 0.98 }} onClick={onLesson}
        className="w-full text-left rounded-2xl p-4 mb-3" style={{ background: N, boxShadow: SHD }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <Tag text="Investment Banking" />
            <p className="text-sm font-semibold text-white mt-1 leading-snug">How M&A Deals<br/>Are Structured</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ ...GLASS_DARK, background: 'rgba(253,118,26,0.22)' }}>
            <BookOpen size={14} style={{ color: O }}/>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#7687b2' }}>8 min</span>
            <span className="w-1 h-1 rounded-full" style={{ background: '#4c5e86' }}/>
            <div className="flex items-center gap-1">
              <Star size={10} style={{ color: O }}/><span className="text-xs font-medium" style={{ color: O }}>+15 XP</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ background: O }}>
            <span className="text-xs font-semibold text-white">Continue</span>
            <ChevronRight size={12} className="text-white"/>
          </div>
        </div>
      </motion.button>

      <div className="rounded-2xl p-4 mb-4 opacity-55" style={{ ...GLASS, boxShadow: SH }}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>Accounting</span>
            <p className="text-sm font-semibold mt-0.5" style={{ color: MT }}>Reading a Balance Sheet</p>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ ...GLASS_ICON }}>
            <Lock size={13} style={{ color: GT }}/>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: GT }}>6 min · Complete previous lesson first</p>
      </div>

      {/* Market + Portfolio */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ ...GLASS, boxShadow: SH }}>
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={12} style={{ color: '#22c55e' }}/>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>Market</span>
          </div>
          <p className="text-[15px] font-bold" style={{ color: '#22c55e' }}>Bullish</p>
          <p className="text-[10px] mt-0.5" style={{ color: GT }}>S&P +1.4% today</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: N, boxShadow: SHD }}>
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign size={12} style={{ color: O }}/>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Portfolio Sim</span>
          </div>
          <motion.p key={portfolio} initial={{ opacity: 0.6, y: -3 }} animate={{ opacity: 1, y: 0 }}
            className="text-[15px] font-bold text-white">
            ${portfolio.toLocaleString()}
          </motion.p>
          <p className="text-[10px] mt-0.5" style={{ color: isUp ? '#22c55e' : '#ef4444' }}>
            {isUp ? '▲' : '▼'} {Math.abs(portfolio - 14200).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOVER TAB
// ═══════════════════════════════════════════════════════════════════════════════
const DISCOVER_CATS = ['All', 'Markets', 'Banking', 'Accounting', 'Macro', 'Modeling']

const FEATURED = [
  { tag: 'TRENDING', title: 'The Fed & Interest Rates Explained', mins: 7,  xp: 14, color: N },
  { tag: 'NEW',      title: 'Private Equity Deal Structures',     mins: 10, xp: 20, color: '#1a1000' },
  { tag: 'POPULAR',  title: 'Options 101: Calls & Puts',          mins: 6,  xp: 12, color: '#0a2b1f' },
]

function DiscoverTab({ onLesson }: { onLesson: () => void }) {
  const [cat, setCat] = useState('All')

  return (
    <div className="pt-4 pb-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>Discover</h1>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ ...GLASS_ICON }}>
          <Filter size={16} style={{ color: ST }}/>
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ ...GLASS }}>
          <Search size={16} style={{ color: GT }}/>
          <span className="text-sm" style={{ color: GT }}>Search courses, topics…</span>
        </div>
      </div>

      {/* Featured horizontal scroll */}
      <div className="mb-5">
        <SectionHeader title="Featured" action="See all" />
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
          {FEATURED.map((f, i) => (
            <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={onLesson}
              className="flex-shrink-0 w-52 rounded-2xl p-4 text-left"
              style={{ background: f.color, boxShadow: SHD }}>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: O }}>{f.tag}</span>
              <p className="text-sm font-semibold text-white mt-2 leading-snug">{f.title}</p>
              <div className="flex items-center gap-2 mt-3">
                <Clock size={11} style={{ color: '#b4c6f4' }}/>
                <span className="text-[10px]" style={{ color: '#b4c6f4' }}>{f.mins} min</span>
                <span style={{ color: '#4c5e86' }}>·</span>
                <Star size={10} style={{ color: O }}/>
                <span className="text-[10px]" style={{ color: O }}>+{f.xp} XP</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-1 mb-4 no-scrollbar">
        {DISCOVER_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
            style={cat === c
              ? { background: N, color: W, border: `1.5px solid ${N}`, boxShadow: '0 2px 8px rgba(10,31,68,0.2)' }
              : { ...GLASS, border: '1.5px solid rgba(255,255,255,0.6)', color: ST }
            }>
            {c}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="px-5">
        <SectionHeader title="All Courses" />
        <div className="flex flex-col gap-3">
          {COURSES.map((c, i) => (
            <motion.button key={c.id} whileTap={c.locked ? {} : { scale: 0.98 }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
              onClick={c.locked ? undefined : onLesson}
              className="flex items-center gap-3 rounded-2xl p-4 text-left"
              style={{ ...GLASS, boxShadow: SH, opacity: c.locked ? 0.55 : 1 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={c.locked ? { ...GLASS_ICON } : { background: N, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                {c.locked ? <Lock size={14} style={{ color: GT }}/> : <Play size={14} className="text-white"/>}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>{c.tag}</span>
                <p className="text-sm font-semibold leading-snug truncate" style={{ color: MT }}>{c.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px]" style={{ color: GT }}>{c.mins} min</span>
                  <span style={{ color: '#c5c6cf' }}>·</span>
                  <Star size={9} style={{ color: O }}/>
                  <span className="text-[10px]" style={{ color: O }}>+{c.xp} XP</span>
                </div>
              </div>
              {c.progress > 0 && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-semibold" style={{ color: O }}>{Math.round(c.progress * 100)}%</span>
                  <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ ...GLASS_TRACK }}>
                    <div className="h-full rounded-full" style={{ width: `${c.progress * 100}%`, background: O }}/>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGES TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ChallengesTab({ xp, userId }: { xp: number; userId?: string }) {
  const [joined, setJoined] = useState<Set<string>>(new Set(['ch1']))
  const { entries, myRank, loading: lbLoading } = useLeaderboard(userId)

  const nextMilestone = Math.ceil((xp + 1) / 500) * 500
  const xpProgress = xp % 500
  const xpPct = Math.min((xpProgress / 500) * 100, 100)

  return (
    <div className="pt-4 pb-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>Challenges</h1>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full" style={{ background: O }}>
          <Trophy size={11} className="text-white"/>
          <span className="text-[11px] font-bold text-white">
            {myRank ? `Rank #${myRank}` : '—'}
          </span>
        </div>
      </div>

      {/* Your rank hero */}
      <div className="mx-5 rounded-2xl p-5 mb-5" style={{ background: N, boxShadow: SHD }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>Your Global Rank</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white leading-none">
                {myRank ? `#${myRank}` : '—'}
              </span>
              <span className="text-sm font-semibold mb-1" style={{ color: '#7687b2' }}>
                of {entries.length > 0 ? `${entries.length}+` : '…'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Total XP</span>
            <span className="text-lg font-bold text-white">{xp.toLocaleString()}</span>
          </div>
        </div>
        {/* XP bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: '#7687b2' }}>{xp.toLocaleString()} XP</span>
            <span className="text-[10px]" style={{ color: '#7687b2' }}>Next: {nextMilestone.toLocaleString()} XP</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ ...GLASS_DARK, background: 'rgba(255,255,255,0.14)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full" style={{ background: O, boxShadow: '0 0 8px rgba(253,118,26,0.5)' }}/>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-5 mb-5">
        <SectionHeader title="Leaderboard" action="Full table" />
        {lbLoading ? (
          <p className="text-xs" style={{ color: GT }}>Loading…</p>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: W, boxShadow: SH }}>
            <p className="text-xs" style={{ color: GT }}>No members yet. Be the first!</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 16px rgba(10,31,68,0.05), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
            {entries.map((e, i) => (
              <div key={e.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: e.isMe ? '#f0f4ff' : W,
                  borderBottom: i < entries.length - 1 ? '1px solid #eceef0' : 'none',
                }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : e.isMe ? N : CA }}>
                  {i < 3
                    ? <Crown size={12} className="text-white"/>
                    : <span className="text-[10px] font-bold" style={{ color: e.isMe ? W : GT }}>{e.rank}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: e.isMe ? N : MT }}>
                    {e.display_name ?? 'Unknown'} {e.isMe && '(You)'}
                  </p>
                  <p className="text-[10px]" style={{ color: GT }}>{e.country ?? '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: e.isMe ? O : MT }}>{e.xp.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active challenges */}
      <div className="px-5">
        <SectionHeader title="Active Challenges" />
        <div className="flex flex-col gap-3">
          {CHALLENGES_DATA.map((ch, i) => {
            const isJoined = joined.has(ch.id)
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
                className="rounded-2xl p-4" style={{ ...GLASS, boxShadow: SH }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-semibold leading-snug" style={{ color: MT }}>{ch.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} style={{ color: GT }}/>
                      <span className="text-[10px]" style={{ color: GT }}>Ends in {ch.ends}</span>
                      <span style={{ color: '#c5c6cf' }}>·</span>
                      <Users size={10} style={{ color: GT }}/>
                      <span className="text-[10px]" style={{ color: GT }}>{ch.entrants} entered</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full flex-shrink-0"
                       style={{ background: '#d9e2ff' }}>
                    <Trophy size={10} style={{ color: N }}/>
                    <span className="text-[10px] font-bold" style={{ color: N }}>{ch.prize}</span>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => setJoined(prev => { const n = new Set(prev); isJoined ? n.delete(ch.id) : n.add(ch.id); return n })}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: isJoined ? '#dcfce7' : O,
                    color: isJoined ? '#16a34a' : W,
                    border: isJoined ? '1.5px solid #22c55e' : 'none',
                  }}>
                  {isJoined ? <><Check size={14}/> Joined</> : <><Plus size={14}/> Join Challenge</>}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLUBS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function ClubsTab({ userId, memberType, onJoinClub, onCreateClub }: {
  userId?: string
  memberType?: string
  onJoinClub?: () => void
  onCreateClub?: () => void
}) {
  const { club, members, posts, stats, loading } = useMyClub(userId)
  const [liked, setLiked]       = useState<Set<string>>(new Set())
  const [newPost, setNewPost]   = useState('')
  const [posting, setPosting]   = useState(false)

  async function submitPost() {
    if (!newPost.trim() || !club || !userId) return
    setPosting(true)
    await supabase.from('club_posts').insert({ club_id: club.id, user_id: userId, content: newPost.trim() })
    setNewPost('')
    setPosting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: GT }}>Loading…</p>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="pt-4 pb-4 px-5" style={{ background: BG }}>
        <h1 className="text-xl font-bold mb-2" style={{ color: MT }}>Clubs</h1>
        <p className="text-sm mb-6" style={{ color: GT }}>You haven't joined or created a club yet.</p>
        <div className="rounded-2xl p-5 text-center" style={{ background: W, boxShadow: SH }}>
          <Users size={32} style={{ color: N, margin: '0 auto 12px' }}/>
          <p className="text-sm font-semibold mb-1" style={{ color: MT }}>No club yet</p>
          {memberType === 'club_member' ? (
            <>
              <p className="text-xs leading-relaxed mb-4" style={{ color: GT }}>Find and join a chapter near you.</p>
              <button onClick={onJoinClub}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: N }}>
                Join a Club
              </button>
            </>
          ) : memberType === 'club_president' ? (
            <>
              <p className="text-xs leading-relaxed mb-4" style={{ color: GT }}>Start a chapter at your school.</p>
              <button onClick={onCreateClub}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: O }}>
                Create Your Club
              </button>
            </>
          ) : (
            <p className="text-xs leading-relaxed" style={{ color: GT }}>
              Upgrade your account in Settings to join or create a club.
            </p>
          )}
        </div>
      </div>
    )
  }

  const memberCount = stats?.member_count ?? members.length

  return (
    <div className="pt-4 pb-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GT }}>Your Chapter</p>
          <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>{club.name}</h1>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: CA }}>
          <Bell size={16} style={{ color: ST }}/>
        </button>
      </div>

      {/* Chapter card */}
      <div className="mx-5 rounded-2xl p-5 mb-5" style={{ background: N, boxShadow: SHD, position: 'relative', overflow: 'hidden' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>Chapter Stats</p>
            <p className="text-2xl font-extrabold text-white leading-none">{memberCount} {memberCount === 1 ? 'Member' : 'Members'}</p>
          </div>
          {club.country && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>Location</p>
              <p className="text-base font-bold text-white">{club.country}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            [stats?.total_xp?.toLocaleString() ?? '0', 'Total XP'],
            [club.school ?? '—', 'School'],
            [stats?.competition_count?.toString() ?? '0', 'Competitions'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-bold text-white truncate">{val}</p>
              <p className="text-[9px]" style={{ color: '#7687b2' }}>{lbl}</p>
            </div>
          ))}
        </div>
        <div style={{position:'absolute',inset:0,borderRadius:'inherit',background:'linear-gradient(135deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.04) 50%,rgba(255,255,255,0.09) 100%)',pointerEvents:'none',border:'1px solid rgba(255,255,255,0.16)'}}/>
      </div>

      {/* Members */}
      <div className="px-5 mb-5">
        <SectionHeader title="Members" action={`See all ${memberCount}`} />
        {members.length === 0 ? (
          <p className="text-xs" style={{ color: GT }}>No members yet.</p>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
            {members.slice(0, 5).map((m, i) => {
              const isMe = m.user_id === userId
              const initials = (m.display_name ?? '?')[0].toUpperCase()
              return (
                <div key={m.user_id} className="flex items-center gap-3 px-4 py-3"
                  style={{ background: isMe ? '#f0f4ff' : W, borderBottom: i < Math.min(members.length, 5) - 1 ? '1px solid #eceef0' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                       style={{ background: isMe ? O : N }}>
                    {initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: isMe ? N : MT }}>
                      {m.display_name ?? 'Unknown'}{isMe ? ' (You)' : ''}
                    </p>
                    <p className="text-[10px]" style={{ color: GT }}>{m.custom_role ?? 'Member'} · {m.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Post feed */}
      <div className="px-5">
        <SectionHeader title="Discussion" />

        {/* Compose */}
        <div className="rounded-2xl p-3 mb-3 flex gap-2" style={{ background: W, boxShadow: SH }}>
          <input
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Post to your chapter…"
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: MT }}
          />
          <button onClick={submitPost} disabled={posting || !newPost.trim()}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: newPost.trim() ? O : CA, transition: 'background 0.15s' }}>
            Post
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: GT }}>No posts yet. Be the first.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
                className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px) saturate(150%)', WebkitBackdropFilter: 'blur(16px) saturate(150%)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 16px rgba(10,31,68,0.05), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                       style={{ background: N }}>{(p.display_name ?? '?')[0].toUpperCase()}</div>
                  <div>
                    <p className="text-[11px] font-bold" style={{ color: MT }}>{p.display_name ?? 'Unknown'}</p>
                    <p className="text-[9px]" style={{ color: GT }}>{timeAgo(p.created_at)}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: ST }}>{p.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1"
                    onClick={() => setLiked(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })}>
                    <Heart size={13} style={{ color: liked.has(p.id) ? '#ef4444' : GT, fill: liked.has(p.id) ? '#ef4444' : 'none' }}/>
                    <span className="text-[10px]" style={{ color: GT }}>{liked.has(p.id) ? 1 : 0}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    <MessageCircle size={13} style={{ color: GT }}/>
                  </button>
                  <button className="flex items-center gap-1">
                    <Share2 size={13} style={{ color: GT }}/>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════════════════════════════════
const HISTORY = [
  { tag: 'INVESTMENT BANKING', title: 'Intro to LBO Modelling',         xp: 20, date: 'Yesterday'  },
  { tag: 'STOCK MARKETS',      title: 'Technical Analysis Basics',       xp: 12, date: '2 days ago' },
  { tag: 'ECONOMICS',          title: 'Supply, Demand & Equilibrium',    xp: 10, date: '3 days ago' },
]

function ProfileTab({ xp, streak, profile, onSignOut, onSettings }: {
  xp: number; streak: number
  profile: import('../contexts/DesktopAuth').Profile | null
  onSignOut: () => void
  onSettings: () => void
}) {
  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500
  const xpToNext = 500
  const displayName = profile?.display_name ?? 'You'
  const initial = displayName[0].toUpperCase()
  const memberLabel = profile?.member_type === 'club_president'
    ? 'Club President'
    : profile?.member_type === 'club_member'
    ? 'Club Member'
    : 'Explorer'

  return (
    <div className="pt-4 pb-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-4">
        <h1 className="text-xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>Profile</h1>
        <button onClick={onSettings} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ ...GLASS_ICON }}>
          <Settings size={16} style={{ color: ST }}/>
        </button>
      </div>

      {/* Profile hero */}
      <div className="mx-5 rounded-2xl p-5 mb-5 text-center" style={{ background: N, boxShadow: SHD + ', inset 0 1px 0 rgba(255,255,255,0.3)', position: 'relative', overflow: 'hidden' }}>
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-black text-white"
             style={{ background: O, boxShadow: `0 0 0 3px ${N}, 0 0 0 5px ${O}` }}>
          {initial}
        </div>
        <p className="text-base font-bold text-white">{displayName}</p>
        <p className="text-[11px] mb-3" style={{ color: '#7687b2' }}>{memberLabel}</p>
        {/* Level badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
             style={{ background: 'rgba(253,118,26,0.18)' }}>
          <Medal size={13} style={{ color: O }}/>
          <span className="text-xs font-bold" style={{ color: O }}>Level {level} — Analyst</span>
        </div>
        {/* XP bar */}
        <div className="flex justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: '#7687b2' }}>{xp} XP</span>
          <span className="text-[10px]" style={{ color: '#7687b2' }}>Lv.{level + 1}: {(level) * 500} XP</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ ...GLASS_DARK, background: 'rgba(255,255,255,0.14)' }}>
          <motion.div initial={{ width: 0 }}
            animate={{ width: `${(xpInLevel / xpToNext) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full" style={{ background: O }}/>
        </div>
        <div style={{position:'absolute',inset:0,borderRadius:'inherit',background:'linear-gradient(135deg,rgba(255,255,255,0.14) 0%,rgba(255,255,255,0.04) 50%,rgba(255,255,255,0.09) 100%)',pointerEvents:'none',border:'1px solid rgba(255,255,255,0.16)'}}/>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Flame size={16} style={{ color: O }}/>,       val: streak, label: 'Day Streak' },
            { icon: <BookOpen size={16} style={{ color: N }}/>,    val: 14,     label: 'Lessons Done' },
            { icon: <Trophy size={16} style={{ color: '#fbbf24' }}/>, val: '#4',    label: 'Global Rank' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.08 } }}
              className="rounded-2xl p-3 text-center" style={{ ...GLASS, boxShadow: SH }}>
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-base font-extrabold" style={{ color: MT }}>{s.val}</p>
              <p className="text-[9px] font-medium" style={{ color: GT }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mb-5">
        <SectionHeader title="Badges" action={`${BADGES.length} earned`} />
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
              className="rounded-2xl p-3 flex flex-col items-center gap-1"
              style={{ ...GLASS, boxShadow: SH }}>
              <span className="text-2xl">{b.emoji}</span>
              <p className="text-[9px] font-semibold text-center leading-tight" style={{ color: ST }}>{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completion history */}
      <div className="px-5 mb-5">
        <SectionHeader title="Recent Activity" />
        <div className="flex flex-col gap-2">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl p-4" style={{ ...GLASS, boxShadow: SH }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: N, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                <BookOpen size={14} className="text-white"/>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>{h.tag}</span>
                <p className="text-xs font-semibold truncate" style={{ color: MT }}>{h.title}</p>
                <p className="text-[9px]" style={{ color: GT }}>{h.date}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
                   style={{ background: '#d9e2ff' }}>
                <Star size={9} style={{ color: N }}/><span className="text-[10px] font-bold" style={{ color: N }}>+{h.xp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings list */}
      <div className="px-5">
        <div className="rounded-2xl overflow-hidden" style={{ ...GLASS, boxShadow: SH }}>
          {[
            { icon: <Shield size={15} style={{ color: N }}/>,   label: 'Privacy & Security' },
            { icon: <Bell size={15} style={{ color: N }}/>,     label: 'Notifications'       },
            { icon: <Globe size={15} style={{ color: N }}/>,    label: 'Language & Region'   },
            { icon: <LogOut size={15} style={{ color: '#ef4444' }}/>, label: 'Sign Out', red: true, action: onSignOut },
          ].map((item, i, arr) => (
            <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #eceef0' : 'none' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                   style={item.red ? { background: 'rgba(254,226,226,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,200,200,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' } : { ...GLASS_ICON }}>
                {item.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: item.red ? '#ef4444' : MT }}>{item.label}</span>
              {!item.red && <ChevronRight size={14} style={{ color: GT, marginLeft: 'auto' }}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LESSON SCREEN (full-screen overlay)
// ═══════════════════════════════════════════════════════════════════════════════
function LessonScreen({ xp, answer, answered, showHint, xpPop, isCorrect, onSelect, onHint, onContinue, onBack }: {
  xp: number; answer: string|null; answered: boolean; showHint: boolean
  xpPop: boolean; isCorrect: boolean
  onSelect: (id: string) => void; onHint: () => void; onContinue: () => void; onBack: () => void
}) {
  const q = QUIZ
  return (
    <div className="flex flex-col min-h-full px-5 pb-8" style={{ background: BG }}>
      <div className="flex items-center justify-between pt-4 mb-4">
        <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ ...GLASS_ICON }}>
          <X size={16} style={{ color: ST }}/>
        </button>
        <div className="flex items-center gap-2">
          <Star size={13} style={{ color: O }}/><span className="text-sm font-bold" style={{ color: MT }}>{xp} XP</span>
        </div>
        <button onClick={onHint} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ ...GLASS_ICON }}>
          <HelpCircle size={16} style={{ color: ST }}/>
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: ST }}>{q.course} · Lesson {q.lesson}/{q.total}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ ...GLASS_TRACK }}>
          <motion.div initial={{ width: `${((q.lesson-1)/q.total)*100}%` }}
            animate={{ width: `${(q.lesson/q.total)*100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full" style={{ background: O }}/>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: N }}>
        <Tag text={q.module}/>
        <div className="flex items-center gap-1.5 mt-2">
          <Award size={13} style={{ color: O }}/>
          <span className="text-xs font-medium" style={{ color: O }}>+{q.xp} XP on correct answer</span>
        </div>
      </div>

      <p className="text-base font-semibold mb-5 leading-snug" style={{ color: MT, letterSpacing: '-0.01em' }}>{q.prompt}</p>

      <AnimatePresence>
        {showHint && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="mb-4 rounded-xl p-3 flex gap-2" style={{ background: '#d9e2ff' }}>
            <Lightbulb size={14} style={{ color: N, flexShrink: 0, marginTop: 1 }}/>
            <p className="text-xs leading-relaxed" style={{ color: N }}>{q.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 mb-6">
        {q.options.map((opt, i) => {
          const sel = answer === opt.id
          const correct = answered && opt.correct
          const wrong   = answered && sel && !opt.correct
          return (
            <motion.button key={opt.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.08 } }}
              whileTap={answered ? {} : { scale: 0.98 }} onClick={() => onSelect(opt.id)}
              className="flex items-center gap-3 rounded-2xl p-4 text-left border-2 transition-all"
              style={{
                background: correct ? '#dcfce7' : wrong ? '#fee2e2' : sel ? '#d9e2ff' : W,
                borderColor: correct ? '#22c55e' : wrong ? '#ef4444' : sel ? N : '#e6e8ea',
                boxShadow: SH,
              }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                   style={{ background: correct ? '#22c55e' : wrong ? '#ef4444' : sel ? N : CA,
                            color: (correct||wrong||sel) ? W : ST }}>
                {correct ? <Check size={13}/> : wrong ? <X size={13}/> : opt.id.toUpperCase()}
              </div>
              <span className="text-sm font-medium leading-snug" style={{ color: MT }}>{opt.text}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {xpPop && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl flex items-center gap-2 z-50"
            style={{ background: O, boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
            <Star size={16} className="text-white"/>
            <span className="text-white font-bold">+{q.xp} XP!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {answered ? (
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }} onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white mt-auto"
          style={{ background: isCorrect ? O : N, boxShadow: isCorrect ? '0 4px 20px rgba(249,115,22,0.35)' : '0 4px 20px rgba(10,31,68,0.25)' }}>
          {isCorrect ? '🎉 Nice work! Continue' : 'Continue'} <ArrowRight size={18}/>
        </motion.button>
      ) : (
        <button onClick={onHint}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium mt-auto border"
          style={{ borderColor: '#c5c6cf', color: ST }}>
          <Lightbulb size={14}/> Need a hint?
        </button>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STREAK SCREEN (full-screen overlay)
// ═══════════════════════════════════════════════════════════════════════════════
function StreakScreen({ streak, freezes, onKeep, onFreeze }: {
  streak: number; freezes: number; onKeep: () => void; onFreeze: () => void
}) {
  return (
    <div className="flex flex-col items-center min-h-full px-5 pb-8" style={{ background: BG }}>
      <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="mt-12 mb-6 text-8xl select-none">🔥</motion.div>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="text-3xl font-extrabold mb-2 text-center" style={{ color: MT, letterSpacing: '-0.02em' }}>
        {streak}-Day Streak!
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35 } }}
        className="text-sm text-center mb-8" style={{ color: ST }}>
        You've studied every day this week.<br/>Keep the fire going.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.45 } }}
        className="w-full rounded-2xl p-5 mb-6" style={{ background: W, boxShadow: SH }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-center" style={{ color: GT }}>This Week</p>
        <div className="flex justify-between">
          {WEEK_DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.5 + i * 0.07 } }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: N }}>
                <Check size={15} className="text-white"/>
              </motion.div>
              <span className="text-[11px] font-semibold" style={{ color: N }}>{d}</span>
            </div>
          ))}
        </div>
      </motion.div>
      {freezes > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-8" style={{ background: '#d9e2ff' }}>
          <Snowflake size={13} style={{ color: N }}/>
          <span className="text-xs font-semibold" style={{ color: N }}>Streak Freeze: {freezes} remaining</span>
        </motion.div>
      )}
      <div className="w-full flex flex-col gap-3 mt-auto">
        <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
          whileTap={{ scale: 0.97 }} onClick={onKeep}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white"
          style={{ background: O, boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
          Keep My Streak <ArrowRight size={18}/>
        </motion.button>
        {freezes > 0 && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.0 } }}
            whileTap={{ scale: 0.97 }} onClick={onFreeze}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-medium text-sm border"
            style={{ borderColor: '#c5c6cf', color: ST }}>
            <Snowflake size={14}/> Use Streak Freeze
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: 'home',       Icon: Home,          label: 'Home'       },
  { id: 'discover',   Icon: Compass,       label: 'Discover'   },
  { id: 'challenges', Icon: Trophy,        label: 'Challenges' },
  { id: 'social',     Icon: MessageCircle, label: 'Social'     },
  { id: 'profile',    Icon: User,          label: 'Profile'    },
] as const

function BottomNav({ active, setActive }: { active: NavTab; setActive: (id: NavTab) => void }) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex items-center justify-around px-1 border-t"
         style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', borderTop: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 -8px 32px rgba(10,31,68,0.08), inset 0 1px 0 rgba(255,255,255,0.9)', paddingTop: '8px', paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}>
      {NAV_ITEMS.map(({ id, Icon, label }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => setActive(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl">
            <motion.div animate={{ scale: isActive ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Icon size={20} style={{ color: isActive ? O : GT }}/>
            </motion.div>
            <span className="text-[9px] font-semibold" style={{ color: isActive ? O : GT }}>{label}</span>
            {isActive && (
              <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full" style={{ background: O }}/>
            )}
          </button>
        )
      })}
    </div>
  )
}
