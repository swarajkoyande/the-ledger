import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

const chapters = [
  {
    city: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    tag: 'Founding Chapter', tagStyle: { color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' },
    stats: [{ v: '35+', l: 'Members' }, { v: '7', l: 'Schools' }],
    desc: 'Our flagship chapter unites 35+ members from 7 schools across Tokyo — bound by a belief that young people deserve to understand money, markets, and their financial future. Weekly market discussions, live trading simulations, and a growing alumni network that spans the city.',
  },
  {
    city: 'India', country: 'Delhi · Tamil Nadu · Gujarat', flag: '🇮🇳',
    tag: 'Expanding Fast', tagStyle: { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)' },
    stats: [{ v: '3', l: 'Regions' }, { v: '2024', l: 'Launched' }],
    desc: 'Spanning three regions — Delhi in the North, Tamil Nadu in the South, Gujarat in the West — India is The Ledger\'s most ambitious expansion. In one of the world\'s youngest nations, the demand for accessible, applied financial education is enormous. We\'re here for it.',
  },
  {
    city: 'Madrid', country: 'Spain', flag: '🇪🇸',
    tag: 'European Hub', tagStyle: { color: '#C4A882', background: 'rgba(196,168,130,0.08)', border: '1px solid rgba(196,168,130,0.2)' },
    stats: [{ v: 'EU', l: 'Chapter' }, { v: 'Active', l: 'Status' }],
    desc: 'The Ledger\'s European home brings together students passionate about economics, investing, and the kind of real financial knowledge that goes beyond the classroom. Market deep-dives, case competitions, and discussions on Europe\'s evolving economic landscape.',
  },
  {
    city: 'Gold Coast', country: 'Australia', flag: '🇦🇺',
    tag: 'Fintech Focus', tagStyle: { color: '#818cf8', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)' },
    stats: [{ v: 'Fintech', l: 'Focus' }, { v: 'Active', l: 'Status' }],
    desc: 'Where finance meets technology. Gold Coast members pull apart fintech models, explore algorithmic trading, and understand how software is reshaping capital markets. The most technically focused chapter in the network — and proud of it.',
  },
]

// ── INJECTED CSS ──────────────────────────────────────────────────────────────
const css = `
  .ch-futura { font-family: "Futura", "Futura PT", "Century Gothic", "Trebuchet MS", ui-sans-serif, sans-serif; }

  @keyframes ch-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes ch-hud-blink {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.8; }
  }
  @keyframes ch-orb-drift {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(18px, -12px) scale(1.04); }
    66%  { transform: translate(-10px, 16px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes ch-word-in {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ch-globe:hover  { color: #ff9a50; text-shadow: 0 0 40px rgba(249,115,22,0.35); }
  .ch-expand:hover { text-shadow: 0 0 60px rgba(249,115,22,0.8); filter: brightness(1.15); }
  .ch-globe, .ch-expand { transition: color 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease; }

  .ch-btn-primary {
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
    text-decoration: none;
    transition: box-shadow 0.25s ease, background 0.2s ease;
    box-shadow: 0 0 0px rgba(249,115,22,0);
  }
  .ch-btn-primary:hover {
    background: #ff8c38;
    box-shadow: 0 0 28px rgba(249,115,22,0.55), 0 0 60px rgba(249,115,22,0.2), inset 0 0 12px rgba(255,255,255,0.12);
  }
`

export default function ChaptersPage() {
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
        className="relative overflow-hidden ch-futura"
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
            animation: 'ch-orb-drift 14s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-60px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,0.06) 0%, transparent 65%)',
            animation: 'ch-orb-drift 18s ease-in-out infinite reverse',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '35%',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)',
            animation: 'ch-orb-drift 22s ease-in-out infinite',
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
            style={{ ...b.style, zIndex: 5, animation: `ch-hud-blink 3s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
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
            Global Chapters · 2026
          </span>
        </div>

        {/* Main content */}
        <div
          className="relative flex flex-col justify-center px-10 sm:px-16 md:px-20"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 6, transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Monospace label */}
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em', marginBottom: '28px', opacity: 0, animation: 'ch-word-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            [ LEDGER_NETWORK ]
          </div>

          {/* Avant-garde heading */}
          <div style={{ lineHeight: 0.88, marginBottom: '28px' }}>
            <div
              className="ch-globe"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 10rem)',
                fontWeight: 900,
                color: '#F5F0E8',
                letterSpacing: '-0.04em',
                display: 'block',
                cursor: 'default',
                opacity: 0,
                animation: 'ch-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s forwards',
              }}
            >
              GLOBAL.
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.5rem', marginTop: '6px', opacity: 0, animation: 'ch-word-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s forwards' }}>
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
                local roots.
              </span>
              <span
                className="ch-expand"
                style={{
                  fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                  fontWeight: 900,
                  color: '#F97316',
                  letterSpacing: '-0.04em',
                  cursor: 'default',
                  textShadow: '0 0 40px rgba(249,115,22,0.45)',
                }}
              >
                EXPAND.
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ maxWidth: '420px', opacity: 0, animation: 'ch-word-in 0.6s ease 0.45s forwards' }}>
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
              Tokyo · Delhi · Madrid · Gold Coast.<br />
              The Ledger is building a generation of<br />
              financially literate leaders — one chapter at a time.
            </p>
          </div>

          {/* Bottom-right chapter count */}
          <div style={{
            position: 'absolute', right: '48px', bottom: '60px',
            textAlign: 'right', opacity: 0,
            animation: 'ch-word-in 0.5s ease 0.6s forwards',
          }}>
            <div style={{ fontSize: '9px', color: '#3A3028', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>Chapters</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#F97316', lineHeight: 1, textShadow: '0 0 30px rgba(249,115,22,0.45)' }}>{chapters.length}</div>
          </div>

          {/* Decorative ghost "N" */}
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
            N
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
            animation: 'ch-ticker 22s linear infinite',
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
                TOKYO &nbsp;·&nbsp; DELHI &nbsp;·&nbsp; MADRID &nbsp;·&nbsp; GOLD COAST &nbsp;·&nbsp; 4 CHAPTERS &nbsp;·&nbsp; 6 COUNTRIES &nbsp;·&nbsp; FOUNDED 2023 &nbsp;·&nbsp; GROWING FAST &nbsp;·&nbsp; APPLY NOW &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTER CARDS ─────────────────────────────────────────────────── */}
      <section className="relative py-16 pb-28 overflow-hidden" style={{ background: '#0E0C09' }}>
        {/* Subtle background orbs for cards section */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 65%)', animation: 'ch-orb-drift 20s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,168,130,0.04) 0%, transparent 65%)', animation: 'ch-orb-drift 25s ease-in-out infinite reverse' }} />
        </div>

        {/* Section eyebrow */}
        <FadeIn>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-10">
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.65)', letterSpacing: '0.28em' }}>
              [ ACTIVE_CHAPTERS ]
            </div>
          </div>
        </FadeIn>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 space-y-5">
          {chapters.map((ch, i) => (
            <FadeIn key={ch.city} delay={i * 80} direction="up">
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
                <div className="grid md:grid-cols-[260px_1fr]">
                  {/* Left panel */}
                  <div
                    className="p-8 flex flex-col justify-between gap-6"
                    style={{
                      background: 'rgba(249,115,22,0.04)',
                      borderRight: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div>
                      <div className="text-5xl mb-4">{ch.flag}</div>
                      <h2
                        className="text-3xl font-black mb-1 ch-futura"
                        style={{ color: '#F5F0E8' }}
                      >
                        {ch.city}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs font-light mb-4" style={{ color: '#6B5E50' }}>
                        <MapPin size={11} />{ch.country}
                      </div>
                      <span
                        className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full"
                        style={ch.tagStyle}
                      >
                        {ch.tag}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {ch.stats.map(s => (
                        <div
                          key={s.l}
                          className="rounded-xl p-3 text-center"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div className="font-black text-xl" style={{ color: '#F97316' }}>{s.v}</div>
                          <div className="text-[11px] font-light mt-0.5" style={{ color: '#6B5E50' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="p-8 md:p-10 flex items-center">
                    <p
                      className="font-light text-lg leading-relaxed"
                      style={{ color: '#9A8B7A' }}
                    >
                      {ch.desc}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── EXPANSION CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: '#0E0C09', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p style={{ color: '#C4A882', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '20px', fontFamily: 'monospace' }}>
              [ YOUR_CITY_NEXT ]
            </p>
            <h2
              style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 900, color: '#F5F0E8', marginBottom: '16px', lineHeight: 1.1, fontFamily: '"Futura","Century Gothic",sans-serif' }}
            >
              Start a chapter in your city.
            </h2>
            <p style={{ color: '#6B5E50', fontSize: '17px', fontWeight: 300, maxWidth: '480px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              The Ledger is actively expanding. Apply to become a Regional Head and bring the network to your community.
            </p>
            <Link to="/register" className="ch-btn-primary">
              Apply as Regional Head <ArrowRight size={13} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
