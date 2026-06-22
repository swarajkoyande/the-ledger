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
    description: "A two-phase academic competition co-hosted with EconomiX. Phase 1: teams submit a 2–3 page analytical essay on a real Japan economics case study, graded by The Ledger's proprietary AI system + human review panel. Phase 2: top teams compete head-to-head in a live in-person final — presenting policy proposals, fielding judge Q&A, and facing a rebuttal round. 4–6 weeks end-to-end.",
    prize: '🥇 Winner: trophy, internship opportunity with a sponsor, Winner badge on The Ledger · 🎖️ Finalist: badge + joint certificate · All participants: AI scorecard feedback + Participant badge',
    eligibility: 'High school students · Teams of 2–4 · All Ledger chapters globally',
    deadline: 'Competition being finalised — registration opening soon',
  },
  {
    name: 'Ledger × NGYA Economics Debate Championship',
    organizer: 'The Ledger · NGYA',
    region: 'Global (Virtual)',
    status: 'In Pursuit' as const,
    description: 'A 5-day virtual debate tournament built on real-world finance and economics motions — co-hosted with NGYA (Nihon Global Youth Association). No reports, no case packs. Every round is a live debate. Format escalates: 1v1 in prelims, 2v2 in semis, full team clash in the Grand Final.',
    prize: '🏆 Champions: Ledger Fellows badge, crystal engraved trophy, winner medals, co-signed certificate · 🎖️ Runners-up: LinkedIn recommendation from NGYA Executive Founder · 🎤 Best Individual Debater: Sharp Minds Award',
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

export default function CompetitionsAvant() {
  const activeCount = competitions.filter(c => c.status === 'Open').length

  return (
    <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    <main>
      {/* ── HERO — AVANT-GARDE ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0E0C09', minHeight: '88vh', paddingTop: '68px' }}
      >
        {/* Giant decorative C — cropped */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            right: '-60px',
            top: '40px',
            fontSize: '52vw',
            fontWeight: 900,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(249,115,22,0.12)',
            letterSpacing: '-0.05em',
            userSelect: 'none',
          }}
        >
          C
        </div>

        {/* Diagonal slash */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '38%',
            top: 0,
            width: '1px',
            height: '100%',
            background: 'rgba(196,168,130,0.15)',
            transform: 'rotate(12deg)',
            transformOrigin: 'top center',
          }}
        />

        {/* Rotated eyebrow on left edge */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block"
          style={{
            writingMode: 'vertical-rl',
            transform: 'translateY(-50%) rotate(180deg)',
            color: '#C4A882',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          Network Competitions · 2026
        </div>

        <div className="relative max-w-6xl mx-auto px-10 sm:px-16 flex flex-col justify-center" style={{ minHeight: 'calc(88vh - 68px)' }}>
          {/* Asymmetric heading */}
          <FadeIn>
            <div className="mb-2">
              <p style={{ color: '#F97316', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                — 01
              </p>
              <div style={{ lineHeight: 0.9 }}>
                <div
                  style={{
                    fontSize: 'clamp(5rem, 13vw, 11rem)',
                    fontWeight: 900,
                    color: '#F5F0E8',
                    letterSpacing: '-0.04em',
                    display: 'block',
                  }}
                >
                  COMPETE.
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
                      fontWeight: 300,
                      color: '#9A8B7A',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      transform: 'rotate(-1.5deg)',
                      display: 'inline-block',
                    }}
                  >
                    learn.
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                      fontWeight: 900,
                      color: '#F97316',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    WIN.
                  </span>
                </div>
              </div>
            </div>

            {/* Body text at a slight angle */}
            <div
              style={{
                maxWidth: '420px',
                marginTop: '48px',
                marginLeft: '4px',
                transform: 'rotate(-1deg)',
                transformOrigin: 'left center',
              }}
            >
              <p style={{ color: '#7A6B58', fontSize: '15px', fontWeight: 300, lineHeight: 1.7 }}>
                Stock trading. Case competitions. Live debates.
                The Ledger network runs challenges that build real financial thinking — all at zero cost to members.
              </p>
            </div>

            {/* CTAs — unconventional */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginTop: '48px' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-block',
                  background: '#F97316',
                  color: '#0E0C09',
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '14px 28px',
                }}
              >
                Register Now
              </Link>
              <Link
                to="/register"
                style={{
                  color: '#C4A882',
                  fontWeight: 300,
                  fontSize: '14px',
                  borderBottom: '1px solid rgba(196,168,130,0.4)',
                  paddingBottom: '2px',
                  letterSpacing: '0.05em',
                }}
              >
                View all competitions ↓
              </Link>
            </div>

            {/* Bottom-right small number label */}
            <div
              style={{
                position: 'absolute',
                right: '48px',
                bottom: '48px',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '10px', color: '#4A3F35', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>Active</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#F97316', lineHeight: 1 }}>{activeCount}</div>
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
