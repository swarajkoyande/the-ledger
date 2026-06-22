import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, User, Shield, Bell, AlertTriangle, Check, ChevronRight } from 'lucide-react'
import { useDesktopAuth } from '../../contexts/DesktopAuth'
import type { MemberType } from '../../contexts/DesktopAuth'
import { supabase } from '../../lib/supabase'

const N = '#0A1F44'
const O = '#fd761a'
const BG = '#f7f9fb'
const W = '#ffffff'
const MT = '#191c1e'
const ST = '#44464e'
const GT = '#75777f'
const CA = '#eceef0'
const SH = '0 4px 16px rgba(0,0,0,0.06)'
const SHD = '0 12px 24px rgba(10,31,68,0.18)'

const GLASS_ICON = {
  background: 'rgba(255,255,255,0.78)',
  backdropFilter: 'blur(12px) saturate(160%)',
  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.82)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 8px rgba(10,31,68,0.08)',
}

function GlassToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      style={{
        flexShrink: 0,
        width: 51,
        height: 31,
        borderRadius: 16,
        background: value ? O : 'rgba(120,120,128,0.16)',
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        border: `1px solid ${value ? 'rgba(253,118,26,0.35)' : 'rgba(255,255,255,0.55)'}`,
        boxShadow: value
          ? '0 0 0 3px rgba(253,118,26,0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 8px rgba(10,31,68,0.06)',
        transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 27,
          height: 27,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '0.5px solid rgba(0,0,0,0.04)',
        }}
      />
    </motion.button>
  )
}

