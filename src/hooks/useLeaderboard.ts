import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface LeaderboardEntry {
  id: string
  display_name: string | null
  country: string | null
  xp: number
  rank: number
  isMe?: boolean
}

export function useLeaderboard(userId: string | undefined, limit = 10) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [myRank, setMyRank]   = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, country, xp')
        .order('xp', { ascending: false })
        .limit(limit)

      if (!data) { setLoading(false); return }

      const ranked: LeaderboardEntry[] = data.map((p, i) => ({
        id: p.id,
        display_name: p.display_name,
        country: p.country,
        xp: p.xp,
        rank: i + 1,
        isMe: p.id === userId,
      }))

      setEntries(ranked)

      const meInList = ranked.find(e => e.isMe)
      if (meInList) {
        setMyRank(meInList.rank)
      } else if (userId) {
        // User is outside top N — get their actual rank
        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gt('xp', data[data.length - 1]?.xp ?? 0)
        setMyRank((count ?? 0) + 1)
      }

      setLoading(false)
    }

    load()
  }, [userId, limit])

  return { entries, myRank, loading }
}
