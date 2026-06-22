import { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Bell, Globe, Trophy, ChevronRight, Plus, Send, Heart,
  MessageCircle, Share2, MessageSquare, ArrowLeft, FileText,
  Calendar, Zap, Check, CheckCheck, BookOpen, Flame, ClipboardList,
} from 'lucide-react'
import { DarkCtx } from '../../pages/AppDemo'
import { CLUB_ASSIGNMENTS, COMMUNITY_CHANNELS, memberToTarget } from '../../data/clubsData'
import type { ClubMember, ChatMessage, ClubPost, ChatTarget, Assignment } from '../../data/clubsData'
import { useDesktopClubs } from '../../hooks/useDesktopClubs'
import type { RealMessage } from '../../hooks/useDesktopClubs'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const N   = '#0A1F44'
const O   = '#fd761a'
const SH  = '0 2px 12px rgba(0,0,0,0.06)'
const SHD = '0 8px 24px rgba(10,31,68,0.14)'
const MEMBER_COLORS = [N, O, '#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6']

function useTokens() {
  const dark = useContext(DarkCtx)
  return {
    dark,
    BG:  dark ? '#0b1424' : '#f7f9fb',
    W:   dark ? '#152033' : '#ffffff',
    MT:  dark ? '#f1f4f8' : '#191c1e',
    ST:  dark ? '#c2c7d0' : '#44464e',
    GT:  dark ? '#8b909c' : '#75777f',
    CA:  dark ? 'rgba(255,255,255,0.08)' : '#eceef0',
    BR:  dark ? 'rgba(255,255,255,0.08)' : '#eceef0',
    HL:  dark ? 'rgba(180,198,244,0.12)' : '#f0f4ff',
    ACTX: dark ? '#b4c6f4' : N,
    SH:  dark ? '0 4px 16px rgba(0,0,0,0.4)' : SH,
    SHD: dark ? '0 12px 28px rgba(0,0,0,0.55)' : SHD,
  }
}

function Card({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const { W, SH } = useTokens()
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: W, boxShadow: SH, ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children, action, onAction }: {
  children: React.ReactNode; action?: string; onAction?: () => void
}) {
  const { MT } = useTokens()
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold" style={{ color: MT }}>{children}</h2>
      {action && (
        <button onClick={onAction} className="text-xs font-semibold" style={{ color: O }}>
          {action}
        </button>
      )}
    </div>
  )
}

type PanelTab = 'members' | 'chat' | 'assignments'

