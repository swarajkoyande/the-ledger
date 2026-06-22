import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface RealClub {
  id: string
  name: string
  description: string | null
  country_code: string | null
  member_count: number
  my_role: 'manager' | 'member'
}

export interface RealMember {
  id: string
  user_id: string
  role: 'manager' | 'member'
  joined_at: string
  first_name: string
  last_name: string
  avatar_url: string | null
  xp: number
}

export interface RealChannel {
  id: string
  name: string
  club_id: string
}

export interface RealMessage {
  id: string
  channel_id: string
  sender_id: string
  content: string
  created_at: string
  is_deleted: boolean
  sender_first_name: string
  sender_last_name: string
  sender_avatar_url: string | null
}

export interface DesktopClubsState {
  clubs: RealClub[]
  activeClub: RealClub | null
  members: RealMember[]
  channels: RealChannel[]
  messages: RealMessage[]
  isLoading: boolean
  currentUserId: string | null
  sendMessage: (channelId: string, content: string) => Promise<void>
  selectClub: (club: RealClub) => void
  selectChannel: (channel: RealChannel) => void
  activeChannel: RealChannel | null
}

export function useDesktopClubs(): DesktopClubsState {
  const [clubs, setClubs]               = useState<RealClub[]>([])
  const [activeClub, setActiveClub]     = useState<RealClub | null>(null)
  const [members, setMembers]           = useState<RealMember[]>([])
  const [channels, setChannels]         = useState<RealChannel[]>([])
  const [activeChannel, setActiveChannel] = useState<RealChannel | null>(null)
  const [messages, setMessages]         = useState<RealMessage[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Load user's clubs on mount
  useEffect(() => {
    let cancelled = false

    async function loadClubs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      setCurrentUserId(user.id)

      const { data: memberships } = await supabase
        .from('club_members')
        .select('club_id, role')
        .eq('user_id', user.id)

      if (!memberships?.length || cancelled) { setIsLoading(false); return }

      const clubIds = memberships.map(m => m.club_id)
      const { data: clubRows } = await supabase
        .from('clubs')
        .select('id, name, description, country_code')
        .in('id', clubIds)

      if (!clubRows || cancelled) { setIsLoading(false); return }

      // Count members per club
      const { data: counts } = await supabase
        .from('club_members')
        .select('club_id')
        .in('club_id', clubIds)

      const countMap: Record<string, number> = {}
      counts?.forEach(c => { countMap[c.club_id] = (countMap[c.club_id] || 0) + 1 })

      const roleMap: Record<string, 'manager' | 'member'> = {}
      memberships.forEach(m => { roleMap[m.club_id] = m.role as 'manager' | 'member' })

      const mapped: RealClub[] = clubRows.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        country_code: c.country_code ?? null,
        member_count: countMap[c.id] || 0,
        my_role: roleMap[c.id],
      }))

      if (!cancelled) {
        setClubs(mapped)
        if (mapped.length) setActiveClub(mapped[0])
        setIsLoading(false)
      }
    }

    loadClubs().catch(() => setIsLoading(false))
    return () => { cancelled = true }
  }, [])

  // Load members + channels when active club changes
  useEffect(() => {
    if (!activeClub) return
    let cancelled = false

    async function loadClubData() {
      // Members
      const { data: memberRows } = await supabase
        .from('club_members')
        .select('id, user_id, role, joined_at')
        .eq('club_id', activeClub!.id)

      if (!memberRows || cancelled) return

      const userIds = memberRows.map(m => m.user_id)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds)

      // Fetch XP from user_status or xp_activity_log total
      const { data: xpRows } = await supabase
        .from('xp_activity_log')
        .select('user_id, xp_awarded')
        .in('user_id', userIds)

      const xpMap: Record<string, number> = {}
      xpRows?.forEach(x => {
        xpMap[x.user_id] = (xpMap[x.user_id] || 0) + (x.xp_awarded || 0)
      })

      const profileMap: Record<string, { first_name: string; last_name: string; avatar_url: string | null }> = {}
      profiles?.forEach(p => { profileMap[p.id] = p })

      if (!cancelled) {
        setMembers(memberRows.map(m => ({
          id: m.id,
          user_id: m.user_id,
          role: m.role as 'manager' | 'member',
          joined_at: m.joined_at,
          first_name: profileMap[m.user_id]?.first_name ?? 'Unknown',
          last_name: profileMap[m.user_id]?.last_name ?? '',
          avatar_url: profileMap[m.user_id]?.avatar_url ?? null,
          xp: xpMap[m.user_id] || 0,
        })))
      }

      // Channels
      const { data: channelRows } = await supabase
        .from('channels')
        .select('id, name, club_id')
        .eq('club_id', activeClub!.id)
        .order('created_at', { ascending: true })

      if (!cancelled && channelRows) {
        setChannels(channelRows)
        setActiveChannel(channelRows[0] ?? null)
      }
    }

    loadClubData().catch(console.error)
    return () => { cancelled = true }
  }, [activeClub?.id])

  // Load messages when active channel changes
  useEffect(() => {
    if (!activeChannel) return
    let cancelled = false

    async function loadMessages() {
      const { data: msgRows } = await supabase
        .from('club_messages')
        .select('id, channel_id, sender_id, content, created_at, is_deleted')
        .eq('channel_id', activeChannel!.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(50)

      if (!msgRows || cancelled) return

      const senderIds = [...new Set(msgRows.map(m => m.sender_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', senderIds)

      const profileMap: Record<string, { first_name: string; last_name: string; avatar_url: string | null }> = {}
      profiles?.forEach(p => { profileMap[p.id] = p })

      if (!cancelled) {
        setMessages(msgRows.map(m => ({
          id: m.id,
          channel_id: m.channel_id,
          sender_id: m.sender_id,
          content: m.content,
          created_at: m.created_at,
          is_deleted: m.is_deleted,
          sender_first_name: profileMap[m.sender_id]?.first_name ?? 'Unknown',
          sender_last_name: profileMap[m.sender_id]?.last_name ?? '',
          sender_avatar_url: profileMap[m.sender_id]?.avatar_url ?? null,
        })))
      }
    }

    loadMessages().catch(console.error)

    // Realtime subscription for new messages
    const sub = supabase
      .channel(`desktop-messages:${activeChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'club_messages',
        filter: `channel_id=eq.${activeChannel.id}`,
      }, async payload => {
        const msg = payload.new as { id: string; channel_id: string; sender_id: string; content: string; created_at: string; is_deleted: boolean }
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .eq('id', msg.sender_id)

        const p = profiles?.[0]
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, {
            id: msg.id,
            channel_id: msg.channel_id,
            sender_id: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            is_deleted: msg.is_deleted,
            sender_first_name: p?.first_name ?? 'Unknown',
            sender_last_name: p?.last_name ?? '',
            sender_avatar_url: p?.avatar_url ?? null,
          }]
        })
      })
      .subscribe()

    return () => {
      cancelled = true
      sub.unsubscribe()
    }
  }, [activeChannel?.id])

  async function sendMessage(channelId: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('club_messages')
      .insert({ channel_id: channelId, sender_id: user.id, content })
  }

  function selectClub(club: RealClub) {
    setActiveClub(club)
    setMembers([])
    setChannels([])
    setMessages([])
    setActiveChannel(null)
  }

  function selectChannel(channel: RealChannel) {
    setActiveChannel(channel)
    setMessages([])
  }

  return {
    clubs, activeClub, members, channels, messages,
    isLoading, currentUserId,
    sendMessage, selectClub, selectChannel, activeChannel,
  }
}
