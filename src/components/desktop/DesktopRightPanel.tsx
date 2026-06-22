import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Play, Flame, Star, ChevronRight, Sparkles,
  Trophy, Clock, Users, Crown, Medal, ClipboardList,
  CheckCircle2, Award, TrendingUp,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ─── Local design tokens ───────────────────────────────────────────────────────
const N   = '#0A1F44'
const O   = '#fd761a'
const W   = '#ffffff'
const MT  = '#191c1e'
const ST  = '#44464e'
const GT  = '#75777f'
const CA  = '#eceef0'
const SH  = '0 2px 12px rgba(0,0,0,0.06)'
const SHD = '0 8px 24px rgba(10,31,68,0.14)'

function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: W, boxShadow: SH, ...style }}>
      {children}
    </div>
  )
}
function PanelTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold" style={{ color: MT }}>{children}</h2>
      {action && <button className="text-xs font-semibold" style={{ color: O }}>{action}</button>}
    </div>
  )
}

// ─── Static / semi-static widgets ─────────────────────────────────────────────
const CONTINUE = { cat: 'Personal Finance', title: 'Budgeting & Cash Flow', progress: 0.38, mins: 6, xp: 120 }
const RECOMMENDED = [
  { tag: 'MARKETS', title: 'Stock Market Essentials',  mins: 10, xp: 750  },
  { tag: 'IB',      title: 'Intro to LBO Modelling',   mins: 12, xp: 1000 },
  { tag: 'ECON',    title: 'Supply & Demand Basics',   mins: 8,  xp: 300  },
]
const RECENT_BADGES = [
  { emoji: '🔥', label: '30-Day Streak' },
  { emoji: '📈', label: 'Market Maven'  },
  { emoji: '⚡', label: 'Speed Learner' },
]
const ASSIGNMENTS = [
  { title: 'DCF model — Apple',  due: 'Due in 2d', done: false },
  { title: 'Read: FOMC primer',  due: 'Due in 4d', done: false },
  { title: 'Quiz: Bond basics',  due: 'Completed', done: true  },
]

// ─── Clubs tab — real data ─────────────────────────────────────────────────────
interface ClubSummary {
  id: string; name: string; member_count: number; my_role: string
}
interface TopMember {
  user_id: string; name: string; role: string; xp: number; isMe: boolean
}

function useClubsSummary() {
  const [club, setClub]     = useState<ClubSummary | null>(null)
  const [top, setTop]       = useState<TopMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: memberships } = await supabase
        .from('club_members').select('club_id, role').eq('user_id', user.id)
      if (!memberships?.length) { setLoading(false); return }

      const clubId = memberships[0].club_id

      const [{ data: clubRow }, { data: allMembers }, { data: xpRows }] = await Promise.all([
        supabase.from('clubs').select('id, name').eq('id', clubId).single(),
        supabase.from('club_members').select('user_id, role').eq('club_id', clubId),
        supabase.from('xp_activity_log').select('user_id, xp_awarded')
          .in('user_id', memberships.map(() => clubId).concat([])), // placeholder — fixed below
      ])

      if (!clubRow || cancelled) { setLoading(false); return }

      const memberUserIds = allMembers?.map(m => m.user_id) ?? []

      const [{ data: profiles }, { data: xp }] = await Promise.all([
        supabase.from('profiles').select('id, first_name, last_name').in('id', memberUserIds),
        supabase.from('xp_activity_log').select('user_id, xp_awarded').in('user_id', memberUserIds),
      ])

      const xpMap: Record<string, number> = {}
      xp?.forEach(x => { xpMap[x.user_id] = (xpMap[x.user_id] || 0) + (x.xp_awarded || 0) })

      const profileMap: Record<string, { first_name: string; last_name: string }> = {}
      profiles?.forEach(p => { profileMap[p.id] = p })

      const roleMap: Record<string, string> = {}
      allMembers?.forEach(m => { roleMap[m.user_id] = m.role })

      const topMembers: TopMember[] = (allMembers ?? [])
        .map(m => ({
          user_id: m.user_id,
          name: `${profileMap[m.user_id]?.first_name ?? ''} ${profileMap[m.user_id]?.last_name ?? ''}`.trim() || 'Unknown',
          role: roleMap[m.user_id] === 'manager' ? 'Chapter Lead' : 'Member',
          xp: xpMap[m.user_id] || 0,
          isMe: m.user_id === user.id,
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 5)

      if (!cancelled) {
        setClub({ id: clubRow.id, name: clubRow.name, member_count: memberUserIds.length, my_role: memberships[0].role })
        setTop(topMembers)
        setLoading(false)
      }
    }
    load().catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  return { club, top, loading }
}

