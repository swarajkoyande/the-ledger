import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Building2, Globe2, CheckCircle2, Loader2 } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { Seo } from '../components/Seo'

type FV = Record<string, string>
function useForm(init: FV) {
  const [v, set] = useState(init)
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const reset = () => set(init)
  return { values: v, onChange, reset }
}

const regions = ['Tokyo, Japan', 'Singapore', 'Gold Coast, Australia', 'Madrid, Spain', 'Delhi, India', 'Tamil Nadu, India', 'Gujarat, India', 'Other']

const countryCodes = [
  { code: '+1',   label: '🇺🇸 +1' },
  { code: '+1-CA', label: '🇨🇦 +1' },
  { code: '+7',   label: '🇷🇺 +7' },
  { code: '+20',  label: '🇪🇬 +20' },
  { code: '+27',  label: '🇿🇦 +27' },
  { code: '+30',  label: '🇬🇷 +30' },
  { code: '+31',  label: '🇳🇱 +31' },
  { code: '+32',  label: '🇧🇪 +32' },
  { code: '+33',  label: '🇫🇷 +33' },
  { code: '+34',  label: '🇪🇸 +34' },
  { code: '+39',  label: '🇮🇹 +39' },
  { code: '+40',  label: '🇷🇴 +40' },
  { code: '+41',  label: '🇨🇭 +41' },
  { code: '+43',  label: '🇦🇹 +43' },
  { code: '+44',  label: '🇬🇧 +44' },
  { code: '+45',  label: '🇩🇰 +45' },
  { code: '+46',  label: '🇸🇪 +46' },
  { code: '+47',  label: '🇳🇴 +47' },
  { code: '+48',  label: '🇵🇱 +48' },
  { code: '+49',  label: '🇩🇪 +49' },
  { code: '+51',  label: '🇵🇪 +51' },
  { code: '+52',  label: '🇲🇽 +52' },
  { code: '+54',  label: '🇦🇷 +54' },
  { code: '+55',  label: '🇧🇷 +55' },
  { code: '+56',  label: '🇨🇱 +56' },
  { code: '+57',  label: '🇨🇴 +57' },
  { code: '+60',  label: '🇲🇾 +60' },
  { code: '+61',  label: '🇦🇺 +61' },
  { code: '+62',  label: '🇮🇩 +62' },
  { code: '+63',  label: '🇵🇭 +63' },
  { code: '+64',  label: '🇳🇿 +64' },
  { code: '+65',  label: '🇸🇬 +65' },
  { code: '+66',  label: '🇹🇭 +66' },
  { code: '+81',  label: '🇯🇵 +81' },
  { code: '+82',  label: '🇰🇷 +82' },
  { code: '+84',  label: '🇻🇳 +84' },
  { code: '+86',  label: '🇨🇳 +86' },
  { code: '+90',  label: '🇹🇷 +90' },
  { code: '+91',  label: '🇮🇳 +91' },
  { code: '+92',  label: '🇵🇰 +92' },
  { code: '+94',  label: '🇱🇰 +94' },
  { code: '+95',  label: '🇲🇲 +95' },
  { code: '+98',  label: '🇮🇷 +98' },
  { code: '+212', label: '🇲🇦 +212' },
  { code: '+213', label: '🇩🇿 +213' },
  { code: '+216', label: '🇹🇳 +216' },
  { code: '+220', label: '🇬🇲 +220' },
  { code: '+221', label: '🇸🇳 +221' },
  { code: '+234', label: '🇳🇬 +234' },
  { code: '+254', label: '🇰🇪 +254' },
  { code: '+256', label: '🇺🇬 +256' },
  { code: '+260', label: '🇿🇲 +260' },
  { code: '+263', label: '🇿🇼 +263' },
  { code: '+351', label: '🇵🇹 +351' },
  { code: '+352', label: '🇱🇺 +352' },
  { code: '+353', label: '🇮🇪 +353' },
  { code: '+358', label: '🇫🇮 +358' },
  { code: '+370', label: '🇱🇹 +370' },
  { code: '+380', label: '🇺🇦 +380' },
  { code: '+420', label: '🇨🇿 +420' },
  { code: '+421', label: '🇸🇰 +421' },
  { code: '+852', label: '🇭🇰 +852' },
  { code: '+853', label: '🇲🇴 +853' },
  { code: '+886', label: '🇹🇼 +886' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+972', label: '🇮🇱 +972' },
  { code: '+973', label: '🇧🇭 +973' },
  { code: '+974', label: '🇶🇦 +974' },
  { code: '+977', label: '🇳🇵 +977' },
  { code: '+994', label: '🇦🇿 +994' },
]

async function netlifySubmit(formName: string, values: FV) {
  const body = new URLSearchParams({ 'form-name': formName, ...values })
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .rg-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes rg-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes rg-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes rg-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rg-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .rg-join:hover { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .rg-network:hover { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }
  .rg-join, .rg-network { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  .rg-btn-primary {
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
  .rg-btn-primary:hover {
    background: #ff8c38;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2);
  }
  .rg-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  .rg-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: transparent;
    color: #C4A882;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 16px 28px;
    border: 1px solid rgba(196,168,130,0.25);
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, box-shadow 0.25s ease;
  }
  .rg-btn-ghost:hover {
    color: #F5F0E8;
    border-color: rgba(249,115,22,0.45);
    box-shadow: 0 0 20px rgba(249,115,22,0.15);
  }
  .rg-btn-ghost:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Form inputs on dark card */
  .rg-inp {
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
  .rg-inp::placeholder { color: rgba(154,139,122,0.45); }
  .rg-inp:focus {
    border-color: rgba(249,115,22,0.45);
    box-shadow: 0 0 0 2px rgba(249,115,22,0.08);
  }
  .rg-inp option { background: #1A1510; color: #F5F0E8; }

  .rg-lbl {
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

function SuccessBanner({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center">
      <div
        className="w-16 h-16 flex items-center justify-center mb-5"
        style={{
          borderRadius: '12px',
          background: 'rgba(249,115,22,0.10)',
          border: '1px solid rgba(249,115,22,0.22)',
        }}
      >
        <CheckCircle2 size={28} style={{ color: '#F97316' }} />
      </div>
      <h3
        className="rg-futura text-2xl font-black mb-2"
        style={{ color: '#F5F0E8' }}
      >
        {title}
      </h3>
      <p className="text-sm font-light max-w-xs leading-relaxed" style={{ color: '#9A8B7A' }}>
        {sub}
      </p>
    </div>
  )
}

export default function RegisterPage() {
  const club = useForm({ clubName: '', schoolName: '', contactName: '', email: '', country: '', members: '', about: '' })
  const head = useForm({ fullName: '', email: '', phoneCode: '+81', phone: '', region: '', school: '', background: '', motivation: '' })

  const [clubDone, setClubDone] = useState(false)
  const [clubLoading, setClubLoading] = useState(false)
  const [clubError, setClubError] = useState('')

  const [headDone, setHeadDone] = useState(false)
  const [headLoading, setHeadLoading] = useState(false)
  const [headError, setHeadError] = useState('')

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

  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setClubLoading(true)
    setClubError('')
    try {
      await netlifySubmit('register-club', club.values)
      setClubDone(true)
    } catch {
      setClubError('Something went wrong. Please try again or email us directly.')
    } finally {
      setClubLoading(false)
    }
  }

  const handleHeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHeadLoading(true)
    setHeadError('')
    try {
      await netlifySubmit('regional-head', head.values)
      setHeadDone(true)
    } catch {
      setHeadError('Something went wrong. Please try again or email us directly.')
    } finally {
      setHeadLoading(false)
    }
  }

  return (
    <>
    <Seo
      title="Register Your Club — Join The Ledger Network"
      description="Register your school finance or economics club with The Ledger. Connect with a global student network across Asia, Europe, and Australia — free to join."
      path="/register"
    />
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden rg-futura"
        style={{ background: '#0E0C09', minHeight: '90vh', paddingTop: '68px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Layer 0: grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* Layer 1: scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 5px)',
            zIndex: 1,
          }}
        />

        {/* Layer 2: drifting background orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-80px',
            width: '620px', height: '620px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 65%)',
            animation: 'rg-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'rg-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'rg-orb-drift 22s ease-in-out infinite',
            animationDelay: '-7s',
          }} />
        </div>

        {/* Layer 3: mouse-tracking glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.11) 0%, rgba(249,115,22,0.04) 30%, transparent 60%)`,
            zIndex: 3,
            transition: 'background 0.08s ease',
          }}
        />

        {/* Layer 4: HUD corner brackets */}
        {([
          { style: { top: 84, left: 20 },    d: 'M0 16 L0 0 L16 0' },
          { style: { top: 84, right: 20 },   d: 'M0 0 L16 0 L16 16' },
          { style: { bottom: 52, left: 20 }, d: 'M0 0 L0 16 L16 16' },
          { style: { bottom: 52, right: 20 }, d: 'M16 0 L16 16 L0 16' },
        ] as { style: React.CSSProperties; d: string }[]).map((b, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="absolute pointer-events-none"
            style={{ ...b.style, zIndex: 5, animation: `rg-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}

        {/* Layer 5: diagonal slash */}
        <div className="absolute pointer-events-none" style={{
          left: '42%', top: 0, width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(196,168,130,0.12) 20%, rgba(196,168,130,0.2) 50%, rgba(196,168,130,0.12) 80%, transparent 100%)',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
          zIndex: 4,
        }} />

        {/* Rotated eyebrow — left edge */}
        <div className="absolute left-5 top-1/2 hidden md:flex items-center gap-2" style={{
          writingMode: 'vertical-rl',
          transform: 'translateY(-50%) rotate(180deg)',
          zIndex: 6,
        }}>
          <span style={{ color: 'rgba(249,115,22,0.7)', fontSize: '8px' }}>◆</span>
          <span style={{ color: 'rgba(196,168,130,0.5)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Join the Network · 2026
          </span>
        </div>

        {/* Main content */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'rg-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_REGISTRATION ]
          </div>

          {/* Avant-garde heading */}
          <h1 style={{ lineHeight: 0.88, margin: '0 0 28px', fontWeight: 'inherit', fontSize: 'inherit' }}>
            <div
              className="rg-join"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'rg-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              JOIN.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'rg-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
              <span style={{
                fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)',
                fontWeight: 400,
                color: '#C4A882',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transform: 'rotate(0deg)',
                display: 'inline-block',
                fontFamily: '"Futura", "Century Gothic", sans-serif',
              }}>
                lead.
              </span>
              <span
                className="rg-network"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                GROW.
              </span>
            </div>
          </h1>

          {/* Body */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'rg-word-in 0.6s ease 0.45s forwards' }}>
            <p style={{
              color: '#7A6B58',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.75,
              marginBottom: '36px',
              transform: 'rotate(0deg)',
              transformOrigin: 'left center',
              fontFamily: 'inherit',
            }}>
              Register your club or apply to lead a region.<br />
              Access competitions, summits, and a global<br />
              student community — at zero cost.
            </p>
          </div>

          {/* Bottom-right chapter count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'rg-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Chapters</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#F97316', lineHeight: 1, textShadow: '0 0 30px rgba(249,115,22,0.4)' }}>6</div>
          </div>

          {/* Decorative ghost "R" */}
          <div style={{
            position: 'absolute', right: '-40px', top: '30px',
            fontSize: '55vw', fontWeight: 900, lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(249,115,22,0.06)',
            letterSpacing: '-0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}>
            R
          </div>
        </div>

        {/* Ticker strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(249,115,22,0.18)',
          background: 'rgba(249,115,22,0.04)',
          padding: '9px 0',
          zIndex: 7,
        }}>
          <div style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'rg-ticker 22s linear infinite',
            width: 'max-content',
          }}>
            {[0, 1].map(i => (
              <span key={i} style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(249,115,22,0.55)',
                letterSpacing: '0.22em',
                paddingRight: '48px',
              }}>
                JOIN THE LEDGER &nbsp;·&nbsp; REGISTER YOUR CLUB &nbsp;·&nbsp; APPLY AS REGIONAL HEAD &nbsp;·&nbsp; 6 CHAPTERS &nbsp;·&nbsp; 6 COUNTRIES &nbsp;·&nbsp; $0 TO JOIN &nbsp;·&nbsp; GLOBAL STUDENT NETWORK &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────────── */}
      <FadeIn>
        <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-center">
            {['70+ students in the network', '6 active chapters', '6 countries', '3 competitions in 2025–26'].map((stat, i, arr) => (
              <span key={stat} className="flex items-center gap-4">
                <span style={{ color: '#C4A882', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', fontFamily: '"Futura","Century Gothic",sans-serif' }}>{stat}</span>
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '18px' }}>·</span>}
              </span>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── FORMS ───────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: '#0E0C09' }}>
        {/* Subtle background lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-6">

          {/* ── Register Your Club ── */}
          <FadeIn delay={0} direction="left">
            <div
              className="rg-futura h-full"
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
              <div
                className="p-7 flex items-start gap-4"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(249,115,22,0.04)',
                }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderRadius: '10px',
                    background: 'rgba(249,115,22,0.10)',
                    border: '1px solid rgba(249,115,22,0.22)',
                  }}
                >
                  <Building2 size={18} style={{ color: '#F97316' }} />
                </div>
                <div>
                  {/* Monospace eyebrow */}
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.22em', marginBottom: '6px' }}>
                    [ CLUB_REGISTRATION ]
                  </div>
                  <h2
                    className="text-xl font-black"
                    style={{ color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif' }}
                  >
                    Register Your Club
                  </h2>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#9A8B7A' }}>
                    Bring The Ledger to your school or university.
                  </p>
                </div>
              </div>

              <div className="p-7">
                {clubDone ? (
                  <SuccessBanner title="Application Received!" sub="We'll review your registration and reach out within a few days with next steps." />
                ) : (
                  <form onSubmit={handleClubSubmit} className="space-y-4">
                    <input name="bot-field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="rg-lbl">Club Name *</label>
                        <input type="text" name="clubName" required value={club.values.clubName} onChange={club.onChange} placeholder="Finance Club" className="rg-inp" />
                      </div>
                      <div>
                        <label className="rg-lbl">School / University *</label>
                        <input type="text" name="schoolName" required value={club.values.schoolName} onChange={club.onChange} placeholder="Your institution" className="rg-inp" />
                      </div>
                    </div>
                    <div>
                      <label className="rg-lbl">Your Name *</label>
                      <input type="text" name="contactName" required value={club.values.contactName} onChange={club.onChange} placeholder="Full name" className="rg-inp" />
                    </div>
                    <div>
                      <label className="rg-lbl">Email Address *</label>
                      <input type="email" name="email" required value={club.values.email} onChange={club.onChange} placeholder="you@school.edu" className="rg-inp" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="rg-lbl">Country *</label>
                        <input type="text" name="country" required value={club.values.country} onChange={club.onChange} placeholder="Japan" className="rg-inp" />
                      </div>
                      <div>
                        <label className="rg-lbl">Approx. Members</label>
                        <input type="number" name="members" min="1" value={club.values.members} onChange={club.onChange} placeholder="15" className="rg-inp" />
                      </div>
                    </div>
                    <div>
                      <label className="rg-lbl">Tell us about your club</label>
                      <textarea name="about" rows={3} value={club.values.about} onChange={club.onChange} placeholder="Activities, focus areas, past events…" className="rg-inp" style={{ resize: 'none' }} />
                    </div>
                    {clubError && (
                      <p className="text-sm font-light" style={{ color: '#f87171' }}>{clubError}</p>
                    )}
                    <button type="submit" disabled={clubLoading} className="rg-btn-primary mt-2">
                      {clubLoading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><span>Register Your Club</span><ArrowRight size={14} /></>
                      }
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>

          {/* ── Apply as Regional Head ── */}
          <FadeIn delay={100} direction="right">
            <div
              className="rg-futura h-full"
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
              <div
                className="p-7 flex items-start gap-4"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(196,168,130,0.03)',
                }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderRadius: '10px',
                    background: 'rgba(196,168,130,0.08)',
                    border: '1px solid rgba(196,168,130,0.18)',
                  }}
                >
                  <Globe2 size={18} style={{ color: '#C4A882' }} />
                </div>
                <div>
                  {/* Monospace eyebrow */}
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.22em', marginBottom: '6px' }}>
                    [ REGIONAL_HEAD_APPLICATION ]
                  </div>
                  <h2
                    className="text-xl font-black"
                    style={{ color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif' }}
                  >
                    Apply as Regional Head
                  </h2>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#9A8B7A' }}>
                    Lead The Ledger's expansion in your region.
                  </p>
                </div>
              </div>

              <div className="p-7">
                {headDone ? (
                  <SuccessBanner title="Application Submitted!" sub="We review every application carefully and will be in touch soon." />
                ) : (
                  <form onSubmit={handleHeadSubmit} className="space-y-4">
                    <input name="bot-field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                    <div>
                      <label className="rg-lbl">Full Name *</label>
                      <input type="text" name="fullName" required value={head.values.fullName} onChange={head.onChange} placeholder="Your full name" className="rg-inp" />
                    </div>
                    <div>
                      <label className="rg-lbl">Email Address *</label>
                      <input type="email" name="email" required value={head.values.email} onChange={head.onChange} placeholder="you@email.com" className="rg-inp" />
                    </div>
                    <div>
                      <label className="rg-lbl">Phone Number *</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          name="phoneCode"
                          required
                          value={head.values.phoneCode}
                          onChange={head.onChange}
                          className="rg-inp"
                          style={{ width: '130px', flexShrink: 0, cursor: 'pointer' }}
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={head.values.phone}
                          onChange={head.onChange}
                          placeholder="90 1234 5678"
                          className="rg-inp"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="rg-lbl">Region You Want to Lead *</label>
                      <input name="region" type="text" required value={head.values.region} onChange={head.onChange} placeholder="e.g. Tokyo, Japan" className="rg-inp" />
                    </div>
                    <div>
                      <label className="rg-lbl">Current School / University *</label>
                      <input type="text" name="school" required value={head.values.school} onChange={head.onChange} placeholder="Your institution" className="rg-inp" />
                    </div>
                    <div>
                      <label className="rg-lbl">Finance / Leadership Background</label>
                      <textarea name="background" rows={2} value={head.values.background} onChange={head.onChange} placeholder="Clubs, competitions, coursework, work experience…" className="rg-inp" style={{ resize: 'none' }} />
                    </div>
                    <div>
                      <label className="rg-lbl">Why do you want to be a Regional Head? *</label>
                      <textarea name="motivation" rows={3} required value={head.values.motivation} onChange={head.onChange} placeholder="Your vision for growing The Ledger in your region…" className="rg-inp" style={{ resize: 'none' }} />
                    </div>
                    {headError && (
                      <p className="text-sm font-light" style={{ color: '#f87171' }}>{headError}</p>
                    )}
                    <button type="submit" disabled={headLoading} className="rg-btn-ghost mt-2">
                      {headLoading
                        ? <Loader2 size={16} className="animate-spin" />
                        : <><span>Submit Application</span><ArrowRight size={14} /></>
                      }
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>
              [ QUESTIONS ]
            </p>
            <h2
              className="rg-futura"
              style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1 }}
            >
              Not sure which path is right?
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              Drop us a message and we'll help you figure out the best way to get involved with The Ledger.
            </p>
            <a
              href="mailto:theledger.japan@gmail.com?subject=Question%20about%20Joining%20The%20Ledger"
              className="rg-btn-primary"
              style={{ width: 'auto', display: 'inline-flex' }}
            >
              Get in Touch <ArrowRight size={13} />
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
    </>
  )
}
