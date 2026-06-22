import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type {
  Challenge,
  LeaderboardEntry,
  UpcomingEvent,
  UserCompeteStats,
} from '../data/competitionsData'
import { MOCK_USER_STATS } from '../data/competitionsData'

export interface CompetitionsState {
  challenges: Challenge[]
  leaderboard: LeaderboardEntry[]
  upcomingEvents: UpcomingEvent[]
  userStats: UserCompeteStats
  isLoading: boolean
}

interface DbCompetition {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  starting_capital: number
  status: string
  is_active: boolean
  is_published: boolean
}

interface DbLeaderboardEntry {
  id: string
  competition_id: string
  user_id: string
  username: string | null
  avatar_url: string | null
  rank: number
  portfolio_value: number
  return_percent: number
  rank_change: number | null
}

function mapCompetition(row: DbCompetition): Challenge {
  const now = new Date()
  const start = new Date(row.start_date)
  const end = new Date(row.end_date)
  let status: Challenge['status'] = 'upcoming'
  if (now >= start && now <= end) status = 'active'
  else if (now > end) status = 'ended'

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    type: 'trading',
    status,
    startsAt: start,
    endsAt: end,
    prize: `${row.starting_capital.toLocaleString()} XP`,
    entrants: 0,
    xpReward: 2000,
    rules: [],
    difficulty: 'intermediate',
    tags: ['trading'],
    isTeamBased: false,
    organizer: 'The Ledger',
  }
}

function mapLeaderboard(rows: DbLeaderboardEntry[], currentUserId?: string): LeaderboardEntry[] {
  return rows.map(row => ({
    rank: row.rank,
    userId: row.user_id,
    username: row.username ?? 'Anonymous',
    avatarInitials: (row.username ?? 'AN').slice(0, 2).toUpperCase(),
    score: Math.round(row.portfolio_value),
    returnPercent: row.return_percent,
    rankDelta: row.rank_change ?? 0,
    isCurrentUser: row.user_id === currentUserId,
  }))
}

export function useCompetitions(): CompetitionsState {
  const [isLoading, setIsLoading] = useState(true)
  const [challenges, setChallenges]       = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard]     = useState<LeaderboardEntry[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [userStats] = useState<UserCompeteStats>(MOCK_USER_STATS)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch published competitions
      const { data: comps } = await supabase
        .from('trading_competitions')
        .select('*')
        .eq('is_published', true)
        .order('start_date', { ascending: false })
        .limit(20)

      if (cancelled) return

      if (comps?.length) {
        const mapped = comps.map(mapCompetition)
        setChallenges(mapped)

        // Build upcoming events from future comps
        const upcoming: UpcomingEvent[] = comps
          .filter(c => new Date(c.start_date) > new Date())
          .slice(0, 5)
          .map(c => ({
            id: c.id,
            title: c.title,
            date: new Date(c.start_date),
            type: 'trading' as const,
          }))
        setUpcomingEvents(upcoming)

        // Fetch leaderboard for the most recent active competition
        const active = comps.find(c => {
          const now = new Date()
          return new Date(c.start_date) <= now && new Date(c.end_date) >= now
        }) ?? comps[0]

        if (active) {
          const { data: lb } = await supabase
            .from('leaderboard_cache')
            .select('*')
            .eq('competition_id', active.id)
            .order('rank', { ascending: true })
            .limit(50)

          if (!cancelled && lb?.length) {
            setLeaderboard(mapLeaderboard(lb as DbLeaderboardEntry[], user?.id))
          }
        }
      }

      if (!cancelled) setIsLoading(false)
    }

    load().catch(() => setIsLoading(false))
    return () => { cancelled = true }
  }, [])

  return { challenges, leaderboard, upcomingEvents, userStats, isLoading }
}
