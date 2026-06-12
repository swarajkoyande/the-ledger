import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

// ── EVENT DATA — edit this array to update the page ──────────────────────────
const events = [
  {
    id: 1,
    type: 'Competition',
    title: 'Global Stock Pitch Championship',
    desc: 'Teams compete across chapters to pitch a long position in under 5 minutes.',
    location: 'Tokyo, Japan',
    flag: '🇯🇵',
    date: 'Jun 12, 2026',
    status: 'Upcoming',
  },
  {
    id: 2,
    type: 'Podcast',
    title: 'The Ledger Live: Macro Markets Deep Dive',
    desc: 'Live-streamed episode covering global interest rate trends and what they mean for students.',
    location: 'Gold Coast, Australia',
    flag: '🇦🇺',
    date: 'Jun 8, 2026',
    status: 'Live Now',
  },
  {
    id: 3,
    type: 'Networking',
    title: 'Chapter Mixer — Delhi Edition',
    desc: 'An evening of structured networking and casual conversation for Delhi members.',
    location: 'Delhi, India',
    flag: '🇮🇳',
    date: 'Jun 20, 2026',
    status: 'Upcoming',
  },
  {
    id: 4,
    type: 'Speech',
    title: 'Keynote: Investing in Uncertainty',
    desc: 'Guest speaker series on navigating volatile markets as a young retail investor.',
    location: 'Madrid, Spain',
    flag: '🇪🇸',
    date: 'May 30, 2026',
    status: 'Past',
  },
  {
    id: 5,
    type: 'Summit',
    title: 'The Ledger Annual Summit 2026',
    desc: 'All chapters unite for two days of panels, workshops, and the flagship pitch competition.',
    location: 'Tokyo, Japan',
    flag: '🇯🇵',
    date: 'Jul 19, 2026',
    status: 'Upcoming',
  },
  {
    id: 6,
    type: 'Competition',
    title: 'Fintech Case Challenge — Gold Coast',
    desc: 'Solve a real fintech brief in 48 hours. Top teams present to an industry panel.',
    location: 'Gold Coast, Australia',
    flag: '🇦🇺',
    date: 'May 17, 2026',
    status: 'Past',
  },
  {
    id: 7,
    type: 'Networking',
    title: 'European Finance Night — Madrid',
    desc: 'Connect with students, alumni, and professionals shaping Europe\'s financial sector.',
    location: 'Madrid, Spain',
    flag: '🇪🇸',
    date: 'Jun 28, 2026',
    status: 'Upcoming',
  },
  {
    id: 8,
    type: 'Podcast',
    title: 'Tamil Nadu Chapter: The Student Portfolio Pod',
    desc: 'Chapter members walk through their paper portfolios and explain their thesis live.',
    location: 'Tamil Nadu, India',
    flag: '🇮🇳',
    date: 'Jun 5, 2026',
    status: 'Past',
  },
]
// ─────────────────────────────────────────────────────────────────────────────


// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .ev-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes ev-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes ev-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes ev-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes ev-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ev-btn-primary {
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
    text-decoration: none;
  }
  .ev-btn-primary:hover {
    background: #ff8c38;
    color: #0E0C09;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2), inset 0 0 12px rgba(255,255,255,0.12);
  }

  .ev-tune:hover  { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .ev-connect:hover { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }
  .ev-tune, .ev-connect { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  .ev-card-link {
    color: #F97316;
    font-family: "Futura", "Century Gothic", sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: text-shadow 0.2s ease, color 0.2s ease;
  }
  .ev-card-link:hover {
    color: #ff8c38;
    text-shadow: 0 0 18px rgba(249,115,22,0.5);
  }

  @keyframes ev-coming-soon-pulse {
    0%, 100% {
      box-shadow: 0 0 0px rgba(249,115,22,0);
      border-color: rgba(249,115,22,0.2);
    }
    50% {
      box-shadow: 0 0 14px rgba(249,115,22,0.28), 0 0 32px rgba(249,115,22,0.08);
      border-color: rgba(249,115,22,0.55);
    }
  }
  .ev-coming-soon {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: "Futura", "Century Gothic", monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(196,168,130,0.5);
    background: rgba(249,115,22,0.03);
    border: 1px solid rgba(249,115,22,0.2);
    border-radius: 2px;
    padding: 6px 14px;
    text-decoration: line-through;
    text-decoration-color: rgba(249,115,22,0.18);
    cursor: default;
    animation: ev-coming-soon-pulse 2.6s ease-in-out infinite;
  }
`

export default function EventsPage() {
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

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden ev-futura"
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
            animation: 'ev-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'ev-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'ev-orb-drift 22s ease-in-out infinite',
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
            style={{ ...b.style, zIndex: 5, animation: `ev-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            <path d={b.d} stroke="rgba(249,115,22,0.45)" strokeWidth="1.2" />
          </svg>
        ))}

        {/* Layer 5: diagonal slash */}
        <div className="absolute pointer-events-none" style={{
          left: '40%', top: 0, width: '1px', height: '100%',
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
            Global Events · 2026
          </span>
        </div>

        {/* Main content */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'ev-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_EVENTS ]
          </div>

          {/* Avant-garde heading */}
          <div style={{ lineHeight: 0.88, marginBottom: '28px' }}>
            <div
              className="ev-tune"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'ev-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              TUNE IN.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'ev-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
              <span style={{
                fontSize: 'clamp(1.3rem, 2.8vw, 2.3rem)',
                fontWeight: 400,
                color: '#C4A882',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
                fontFamily: '"Futura", "Century Gothic", sans-serif',
              }}>
                show up.
              </span>
              <span
                className="ev-connect"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                CONNECT.
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'ev-word-in 0.6s ease 0.45s forwards' }}>
            <p style={{
              color: '#7A6B58',
              fontSize: '16px',
              fontWeight: 300,
              lineHeight: 1.75,
              marginBottom: '36px',
              transform: 'rotate(-0.8deg)',
              transformOrigin: 'left center',
              fontFamily: 'inherit',
            }}>
              Competitions · Networking nights · Keynotes.<br />
              Live podcasts and global summits — all free<br />
              for Ledger chapter members worldwide.
            </p>
          </div>

          {/* Bottom-right live count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'ev-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Live</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#4ade80', lineHeight: 1, textShadow: '0 0 30px rgba(74,222,128,0.35)' }}>
              {events.filter(e => e.status === 'Live Now').length}
            </div>
          </div>

          {/* Decorative ghost "E" */}
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
            E
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
            animation: 'ev-ticker 22s linear infinite',
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
                NETWORKING &nbsp;·&nbsp; SPEECHES &nbsp;·&nbsp; PODCASTS &nbsp;·&nbsp; COMPETITIONS &nbsp;·&nbsp; SUMMITS &nbsp;·&nbsp; GLOBAL &nbsp;·&nbsp; FREE TO JOIN &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WORKSHOP ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden ev-futura" style={{ background: '#0E0C09', borderTop: '1px solid rgba(249,115,22,0.12)' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

        <FadeIn>
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

            {/* Section label */}
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '20px' }}>
              [ UPCOMING_EVENTS ]
            </div>
            <h2 style={{ fontFamily: '"Futura","Century Gothic",sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, color: '#F5F0E8', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '40px' }}>
              On the Calendar.
            </h2>

            {/* Workshop card */}
            <div
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
              {/* Card header bar */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(249,115,22,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.8)', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.22)', padding: '4px 10px', borderRadius: '2px' }}>
                    Workshop
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.8)', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', padding: '4px 10px', borderRadius: '2px' }}>
                    ● Upcoming
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#C4A882', background: 'rgba(196,168,130,0.07)', border: '1px solid rgba(196,168,130,0.16)', padding: '5px 12px', borderRadius: '100px', letterSpacing: '0.1em' }}>
                    📅 26–27 July 2025
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#C4A882', background: 'rgba(196,168,130,0.07)', border: '1px solid rgba(196,168,130,0.16)', padding: '5px 12px', borderRadius: '100px', letterSpacing: '0.1em' }}>
                    📍 Tokyo · In-Person
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-7 sm:p-8">
                <h3 style={{ fontFamily: '"Futura","Century Gothic",sans-serif', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 900, color: '#F5F0E8', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '14px' }}>
                  Finance, Economics &amp; Business Workshop
                </h3>
                <p style={{ color: '#7A6B58', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, maxWidth: '620px', marginBottom: '24px' }}>
                  A two-day weekend intensive for high school students across The Ledger network. Build foundational knowledge in financial markets and macroeconomics, then advance into financial modelling, trading strategies, and a live stock pitch challenge. Includes guest speaker sessions, team case studies, and cross-school networking.
                </p>

                {/* Highlight tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                  {['🎤 Guest Speakers', '🤝 Team Collaboration', '📊 Financial Modelling', '🏆 Stock Pitch Challenge', '🌏 Cross-School Networking'].map(tag => (
                    <span key={tag} style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.12em', color: 'rgba(196,168,130,0.75)', border: '1px solid rgba(196,168,130,0.18)', padding: '5px 12px', borderRadius: '100px' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <a href="/workshop-register" className="ev-btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
                  Register Interest <ArrowRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* ── COMING SOON (removed) ────────────────────────────────────────────── */}
      {false && <section className="relative overflow-hidden" style={{ background: '#F5F0E8', borderTop: '1px solid rgba(26,21,16,0.06)' }}>
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
          backgroundSize: '180px 180px',
          opacity: 0.5,
        }} />

        {/* Decorative ghost text background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none" style={{ zIndex: 0 }}>
          <span style={{
            fontSize: 'clamp(10rem, 40vw, 28rem)',
            fontWeight: 900,
            fontFamily: '"Futura","Century Gothic",sans-serif',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(26,21,16,0.05)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            SOON
          </span>
        </div>

        <FadeIn>
          <div className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8 py-32 sm:py-40" style={{ zIndex: 1 }}>

            {/* Pulsing badge */}
            <div className="ev-coming-soon-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'monospace',
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(249,115,22,0.7)',
              background: 'rgba(249,115,22,0.06)',
              border: '1px solid rgba(249,115,22,0.25)',
              padding: '8px 18px',
              borderRadius: '2px',
              marginBottom: '32px',
              animation: 'ev-coming-soon-pulse 2.6s ease-in-out infinite',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F97316', display: 'inline-block', animation: 'ev-coming-soon-dot 2.6s ease-in-out infinite' }} />
              [ EVENTS_CALENDAR ]
            </div>

            {/* Large heading */}
            <h2 style={{
              fontFamily: '"Futura","Century Gothic",sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 900,
              color: '#1A1510',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              marginBottom: '12px',
            }}>
              COMING
            </h2>
            <h2 style={{
              fontFamily: '"Futura","Century Gothic",sans-serif',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 900,
              color: '#F97316',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              marginBottom: '36px',
              textShadow: '0 0 60px rgba(249,115,22,0.2)',
            }}>
              SOON.
            </h2>

            {/* Sub-copy */}
            <p style={{
              fontFamily: '"Futura","Century Gothic",sans-serif',
              fontSize: '15px',
              fontWeight: 300,
              color: '#7A6B58',
              lineHeight: 1.75,
              maxWidth: '400px',
              letterSpacing: '0.03em',
            }}>
              Competitions, networking nights, keynotes, and podcasts — the full event calendar is on its way.
            </p>

            {/* Category chips preview */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
              {['Competition', 'Networking', 'Speech', 'Podcast', 'Summit'].map(cat => (
                <span key={cat} style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(26,21,16,0.3)',
                  border: '1px solid rgba(26,21,16,0.1)',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(26,21,16,0.15)',
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>}

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, #130B04 0%, #1A0D05 50%, #0E0C09 100%)',
        borderTop: '1px solid rgba(249,115,22,0.22)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient orange glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }} />
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>
              [ SUBMIT_AN_EVENT ]
            </p>
            <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1, fontFamily: '"Futura","Century Gothic",sans-serif' }}>
              Know about an event?
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              Running a competition, hosting a speaker, or recording a chapter podcast? Submit it and we'll add it to the network calendar.
            </p>
            <a
              href="mailto:theledger.japan@gmail.com?subject=Event%20Submission%20for%20The%20Ledger"
              className="ev-btn-primary"
            >
              Submit an Event <ArrowRight size={13} />
            </a>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
