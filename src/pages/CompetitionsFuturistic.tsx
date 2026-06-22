import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

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
    name: `Ledger Trading Competition — ${tq.season} 2026`,
    organizer: 'The Ledger Network',
    region: 'Global',
    status: tq.status,
    description: `The Ledger's flagship quarterly trading competition. Each participant starts with a virtual $100,000 portfolio and competes across stocks and crypto — with leverage available. Runs every quarter (Spring · Summer · Fall · Winter). Current session: ${tq.season} ${tq.window}.`,
    prize: '🏆 Ledger Fellows badge permanently on your app profile · Network-wide spotlight · Leaderboard recognition',
    eligibility: 'All active Ledger chapter members globally · Individual · $0 entry fee',
    deadline: `${tq.season} session live now — closes end of ${tq.window.split('–')[1].trim()}`,
  },
  {
    name: 'Ledger × EconomiX Economics Case Competition',
    organizer: 'The Ledger · EconomiX',
    region: 'Global (Japan focus)',
    status: 'In Pursuit',
    description: "A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger's proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final.",
    prize: '🥇 Winner: trophy, internship opportunity with a sponsor, Winner badge on The Ledger · 🎖️ Finalist: badge + joint certificate · All participants: AI scorecard feedback',
    eligibility: 'High school students · Teams of 2–4 · All Ledger chapters globally',
    deadline: 'Competition being finalised — registration opening soon',
  },
  {
    name: 'Ledger × NGYA Economics Debate Championship',
    organizer: 'The Ledger · NGYA',
    region: 'Global (Virtual)',
    status: 'In Pursuit' as const,
    description: 'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final.',
    prize: '🏆 Champions: Ledger Fellows badge, crystal engraved trophy, winner medals · 🎖️ Runners-up: LinkedIn recommendation from NGYA Executive Founder · 🎤 Sharp Minds Award',
    eligibility: 'All Ledger chapter members globally · Teams of 3–4 · Virtual format',
    deadline: 'Proposed for Summer 2026 — details being confirmed with NGYA',
  },
]

const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Open:            { label: 'Open',          color: '#F97316', bg: 'rgba(249,115,22,0.12)',   border: '1px solid rgba(249,115,22,0.3)'   },
  'Coming Soon':   { label: 'Coming Soon',   color: '#C4A882', bg: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.3)' },
  'In Pursuit':    { label: 'In Pursuit',    color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: '1px solid rgba(52,211,153,0.25)' },
  'In Discussion': { label: 'In Discussion', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)' },
  Closed:          { label: 'Closed',        color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: '1px solid rgba(107,114,128,0.25)' },
}

const tickerCSS = `
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes hud-pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
`

