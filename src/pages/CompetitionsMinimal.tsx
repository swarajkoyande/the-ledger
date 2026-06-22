import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

// ── TRADING COMPETITION — QUARTERLY AUTO-DETECTION ───────────────────────────
function getTradingQuarter() {
  const now = new Date()
  const month = now.getMonth()
  if (month <= 2)  return { season: 'Winter', window: 'Jan – Mar', status: month < 3 ? 'Open' : 'Open' }
  if (month <= 5)  return { season: 'Spring', window: 'Apr – Jun', status: 'Open' }
  if (month <= 8)  return { season: 'Summer', window: 'Jul – Sep', status: 'Open' }
  return           { season: 'Fall',   window: 'Oct – Dec', status: 'Open' }
}
const tq = getTradingQuarter()

// ── COMPETITION DATA ──────────────────────────────────────────────────────────
const competitions = [
  {
    name: `Ledger Trading Competition — ${tq.season} 2026`,
    organizer: 'The Ledger Network',
    region: 'Global',
    status: tq.status,
    description:
      `The Ledger's flagship quarterly trading competition. Each participant starts with a virtual $100,000 portfolio and competes across stocks and crypto — with leverage available. Runs every quarter (Spring · Summer · Fall · Winter). Current session: ${tq.season} ${tq.window}.`,
    prize: '🏆 Ledger Fellows badge permanently on your app profile · Network-wide spotlight · Leaderboard recognition',
    eligibility: 'All active Ledger chapter members globally · Individual · $0 entry fee',
    deadline: `${tq.season} session live now — closes end of ${tq.window.split('–')[1].trim()}`,
  },
  {
    name: 'Ledger × EconomiX Economics Case Competition',
    organizer: 'The Ledger · EconomiX',
    region: 'Global (Japan focus)',
    status: 'In Pursuit',
    description:
      'A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger\'s proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final — presenting policy proposals, fielding judge Q&A, and facing a rebuttal round. 4–6 weeks end-to-end.',
    prize: '🥇 Winner: trophy, internship opportunity with a sponsor, Winner badge on The Ledger · 🎖️ Finalist: badge + joint certificate · All participants: AI scorecard feedback + Participant badge',
    eligibility: 'High school students · Teams of 2–4 · All Ledger chapters globally',
    deadline: 'Competition being finalised — registration opening soon',
  },
  {
    name: 'Ledger × NGYA Economics Debate Championship',
    organizer: 'The Ledger · NGYA',
    region: 'Global (Virtual)',
    status: 'In Pursuit' as const,
    description:
      'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA (Nihon Global Youth Association). No reports, no case packs. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final. Motions span macro policy, markets, corporate finance, and socio-economics. Proposed for Summer.',
    prize: '🏆 Champions: Ledger Fellows badge, crystal engraved trophy, winner medals, co-signed certificate · 🎖️ Runners-up: LinkedIn recommendation from NGYA Executive Founder, spotlight post · 🎤 Best Individual Debater: Sharp Minds Award',
    eligibility: 'All Ledger chapter members globally · Teams of 3–4 · Virtual format',
    deadline: 'Proposed for Summer 2026 — details being confirmed with NGYA',
  },
]

