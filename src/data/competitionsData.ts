// All dates computed from import time so countdowns are always live

export type ChallengeType = 'trading' | 'case-competition' | 'quiz-challenge' | 'ma-simulation' | 'pitch'
export type ChallengeStatus = 'active' | 'upcoming' | 'ended'
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  status: ChallengeStatus
  endsAt: Date
  startsAt: Date
  prize: string
  entrants: number
  maxEntrants?: number
  xpReward: number
  rules: string[]
  difficulty: ChallengeDifficulty
  tags: string[]
  isTeamBased: boolean
  organizer: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarInitials: string
  score: number
  returnPercent: number
  rankDelta: number
  isCurrentUser: boolean
}

export interface UpcomingEvent {
  id: string
  title: string
  date: Date
  type: ChallengeType
  spotsLeft?: number
}

export interface UserCompeteStats {
  totalXp: number
  rank: number
  rankDelta: number
  nextRankXp: number
  xpToNextRank: number
  challengesJoined: number
  top10Finishes: number
  currentStreak: number
  nextRankUsername: string
}

const now = new Date()
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86_400_000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    title: 'Global Stock Trading Championship',
    description:
      'Build the highest-returning simulated portfolio over 7 days. Trade equities, ETFs, and indices using real-time data. Top performers earn XP, badges, and bragging rights.',
    type: 'trading',
    status: 'active',
    startsAt: daysAgo(2),
    endsAt: daysFromNow(5),
    prize: '2,000 XP',
    entrants: 847,
    maxEntrants: 1000,
    xpReward: 2000,
    rules: [
      'Each participant starts with a virtual $100,000 portfolio.',
      'Trades execute at live market prices during market hours.',
      'Maximum position size: 25% of portfolio per ticker.',
      'Short selling and leverage are not permitted.',
      'Final rankings determined by total portfolio return percentage.',
      'Ties broken by Sharpe ratio (risk-adjusted return).',
    ],
    difficulty: 'intermediate',
    tags: ['Trading', 'Markets', 'Portfolio'],
    isTeamBased: false,
    organizer: 'The Ledger',
  },
  {
    id: 'ch2',
    title: 'Personal Finance Sprint',
    description:
      'Answer 30 rapid-fire personal finance questions in 10 minutes. Topics span budgeting, compound interest, credit, taxes, and savings vehicles.',
    type: 'quiz-challenge',
    status: 'active',
    startsAt: daysAgo(1),
    endsAt: daysFromNow(3),
    prize: '750 XP',
    entrants: 1203,
    maxEntrants: undefined,
    xpReward: 750,
    rules: [
      'Each participant answers the same 30 questions independently.',
      'Time limit: 10 minutes from when you start.',
      'You may attempt the quiz once only.',
      'Questions are randomised in order.',
      'Score is based on correct answers; partial credit is not given.',
      'Tiebreaker: fastest completion time wins.',
    ],
    difficulty: 'beginner',
    tags: ['Personal Finance', 'Quiz', 'Beginner'],
    isTeamBased: false,
    organizer: 'The Ledger',
  },
  {
    id: 'ch3',
    title: 'Global Trading Cup',
    description:
      'The premier annual trading simulation tournament. Compete against students from 40+ universities over a two-week period. Sponsored by leading investment banks.',
    type: 'trading',
    status: 'upcoming',
    startsAt: new Date(now.getFullYear(), 6, 15),
    endsAt: new Date(now.getFullYear(), 6, 29),
    prize: '10,000 XP + Certificate',
    entrants: 312,
    maxEntrants: 500,
    xpReward: 10000,
    rules: [
      'Open to all registered Ledger users with at least Beginner rank.',
      'Virtual portfolio of $250,000 in simulated funds.',
      'Trading period: 9 AM – 4 PM EST on weekdays only.',
      'Three asset classes allowed: equities, bonds, and commodities.',
      'Maximum 5 trades per day.',
      'Final ranking by percentage return; top 20 earn certificates.',
    ],
    difficulty: 'advanced',
    tags: ['Trading', 'Markets', 'Annual'],
    isTeamBased: false,
    organizer: 'The Ledger & Barclays',
  },
  {
    id: 'ch4',
    title: 'Economics Olympiad',
    description:
      'A team-based macro-economics case competition. Analyse a 20-page brief and present a 10-minute solution to a panel of judges.',
    type: 'case-competition',
    status: 'upcoming',
    startsAt: new Date(now.getFullYear(), 6, 22),
    endsAt: new Date(now.getFullYear(), 6, 23),
    prize: '5,000 XP + Trophy',
    entrants: 88,
    maxEntrants: 120,
    xpReward: 5000,
    rules: [
      'Teams of 3–4 students.',
      'Case brief released 48 hours before the judging session.',
      'Presentations are 10 minutes + 5 minutes Q&A.',
      'Judged on analysis depth, feasibility, and presentation quality.',
      'No AI-generated content is permitted.',
      'Finalists must be available for a live video judging session.',
    ],
    difficulty: 'advanced',
    tags: ['Economics', 'Case Study', 'Team'],
    isTeamBased: true,
    organizer: 'The Ledger',
  },
  {
    id: 'ch5',
    title: 'M&A Deal Simulation',
    description:
      'Run a mock M&A process from initial screen to LOI. Build a DCF model, perform synergy analysis, and recommend deal structure.',
    type: 'ma-simulation',
    status: 'ended',
    startsAt: daysAgo(21),
    endsAt: daysAgo(7),
    prize: '3,500 XP',
    entrants: 634,
    maxEntrants: undefined,
    xpReward: 3500,
    rules: [
      'Fictional target company data provided at start.',
      'Submissions include a completed DCF model and 5-slide recommendation deck.',
      'Time limit: 72 hours from brief release.',
      'Solo entries only.',
      'Ranked by model accuracy (vs. answer key) and deck quality.',
      'Top 10 submissions receive written feedback from mentors.',
    ],
    difficulty: 'advanced',
    tags: ['M&A', 'Modelling', 'Investment Banking'],
    isTeamBased: false,
    organizer: 'The Ledger',
  },
  {
    id: 'ch6',
    title: 'IB Pitch Challenge',
    description:
      'Pitch a 3-minute buy-side recommendation for a real listed company. Judges are practising analysts and portfolio managers.',
    type: 'pitch',
    status: 'ended',
    startsAt: daysAgo(35),
    endsAt: daysAgo(14),
    prize: '2,500 XP + Mentorship',
    entrants: 410,
    maxEntrants: 500,
    xpReward: 2500,
    rules: [
      'Pick any company listed on the NYSE or NASDAQ.',
      'Pitch is a 3-minute video recording, submitted via the platform.',
      'Include a 1-page investment thesis summary.',
      'Judged on thesis quality, financial understanding, and delivery.',
      'Mentorship session awarded to top 5 finalists.',
      'Submissions must be original work — no copied content.',
    ],
    difficulty: 'intermediate',
    tags: ['Pitch', 'Equity Research', 'Presentation'],
    isTeamBased: false,
    organizer: 'The Ledger & Goldman Alums',
  },
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', username: 'SofiaL',       avatarInitials: 'SL', score: 128450, returnPercent: 28.45, rankDelta:  0, isCurrentUser: false },
  { rank: 2, userId: 'u2', username: 'CapitalKing',  avatarInitials: 'CK', score: 115320, returnPercent: 15.32, rankDelta: +1, isCurrentUser: false },
  { rank: 3, userId: 'u3', username: 'BullMarketQ',  avatarInitials: 'BM', score: 108900, returnPercent: 8.90,  rankDelta: -1, isCurrentUser: false },
  { rank: 4, userId: 'u4', username: 'You',          avatarInitials: 'ME', score: 104340, returnPercent: 4.34,  rankDelta: +2, isCurrentUser: true  },
  { rank: 5, userId: 'u5', username: 'AlphaHunterX', avatarInitials: 'AH', score: 98210,  returnPercent: -1.79, rankDelta:  0, isCurrentUser: false },
  { rank: 6, userId: 'u6', username: 'BondKingJ',    avatarInitials: 'BJ', score: 91500,  returnPercent: -8.50, rankDelta: -2, isCurrentUser: false },
  { rank: 7, userId: 'u7', username: 'QuietPortfolio',avatarInitials:'QP', score: 88320,  returnPercent: -11.68,rankDelta:  0, isCurrentUser: false },
  { rank: 8, userId: 'u8', username: 'ArbitrageAce', avatarInitials: 'AA', score: 82100,  returnPercent: -17.90,rankDelta: +3, isCurrentUser: false },
  { rank: 9, userId: 'u9', username: 'ValueInvest',  avatarInitials: 'VI', score: 76450,  returnPercent: -23.55,rankDelta: -1, isCurrentUser: false },
  { rank:10, userId:'u10', username: 'MomentumM',    avatarInitials: 'MM', score: 71230,  returnPercent: -28.77,rankDelta:  0, isCurrentUser: false },
]

export const MOCK_UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 'ev1', title: 'Global Trading Cup', date: new Date(now.getFullYear(), 6, 15), type: 'trading',          spotsLeft: 188 },
  { id: 'ev2', title: 'Economics Olympiad', date: new Date(now.getFullYear(), 6, 22), type: 'case-competition', spotsLeft: 32  },
  { id: 'ev3', title: 'IB Case Finals',     date: new Date(now.getFullYear(), 7, 3),  type: 'pitch',            spotsLeft: 50  },
]

const nextRankUser = MOCK_LEADERBOARD.find(e => e.rank === 3)?.username ?? 'BullMarketQ'

export const MOCK_USER_STATS: UserCompeteStats = {
  totalXp:          4340,
  rank:             4,
  rankDelta:        2,
  nextRankXp:       5000,
  xpToNextRank:     660,
  challengesJoined: 3,
  top10Finishes:    1,
  currentStreak:    5,
  nextRankUsername: nextRankUser,
}