// ─── Challenges tab — real competitions ────────────────────────────────────────
interface CompEvent { id: string; title: string; start_date: string }

function useUpcomingComps() {
  const [events, setEvents] = useState<CompEvent[]>([])
  useEffect(() => {
    const now = new Date().toISOString()
    supabase.from('trading_competitions')
      .select('id, title, start_date')
      .eq('is_published', true)
      .gt('start_date', now)
      .order('start_date', { ascending: true })
      .limit(3)
      .then(({ data }) => { if (data) setEvents(data) })
  }, [])
  return events
}

// ─── Widget components ─────────────────────────────────────────────────────────
function ContinueLearning() {
  return (
    <div className="rounded-2xl p-4 mb-4 cursor-pointer" style={{ background: N, boxShadow: SHD }}>
      <div className="flex items-center gap-1.5 mb-2">
        <BookOpen size={12} style={{ color: O }} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Continue learning</span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7687b2' }}>{CONTINUE.cat}</span>
      <p className="text-sm font-semibold text-white mt-0.5 mb-3 leading-snug">{CONTINUE.title}</p>
      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.12)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(CONTINUE.progress * 100)}%` }} transition={{ duration: 0.9 }}
          className="h-full rounded-full" style={{ background: O }} />
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px]" style={{ color: '#7687b2' }}>{Math.round(CONTINUE.progress * 100)}% complete</span>
        <div className="flex items-center gap-1">
          <Clock size={10} style={{ color: '#7687b2' }} /><span className="text-[10px]" style={{ color: '#7687b2' }}>{CONTINUE.mins} min left</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 py-2 rounded-xl" style={{ background: O }}>
        <Play size={11} className="text-white" /><span className="text-xs font-semibold text-white">Resume</span>
      </div>
    </div>
  )
}

function RecommendedForYou() {
  return (
    <>
      <PanelTitle action="See all">Recommended for you</PanelTitle>
      <Card className="mb-4">
        {RECOMMENDED.map((r, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
            style={{ borderBottom: i < RECOMMENDED.length - 1 ? `1px solid ${CA}` : 'none' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: N }}>
              <Play size={12} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: GT }}>{r.tag}</p>
              <p className="text-xs font-medium truncate" style={{ color: MT }}>{r.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px]" style={{ color: GT }}>{r.mins} min</span>
                <div className="flex items-center gap-0.5"><Star size={8} style={{ color: O }} /><span className="text-[10px] font-medium" style={{ color: O }}>+{r.xp}</span></div>
              </div>
            </div>
            <ChevronRight size={13} style={{ color: GT }} />
          </button>
        ))}
      </Card>
    </>
  )
}

function StreakNudge() {
  return (
    <Card className="p-4 flex items-center gap-3" style={{ background: '#fff6ef', boxShadow: 'none', border: `1px solid ${'#fde2cc'}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: O }}>
        <Flame size={16} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold" style={{ color: MT }}>Keep your streak alive</p>
        <p className="text-[10px]" style={{ color: ST }}>One lesson today keeps it going 🔥</p>
      </div>
    </Card>
  )
}

