import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Reply, Share2, X, ChevronDown, Users } from 'lucide-react';
import { useDesktopAuth } from '../../contexts/DesktopAuth';
import { supabase } from '../../lib/supabase';

// Palette
const N = '#0A1F44';
const O = '#fd761a';
const BG = '#f7f9fb';
const W = '#ffffff';
const MT = '#191c1e';
const ST = '#44464e';
const GT = '#75777f';
const CA = '#eceef0';
const SH = '0 4px 16px rgba(0,0,0,0.06)';
const SHD = '0 12px 24px rgba(10,31,68,0.18)';

const TOPICS = ['All', 'Markets', 'Economics', 'IB', 'Strategy', 'Finance'];
const REGIONS = ['All Regions', 'Asia', 'Europe', 'Americas', 'MENA', 'Africa'];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function avatarInitial(name?: string): string {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  topic: string | null;
  region: string | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
  profiles: { display_name: string } | null;
  liked?: boolean;
}

interface SocialTabProps {
  userId?: string;
  memberType?: string;
  onGoToClub?: () => void;
}

export default function SocialTab({ userId, memberType, onGoToClub }: SocialTabProps) {
  const isClubMember =
    memberType === 'club_member' || memberType === 'club_president';

  const [activeView, setActiveView] = useState<'feed' | 'club'>('feed');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [composerText, setComposerText] = useState('');
  const [composerTopic, setComposerTopic] = useState('Markets');
  const [posting, setPosting] = useState(false);
  const [showDMSheet, setShowDMSheet] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setShowRegionDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchProfile() {
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .single();
    if (data) setDisplayName(data.display_name ?? '');
  }

  async function fetchPosts() {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, user_id, content, topic, region, likes_count, replies_count, created_at, profiles(display_name)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      // Check which posts the current user has liked
      let likedIds: Set<string> = new Set();
      if (userId) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId);
        if (likes) likedIds = new Set(likes.map((l: { post_id: string }) => l.post_id));
      }
      setPosts(
        (data as unknown as Post[]).map((p) => ({
          ...p,
          liked: likedIds.has(p.id),
        }))
      );
    }
    setLoadingPosts(false);
  }

  async function handlePost() {
    if (!composerText.trim() || !userId) return;
    setPosting(true);
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: composerText.trim(),
        topic: composerTopic,
        region: selectedRegion === 'All Regions' ? null : selectedRegion,
      })
      .select('id, user_id, content, topic, region, likes_count, replies_count, created_at, profiles(display_name)')
      .single();

    if (!error && data) {
      setPosts((prev) => [{ ...(data as unknown as Post), liked: false }, ...prev]);
      setComposerText('');
    }
    setPosting(false);
  }

  async function handleLike(post: Post) {
    if (!userId) return;
    if (post.liked) {
      await supabase.from('post_likes').delete().match({ user_id: userId, post_id: post.id });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, liked: false, likes_count: Math.max(0, p.likes_count - 1) } : p
        )
      );
    } else {
      await supabase.from('post_likes').insert({ user_id: userId, post_id: post.id });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, liked: true, likes_count: p.likes_count + 1 } : p
        )
      );
    }
  }

  const filteredPosts = posts.filter((p) => {
    const topicMatch = selectedTopic === 'All' || p.topic === selectedTopic;
    const regionMatch =
      selectedRegion === 'All Regions' || p.region === selectedRegion || p.region === null;
    return topicMatch && regionMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: BG }}>
      {/* Header */}
      <div
        style={{
          background: W,
          padding: '16px 20px 12px',
          borderBottom: `1px solid ${CA}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color: MT, letterSpacing: '-0.3px' }}>
          Social
        </span>
        <button
          onClick={() => setShowDMSheet(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 10,
            color: N,
          }}
          aria-label="Direct messages"
        >
          <MessageCircle size={22} />
        </button>
      </div>

      {/* View Pills */}
      <div
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 50,
          padding: '10px 20px 10px',
          display: 'flex',
          gap: 8,
          borderBottom: `1px solid ${CA}`,
        }}
      >
        {(['feed', ...(isClubMember ? ['club'] : [])] as ('feed' | 'club')[]).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              padding: '6px 18px',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.18s ease',
              ...(activeView === view
                ? {
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 2px 8px rgba(10,31,68,0.10)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    color: N,
                  }
                : {
                    background: CA,
                    border: 'none',
                    color: ST,
                  }),
            }}
          >
            {view === 'feed' ? 'Feed' : 'Club'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeView === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Filter Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  overflowX: 'auto',
                  background: W,
                  borderBottom: `1px solid ${CA}`,
                }}
              >
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 16,
                      border: `1.5px solid ${selectedTopic === topic ? N : CA}`,
                      background: selectedTopic === topic ? N : W,
                      color: selectedTopic === topic ? W : ST,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.16s ease',
                    }}
                  >
                    {topic}
                  </button>
                ))}

                {/* Region button */}
                <div ref={regionRef} style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => setShowRegionDropdown((v) => !v)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 16,
                      border: `1.5px solid ${selectedRegion !== 'All Regions' ? O : CA}`,
                      background: selectedRegion !== 'All Regions' ? O : W,
                      color: selectedRegion !== 'All Regions' ? W : ST,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {selectedRegion === 'All Regions' ? 'Region' : selectedRegion}
                    <ChevronDown size={13} />
                  </button>
                  <AnimatePresence>
                    {showRegionDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          position: 'absolute',
                          top: '110%',
                          left: 0,
                          background: W,
                          borderRadius: 12,
                          boxShadow: SHD,
                          zIndex: 100,
                          minWidth: 150,
                          overflow: 'hidden',
                        }}
                      >
                        {REGIONS.map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setSelectedRegion(r);
                              setShowRegionDropdown(false);
                            }}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px 16px',
                              textAlign: 'left',
                              background: selectedRegion === r ? BG : W,
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: 13,
                              color: selectedRegion === r ? N : MT,
                              fontWeight: selectedRegion === r ? 600 : 400,
                            }}
                          >
                            {r}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Post Composer */}
              {userId && (
                <div
                  style={{
                    margin: '16px 16px 4px',
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px rgba(10,31,68,0.04)',
                    borderRadius: 16,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: N,
                        color: W,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {avatarInitial(displayName)}
                    </div>
                    <textarea
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder="Share a market insight, economic view, or question…"
                      rows={3}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: 14,
                        color: MT,
                        background: 'transparent',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10,
                    }}
                  >
                    <select
                      value={composerTopic}
                      onChange={(e) => setComposerTopic(e.target.value)}
                      style={{
                        fontSize: 12,
                        color: ST,
                        border: `1px solid ${CA}`,
                        borderRadius: 8,
                        padding: '4px 8px',
                        background: BG,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {TOPICS.filter((t) => t !== 'All').map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handlePost}
                      disabled={!composerText.trim() || posting}
                      style={{
                        padding: '7px 18px',
                        borderRadius: 20,
                        border: 'none',
                        background: composerText.trim() ? O : CA,
                        color: composerText.trim() ? W : GT,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: composerText.trim() ? 'pointer' : 'default',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {posting ? 'Posting…' : 'Post'}
                    </button>
                  </div>
                </div>
              )}

              {/* Feed */}
              <div style={{ padding: '8px 16px 80px' }}>
                {loadingPosts ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: GT, fontSize: 14 }}>
                    Loading…
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: GT,
                      fontSize: 14,
                    }}
                  >
                    No posts yet — be the first to share something.
                  </div>
                ) : (
                  filteredPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      style={{
                        background: 'rgba(255,255,255,0.68)',
                        backdropFilter: 'blur(16px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                        border: '1px solid rgba(255,255,255,0.45)',
                        boxShadow: '0 4px 16px rgba(10,31,68,0.05), inset 0 1px 0 rgba(255,255,255,0.75)',
                        borderRadius: 16,
                        padding: '14px 16px',
                        marginBottom: 10,
                      }}
                    >
                      {/* Post header */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            background: N,
                            color: W,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {avatarInitial(post.profiles?.display_name)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: MT,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {post.profiles?.display_name ?? 'Anonymous'}
                          </div>
                          <div style={{ fontSize: 11, color: GT }}>{timeAgo(post.created_at)}</div>
                        </div>
                        {post.topic && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: N,
                              background: 'rgba(10,31,68,0.07)',
                              borderRadius: 8,
                              padding: '3px 8px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {post.topic}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <p
                        style={{
                          fontSize: 14,
                          color: ST,
                          lineHeight: 1.55,
                          margin: '0 0 10px',
                        }}
                      >
                        {post.content}
                      </p>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <button
                          onClick={() => handleLike(post)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: post.liked ? O : GT,
                            fontSize: 13,
                            padding: 0,
                            transition: 'color 0.15s ease',
                          }}
                        >
                          <Heart
                            size={16}
                            fill={post.liked ? O : 'none'}
                            strokeWidth={post.liked ? 0 : 2}
                          />
                          {post.likes_count > 0 && post.likes_count}
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: GT,
                            fontSize: 13,
                            padding: 0,
                          }}
                        >
                          <Reply size={16} />
                          {post.replies_count > 0 && post.replies_count}
                        </button>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: GT,
                            fontSize: 13,
                            padding: 0,
                            marginLeft: 'auto',
                          }}
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="club"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 32px',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(10,31,68,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={28} color={N} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: MT, marginBottom: 8 }}>
                  Club Discussion
                </div>
                <div style={{ fontSize: 14, color: GT, lineHeight: 1.5, maxWidth: 260 }}>
                  Your club discussion lives in the Clubs tab. Head there to chat with your members.
                </div>
              </div>
              <button
                onClick={onGoToClub}
                style={{
                  padding: '11px 28px',
                  borderRadius: 20,
                  border: 'none',
                  background: N,
                  color: W,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: SH,
                }}
              >
                Go to Clubs
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DM Sheet */}
      <AnimatePresence>
        {showDMSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowDMSheet(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#000',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: '20px 20px 0 0',
                zIndex: 201,
                padding: '20px 24px 48px',
                boxShadow: SHD,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: MT }}>Direct Messages</span>
                <button
                  onClick={() => setShowDMSheet(false)}
                  style={{
                    background: CA,
                    border: 'none',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ST,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(10,31,68,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <MessageCircle size={24} color={N} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: MT, marginBottom: 6 }}>
                  DMs coming soon
                </div>
                <div style={{ fontSize: 13, color: GT }}>
                  Direct messaging will be available in a future update.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
