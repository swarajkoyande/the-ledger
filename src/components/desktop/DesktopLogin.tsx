import { useState } from 'react'
import { useDesktopAuth } from '../../contexts/DesktopAuth'
import type { MemberType } from '../../contexts/DesktopAuth'

const N = '#0A1F44'
const O = '#fd761a'

const MEMBER_TYPES: { value: MemberType; label: string; description: string }[] = [
  {
    value: 'user',
    label: 'Explorer',
    description: 'Learn, trade, and engage in the global social feed. No club required.',
  },
  {
    value: 'club_member',
    label: 'Club Member',
    description: 'Join your school chapter. Access club discussions, assignments, and competitions.',
  },
  {
    value: 'club_president',
    label: 'Club President',
    description: 'Run your own chapter. Create assignments, host competitions, manage members.',
  },
]

export default function DesktopLogin() {
  const { signIn, signUp } = useDesktopAuth()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [displayName, setDisplayName] = useState('')
  const [memberType, setMemberType] = useState<MemberType>('user')
  const [error, setError]           = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signUp(email, password, memberType, displayName)
    setLoading(false)
    if (error) { setError(error); return }
    setSuccess(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px',
    border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: 12, fontSize: 14,
    outline: 'none', transition: 'border-color 0.15s, background 0.15s', fontFamily: 'inherit',
    background: 'rgba(255,255,255,0.10)', color: '#ffffff',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.72)', display: 'block', marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1f44 0%, #1a3a6e 40%, #0d2d55 70%, #0a1f44 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="lg-orb" style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle, rgba(253,118,26,0.28) 0%, transparent 70%)',filter:'blur(64px)',top:-120,left:-80,pointerEvents:'none'}}/>
      <div className="lg-orb-2" style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle, rgba(180,198,244,0.18) 0%, transparent 70%)',filter:'blur(80px)',bottom:-100,right:-60,pointerEvents:'none'}}/>

      <div style={{
        width: tab === 'signup' ? 440 : 380,
        background: 'rgba(255,255,255,0.10)',
        backdropFilter: 'blur(48px) saturate(180%)',
        WebkitBackdropFilter: 'blur(48px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 40,
        transition: 'width 0.2s',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: N,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.18), 0 8px 24px rgba(253,118,26,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
            <span style={{ color: O, fontWeight: 800, fontSize: 22 }}>L</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#ffffff' }}>The Ledger</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Your financial future starts here.</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 10,
          padding: 4, marginBottom: 28, gap: 4,
        }}>
          {(['signin', 'signup'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(false) }}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.15s',
                background: tab === t ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: tab === t ? '#ffffff' : 'rgba(255,255,255,0.5)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Sign In */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="lg-input"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(253,118,26,0.8)'; e.target.style.background = 'rgba(255,255,255,0.16)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)' }} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="lg-input"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(253,118,26,0.8)'; e.target.style.background = 'rgba(255,255,255,0.16)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)' }} />
            </div>
            {error && <p style={{ margin: 0, fontSize: 13, color: '#ffb3b3', background: 'rgba(211,47,47,0.2)', border: '1px solid rgba(211,47,47,0.4)', padding: '8px 12px', borderRadius: 8 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              padding: '12px 0', borderRadius: 10,
              background: 'linear-gradient(135deg, #fd761a, #e85d04)',
              color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 4,
              boxShadow: '0 8px 24px rgba(253,118,26,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {/* Sign Up */}
        {tab === 'signup' && !success && (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required
                className="lg-input"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(253,118,26,0.8)'; e.target.style.background = 'rgba(255,255,255,0.16)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)' }} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="lg-input"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(253,118,26,0.8)'; e.target.style.background = 'rgba(255,255,255,0.16)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)' }} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="lg-input"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(253,118,26,0.8)'; e.target.style.background = 'rgba(255,255,255,0.16)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)' }} />
            </div>

            {/* Member type picker */}
            <div>
              <label style={{ ...labelStyle, marginBottom: 10 }}>I am a…</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MEMBER_TYPES.map(mt => (
                  <button
                    key={mt.value}
                    type="button"
                    onClick={() => setMemberType(mt.value)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                      border: memberType === mt.value ? '2px solid rgba(253,118,26,0.6)' : '1.5px solid rgba(255,255,255,0.15)',
                      background: memberType === mt.value ? 'rgba(253,118,26,0.18)' : 'rgba(255,255,255,0.08)',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 13, color: memberType === mt.value ? O : 'rgba(255,255,255,0.85)' }}>
                      {mt.label}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3, lineHeight: 1.4 }}>
                      {mt.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p style={{ margin: 0, fontSize: 13, color: '#ffb3b3', background: 'rgba(211,47,47,0.2)', border: '1px solid rgba(211,47,47,0.4)', padding: '8px 12px', borderRadius: 8 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{
              padding: '12px 0', borderRadius: 10,
              background: 'linear-gradient(135deg, #fd761a, #e85d04)',
              color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 4,
              boxShadow: '0 8px 24px rgba(253,118,26,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        )}

        {/* Success state */}
        {tab === 'signup' && success && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: '#e8f5e9',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <span style={{ fontSize: 24 }}>✓</span>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#ffffff' }}>Account created</p>
            <p style={{ margin: '8px 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              Check your email to confirm your address, then sign in.
            </p>
            <button onClick={() => { setTab('signin'); setSuccess(false); setError(null) }}
              style={{
                padding: '10px 24px', borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
              Go to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