function UpcomingEvents() {
  const events = useUpcomingComps()
  return (
    <>
      <PanelTitle>Upcoming competitions</PanelTitle>
      {events.length === 0 && (
        <p className="text-xs mb-4" style={{ color: GT }}>No upcoming competitions right now.</p>
      )}
      <div className="flex flex-col gap-2 mb-4">
        {events.map((ev) => {
          const d = new Date(ev.start_date)
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          return (
            <Card key={ev.id} className="px-3 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#d9e2ff' }}>
                <Trophy size={13} style={{ color: N }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: MT }}>{ev.title}</p>
                <p className="text-[10px]" style={{ color: GT }}>{dateStr}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}

function YourChapterPanel() {
  const { club, top, loading } = useClubsSummary()

  if (loading) {
    return <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: N }}>
      <p className="text-[10px]" style={{ color: '#7687b2' }}>Loading club…</p>
    </div>
  }

  if (!club) {
    return <div className="rounded-2xl p-4 mb-4" style={{ background: N }}>
      <p className="text-xs text-white opacity-70">Not in any clubs yet.</p>
    </div>
  }

  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: N, boxShadow: SHD }}>
      <div className="flex items-center gap-1.5 mb-3">
        <Users size={12} style={{ color: O }} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#b4c6f4' }}>Your chapter</span>
      </div>
      <p className="text-sm font-bold text-white mb-3">{club.name}</p>
      <div className="grid grid-cols-2 gap-2">
        {[[`${club.member_count}`, 'Members'], [club.my_role === 'manager' ? 'Lead' : 'Member', 'Your role']].map(([v, l], i) => (
          <div key={i} className="text-center">
            <p className="text-lg font-black text-white leading-none capitalize">{v}</p>
            <p className="text-[9px] mt-1" style={{ color: '#7687b2' }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopMembersPanel() {
  const { top, loading } = useClubsSummary()

  if (loading) return null

  return (
    <>
      <PanelTitle action={`${top.length} members`}>Top members</PanelTitle>
      <Card className="mb-4">
        {top.map((m, i) => (
          <div key={m.user_id} className="flex items-center gap-2.5 px-3 py-2.5"
            style={{ background: m.isMe ? '#f0f4ff' : W, borderBottom: i < top.length - 1 ? `1px solid ${CA}` : 'none' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
              style={{ background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : m.isMe ? N : CA, color: (i < 3 || m.isMe) ? W : GT }}>
              {i < 3 ? <Crown size={10} /> : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: m.isMe ? N : MT }}>{m.name}{m.isMe ? ' (You)' : ''}</p>
              <p className="text-[9px]" style={{ color: GT }}>{m.role}</p>
            </div>
            <span className="text-xs font-bold flex-shrink-0" style={{ color: m.isMe ? O : MT }}>{m.xp.toLocaleString()}</span>
          </div>
        ))}
        {top.length === 0 && (
          <p className="text-xs p-3" style={{ color: GT }}>No members found.</p>
        )}
      </Card>
    </>
  )
}

function OpenAssignments() {
  return (
    <>
      <PanelTitle>Open assignments</PanelTitle>
      <div className="flex flex-col gap-2">
        {ASSIGNMENTS.map((a, i) => (
          <Card key={i} className="px-3 py-3 flex items-center gap-3" style={{ opacity: a.done ? 0.6 : 1 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.done ? '#dcfce7' : '#d9e2ff' }}>
              {a.done ? <CheckCircle2 size={14} style={{ color: '#16a34a' }} /> : <ClipboardList size={14} style={{ color: N }} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: MT, textDecoration: a.done ? 'line-through' : 'none' }}>{a.title}</p>
              <p className="text-[10px]" style={{ color: a.done ? '#16a34a' : GT }}>{a.due}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

function LevelProgress() {
  return (
    <>
      <PanelTitle>Level progress</PanelTitle>
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.14)' }}>
              <Medal size={16} style={{ color: O }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: MT }}>Level 1</p>
              <p className="text-[10px]" style={{ color: GT }}>Analyst</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: '#dcfce7' }}>
            <TrendingUp size={10} style={{ color: '#16a34a' }} /><span className="text-[10px] font-bold" style={{ color: '#16a34a' }}>+340/wk</span>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden mb-1.5" style={{ background: CA }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: O }} />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px]" style={{ color: GT }}>340 XP</span>
          <span className="text-[10px]" style={{ color: GT }}>Lv.2 · 500 XP</span>
        </div>
        <p className="text-[10px] mt-2" style={{ color: ST }}>160 XP to level up</p>
      </Card>
    </>
  )
}

function RecentBadges() {
  return (
    <>
      <PanelTitle action="6 earned">Recent badges</PanelTitle>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {RECENT_BADGES.map((b, i) => (
          <div key={i} className="rounded-xl p-3 flex flex-col items-center gap-1.5" style={{ background: W, boxShadow: SH }}>
            <span className="text-2xl">{b.emoji}</span>
            <p className="text-[8px] font-semibold text-center leading-tight" style={{ color: GT }}>{b.label}</p>
          </div>
        ))}
      </div>
      <Card className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(253,118,26,0.14)' }}>
          <Award size={16} style={{ color: O }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: MT }}>Next: IB Expert</p>
          <p className="text-[10px]" style={{ color: ST }}>Complete the IB track to unlock</p>
        </div>
        <Sparkles size={14} style={{ color: O }} />
      </Card>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export interface DesktopRightPanelProps {
  tab: 'discover' | 'challenges' | 'clubs' | 'profile'
}

export default function DesktopRightPanel({ tab }: DesktopRightPanelProps) {
  return (
    <div className="w-[280px] flex-shrink-0 px-4 py-5 overflow-y-auto" style={{ borderLeft: `1px solid ${CA}` }}>
      {tab === 'discover' && (
        <>
          <ContinueLearning />
          <RecommendedForYou />
          <StreakNudge />
        </>
      )}

      {tab === 'challenges' && (
        <>
          <UpcomingEvents />
        </>
      )}

      {tab === 'clubs' && (
        <>
          <YourChapterPanel />
          <TopMembersPanel />
          <OpenAssignments />
        </>
      )}

      {tab === 'profile' && (
        <>
          <LevelProgress />
          <RecentBadges />
        </>
      )}
    </div>
  )
}