// Map real member data to the ClubMember shape the sub-panels expect
function toClubMember(m: {
  user_id: string; first_name: string; last_name: string; role: 'manager' | 'member'
  joined_at: string; xp: number; avatar_url: string | null
}, rank: number, isMe: boolean): ClubMember {
  return {
    id: m.user_id,
    name: `${m.first_name} ${m.last_name}`.trim() || 'Unknown',
    role: m.role === 'manager' ? 'Chapter Lead' : 'Member',
    active: true,
    rank,
    xp: m.xp,
    color: MEMBER_COLORS[rank % MEMBER_COLORS.length],
    bio: `Member since ${new Date(m.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    lessons: 0,
    streak: 0,
    competitions: 0,
    isMe,
  }
}

// Map real messages to ClubPost for the discussion feed
function toPost(m: RealMessage, index: number): ClubPost {
  const d = new Date(m.created_at)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return {
    id: index + 1,
    author: `${m.sender_first_name} ${m.sender_last_name}`.trim() || 'Unknown',
    time: `${date} · ${time}`,
    text: m.content,
    likes: 0,
    comments: [],
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP CLUBS — two-column layout, side-by-side drill-in panels
// ═══════════════════════════════════════════════════════════════════════════════
export default function DesktopClubs({ country }: { country?: { name: string; flag: string } }) {
  const t = useTokens()
  const { BG, W, MT, ST, GT, CA, BR, SH, SHD, HL, ACTX } = t

  const {
    clubs, activeClub, members, channels, messages, isLoading,
    currentUserId, sendMessage, selectClub, selectChannel, activeChannel,
  } = useDesktopClubs()

  // Map real data to panel-compatible shapes
  const sortedMembers: ClubMember[] = members
    .sort((a, b) => b.xp - a.xp)
    .map((m, i) => toClubMember(m, i + 1, m.user_id === currentUserId))

  const realChannels: ChatTarget[] = channels.map(c => ({
    id: c.id,
    name: c.name,
    subtitle: 'Club channel',
    color: N,
    group: true,
  }))

  const [localPosts, setLocalPosts] = useState<ClubPost[]>([])
  const [liked, setLiked]         = useState<Set<number>>(new Set())
  const [draft, setDraft]         = useState('')
  const [openComments, setOpenComments] = useState<Set<number>>(new Set())
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})

  // Sync real messages → local posts (realtime-friendly: merge, don't replace)
  useEffect(() => {
    setLocalPosts(messages.map(toPost))
  }, [messages])

  // Right-panel state
  const [panel, setPanel]             = useState<PanelTab>('members')
  const [activeMember, setActiveMember] = useState<ClubMember | null>(null)
  const [activeChat, setActiveChat]   = useState<ChatTarget | null>(null)
  const [assignments] = useState<Assignment[]>(CLUB_ASSIGNMENTS)

  const todoCount = assignments.filter(a => a.status === 'todo').length

  async function submitPost() {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    // Send to active channel (or first channel)
    const channelId = activeChannel?.id ?? channels[0]?.id
    if (channelId) {
      await sendMessage(channelId, text)
    } else {
      // optimistic fallback if no channel yet
      setLocalPosts(prev => [
        { id: Date.now(), author: 'You', time: 'Just now', text, likes: 0, comments: [] },
        ...prev,
      ])
    }
  }

  function toggleComments(id: number) {
    setOpenComments(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function addComment(id: number) {
    const text = (commentDrafts[id] ?? '').trim()
    if (!text) return
    setLocalPosts(prev => prev.map(p => p.id === id
      ? { ...p, comments: [...p.comments, { author: 'You', text, time: 'Now' }] } : p))
    setCommentDrafts(d => ({ ...d, [id]: '' }))
  }
  function openChat(target: ChatTarget) {
    setPanel('chat')
    setActiveChat(target)
    setActiveMember(null)
    if (target.group) selectChannel({ id: target.id, name: target.name, club_id: activeClub?.id ?? '' })
  }
  function openMember(m: ClubMember) {
    setPanel('members')
    setActiveMember(m)
  }

  const clubName = activeClub?.name ?? (country?.name ?? 'Your Club')
  const clubFlag = country?.flag ?? '🌍'

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-24" style={{ background: BG }}>
        <p className="text-sm" style={{ color: GT }}>Loading your clubs…</p>
      </div>
    )
  }

  if (!isLoading && clubs.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3" style={{ background: BG }}>
        <Users size={40} style={{ color: GT }} />
        <p className="text-base font-semibold" style={{ color: MT }}>You're not in any clubs yet</p>
        <p className="text-sm" style={{ color: GT }}>Join a club on the Ledger app to get started.</p>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ background: BG }}>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GT }}>
            Your Chapter
          </p>
          <h1 className="text-2xl font-bold" style={{ color: MT, letterSpacing: '-0.01em' }}>
            {clubName} {clubFlag}
          </h1>

          {/* Club selector if user belongs to multiple clubs */}
          {clubs.length > 1 && (
            <div className="flex items-center gap-2 mt-1.5">
              {clubs.map(c => (
                <button key={c.id} onClick={() => selectClub(c)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    background: c.id === activeClub?.id ? N : CA,
                    color: c.id === activeClub?.id ? '#fff' : ST,
                  }}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanel('assignments')}
            className="h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold transition-colors hover:opacity-90"
            style={{ background: CA, color: ST }}>
            <ClipboardList size={15} /> Assignments
            {todoCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: O }}>
                {todoCount}
              </span>
            )}
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{ background: CA }}>
            <Bell size={16} style={{ color: ST }} />
          </button>
        </div>
      </div>

      {/* ── Hero stat band ── */}
      <div className="px-8 mb-5">
        <div className="rounded-2xl p-6" style={{ background: N, boxShadow: SHD }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>Chapter</p>
              <p className="text-2xl font-extrabold text-white leading-none">
                {activeClub?.member_count ?? members.length} Members
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#b4c6f4' }}>Role</p>
              <div className="flex items-center gap-1.5">
                <Globe size={16} style={{ color: O }} />
                <p className="text-lg font-extrabold text-white leading-none capitalize">
                  {activeClub?.my_role ?? 'Member'}
                </p>
              </div>
            </div>
            {[
              [`${channels.length}`, 'Channels'],
              [`${sortedMembers.reduce((s, m) => s + m.xp, 0).toLocaleString()}`, 'Total XP'],
            ].map(([val, lbl]) => (
              <div key={lbl} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <p className="text-lg font-bold text-white">{val}</p>
                <p className="text-[10px]" style={{ color: '#7687b2' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="px-8 pb-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
        {/* ── LEFT: discussion feed ── */}
        <div>
          <SectionTitle>
            {activeChannel ? `# ${activeChannel.name}` : 'Discussion'}
          </SectionTitle>

          {/* Composer */}
          <Card className="p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: O }}>
                {sortedMembers.find(m => m.isMe)?.name[0] ?? 'Y'}
              </div>
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Share something with ${clubName}…`}
                  rows={2}
                  className="w-full resize-none text-sm leading-relaxed outline-none bg-transparent"
                  style={{ color: MT }}
                />
                <div className="flex items-center justify-end mt-2">
                  <motion.button whileTap={{ scale: 0.96 }} onClick={submitPost} disabled={!draft.trim()}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ background: draft.trim() ? O : '#d6d8db' }}>
                    <Plus size={13} /> Post
                  </motion.button>
                </div>
              </div>
            </div>
          </Card>

          {localPosts.length === 0 && (
            <div className="text-center py-12" style={{ color: GT }}>
              <MessageCircle size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No messages yet — start the conversation!</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {localPosts.map((p, i) => {
              const commentsOpen = openComments.has(p.id)
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 4) * 0.05 } }}
                  className="rounded-2xl p-5" style={{ background: W, boxShadow: SH }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: N }}>{p.author[0]}</div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: MT }}>{p.author}</p>
                      <p className="text-[10px]" style={{ color: GT }}>{p.time}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-3.5" style={{ color: ST }}>{p.text}</p>
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
                      onClick={() => setLiked(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n })}>
                      <Heart size={15} style={{ color: liked.has(p.id) ? '#ef4444' : GT, fill: liked.has(p.id) ? '#ef4444' : 'none' }} />
                      <span className="text-xs" style={{ color: GT }}>{p.likes + (liked.has(p.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity" onClick={() => toggleComments(p.id)}>
                      <MessageCircle size={15} style={{ color: commentsOpen ? O : GT }} />
                      <span className="text-xs" style={{ color: commentsOpen ? O : GT }}>{p.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:opacity-75 transition-opacity">
                      <Share2 size={15} style={{ color: GT }} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {commentsOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="mt-3.5 pt-3.5 flex flex-col gap-3" style={{ borderTop: `1px solid ${BR}` }}>
                          {p.comments.map((c, ci) => (
                            <div key={ci} className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                                style={{ background: c.author === 'You' ? O : N }}>{c.author[0]}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold" style={{ color: MT }}>{c.author}</p>
                                  <p className="text-[10px]" style={{ color: GT }}>{c.time}</p>
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: ST }}>{c.text}</p>
                              </div>
                            </div>
                          ))}
                          {p.comments.length === 0 && (
                            <p className="text-xs" style={{ color: GT }}>No comments yet — start the conversation.</p>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              value={commentDrafts[p.id] ?? ''}
                              onChange={(e) => setCommentDrafts(d => ({ ...d, [p.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === 'Enter') addComment(p.id) }}
                              placeholder="Add a comment…"
                              className="flex-1 text-xs px-3.5 py-2.5 rounded-full outline-none"
                              style={{ background: CA, color: MT }}
                            />
                            <button onClick={() => addComment(p.id)}
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                              style={{ background: (commentDrafts[p.id] ?? '').trim() ? O : '#d6d8db' }}>
                              <Send size={13} className="text-white" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: tabbed drill-in panel ── */}
        <div className="lg:sticky lg:top-6 flex flex-col gap-4">
          <Card className="p-1.5 flex">
            {([
              { id: 'members', label: 'Members', Icon: Users },
              { id: 'chat',    label: 'Chat',    Icon: MessageSquare },
              { id: 'assignments', label: 'Tasks', Icon: ClipboardList },
            ] as const).map(({ id, label, Icon }) => {
              const on = panel === id
              return (
                <button key={id}
                  onClick={() => { setPanel(id); if (id !== 'members') setActiveMember(null); if (id !== 'chat') setActiveChat(null) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: on ? N : 'transparent', color: on ? '#fff' : ST }}>
                  <Icon size={14} /> {label}
                </button>
              )
            })}
          </Card>

          <div className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH, minHeight: 520 }}>
            <AnimatePresence mode="wait">
              {panel === 'members' && (
                <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {activeMember
                    ? <MemberProfilePanel member={activeMember} onBack={() => setActiveMember(null)} onMessage={() => { openChat(memberToTarget(activeMember)) }} t={t} />
                    : <MembersPanel
                        members={sortedMembers}
                        country={clubName}
                        channels={realChannels}
                        onOpenMember={openMember}
                        onOpenChat={openChat}
                        t={t}
                      />}
                </motion.div>
              )}
              {panel === 'chat' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {activeChat
                    ? <RealChatPanel
                        target={activeChat}
                        messages={activeChat.group ? messages : []}
                        currentUserId={currentUserId}
                        onBack={() => setActiveChat(null)}
                        onSend={(content) => sendMessage(activeChat.id, content)}
                        t={t}
                      />
                    : <ChatListPanel members={sortedMembers} channels={realChannels} onOpenChat={openChat} t={t} />}
                </motion.div>
              )}
              {panel === 'assignments' && (
                <motion.div key="assignments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AssignmentsPanel
                    assignments={assignments}
                    onSubmit={() => {}}
                    country={clubName}
                    t={t}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

type Tokens = ReturnType<typeof useTokens>

// ─── Members + channels panel ──────────────────────────────────────────────────
function MembersPanel({ members, country, channels, onOpenMember, onOpenChat, t }: {
  members: ClubMember[]
  country: string
  channels: ChatTarget[]
  onOpenMember: (m: ClubMember) => void
  onOpenChat: (target: ChatTarget) => void
  t: Tokens
}) {
  const { W, MT, ST, GT, CA, BR, HL, ACTX } = t
  return (
    <div className="flex flex-col">
      {channels.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <SectionTitle>Channels</SectionTitle>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BR}` }}>
            {channels.map((c, i) => (
              <button key={c.id} onClick={() => onOpenChat(c)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:opacity-90"
                style={{ background: W, borderBottom: i < channels.length - 1 ? `1px solid ${BR}` : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: N }}>
                  <Users size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: MT }}># {c.name}</p>
                  <p className="text-[10px]" style={{ color: GT }}>Club channel</p>
                </div>
                <ChevronRight size={15} style={{ color: GT }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-2 pb-4">
        <SectionTitle action={`${members.length} members`}>{`Leaderboard · ${country}`}</SectionTitle>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BR}` }}>
          {members.map((m, i) => (
            <button key={m.id} onClick={() => onOpenMember(m)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:opacity-95"
              style={{ background: m.isMe ? HL : W, borderBottom: i < members.length - 1 ? `1px solid ${BR}` : 'none' }}>
              <div className="w-5 flex-shrink-0 text-center text-xs font-extrabold"
                style={{ color: m.rank === 1 ? O : m.rank <= 3 ? ACTX : GT }}>{m.rank}</div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: m.color }}>{m.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: MT }}>
                  {m.name}{m.isMe ? ' (You)' : ''}
                </p>
                <p className="text-[10px]" style={{ color: GT }}>{m.role} · {m.xp.toLocaleString()} XP</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
              {!m.isMe && (
                <span role="button" tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onOpenChat(memberToTarget(m)) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
                  style={{ background: CA }}>
                  <MessageSquare size={14} style={{ color: ST }} />
                </span>
              )}
            </button>
          ))}
          {members.length === 0 && (
            <p className="text-xs p-4" style={{ color: GT }}>No members found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Member profile panel ──────────────────────────────────────────────────────
function MemberProfilePanel({ member, onBack, onMessage, t }: {
  member: ClubMember; onBack: () => void; onMessage: () => void; t: Tokens
}) {
  const { W, MT, ST, GT, CA, BR, SH, SHD } = t
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: CA }}>
          <ArrowLeft size={16} style={{ color: ST }} />
        </button>
        <h2 className="text-sm font-bold" style={{ color: MT }}>Profile</h2>
      </div>
      <div className="px-5 py-5">
        <div className="rounded-2xl p-5 text-center" style={{ background: N, boxShadow: SHD }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-black text-white"
            style={{ background: member.color, boxShadow: `0 0 0 3px ${N}, 0 0 0 5px ${member.color}` }}>
            {member.name[0]}
          </div>
          <p className="text-base font-bold text-white">{member.name}{member.isMe ? ' (You)' : ''}</p>
          <p className="text-[11px] mb-3" style={{ color: '#7687b2' }}>{member.role} · Chapter</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(253,118,26,0.18)' }}>
            <Trophy size={13} style={{ color: O }} />
            <span className="text-xs font-bold" style={{ color: O }}>Rank #{member.rank} · {member.xp.toLocaleString()} XP</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { icon: <BookOpen size={16} style={{ color: N }} />, val: member.lessons, label: 'Lessons' },
            { icon: <Flame size={16} style={{ color: O }} />, val: member.streak, label: 'Day Streak' },
            { icon: <Trophy size={16} style={{ color: '#fbbf24' }} />, val: member.competitions, label: 'Competitions' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-3 text-center" style={{ background: W, boxShadow: SH, border: `1px solid ${BR}` }}>
              <div className="flex justify-center mb-1">{s.icon}</div>
              <p className="text-base font-extrabold" style={{ color: MT }}>{s.val}</p>
              <p className="text-[9px] font-medium" style={{ color: GT }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-2" style={{ color: GT }}>About</p>
        <div className="rounded-2xl p-4" style={{ background: W, boxShadow: SH, border: `1px solid ${BR}` }}>
          <p className="text-xs leading-relaxed" style={{ color: ST }}>{member.bio}</p>
        </div>

        {!member.isMe && (
          <motion.button whileTap={{ scale: 0.98 }} onClick={onMessage}
            className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white"
            style={{ background: O, boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
            <MessageSquare size={17} /> Message {member.name.split(' ')[0]}
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ─── Chat list panel ───────────────────────────────────────────────────────────
function ChatListPanel({ members, channels, onOpenChat, t }: {
  members: ClubMember[]
  channels: ChatTarget[]
  onOpenChat: (target: ChatTarget) => void
  t: Tokens
}) {
  const { W, MT, GT, BR } = t
  const dms = members.filter(m => !m.isMe)
  return (
    <div className="flex flex-col">
      {channels.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <SectionTitle>Channels</SectionTitle>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BR}` }}>
            {channels.map((c, i) => (
              <button key={c.id} onClick={() => onOpenChat(c)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:opacity-90"
                style={{ background: W, borderBottom: i < channels.length - 1 ? `1px solid ${BR}` : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: N }}>
                  <Users size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: MT }}># {c.name}</p>
                  <p className="text-[10px]" style={{ color: GT }}>Club channel</p>
                </div>
                <ChevronRight size={15} style={{ color: GT }} />
              </button>
            ))}
          </div>
        </div>
      )}
      {dms.length > 0 && (
        <div className="px-4 pt-2 pb-4">
          <SectionTitle>Direct Messages</SectionTitle>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BR}` }}>
            {dms.map((m, i) => (
              <button key={m.id} onClick={() => onOpenChat(memberToTarget(m))}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:opacity-90"
                style={{ background: W, borderBottom: i < dms.length - 1 ? `1px solid ${BR}` : 'none' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: m.color }}>{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: MT }}>{m.name}</p>
                  <p className="text-[10px] truncate" style={{ color: GT }}>Direct message</p>
                </div>
                <ChevronRight size={15} style={{ color: GT }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Real chat panel (uses live Supabase messages) ─────────────────────────────
function RealChatPanel({ target, messages, currentUserId, onBack, onSend, t }: {
  target: ChatTarget
  messages: RealMessage[]
  currentUserId: string | null
  onBack: () => void
  onSend: (content: string) => Promise<void>
  t: Tokens
}) {
  const { W, MT, ST, GT, CA, BR } = t
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    await onSend(text)
  }

  return (
    <div className="flex flex-col" style={{ height: 520 }}>
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: CA }}>
          <ArrowLeft size={16} style={{ color: ST }} />
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: target.color }}>
          {target.group ? <Users size={16} /> : target.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: MT }}>{target.group ? `# ${target.name}` : target.name}</p>
          <p className="text-[10px] truncate" style={{ color: GT }}>
            {target.group ? 'Club channel' : 'Direct message'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-xs text-center mt-8" style={{ color: GT }}>No messages yet — say something!</p>
        )}
        {messages.map(m => {
          const fromMe = m.sender_id === currentUserId
          const name = `${m.sender_first_name} ${m.sender_last_name}`.trim() || 'Unknown'
          const time = new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`max-w-[80%] ${fromMe ? 'self-end' : 'self-start'}`}>
              {target.group && !fromMe && (
                <p className="text-[10px] font-bold mb-0.5 ml-1" style={{ color: N }}>{name}</p>
              )}
              <div className="rounded-2xl px-3.5 py-2"
                style={{
                  background: fromMe ? O : W,
                  color: fromMe ? '#fff' : MT,
                  border: fromMe ? 'none' : `1px solid ${BR}`,
                  borderBottomRightRadius: fromMe ? 4 : 16,
                  borderBottomLeftRadius: fromMe ? 16 : 4,
                }}>
                <p className="text-xs leading-relaxed">{m.content}</p>
              </div>
              <div className={`flex items-center gap-1 mt-0.5 ${fromMe ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[9px]" style={{ color: GT }}>{time}</span>
                {fromMe && <CheckCheck size={11} style={{ color: '#22c55e' }} />}
              </div>
            </motion.div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${BR}` }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Message…"
          className="flex-1 text-sm px-3.5 py-2.5 rounded-full outline-none"
          style={{ background: CA, color: MT }}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={send}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: draft.trim() ? O : '#d6d8db' }}>
          <Send size={15} className="text-white" />
        </motion.button>
      </div>
    </div>
  )
}

