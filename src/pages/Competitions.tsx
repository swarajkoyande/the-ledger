import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { ArrowRight, Lock } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import BorderGlow from '../components/BorderGlow'
import { useState, useEffect, useRef } from 'react'
import CompetitionRegisterModal from '../components/CompetitionRegisterModal'
// ── QUARTERLY AUTO-DETECTION ──────────────────────────────────────────────────
function getTradingQuarter() {
  const now = new Date()
  const month = now.getMonth()
  if (month <= 2) return { season: 'Winter', window: 'Jan – Mar', status: 'Open' }
  if (month <= 5) return { season: 'Spring', window: 'Apr – Jun', status: 'Open' }
  if (month <= 8) return { season: 'Summer', window: 'Jul – Sep', status: 'Open' }
  return { season: 'Fall', window: 'Oct – Dec', status: 'Open' }
}
const tq = getTradingQuarter()

const competitions = [
  {
    name: 'Ledger × NGYA Economics Debate Championship',
    organizer: 'The Ledger · NGYA',
    region: 'Global (Virtual)',
    status: 'Coming Soon' as const,
    description: 'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA (Nihon Global Youth Association). No reports, no case packs. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final.',
    prize: '🏆 Champions: Ledger Fellows badge, crystal engraved trophy, winner medals, co-signed certificate · 🎖️ Runners-up: LinkedIn recommendation from NGYA Executive Founder · 🎤 Best Individual Debater: Sharp Minds Award',
    eligibility: 'All Ledger chapter members globally · Teams of 3–4 · Virtual format',
    deadline: 'Reg deadline Jul 17 · Registration opens Jun 22 · Starts Jul 26 · Ends Jul 31',
    registrationOpen: new Date('2026-06-22T00:00:00'),
    isNGYA: true,
  },
  {
    name: 'Ledger × EconomiX Economics Case Competition',
    organizer: 'The Ledger · EconomiX',
    region: 'Global (Japan focus)',
    status: 'Coming Soon',
    description: "A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger's proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final — presenting policy proposals, fielding judge Q&A, and facing a rebuttal round. 4–6 weeks end-to-end.",
    prize: '🥇 Winner: trophy, internship opportunity with a sponsor, Winner badge on The Ledger · 🎖️ Finalist: badge + joint certificate · All participants: AI scorecard feedback + Participant badge',
    eligibility: 'High school students · Teams of 2–4 · All Ledger chapters globally',
    deadline: 'Reg deadline Jul 12 · Registration opens Jun 29 · Finals Aug 9',
    registrationOpen: new Date('2026-06-29T00:00:00'),
    isEconomiX: true,
  },
  {
    name: `Ledger Trading Competition — ${tq.season} 2026`,
    organizer: 'The Ledger Network',
    region: 'Global',
    status: tq.status,
    description: `The Ledger's flagship quarterly trading competition. Each participant starts with a virtual $100,000 portfolio and competes across stocks and crypto — with leverage available. Runs every quarter (Spring · Summer · Fall · Winter). Current session: ${tq.season} ${tq.window}.`,
    prize: '🏆 Ledger Fellows badge permanently on your app profile · Network-wide spotlight · Leaderboard recognition',
    eligibility: 'All active Ledger chapter members globally · Individual · $0 entry fee',
    deadline: `${tq.season} session live now — closes end of ${tq.window.split('–')[1].trim()}`,
  },
]

const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Open:            { label: 'Open',          color: '#F97316', bg: 'rgba(249,115,22,0.12)',   border: '1px solid rgba(249,115,22,0.3)'   },
  'Coming Soon':   { label: 'Coming Soon',   color: '#C4A882', bg: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.3)'  },
  'In Pursuit':    { label: 'In Pursuit',    color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: '1px solid rgba(52,211,153,0.25)'  },
  'In Discussion': { label: 'In Discussion', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)'  },
  Closed:          { label: 'Closed',        color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: '1px solid rgba(107,114,128,0.25)' },
}

// ── COUNTDOWN TIMER ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
    const s = Math.floor(diff / 1000)
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      done: false,
    }
  }
  const [tick, setTick] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTick(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return tick
}

