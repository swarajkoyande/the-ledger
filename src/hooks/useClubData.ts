import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ClubData {
  id: string
  name: string
  school: string | null
  region: string | null
  country: string | null
  description: string | null
  president_id: string
}

export interface ClubMember {
  user_id: string
  display_name: string | null
  custom_role: string | null
  xp: number
  joined_at: string
}

export interface ClubPost {
  id: string
  user_id: string
  display_name: string | null
  content: string
  created_at: string
  likes_count?: number
}

export interface ClubStats {
  member_count: number
  total_xp: number
  competition_count: number
}

export function useMyClub(userId: string | undefined) {
  const [club, setClub]       = useState<ClubData | null>(null)
  const [members, setMembers] = useState<ClubMember[]>([])
  const [posts, setPosts]     = useState<ClubPost[]>([])
  const [stats, setStats]     = useState<ClubStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    async function load() {
      setLoading(true)

      // Check if user is president
      const { data: presidingClub } = await supabase
        .from('clubs')
        .select('*')
        .eq('president_id', userId)
        .maybeSingle()

      // Check if user is a member
      const { data: membership } = await supabase
        .from('club_memberships')
        .select('club_id')
        .eq('user_id', userId)
        .maybeSingle()

      const clubId = presidingClub?.id ?? membership?.club_id ?? null

      if (!clubId) { setLoading(false); return }

      // Fetch club details if not already from presidency check
      let clubData: ClubData | null = presidingClub ?? null
      if (!clubData) {
        const { data } = await supabase.from('clubs').select('*').eq('id', clubId).single()
        clubData = data
      }
      setClub(clubData)

      // Fetch members with profiles
      const { data: memberRows } = await supabase
        .from('club_memberships')
        .select('user_id, custom_role, joined_at, profiles(display_name, xp)')
        .eq('club_id', clubId)
        .order('joined_at', { ascending: true })

      if (memberRows) {
        setMembers(memberRows.map(r => {
          const p = r.profiles as unknown as { display_name: string | null; xp: number } | null
          return {
            user_id: r.user_id,
            display_name: p?.display_name ?? null,
            custom_role: r.custom_role,
            xp: p?.xp ?? 0,
            joined_at: r.joined_at,
          }
        }))
      }

      // Fetch club posts
      const { data: postRows } = await supabase
        .from('club_posts')
        .select('id, user_id, content, created_at, profiles(display_name)')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (postRows) {
        setPosts(postRows.map(r => {
          const p = r.profiles as unknown as { display_name: string | null } | null
          return {
            id: r.id,
            user_id: r.user_id,
            display_name: p?.display_name ?? null,
            content: r.content,
            created_at: r.created_at,
          }
        }))
      }

      // Stats
      const memberCount = memberRows?.length ?? 0
      const totalXp = memberRows?.reduce((sum, r) => {
        const p = r.profiles as unknown as { xp: number } | null
        return sum + (p?.xp ?? 0)
      }, 0) ?? 0
      const { count: compCount } = await supabase
        .from('club_competitions')
        .select('id', { count: 'exact', head: true })
        .eq('club_id', clubId)

      setStats({ member_count: memberCount, total_xp: totalXp, competition_count: compCount ?? 0 })
      setLoading(false)
    }

    load()
  }, [userId])

  return { club, members, posts, stats, loading }
}