// ─── Assignments panel ─────────────────────────────────────────────────────────
function AssignmentsPanel({ assignments, onSubmit, country, t }: {
  assignments: Assignment[]; onSubmit: (id: string) => void; country: string; t: Tokens
}) {
  const { W, MT, ST, GT, CA, BR, SH } = t
  const [openId, setOpenId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const todoCount = assignments.filter(a => a.status === 'todo').length

  const statusStyle: Record<Assignment['status'], { label: string; bg: string; fg: string }> = {
    todo:      { label: 'To do',     bg: 'rgba(253,118,26,0.15)', fg: O },
    submitted: { label: 'Submitted', bg: 'rgba(99,102,241,0.15)', fg: '#6366f1' },
    graded:    { label: 'Graded',    bg: 'rgba(34,197,94,0.15)',  fg: '#16a34a' },
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BR}` }}>
        <h2 className="text-sm font-bold" style={{ color: MT }}>Assignments</h2>
        <p className="text-[10px]" style={{ color: GT }}>{todoCount} pending · {country}</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {assignments.map((a, i) => {
          const s = statusStyle[a.status]
          const open = openId === a.id
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
              className="rounded-2xl p-4" style={{ background: W, boxShadow: SH, border: `1px solid ${BR}` }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
                    <FileText size={15} style={{ color: ST }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight" style={{ color: MT }}>{a.title}</p>
                    <p className="text-[10px]" style={{ color: GT }}>{a.course}</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.fg }}>
                  {a.status === 'graded' && a.grade ? `Grade ${a.grade}` : s.label}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} style={{ color: GT }} />
                  <span className="text-[10px]" style={{ color: GT }}>{a.due}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} style={{ color: O }} />
                  <span className="text-[10px] font-bold" style={{ color: O }}>+{a.xp} XP</span>
                </div>
              </div>

              {a.status === 'todo' && !open && (
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setOpenId(a.id)}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: N }}>
                  Start assignment
                </motion.button>
              )}

              <AnimatePresence>
                {a.status === 'todo' && open && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${BR}` }}>
                      <textarea
                        value={drafts[a.id] ?? ''}
                        onChange={(e) => setDrafts(d => ({ ...d, [a.id]: e.target.value }))}
                        placeholder="Paste a link or write your submission…"
                        rows={3}
                        className="w-full resize-none text-xs leading-relaxed outline-none rounded-xl p-3"
                        style={{ background: CA, color: MT }}
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button onClick={() => setOpenId(null)}
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg" style={{ color: GT, background: CA }}>
                          Cancel
                        </button>
                        <motion.button whileTap={{ scale: 0.96 }}
                          disabled={!(drafts[a.id] ?? '').trim()}
                          onClick={() => { onSubmit(a.id); setOpenId(null) }}
                          className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ background: (drafts[a.id] ?? '').trim() ? O : '#d6d8db' }}>
                          <Check size={12} /> Submit
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {a.status === 'submitted' && (
                <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${BR}` }}>
                  <CheckCheck size={13} style={{ color: '#6366f1' }} />
                  <span className="text-[10px] font-semibold" style={{ color: '#6366f1' }}>Awaiting review</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