function RegistrationActions({ target, onRegister }: { target: Date; onRegister: () => void }) {
  const { days, hours, minutes, seconds, done } = useCountdown(target)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
      {/* Countdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: done ? 'rgba(74,222,128,0.6)' : '#4A3F35', fontFamily: 'monospace', marginBottom: '2px', transition: 'color 0.4s' }}>
          {done ? 'Registration open' : 'Registration opens in'}
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {[['days', days], ['hrs', hours], ['min', minutes], ['sec', seconds]].map(([label, val]) => (
            <div key={label as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '42px', background: done ? 'rgba(74,222,128,0.06)' : 'rgba(249,115,22,0.06)', border: `1px solid ${done ? 'rgba(74,222,128,0.2)' : 'rgba(249,115,22,0.2)'}`, borderRadius: '4px', padding: '8px 6px 5px', transition: 'all 0.4s' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1, color: done ? '#4ade80' : '#F97316', fontFamily: '"Futura","Century Gothic",sans-serif', letterSpacing: '-0.02em', transition: 'color 0.4s' }}>{pad(val as number)}</span>
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: done ? 'rgba(74,222,128,0.5)' : 'rgba(249,115,22,0.5)', marginTop: '4px', fontFamily: 'monospace', transition: 'color 0.4s' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Register button — locked until countdown done */}
      {done ? (
        <button onClick={onRegister} className="cf-btn-primary" style={{ alignSelf: 'flex-end' }}>
          Register Now <ArrowRight size={13} />
        </button>
      ) : (
        <button
          disabled
          title="Registration not open yet"
          style={{
            alignSelf: 'flex-end',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            fontFamily: '"Futura","Century Gothic",sans-serif',
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(196,168,130,0.3)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '2px',
            cursor: 'not-allowed',
          }}
        >
          <Lock size={12} style={{ opacity: 0.5 }} />
          Register
        </button>
      )}
    </div>
  )
}

// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .cf-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes cf-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes cf-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes cf-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes cf-noise {
    0%   { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  @keyframes cf-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cf-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F97316;
    color: #0E0C09;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 900;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 14px 28px;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: box-shadow 0.25s ease, background 0.2s ease, color 0.2s ease;
    box-shadow: 0 0 0px rgba(249,115,22,0);
  }
  .cf-btn-primary:hover {
    background: #ff8c38;
    color: #0E0C09;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2), inset 0 0 12px rgba(255,255,255,0.12);
  }

  .cf-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #C4A882;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.06em;
    padding: 2px 0;
    border-bottom: 1px solid rgba(196,168,130,0.35);
    transition: color 0.2s ease, border-color 0.2s ease, text-shadow 0.2s ease;
  }
  .cf-btn-ghost:hover {
    color: #F5F0E8;
    border-color: rgba(245,240,232,0.5);
    text-shadow: 0 0 18px rgba(249,115,22,0.4);
  }

  .cf-compete:hover { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .cf-win:hover     { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }

  .cf-compete, .cf-win { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  @keyframes pr {
    0%   { r: 8;  opacity: .65; }
    100% { r: 22; opacity: 0;   }
  }

  @keyframes cf-coming-soon-pulse {
    0%, 100% {
      box-shadow: 0 0 0px rgba(249,115,22,0), inset 0 0 0px rgba(249,115,22,0);
      border-color: rgba(249,115,22,0.18);
    }
    40% {
      box-shadow: 0 0 18px rgba(249,115,22,0.35), 0 0 40px rgba(249,115,22,0.12), inset 0 0 10px rgba(249,115,22,0.06);
      border-color: rgba(249,115,22,0.65);
    }
    60% {
      box-shadow: 0 0 22px rgba(249,115,22,0.4), 0 0 50px rgba(249,115,22,0.15), inset 0 0 12px rgba(249,115,22,0.08);
      border-color: rgba(249,115,22,0.75);
    }
  }
  .cf-coming-soon {
    animation: cf-coming-soon-pulse 2.8s ease-in-out infinite;
  }

  @keyframes cf-spotlight-sweep {
    0%   { opacity: 0;   transform: translateX(-80%); }
    15%  { opacity: 1; }
    70%  { opacity: 0.7; }
    100% { opacity: 0;   transform: translateX(140%); }
  }
  .cf-spotlight {
    animation: cf-spotlight-sweep 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`

export default function Competitions() {
  const activeCount = competitions.filter(c => c.status === 'Open').length
  const heroRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [scrollY, setScrollY] = useState(0)
  const [spotlit, setSpotlit] = useState(false)
  const [registerModal, setRegisterModal] = useState<'economix' | 'ngya' | null>(null)

  const handleBrowse = () => {
    cardsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSpotlit(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setSpotlit(true)))
  }

  // Mouse tracking for the glow
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const handleMouseLeave = () => setMouse({ x: -9999, y: -9999 })

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <Seo
      title="Stock Pitch & Economics Competitions | The Ledger"
      description="Compete in The Ledger's global student finance competitions: stock pitch championships, economics case studies, and academic debate tournaments."
      path="/competitions"
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'Ledger × NGYA Economics Debate Championship',
          description: 'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA (Nihon Global Youth Association). No reports, no case packs. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final.',
          startDate: '2026-07-26',
          endDate: '2026-07-31',
          organizer: { '@type': 'Organization', name: 'The Ledger · NGYA' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'Ledger × EconomiX Economics Case Competition',
          description: "A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger's proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final — presenting policy proposals, fielding judge Q&A, and facing a rebuttal round. 4–6 weeks end-to-end.",
          startDate: '2026-08-09',
          organizer: { '@type': 'Organization', name: 'The Ledger · EconomiX' },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: `Ledger Trading Competition — ${tq.season} 2026`,
          description: `The Ledger's flagship quarterly trading competition. Each participant starts with a virtual $100,000 portfolio and competes across stocks and crypto — with leverage available. Runs every quarter (Spring · Summer · Fall · Winter). Current session: ${tq.season} ${tq.window}.`,
          organizer: { '@type': 'Organization', name: 'The Ledger Network' },
        },
      ]}
    />
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden cf-futura"
        style={{ background: '#0E0C09', minHeight: '90vh', paddingTop: '68px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* ── Layer 0: subtle noise/grain texture ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '180px 180px',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* ── Layer 1: scanlines ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.013) 0px, rgba(255,255,255,0.013) 1px, transparent 1px, transparent 5px)',
            zIndex: 1,
          }}
        />

        {/* ── Layer 2: static background orbs ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-80px',
            width: '620px', height: '620px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.09) 0%, transparent 65%)',
            animation: 'cf-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'cf-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'cf-orb-drift 22s ease-in-out infinite',
            animationDelay: '-7s',
          }} />
        </div>

        {/* ── Layer 3: mouse-tracking orange glow ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(249,115,22,0.11) 0%, rgba(249,115,22,0.04) 30%, transparent 60%)`,
            zIndex: 3,
            transition: 'background 0.08s ease',
          }}
        />

        {/* ── Layer 4: HUD corner brackets ── */}
        {([
          { style: { top: 84, left: 20 },   d: 'M0 16 L0 0 L16 0' },
          { style: { top: 84, right: 20 },   d: 'M0 0 L16 0 L16 16' },
          { style: { bottom: 52, left: 20 }, d: 'M0 0 L0 16 L16 16' },
          { style: { bottom: 52, right: 20 },d: 'M16 0 L16 16 L0 16' },
        ] as { style: React.CSSProperties; d: string }[]).map((b, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none"
            className="absolute pointer-events-none"
            style={{ ...b.style, zIndex: 5, animation: `cf-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}

        {/* ── Layer 5: diagonal slash ── */}
        <div className="absolute pointer-events-none" style={{
          left: '40%', top: 0, width: '1px', height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(196,168,130,0.12) 20%, rgba(196,168,130,0.2) 50%, rgba(196,168,130,0.12) 80%, transparent 100%)',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
          zIndex: 4,
        }} />

        {/* ── Rotated eyebrow — left edge ── */}
        <div className="absolute left-5 top-1/2 hidden md:flex items-center gap-2" style={{
          writingMode: 'vertical-rl',
          transform: 'translateY(-50%) rotate(180deg)',
          zIndex: 6,
        }}>
          <span style={{ color: 'rgba(249,115,22,0.7)', fontSize: '8px' }}>◆</span>
          <span style={{ color: 'rgba(196,168,130,0.5)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Network Competitions · 2026
          </span>
        </div>

        {/* ── Main content ── */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'cf-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_COMPETITIONS ]
          </div>

          {/* Avant-garde heading */}
          <h1 style={{ lineHeight: 0.88, margin: '0 0 28px', fontWeight: 'inherit', fontSize: 'inherit' }}>
            <div
              className="cf-compete"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'cf-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              COMPETE.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'cf-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
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
                learn.
              </span>
              <span
                className="cf-win"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                WIN.
              </span>
            </div>
          </h1>

          {/* Body + CTAs */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'cf-word-in 0.6s ease 0.45s forwards' }}>
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
              Trading · Case competitions · Live debates.<br />
              The Ledger network runs challenges that build<br />
              real financial thinking. All at zero cost to members.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="cf-btn-primary">
                Register Now <ArrowRight size={13} />
              </Link>
              <button onClick={handleBrowse} className="cf-btn-ghost" style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(196,168,130,0.35)', cursor: 'pointer' }}>
                Browse competitions ↓
              </button>
            </div>
          </div>

          {/* Bottom-right active count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'cf-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Active</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#4ade80', lineHeight: 1, textShadow: '0 0 30px rgba(74,222,128,0.35)' }}>{activeCount}</div>
          </div>

          {/* Decorative large ghost "C" */}
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
            C
          </div>
        </div>

        {/* ── Ticker strip ── */}
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
            animation: 'cf-ticker 22s linear infinite',
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
                TRADING &nbsp;·&nbsp; DEBATE &nbsp;·&nbsp; CASE STUDY &nbsp;·&nbsp; ECONOMICS &nbsp;·&nbsp; GLOBAL &nbsp;·&nbsp; VIRTUAL &nbsp;·&nbsp; $0 ENTRY &nbsp;·&nbsp; SPRING 2026 &nbsp;·&nbsp; STOCKS &amp; CRYPTO &nbsp;·&nbsp; LEVERAGE AVAILABLE &nbsp;·&nbsp; 6+ COUNTRIES &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-3 sm:gap-8 text-center">
            {[`${activeCount} Active Competition${activeCount !== 1 ? 's' : ''}`, '6+ Countries Eligible', '$0 Entry Fee'].map((stat, i) => (
              <span key={i} className="flex items-center gap-4">
                <span style={{ color: '#C4A882', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>{stat}</span>
                {i < 2 && <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '18px' }}>·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── COMPETITION CARDS ─────────────────────────────────────────────── */}
      <section ref={cardsRef} className="relative py-16 pb-28 overflow-hidden" style={{ background: '#0E0C09' }}>
        {/* Spotlight sweep overlay */}
        {spotlit && (
          <div
            className="cf-spotlight absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
            onAnimationEnd={() => setSpotlit(false)}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 38% 100% at 50% 50%, rgba(249,115,22,0.13) 0%, rgba(249,115,22,0.05) 45%, transparent 70%)',
            }} />
          </div>
        )}

        {/* Subtle background lighting for the cards section */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 space-y-4">
          {competitions.map((comp, i) => {
            const s = statusStyle[comp.status] || statusStyle['Closed']
            return (
              <FadeIn key={comp.name} delay={i * 80} direction="up">
                <BorderGlow animated glowColor="24 95 53" colors={['#f97316', '#c4a882', '#92400e']} borderRadius={20} backgroundColor="#0E0C09">
                <div>
                  <div className="grid md:grid-cols-[260px_1fr]">
                    {/* Left panel — darker glass */}
                    <div
                      className="p-8 flex flex-col justify-between gap-6"
                      style={{
                        background: 'rgba(249,115,22,0.04)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div>
                        <h2 className="text-xl font-black leading-snug mb-3" style={{ color: '#F5F0E8', fontFamily: '"Futura","Century Gothic",sans-serif' }}>{comp.name}</h2>
                        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B5E50', marginBottom: '16px', fontFamily: 'monospace' }}>{comp.organizer}</p>
                        <div className="flex flex-col gap-2">
                          <span style={{ display: 'inline-flex', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', width: 'fit-content', color: '#C4A882', background: 'rgba(196,168,130,0.08)', border: '1px solid rgba(196,168,130,0.18)', letterSpacing: '0.06em' }}>{comp.region}</span>
                          <span style={{ display: 'inline-flex', fontSize: '10px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', width: 'fit-content', color: s.color, background: s.bg, border: s.border, letterSpacing: '0.06em' }}>{s.label}</span>
                        </div>
                      </div>
                      {(comp as any).isEconomiX ? (
                        <div style={{ borderRadius: '10px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {[
                            ['Reg Opens',    'Jun 29, 2026'],
                            ['Reg Deadline', 'Jul 12, 2026'],
                            ['Finals',       'Aug 9, 2026'],
                          ].map(([label, date]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A3F35', fontFamily: 'monospace' }}>{label}</span>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#F97316', fontFamily: 'monospace', textShadow: '0 0 8px rgba(249,115,22,0.6)' }}>{date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (comp as any).isNGYA ? (
                        <div style={{ borderRadius: '10px', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {[
                            ['Reg Opens',    'Jun 22, 2026'],
                            ['Reg Deadline', 'Jul 17, 2026'],
                            ['Starts',       'Jul 26, 2026'],
                            ['Ends',         'Jul 31, 2026'],
                          ].map(([label, date]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A3F35', fontFamily: 'monospace' }}>{label}</span>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#F97316', fontFamily: 'monospace', textShadow: '0 0 8px rgba(249,115,22,0.6)' }}>{date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ borderRadius: '10px', padding: '12px 14px', fontSize: '11px', fontWeight: 300, lineHeight: 1.6, color: '#C4A882', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {comp.deadline}
                        </div>
                      )}
                    </div>

                    {/* Right panel — lighter glass */}
                    <div className="p-8 md:p-10 flex flex-col justify-between gap-6">
                      <p style={{ fontWeight: 300, fontSize: '16px', lineHeight: 1.75, color: '#9A8B7A' }}>{comp.description}</p>
                      <div className="space-y-2">
                        <div style={{ borderRadius: '12px', padding: '14px 18px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3F35', marginBottom: '6px', fontFamily: 'monospace' }}>Prize / Reward</p>
                          <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: '#7A6B58' }}>{comp.prize}</p>
                        </div>
                        <div style={{ borderRadius: '12px', padding: '14px 18px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3F35', marginBottom: '6px', fontFamily: 'monospace' }}>Eligibility</p>
                          <p style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.6, color: '#7A6B58' }}>{comp.eligibility}</p>
                        </div>
                      </div>
                      {comp.status === 'Open' ? (
                        <a
                          href="https://app.theledger.online"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cf-btn-primary"
                          style={{ alignSelf: 'flex-start' }}
                        >
                          Register <ArrowRight size={13} />
                        </a>
                      ) : (comp as any).isEconomiX ? (
                        <RegistrationActions
                          target={(comp as any).registrationOpen}
                          onRegister={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSczGqspgdDt1y0Jh5HukNfnNOTfoNZP94iuTgThR7vb1LwWHg/viewform?usp=publish-editor', '_blank')}
                        />
                      ) : (comp as any).isNGYA ? (
                        <RegistrationActions
                          target={(comp as any).registrationOpen}
                          onRegister={() => setRegisterModal('ngya')}
                        />
                      ) : (
                        <span
                          className="cf-coming-soon"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 22px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: '"Futura","Century Gothic",sans-serif',
                            color: 'rgba(196,168,130,0.45)',
                            background: 'rgba(249,115,22,0.03)',
                            border: '1px solid rgba(249,115,22,0.18)',
                            borderRadius: '2px',
                            cursor: 'not-allowed',
                            textDecoration: 'line-through',
                            textDecorationColor: 'rgba(249,115,22,0.2)',
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                </BorderGlow>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ── COMPETITION CTA ───────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>[ GOT_AN_IDEA ]</p>
            <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1, fontFamily: '"Futura","Century Gothic",sans-serif' }}>
              Have a competition idea?
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, marginBottom: '36px', maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              We're always looking for new challenges. If you have a format, topic, or partnership in mind — tell us about it.
            </p>
            <a
              href="mailto:theledger.japan@gmail.com?subject=Competition%20Idea%20for%20The%20Ledger"
              className="cf-btn-primary"
            >
              Get in Touch <ArrowRight size={13} />
            </a>
          </div>
        </FadeIn>
      </section>
    </main>

    {registerModal && (
      <CompetitionRegisterModal
        competition={registerModal}
        competitionName={
          registerModal === 'economix'
            ? 'Ledger × EconomiX Economics Case Competition'
            : 'Ledger × NGYA Economics Debate Championship'
        }
        onClose={() => setRegisterModal(null)}
      />
    )}
    </>
  )
}