// ── STATUS STYLES ─────────────────────────────────────────────────────────────
const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Open:           { label: 'Open',          color: '#F97316', bg: 'rgba(249,115,22,0.12)',   border: '1px solid rgba(249,115,22,0.3)'   },
  'Coming Soon':  { label: 'Coming Soon',   color: '#C4A882', bg: 'rgba(196,168,130,0.12)', border: '1px solid rgba(196,168,130,0.3)' },
  'In Pursuit':   { label: 'In Pursuit',    color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: '1px solid rgba(52,211,153,0.25)' },
  'In Discussion':{ label: 'In Discussion', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.3)' },
  Closed:         { label: 'Closed',        color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: '1px solid rgba(107,114,128,0.25)'},
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CompetitionsMinimal() {
  const activeCount = competitions.filter(c => c.status === 'Open').length

  return (
    <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    <main>
      {/* ── HERO — LIQUID GLASS ───────────────────────────────────────────── */}
      <section
        className="relative pt-[68px] pb-28 overflow-hidden"
        style={{ background: '#0E0C09' }}
      >
        {/* Background lighting — two large soft light sources */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Warm orange top-right source */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 700px 500px at 85% -10%, rgba(249,115,22,0.12) 0%, transparent 70%)',
            }}
          />
          {/* Cool tan bottom-left fill */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 600px 400px at -5% 110%, rgba(196,168,130,0.08) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Floating stat pills — positioned relative to the hero section */}
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          {/* Pills row — overlaps the top of the glass card via negative bottom margin */}
          <FadeIn delay={100}>
            <div
              className="flex flex-wrap items-center justify-center gap-3 mb-[-18px] relative z-10"
            >
              {[
                `${activeCount} Competition${activeCount !== 1 ? 's' : ''} Active`,
                'Global Network',
                '$0 Entry',
              ].map((label) => (
                <span
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#C4A882',
                    letterSpacing: '0.04em',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Central glass card */}
          <FadeIn>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                borderRadius: '32px',
                padding: 'clamp(3rem, 6vw, 4rem)',
                textAlign: 'center',
                marginTop: '0',
                paddingTop: 'clamp(3.5rem, 6vw, 4.5rem)',
              }}
            >
              {/* Eyebrow */}
              <div
                className="flex flex-col items-center gap-2 mb-8"
              >
                <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A882' }}>
                  <span style={{ color: '#F97316', marginRight: '6px' }}>●</span>
                  Network Competitions
                </p>
                {/* Thin light line */}
                <div
                  style={{
                    height: '1px',
                    width: '40px',
                    background: 'rgba(249,115,22,0.3)',
                  }}
                />
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontSize: 'clamp(3.5rem, 7vw, 6rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  marginBottom: '1.5rem',
                  color: '#F5F0E8',
                }}
              >
                Compete. Learn.{' '}
                <br />
                <span
                  style={{
                    color: '#F97316',
                    textShadow: '0 0 80px rgba(249,115,22,0.35)',
                  }}
                >
                  Win.
                </span>
              </h1>

              {/* Subtext */}
              <p
                style={{
                  color: '#7A6E65',
                  fontSize: '1.125rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  maxWidth: '520px',
                  margin: '0 auto 2.5rem',
                }}
              >
                From stock pitch challenges to fintech hackathons, The Ledger network runs competitions that sharpen your financial thinking — and look great on a résumé. All at zero cost to members.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Primary — minimal text + arrow */}
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2"
                  style={{
                    color: '#F5F0E8',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    paddingBottom: '2px',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderBottomColor = '#F97316'
                    e.currentTarget.style.color = '#F97316'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderBottomColor = 'transparent'
                    e.currentTarget.style.color = '#F5F0E8'
                  }}
                >
                  Join a Competition <ArrowRight size={14} />
                </Link>

                {/* Secondary — glass pill */}
                <Link
                  to="#competitions"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '100px',
                    padding: '10px 24px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#C4A882',
                    textDecoration: 'none',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  Browse All
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#141108', borderTop: '1px solid rgba(245,240,232,0.05)', borderBottom: '1px solid rgba(245,240,232,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center">
            {[
              `${activeCount} Active Competition${activeCount !== 1 ? 's' : ''}`,
              '6+ Countries Eligible',
              '$0 Entry Fee',
            ].map((stat, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-cream text-sm font-semibold">{stat}</span>
                {i < 2 && <span className="hidden sm:inline text-stone/30 text-lg">·</span>}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── COMPETITION CARDS ─────────────────────────────────────────────── */}
      <section id="competitions" className="py-16 pb-28" style={{ background: '#FAF8F3' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">
          {competitions.map((comp, i) => {
            const s = statusStyle[comp.status]
            return (
              <FadeIn key={comp.name} delay={i * 80} direction="up">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(26,21,16,0.08)',
                    boxShadow: '0 4px 24px rgba(14,12,9,0.06)',
                  }}
                >
                  <div className="grid md:grid-cols-[260px_1fr]">
                    {/* Left panel — dark */}
                    <div
                      className="p-8 flex flex-col justify-between gap-6"
                      style={{ background: '#141108', borderRight: '1px solid rgba(245,240,232,0.06)' }}
                    >
                      <div>
                        <h2 className="text-xl font-black leading-snug mb-3 text-cream">{comp.name}</h2>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: '#9A8B7A' }}>
                          {comp.organizer}
                        </p>
                        <div className="flex flex-col gap-2">
                          <span
                            className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full w-fit"
                            style={{ color: '#C4A882', background: 'rgba(196,168,130,0.1)', border: '1px solid rgba(196,168,130,0.2)' }}
                          >
                            {comp.region}
                          </span>
                          <span
                            className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full w-fit"
                            style={{ color: s.color, background: s.bg, border: s.border }}
                          >
                            {s.label}
                          </span>
                        </div>
                      </div>
                      <div
                        className="rounded-xl px-4 py-3 text-xs font-light leading-relaxed"
                        style={{ background: 'rgba(245,240,232,0.04)', color: '#9A8B7A', border: '1px solid rgba(245,240,232,0.06)' }}
                      >
                        {comp.deadline}
                      </div>
                    </div>

                    {/* Right panel — white */}
                    <div className="p-8 md:p-10 flex flex-col justify-between gap-6">
                      <p className="font-light text-lg leading-relaxed" style={{ color: '#5C4E3F' }}>
                        {comp.description}
                      </p>
                      <div className="space-y-3">
                        <div
                          className="rounded-2xl px-5 py-4"
                          style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.06)' }}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#9A8B7A' }}>Prize / Reward</p>
                          <p className="text-sm font-light leading-relaxed" style={{ color: '#5C4E3F' }}>{comp.prize}</p>
                        </div>
                        <div
                          className="rounded-2xl px-5 py-4"
                          style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.06)' }}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#9A8B7A' }}>Eligibility</p>
                          <p className="text-sm font-light leading-relaxed" style={{ color: '#5C4E3F' }}>{comp.eligibility}</p>
                        </div>
                      </div>
                      <div>
                        <Link
                          to="/register"
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                          style={{ color: '#F97316' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#fb923c')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#F97316')}
                        >
                          View Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ── PROPOSE A COMPETITION CTA ─────────────────────────────────────── */}
      <section style={{ background: '#141108', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">Got an Idea?</p>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-black text-cream mb-5 leading-tight">
              Have a competition idea?
            </h2>
            <p className="text-stone text-xl font-light mb-10 max-w-xl mx-auto">
              We're always looking for new challenges to bring to the network. If you have a format, a topic, or a partnership in mind — reach out through the registration form and tell us about it.
            </p>
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
    </>
  )
}
