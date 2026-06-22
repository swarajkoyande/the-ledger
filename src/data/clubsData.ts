// ─── Clubs data & types ─────────────────────────────────────────────────────
// Ported from the mobile ClubsTab + sub-screens in ledger-mockups AppDemo.tsx.
// Self-contained: consumed by src/components/desktop/DesktopClubs.tsx.

const O = '#fd761a'

// ─── Types ──────────────────────────────────────────────────────────────────
export type ClubMember = {
  id: string
  name: string
  role: string
  active: boolean
  rank: number
  xp: number
  color: string
  bio: string
  lessons: number
  streak: number
  competitions: number
  isMe?: boolean
}

export type PostComment = { author: string; text: string; time: string }

export type ClubPost = {
  id: number
  author: string
  time: string
  text: string
  likes: number
  comments: PostComment[]
}

export type ChatMessage = {
  id: number
  fromMe: boolean
  text: string
  time: string
  author?: string
}

export type ChatTarget = {
  id: string
  name: string
  subtitle?: string
  color: string
  group?: boolean
}

export type Assignment = {
  id: string
  title: string
  course: string
  due: string
  status: 'todo' | 'submitted' | 'graded'
  xp: number
  grade?: string
}

// ─── Seed data ──────────────────────────────────────────────────────────────
export const CLUB_POSTS: ClubPost[] = [
  {
    id: 1, author: 'Rohan M.', time: '2h ago',
    text: "Great breakdown on the Fed's latest move. Anyone catching the FOMC meeting tomorrow?",
    likes: 12,
    comments: [
      { author: 'Aisha K.', text: "I'll be watching the dot plot closely.", time: '1h ago' },
      { author: 'Priya S.', text: 'Same — expecting a hold but hawkish tone.', time: '52m ago' },
    ],
  },
  {
    id: 2, author: 'Aisha K.', time: '5h ago',
    text: 'Shared my DCF model for Apple — feedback welcome. Assuming 8% WACC and 3% terminal growth.',
    likes: 8,
    comments: [
      { author: 'Rohan M.', text: 'Terminal growth feels a touch high for a mega-cap.', time: '4h ago' },
    ],
  },
  {
    id: 3, author: 'James T.', time: '1d ago',
    text: "Reminder: chapter meeting on Friday. We'll be doing a live stock pitch competition.",
    likes: 21,
    comments: [],
  },
]

export const CLUB_MEMBERS: ClubMember[] = [
  { id: 'rohan', name: 'Rohan M.', role: 'Chapter Lead', active: true, rank: 1, xp: 3120, color: '#6366f1',
    bio: 'Final-year finance student. Runs the weekly stock-pitch sessions.', lessons: 38, streak: 24, competitions: 11 },
  { id: 'priya', name: 'Priya S.', role: 'Member', active: true, rank: 2, xp: 2780, color: '#ec4899',
    bio: 'Equity research enthusiast. Loves a good DCF.', lessons: 31, streak: 18, competitions: 9 },
  { id: 'aisha', name: 'Aisha K.', role: 'Member', active: true, rank: 3, xp: 2540, color: '#14b8a6',
    bio: 'Aspiring IB analyst. Currently grinding LBO models.', lessons: 27, streak: 15, competitions: 8 },
  { id: 'me', name: 'Swasmac', role: 'Member', active: true, rank: 4, xp: 2210, color: O, isMe: true,
    bio: 'Learning the ropes one lesson at a time.', lessons: 14, streak: 12, competitions: 5 },
  { id: 'james', name: 'James T.', role: 'Member', active: false, rank: 5, xp: 1890, color: '#f59e0b',
    bio: 'Macro nerd. Never misses an FOMC meeting.', lessons: 22, streak: 0, competitions: 7 },
]

export const COMMUNITY_CHANNELS: ChatTarget[] = [
  { id: 'ch-general', name: 'General',              subtitle: '1,240 members', color: '#6366f1', group: true },
  { id: 'ch-stocks',  name: 'Stock Market Talk',    subtitle: '880 members',   color: '#14b8a6', group: true },
  { id: 'ch-careers', name: 'Career & Internships', subtitle: '540 members',   color: '#f59e0b', group: true },
]

export const SEED_CHATS: Record<string, ChatMessage[]> = {
  rohan: [
    { id: 1, fromMe: false, text: 'Hey! You joining the stock pitch on Friday?', time: '09:12' },
    { id: 2, fromMe: true,  text: 'Definitely. Still picking my company though 😅', time: '09:14' },
    { id: 3, fromMe: false, text: 'Nice. Want me to review your deck beforehand?', time: '09:15' },
  ],
  priya: [
    { id: 1, fromMe: false, text: 'Did you finish the DCF lesson?', time: 'Yesterday' },
    { id: 2, fromMe: true,  text: 'Just wrapped it — terminal value finally clicked', time: 'Yesterday' },
  ],
  aisha: [
    { id: 1, fromMe: true,  text: 'How are the LBO models going?', time: 'Mon' },
    { id: 2, fromMe: false, text: 'Painful but getting there 😂', time: 'Mon' },
  ],
  james: [
    { id: 1, fromMe: false, text: 'FOMC tomorrow — predictions?', time: '2d ago' },
  ],
  'ch-general': [
    { id: 1, fromMe: false, author: 'Wei L.',   text: 'Welcome to all the new members joining this week! 👋', time: '10:02' },
    { id: 2, fromMe: false, author: 'Nadia R.', text: 'Anyone going to the markets meetup downtown?', time: '10:20' },
    { id: 3, fromMe: true,  text: 'I might! What time does it start?', time: '10:24' },
  ],
  'ch-stocks': [
    { id: 1, fromMe: false, author: 'Daniel C.', text: 'SG banks are ripping today 🚀', time: '11:30' },
    { id: 2, fromMe: false, author: 'Mei T.',    text: 'DBS broke its all-time high again', time: '11:33' },
  ],
  'ch-careers': [
    { id: 1, fromMe: false, author: 'Arjun P.', text: 'Summer IB internship apps are open at most BBs now.', time: 'Yesterday' },
  ],
}

export const CLUB_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Build a DCF for a listed company', course: 'Equity Valuation',   due: 'Due Fri, 18 Jul',  status: 'todo',      xp: 120 },
  { id: 'a2', title: 'One-page macro outlook memo',      course: 'Economics',          due: 'Due Mon, 21 Jul',  status: 'todo',      xp: 80  },
  { id: 'a3', title: 'LBO model — sources & uses',       course: 'Investment Banking', due: 'Submitted 10 Jul', status: 'submitted', xp: 150 },
  { id: 'a4', title: 'Technical analysis case study',    course: 'Stock Markets',      due: 'Graded 3 Jul',     status: 'graded',    xp: 100, grade: 'A' },
]

export function memberToTarget(m: ClubMember): ChatTarget {
  return { id: m.id, name: m.name, subtitle: m.role, color: m.color }
}
