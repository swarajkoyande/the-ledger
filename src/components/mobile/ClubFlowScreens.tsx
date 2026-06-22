import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Users, MapPin, User, ChevronRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useDesktopAuth } from '../../contexts/DesktopAuth';
import { supabase } from '../../lib/supabase';

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

interface Club {
  id: string;
  name: string;
  school: string;
  country: string;
  region: string | null;
  profiles: { display_name: string } | null;
  member_count: number;
}

export function JoinClubScreen({ onBack, onJoined }: { onBack: () => void; onJoined: () => void }) {
  const { user } = useDesktopAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [alreadyInClub, setAlreadyInClub] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestSentClubId, setRequestSentClubId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;

      const { data: membership } = await supabase
        .from('club_memberships')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'member')
        .maybeSingle();

      if (membership) {
        setAlreadyInClub(true);
        setLoading(false);
        return;
      }

      const { data: pendingRows } = await supabase
        .from('club_memberships')
        .select('club_id')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (pendingRows && pendingRows.length > 0) {
        setRequestSentClubId(pendingRows[0].club_id);
      }

      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('id, name, school, country, region, profiles!president_id(display_name)');

      if (fetchError) {
        setError('Failed to load clubs.');
        setLoading(false);
        return;
      }

      const clubsWithCounts: Club[] = await Promise.all(
        (data ?? []).map(async (club: any) => {
          const { count } = await supabase
            .from('club_memberships')
            .select('id', { count: 'exact', head: true })
            .eq('club_id', club.id);
          return {
            ...club,
            profiles: Array.isArray(club.profiles) ? club.profiles[0] ?? null : club.profiles,
            member_count: count ?? 0,
          };
        })
      );

      setClubs(clubsWithCounts);
      setLoading(false);
    }

    load();
  }, [user]);

  async function handleJoin(clubId: string) {
    if (!user) return;
    setJoiningId(clubId);
    setError(null);

    const { error: insertError } = await supabase
      .from('club_memberships')
      .insert({ club_id: clubId, user_id: user.id, status: 'pending' });

    if (insertError) {
      setError('Failed to join club. Please try again.');
      setJoiningId(null);
      return;
    }

    setJoiningId(null);
    setRequestSentClubId(clubId);
  }

  const filtered = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: N, padding: '20px 20px 24px', position: 'relative' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, color: W, marginBottom: 20 }}
        >
          <ArrowLeft size={20} color={W} />
          <span style={{ fontSize: 14, color: W, opacity: 0.8 }}>Back</span>
        </button>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: W, letterSpacing: -0.5 }}>Join a Club</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Find your school's chapter</p>
      </div>

      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} color={GT} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name or school…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              borderRadius: 14,
              border: `1.5px solid ${CA}`,
              background: W,
              fontSize: 15,
              color: MT,
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: SH,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', padding: 4 }}
            >
              <X size={14} color={GT} />
            </button>
          )}
        </div>

        {/* Already in club */}
        {alreadyInClub && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: W,
              borderRadius: 18,
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: SH,
              border: `1.5px solid ${CA}`,
            }}
          >
            <CheckCircle size={40} color={O} style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: MT }}>You're already in a club</p>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: ST }}>Head back to your Club tab to see your chapter.</p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#fff5f5',
              border: '1.5px solid #ffd0d0',
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={16} color="#c0392b" />
            <span style={{ fontSize: 14, color: '#c0392b' }}>{error}</span>
          </motion.div>
        )}

        {/* Loading */}
        {loading && !alreadyInClub && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 110,
                  borderRadius: 18,
                  background: `linear-gradient(90deg, ${CA} 0%, #f0f2f4 50%, ${CA} 100%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !alreadyInClub && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '48px 24px' }}
          >
            <Users size={40} color={CA} style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: ST }}>No clubs found</p>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: GT }}>Try a different search term.</p>
          </motion.div>
        )}

        {/* Club cards */}
        {!loading && !alreadyInClub && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {filtered.map((club, i) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 16px rgba(10,31,68,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                    borderRadius: 18,
                    padding: '18px 18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: MT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {club.name}
                      </p>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: ST, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {club.school}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} color={GT} />
                          <span style={{ fontSize: 12, color: GT }}>
                            {[club.country, club.region].filter(Boolean).join(', ')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={12} color={GT} />
                          <span style={{ fontSize: 12, color: GT }}>{club.member_count} members</span>
                        </div>
                        {club.profiles?.display_name && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <User size={12} color={GT} />
                            <span style={{ fontSize: 12, color: GT }}>{club.profiles.display_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => requestSentClubId === club.id ? undefined : handleJoin(club.id)}
                      disabled={joiningId === club.id || requestSentClubId === club.id}
                      style={{
                        background: requestSentClubId === club.id ? CA : joiningId === club.id ? CA : 'rgba(10,31,68,0.88)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: (joiningId === club.id || requestSentClubId === club.id) ? 'none' : '0 4px 16px rgba(10,31,68,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                        color: (joiningId === club.id || requestSentClubId === club.id) ? GT : 'white',
                        borderRadius: 12,
                        padding: '10px 18px',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: (joiningId === club.id || requestSentClubId === club.id) ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'background 0.2s, transform 0.1s',
                      }}
                    >
                      {requestSentClubId === club.id ? 'Request Sent ✓' : joiningId === club.id ? 'Joining…' : 'Join'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

interface FormState {
  name: string;
  school: string;
  country: string;
  region: string;
  description: string;
}

interface FormErrors {
  name?: string;
  school?: string;
}

export function CreateClubScreen({ onBack, onCreated }: { onBack: () => void; onCreated: () => void }) {
  const { user } = useDesktopAuth();
  const [form, setForm] = useState<FormState>({ name: '', school: '', country: '', region: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Club name is required.';
    if (!form.school.trim()) next.school = 'School name is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !user) return;

    setSubmitting(true);
    setServerError(null);

    const { error: insertError } = await supabase.from('clubs').insert({
      name: form.name.trim(),
      school: form.school.trim(),
      country: form.country.trim() || null,
      region: form.region.trim() || null,
      description: form.description.trim() || null,
      president_id: user.id,
    });

    if (insertError) {
      setServerError('Failed to create club. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onCreated();
    }, 1600);
  }

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '13px 14px',
    borderRadius: 14,
    border: `1.5px solid ${hasError ? '#e74c3c' : 'rgba(255,255,255,0.6)'}`,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontSize: 15,
    color: MT,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
    boxShadow: SH,
    transition: 'border-color 0.2s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: ST,
    marginBottom: 6,
    letterSpacing: 0.1,
  };

  const fieldErrorStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 5,
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: N, padding: '20px 20px 28px', position: 'relative' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8, color: W, marginBottom: 20 }}
        >
          <ArrowLeft size={20} color={W} />
          <span style={{ fontSize: 14, color: W, opacity: 0.8 }}>Back</span>
        </button>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: W, letterSpacing: -0.5 }}>Create Your Club</h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Start a chapter at your school</p>
      </div>

      <div style={{ flex: 1, padding: '24px 16px 40px', overflowY: 'auto' }}>
        {/* Success state */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 8px 32px rgba(10,31,68,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
                borderRadius: 20,
                padding: '36px 24px',
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
              >
                <CheckCircle size={48} color={O} style={{ marginBottom: 16 }} />
              </motion.div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: MT }}>Club created!</p>
              <p style={{ margin: '10px 0 0', fontSize: 14, color: ST }}>Your chapter is live. Redirecting you now…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!submitted && (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#fff5f5',
                  border: '1.5px solid #ffd0d0',
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <AlertCircle size={16} color="#c0392b" />
                <span style={{ fontSize: 14, color: '#c0392b' }}>{serverError}</span>
              </motion.div>
            )}

            {/* Club Name */}
            <div>
              <label style={labelStyle}>
                Club Name <span style={{ color: O }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. The Ledger – Keio Chapter"
                value={form.name}
                onChange={update('name')}
                style={inputStyle(!!errors.name)}
              />
              {errors.name && <p style={fieldErrorStyle}>{errors.name}</p>}
            </div>

            {/* School */}
            <div>
              <label style={labelStyle}>
                School <span style={{ color: O }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Keio Senior High School"
                value={form.school}
                onChange={update('school')}
                style={inputStyle(!!errors.school)}
              />
              {errors.school && <p style={fieldErrorStyle}>{errors.school}</p>}
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country</label>
              <input
                type="text"
                placeholder="e.g. Japan"
                value={form.country}
                onChange={update('country')}
                style={inputStyle()}
              />
            </div>

            {/* Region */}
            <div>
              <label style={labelStyle}>Region / State / Prefecture</label>
              <input
                type="text"
                placeholder="e.g. Tokyo"
                value={form.region}
                onChange={update('region')}
                style={inputStyle()}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                placeholder="What makes your chapter unique? (optional)"
                value={form.description}
                onChange={update('description')}
                rows={4}
                style={{
                  ...inputStyle(),
                  resize: 'vertical',
                  lineHeight: 1.55,
                  minHeight: 100,
                }}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              style={{
                background: submitting ? CA : N,
                color: submitting ? GT : W,
                border: 'none',
                borderRadius: 16,
                padding: '16px',
                fontSize: 16,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                width: '100%',
                marginTop: 6,
                boxShadow: submitting ? 'none' : SHD,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Creating…' : 'Create Club'}
              {!submitting && <ChevronRight size={18} color={W} />}
            </motion.button>

            <p style={{ textAlign: 'center', fontSize: 12, color: GT, margin: 0 }}>
              You'll be set as club president automatically.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
