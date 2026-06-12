import { useState, useRef, useEffect } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

type FV = Record<string, string>
function useForm(init: FV) {
  const [v, set] = useState(init)
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const reset = () => set(init)
  return { values: v, onChange, reset }
}

async function netlifySubmit(formName: string, values: FV) {
  const body = new URLSearchParams({ 'form-name': formName, ...values })
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

const css = `
  .wr-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes wr-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes wr-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes wr-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wr-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .wr-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: #F97316;
    color: #0E0C09;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 900;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 16px 28px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: box-shadow 0.25s ease, background 0.2s ease;
    box-shadow: 0 0 0px rgba(249,115,22,0);
  }
  .wr-btn-primary:hover {
    background: #ff8c38;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2);
  }
  .wr-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  .wr-inp {
    width: 100%;
    font-size: 13px;
    font-weight: 300;
    border-radius: 6px;
    padding: 12px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: #F5F0E8;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    font-family: inherit;
  }
  .wr-inp::placeholder { color: rgba(154,139,122,0.45); }
  .wr-inp:focus {
    border-color: rgba(249,115,22,0.45);
    box-shadow: 0 0 0 2px rgba(249,115,22,0.08);
  }
  .wr-inp option { background: #1A1510; color: #F5F0E8; }

  .wr-lbl {
    display: block;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6B5E50;
    margin-bottom: 8px;
    font-family: monospace;
  }
`

const yearLevels = ['Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13 / IB2', 'Other']
const hearAbout = ['The Ledger App', 'School / Teacher', 'Friend / Classmate', 'Instagram / Social Media', 'Chapter Event', 'Other']

export default function WorkshopRegisterPage() {
  const form = useForm({ fullName: '', email: '', school: '', yearLevel: '', city: '', country: '', hearAboutUs: '', notes: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const heroRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [scrollY, setScrollY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const handleMouseLeave = () => setMouse({ x: -9999, y: -9999 })

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await netlifySubmit('workshop-register-interest', form.values)
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden wr-futura"
        style={{ background: '#0E0C09', minHeight: '75vh', paddingTop: '68px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', backgroundSize: '180px 180px', opacity: 0.6, zIndex: 0 }} />
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 5px)', zIndex: 1 }} />
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-80px', width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 65%)', animation: 'wr-orb-drift 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)', animation: 'wr-orb-drift 18s ease-in-out infinite reverse' }} />
        </div>
        {/* Mouse glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.11) 0%, rgba(249,115,22,0.04) 30%, transparent 60%)`, zIndex: 3, transition: 'background 0.08s ease' }} />
        {/* HUD corners */}
        {([
          { style: { top: 84, left: 20 },    d: 'M0 16 L0 0 L16 0' },
          { style: { top: 84, right: 20 },   d: 'M0 0 L16 0 L16 16' },
          { style: { bottom: 52, left: 20 }, d: 'M0 0 L0 16 L16 16' },
          { style: { bottom: 52, right: 20 }, d: 'M16 0 L16 16 L0 16' },
        ] as { style: React.CSSProperties; d: string }[]).map((b, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute pointer-events-none" style={{ ...b.style, zIndex: 5, animation: 'wr-hud-blink 3s ease-in-out infinite', animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}
        {/* Diagonal slash */}
        <div className="absolute pointer-events-none" style={{ left: '42%', top: 0, width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent 0%, rgba(196,168,130,0.12) 20%, rgba(196,168,130,0.2) 50%, rgba(196,168,130,0.12) 80%, transparent 100%)', transform: 'rotate(10deg)', transformOrigin: 'top center', zIndex: 4 }} />

        {/* Main content */}
        <div className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20" style={{ minHeight: 'calc(75vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.12}px)` }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'wr-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ WORKSHOP_REGISTRATION ]
          </div>
          <div style={{ lineHeight: 0.88, marginBottom: '28px' }}>
            <div style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, color: '#F5F0E8', letterSpacing: '-0.04em', display: 'block', opacity: 0, animation: 'wr-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards' }}>
              REGISTER.
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginTop: '6px', opacity: 0, animation: 'wr-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
              <span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)', fontWeight: 400, color: '#C4A882', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-block' }}>
                your interest.
              </span>
            </div>
          </div>
          <div style={{ maxWidth: '460px', opacity: 0, animation: 'wr-word-in 0.6s ease 0.45s forwards' }}>
            <p style={{ color: '#7A6B58', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, marginBottom: '16px' }}>
              Finance, Economics &amp; Business Workshop<br />
              <span style={{ color: '#C4A882', fontWeight: 400 }}>26–27 July 2025 · Tokyo · In-Person</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['🎤 Guest Speakers', '📊 Financial Modelling', '🏆 Stock Pitch Challenge'].map(tag => (
                <span key={tag} style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(196,168,130,0.6)', border: '1px solid rgba(196,168,130,0.14)', padding: '4px 10px', borderRadius: '100px' }}>{tag}</span>
              ))}
            </div>
          </div>
          {/* Ghost letter */}
          <div style={{ position: 'absolute', right: '-40px', top: '30px', fontSize: '55vw', fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px rgba(249,115,22,0.06)', letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
            W
          </div>
        </div>

        {/* Ticker */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', borderTop: '1px solid rgba(249,115,22,0.18)', background: 'rgba(249,115,22,0.04)', padding: '9px 0', zIndex: 7 }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'wr-ticker 22s linear infinite', width: 'max-content' }}>
            {[0, 1].map(i => (
              <span key={i} style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.55)', letterSpacing: '0.22em', paddingRight: '48px' }}>
                FINANCE WORKSHOP &nbsp;·&nbsp; 26–27 JULY 2025 &nbsp;·&nbsp; TOKYO &nbsp;·&nbsp; IN-PERSON &nbsp;·&nbsp; HIGH SCHOOL STUDENTS &nbsp;·&nbsp; FINANCIAL MODELLING &nbsp;·&nbsp; STOCK PITCH CHALLENGE &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ────────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: '#0E0C09' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)' }} />
        </div>

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div
              className="wr-futura"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Card header */}
              <div className="p-7 flex items-start gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(249,115,22,0.04)' }}>
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0" style={{ borderRadius: '10px', background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.22)' }}>
                  <span style={{ fontSize: '18px' }}>📊</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.22em', marginBottom: '6px' }}>
                    [ INTEREST_REGISTRATION ]
                  </div>
                  <h2 className="text-xl font-black" style={{ color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif' }}>
                    Register Your Interest
                  </h2>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#9A8B7A' }}>
                    Finance, Economics &amp; Business Workshop · Tokyo · 26–27 July 2025
                  </p>
                </div>
              </div>

              <div className="p-7">
                {done ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-5" style={{ borderRadius: '12px', background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.22)' }}>
                      <CheckCircle2 size={28} style={{ color: '#F97316' }} />
                    </div>
                    <h3 className="wr-futura text-2xl font-black mb-2" style={{ color: '#F5F0E8' }}>Interest Registered!</h3>
                    <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: '#9A8B7A' }}>
                      We've received your interest for the workshop. We'll be in touch with more details as July approaches.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="bot-field" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="wr-lbl">Full Name *</label>
                        <input type="text" name="fullName" required value={form.values.fullName} onChange={form.onChange} placeholder="Your full name" className="wr-inp" />
                      </div>
                      <div>
                        <label className="wr-lbl">Email Address *</label>
                        <input type="email" name="email" required value={form.values.email} onChange={form.onChange} placeholder="you@school.edu" className="wr-inp" />
                      </div>
                    </div>
                    <div>
                      <label className="wr-lbl">School / Institution *</label>
                      <input type="text" name="school" required value={form.values.school} onChange={form.onChange} placeholder="Your school name" className="wr-inp" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="wr-lbl">Year Level *</label>
                        <select name="yearLevel" required value={form.values.yearLevel} onChange={form.onChange} className="wr-inp" style={{ cursor: 'pointer', appearance: 'none' as React.CSSProperties['appearance'] }}>
                          <option value="">Select year level…</option>
                          {yearLevels.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="wr-lbl">City *</label>
                        <input type="text" name="city" required value={form.values.city} onChange={form.onChange} placeholder="e.g. Tokyo" className="wr-inp" />
                      </div>
                    </div>
                    <div>
                      <label className="wr-lbl">Country *</label>
                      <input type="text" name="country" required value={form.values.country} onChange={form.onChange} placeholder="e.g. Japan" className="wr-inp" />
                    </div>
                    <div>
                      <label className="wr-lbl">How did you hear about this?</label>
                      <select name="hearAboutUs" value={form.values.hearAboutUs} onChange={form.onChange} className="wr-inp" style={{ cursor: 'pointer', appearance: 'none' as React.CSSProperties['appearance'] }}>
                        <option value="">Select an option…</option>
                        {hearAbout.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="wr-lbl">Any questions or notes? (optional)</label>
                      <textarea name="notes" rows={3} value={form.values.notes} onChange={form.onChange} placeholder="Dietary requirements, questions, or anything else…" className="wr-inp" style={{ resize: 'none' }} />
                    </div>
                    {error && <p className="text-sm font-light" style={{ color: '#f87171' }}>{error}</p>}
                    <button type="submit" disabled={loading} className="wr-btn-primary mt-2">
                      {loading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><span>Register My Interest</span><ArrowRight size={14} /></>
                      }
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