export default function CompetitionsFuturistic() {
  const activeCount = competitions.filter(c => c.status === 'Open').length

  return (
    <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    <main>
      <style dangerouslySetInnerHTML={{ __html: tickerCSS }} />

      {/* ── HERO — FUTURISTIC ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: '#0E0C09',
          minHeight: '90vh',
          paddingTop: '68px',
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)',
            zIndex: 1,
          }}
        />

        {/* Radial light sources */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.1) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse at 20% 80%, rgba(0,255,180,0.04) 0%, transparent 60%)' }} />
        </div>

        {/* HUD corner brackets */}
        {[
          { top: 84, left: 24 },
          { top: 84, right: 24 },
          { bottom: 0, left: 24 },
          { bottom: 0, right: 24 },
        ].map((pos, i) => (
          <svg
            key={i}
            width="20" height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="absolute pointer-events-none"
            style={{ ...pos, opacity: 0.5, zIndex: 2, animation: 'hud-pulse 3s ease-in-out infinite', animationDelay: `${i * 0.4}s` }}
          >
            {i === 0 && <><path d="M0 10 L0 0 L10 0" stroke="#F97316" strokeWidth="1.5"/></>}
            {i === 1 && <><path d="M20 10 L20 0 L10 0" stroke="#F97316" strokeWidth="1.5"/></>}
            {i === 2 && <><path d="M0 10 L0 20 L10 20" stroke="#F97316" strokeWidth="1.5"/></>}
            {i === 3 && <><path d="M20 10 L20 20 L10 20" stroke="#F97316" strokeWidth="1.5"/></>}
          </svg>
        ))}

        {/* Main content */}
        <div className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8" style={{ minHeight: 'calc(90vh - 68px)', zIndex: 2 }}>
          <FadeIn>
            {/* Monospace label */}
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F97316', letterSpacing: '0.25em', marginBottom: '24px', opacity: 0.85 }}>
              [ NETWORK_COMPETITIONS ]
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#F5F0E8',
                marginBottom: '8px',
                letterSpacing: '-0.03em',
              }}
            >
              Compete. Learn.{' '}
              <span style={{ color: '#F97316', textShadow: '0 0 30px rgba(249,115,22,0.6)' }}>Win.</span>
            </h1>

            {/* Stat chips */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '28px 0' }}>
              {[`◆ ${activeCount} COMPETITIONS`, '◆ GLOBAL NETWORK', '◆ $0 ENTRY'].map(chip => (
                <span
                  key={chip}
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#F97316',
                    background: 'rgba(249,115,22,0.07)',
                    border: '1px solid rgba(249,115,22,0.25)',
                    padding: '6px 14px',
                    borderRadius: '4px',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <p style={{ color: '#9A8B7A', fontSize: '16px', fontWeight: 300, maxWidth: '520px', lineHeight: 1.7, margin: '0 auto 36px' }}>
              Trading simulations, case competitions, live debates — sharpening financial thinking across {activeCount + 5}+ countries. Zero cost to members.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  border: '1px solid #F97316',
                  color: '#F97316',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 20px rgba(249,115,22,0.2), inset 0 0 20px rgba(249,115,22,0.03)',
                  transition: 'box-shadow 0.2s',
                }}
              >
                Register Now <ArrowRight size={13} />
              </Link>
              <Link
                to="#competitions"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  border: '1px solid rgba(245,240,232,0.1)',
                  color: '#9A8B7A',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                View All ↓
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Scrolling ticker */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            overflow: 'hidden',
            borderTop: '1px solid rgba(249,115,22,0.15)',
            background: 'rgba(249,115,22,0.04)',
            padding: '10px 0',
            zIndex: 3,
          }}
        >
          <div
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              animation: 'ticker-scroll 20s linear infinite',
              width: 'max-content',
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(249,115,22,0.6)', letterSpacing: '0.2em', paddingRight: '48px' }}>
                TRADING &nbsp;·&nbsp; DEBATE &nbsp;·&nbsp; CASE STUDY &nbsp;·&nbsp; ECONOMICS &nbsp;·&nbsp; GLOBAL &nbsp;·&nbsp; VIRTUAL &nbsp;·&nbsp; $0 ENTRY &nbsp;·&nbsp; SPRING 2026 &nbsp;·&nbsp; STOCKS &amp; CRYPTO &nbsp;·&nbsp; LEVERAGE AVAILABLE &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#141108', borderTop: '1px solid rgba(245,240,232,0.05)', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center">
            {[`${activeCount} Active Competition${activeCount !== 1 ? 's' : ''}`, '6+ Countries Eligible', '$0 Entry Fee'].map((stat, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-cream text-sm font-semibold">{stat}</span>
                {i < 2 && <span className="hidden sm:inline text-stone/30 text-lg">·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── COMPETITION CARDS ─────────────────────────────────────────────── */}
      <section className="py-16 pb-28" style={{ background: '#FAF8F3' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">
          {competitions.map((comp, i) => {
            const s = statusStyle[comp.status] || statusStyle['Closed']
            return (
              <FadeIn key={comp.name} delay={i * 80} direction="up">
                <div className="rounded-3xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.08)', boxShadow: '0 4px 24px rgba(14,12,9,0.06)' }}>
                  <div className="grid md:grid-cols-[260px_1fr]">
                    <div className="p-8 flex flex-col justify-between gap-6" style={{ background: '#141108', borderRight: '1px solid rgba(245,240,232,0.06)' }}>
                      <div>
                        <h2 className="text-xl font-black leading-snug mb-3 text-cream">{comp.name}</h2>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#9A8B7A' }}>{comp.organizer}</p>
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full w-fit" style={{ color: '#C4A882', background: 'rgba(196,168,130,0.1)', border: '1px solid rgba(196,168,130,0.2)' }}>{comp.region}</span>
                          <span className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full w-fit" style={{ color: s.color, background: s.bg, border: s.border }}>{s.label}</span>
                        </div>
                      </div>
                      <div className="rounded-xl px-4 py-3 text-xs font-light leading-relaxed" style={{ background: 'rgba(245,240,232,0.04)', color: '#9A8B7A', border: '1px solid rgba(245,240,232,0.06)' }}>{comp.deadline}</div>
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-between gap-6">
                      <p className="font-light text-lg leading-relaxed" style={{ color: '#5C4E3F' }}>{comp.description}</p>
                      <div className="space-y-3">
                        <div className="rounded-2xl px-5 py-4" style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.06)' }}>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#9A8B7A' }}>Prize / Reward</p>
                          <p className="text-sm font-light leading-relaxed" style={{ color: '#5C4E3F' }}>{comp.prize}</p>
                        </div>
                        <div className="rounded-2xl px-5 py-4" style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.06)' }}>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#9A8B7A' }}>Eligibility</p>
                          <p className="text-sm font-light leading-relaxed" style={{ color: '#5C4E3F' }}>{comp.eligibility}</p>
                        </div>
                      </div>
                      <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#F97316' }}>View Details <ArrowRight size={14} /></Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#141108', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">Got an Idea?</p>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-black text-cream mb-5 leading-tight">Have a competition idea?</h2>
            <p className="text-stone text-xl font-light mb-10 max-w-xl mx-auto">We're always looking for new challenges. If you have a format, topic, or partnership in mind — tell us about it.</p>
            <Link to="/register" className="btn-primary text-base px-8 py-4">Get in Touch <ArrowRight size={16} /></Link>
          </div>
        </FadeIn>
      </section>
    </main>
    </>
  )
}