const MEMBER_OPTIONS: { type: MemberType; label: string; description: string }[] = [
  {
    type: 'user',
    label: 'Explorer',
    description: 'Independent learner — no club affiliation. Access all courses and leaderboards.',
  },
  {
    type: 'club_member',
    label: 'Club Member',
    description: 'Member of a Ledger club. Earn club XP, join club challenges, and collaborate.',
  },
  {
    type: 'club_president',
    label: 'Club President',
    description: 'Lead your school\'s Ledger club. Manage members, host events, and set goals.',
  },
]

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const { profile, user, refreshProfile, signOut } = useDesktopAuth()

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [school, setSchool] = useState(profile?.school ?? '')
  const [country, setCountry] = useState(profile?.country ?? '')
  const [region, setRegion] = useState(profile?.region ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [memberType, setMemberType] = useState<MemberType>(profile?.member_type ?? 'user')
  const [memberSaving, setMemberSaving] = useState(false)

  const [signingOut, setSigningOut] = useState(false)

  const [notifPush,    setNotifPush]    = useState(true)
  const [notifEmail,   setNotifEmail]   = useState(false)
  const [notifStreak,  setNotifStreak]  = useState(true)
  const [notifQuiz,    setNotifQuiz]    = useState(true)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '')
      setSchool(profile.school ?? '')
      setCountry(profile.country ?? '')
      setRegion(profile.region ?? '')
      setBio(profile.bio ?? '')
      setMemberType(profile.member_type)
    }

    async function loadPrefs() {
      if (!user) return
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('notif_push, notif_email, notif_streak, notif_quiz')
        .eq('user_id', user.id)
        .maybeSingle()
      if (prefs) {
        setNotifPush(prefs.notif_push ?? true)
        setNotifEmail(prefs.notif_email ?? false)
        setNotifStreak(prefs.notif_streak ?? true)
        setNotifQuiz(prefs.notif_quiz ?? true)
      }
    }
    loadPrefs()
  }, [profile])

  async function handleSaveAccount() {
    if (!user) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, school, country, region, bio })
      .eq('id', user.id)

    if (error) {
      setSaveError(error.message)
    } else {
      await refreshProfile()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    }
    setSaving(false)
  }

  async function saveNotifPrefs(patch: Record<string, boolean>) {
    if (!user) return
    await supabase.from('user_preferences').upsert(
      { user_id: user.id, ...patch, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  }

  async function handleMemberTypeChange(type: MemberType) {
    if (!user || type === memberType) return
    setMemberSaving(true)
    setMemberType(type)

    await supabase
      .from('profiles')
      .update({ member_type: type })
      .eq('id', user.id)

    await refreshProfile()
    setMemberSaving(false)
  }

  async function saveNotifPrefs(patch: Partial<{ notif_push: boolean; notif_email: boolean; notif_streak: boolean; notif_quiz: boolean }>) {
    if (!user) return
    await supabase.from('user_preferences').upsert({
      user_id: user.id,
      ...patch,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    onBack()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: `1.5px solid ${CA}`,
    borderRadius: 12,
    fontSize: 15,
    color: MT,
    background: BG,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: GT,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 6,
    fontFamily: 'Inter, sans-serif',
  }

  const sectionCardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(16px) saturate(140%)',
    WebkitBackdropFilter: 'blur(16px) saturate(140%)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 4px 16px rgba(10,31,68,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
    borderRadius: 20,
    padding: '20px 20px 24px',
    marginBottom: 16,
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: GT,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 18,
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        fontFamily: 'Inter, sans-serif',
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(247,249,251,0.88)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: '1px solid rgba(255,255,255,0.6)',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: SH,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: N,
            borderRadius: 8,
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.2} />
        </button>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: MT,
            letterSpacing: '-0.01em',
          }}
        >
          Settings
        </span>
      </div>

      <div style={{ padding: '24px 20px 0' }}>

        {/* Account Section */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, ...GLASS_ICON, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color={N} />
            </div>
            <span style={{ ...sectionTitleStyle, marginBottom: 0 }}>Account</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={labelStyle}>Display Name</div>
              <input
                style={inputStyle}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                onFocus={e => (e.currentTarget.style.borderColor = O)}
                onBlur={e => (e.currentTarget.style.borderColor = CA)}
              />
            </div>

            <div>
              <div style={labelStyle}>School</div>
              <input
                style={inputStyle}
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="Your school"
                onFocus={e => (e.currentTarget.style.borderColor = O)}
                onBlur={e => (e.currentTarget.style.borderColor = CA)}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>Country</div>
                <input
                  style={inputStyle}
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Country"
                  onFocus={e => (e.currentTarget.style.borderColor = O)}
                  onBlur={e => (e.currentTarget.style.borderColor = CA)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>Region</div>
                <select
                  style={{ ...inputStyle, appearance: 'none' as const, WebkitAppearance: 'none' }}
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="Asia-Pacific">Asia-Pacific</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Africa">Africa</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <div style={labelStyle}>Bio</div>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 80,
                  resize: 'vertical',
                  lineHeight: 1.5,
                }}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell your story..."
                onFocus={e => (e.currentTarget.style.borderColor = O)}
                onBlur={e => (e.currentTarget.style.borderColor = CA)}
              />
            </div>

            {saveError && (
              <div
                style={{
                  background: '#fff1f0',
                  border: '1px solid #ffccc7',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#cf1322',
                }}
              >
                {saveError}
              </div>
            )}

            <button
              onClick={handleSaveAccount}
              disabled={saving}
              style={{
                width: '100%',
                padding: '13px 0',
                borderRadius: 14,
                border: 'none',
                background: saveSuccess ? '#16a34a' : N,
                color: W,
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s, opacity 0.2s',
                opacity: saving ? 0.7 : 1,
                fontFamily: 'Inter, sans-serif',
                boxShadow: SHD,
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={16} />
                  Saved
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Member Type Section */}
        <div style={sectionCardStyle}>
          <div style={{ marginBottom: 4 }}>
            <span style={sectionTitleStyle}>Member Type</span>
          </div>

          {memberType === 'user' ? null : (
            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: '#92400e',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              Changing to Explorer removes you from your club.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MEMBER_OPTIONS.map(opt => {
              const selected = memberType === opt.type
              return (
                <button
                  key={opt.type}
                  onClick={() => handleMemberTypeChange(opt.type)}
                  disabled={memberSaving}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: selected ? '2px solid rgba(253,118,26,0.5)' : '1.5px solid rgba(255,255,255,0.5)',
                    background: selected ? 'rgba(253,118,26,0.08)' : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: selected ? '0 0 0 4px rgba(253,118,26,0.08), inset 0 1px 0 rgba(255,255,255,0.6)' : 'inset 0 1px 0 rgba(255,255,255,0.6)',
                    cursor: memberSaving ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, background 0.15s',
                    opacity: memberSaving && !selected ? 0.6 : 1,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${selected ? O : GT}`,
                      background: selected ? O : 'transparent',
                      flexShrink: 0,
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {selected && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: W,
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: selected ? O : MT,
                        marginBottom: 4,
                        fontFamily: 'Inter, sans-serif',
                        transition: 'color 0.15s',
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: ST,
                        lineHeight: 1.5,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {opt.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications Section */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, ...GLASS_ICON, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} color={N} />
            </div>
            <span style={{ ...sectionTitleStyle, marginBottom: 0 }}>Notifications</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {([
              { label: 'Push Notifications', sub: 'App alerts on your device',        value: notifPush,   dbKey: 'notif_push',   set: setNotifPush   },
              { label: 'Email Digest',        sub: 'Weekly summary to your inbox',     value: notifEmail,  dbKey: 'notif_email',  set: setNotifEmail  },
              { label: 'Streak Reminders',    sub: 'Daily nudge to keep your streak',  value: notifStreak, dbKey: 'notif_streak', set: setNotifStreak },
              { label: 'Daily Quiz Alert',    sub: 'Remind me when the quiz resets',   value: notifQuiz,   dbKey: 'notif_quiz',   set: setNotifQuiz   },
            ] as const).map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${CA}` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: MT, fontFamily: 'Inter, sans-serif' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: GT, marginTop: 2, fontFamily: 'Inter, sans-serif' }}>{item.sub}</div>
                </div>
                <GlassToggle value={item.value} onChange={v => { item.set(v); saveNotifPrefs({ [item.dbKey]: v }) }} />
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, ...GLASS_ICON, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} color={N} />
            </div>
            <span style={{ ...sectionTitleStyle, marginBottom: 0 }}>Security</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['Change Password', 'Privacy & Security'].map((item, i, arr) => (
              <button
                key={item}
                onClick={() => {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 2px',
                  background: 'none',
                  border: 'none',
                  borderBottom: i < arr.length - 1 ? `1px solid ${CA}` : 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: MT,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {item}
                </span>
                <ChevronRight size={18} color={GT} />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div
          style={{
            ...sectionCardStyle,
            border: '1.5px solid #fecaca',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                ...sectionTitleStyle,
                color: '#dc2626',
                marginBottom: 0,
              }}
            >
              Danger Zone
            </span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 14,
              border: '1.5px solid #dc2626',
              background: signingOut ? '#fee2e2' : '#fff1f0',
              color: '#dc2626',
              fontSize: 15,
              fontWeight: 700,
              cursor: signingOut ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s, opacity 0.15s',
              opacity: signingOut ? 0.7 : 1,
            }}
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

      </div>
    </div>
  )
}
