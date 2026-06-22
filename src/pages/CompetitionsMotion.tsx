import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { useState, useEffect, useRef } from 'react'

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
    status: 'In Discussion' as const,
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

const motionCSS = `
@keyframes word-in {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes orb-breathe {
  0%, 100% { opacity: 0.06; transform: scale(1); }
  50%       { opacity: 0.14; transform: scale(1.08); }
}
@keyframes float-1 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-14px) translateX(6px)} }
@keyframes float-2 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-10px) translateX(-8px)} }
@keyframes float-3 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-18px) translateX(4px)} }
@keyframes float-4 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-8px) translateX(-5px)} }
@keyframes float-5 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-12px) translateX(10px)} }
@keyframes float-6 { 0%,100%{transform:translateY(0px) translateX(0px)} 50%{transform:translateY(-20px) translateX(-3px)} }
`

const particles = [
  { top: '18%', left: '12%',  size: 5,  anim: 'float-1 4.2s ease-in-out infinite', color: 'rgba(249,115,22,0.5)' },
  { top: '60%', left: '8%',   size: 4,  anim: 'float-2 5.1s ease-in-out infinite', color: 'rgba(196,168,130,0.4)' },
  { top: '30%', right: '10%', size: 7,  anim: 'float-3 6.0s ease-in-out infinite', color: 'rgba(249,115,22,0.3)' },
  { top: '70%', right: '15%', size: 4,  anim: 'float-4 4.8s ease-in-out infinite', color: 'rgba(196,168,130,0.5)' },
  { top: '50%', left: '22%',  size: 6,  anim: 'float-5 5.6s ease-in-out infinite', color: 'rgba(249,115,22,0.25)' },
  { top: '20%', right: '28%', size: 4,  anim: 'float-6 7.0s ease-in-out infinite', color: 'rgba(196,168,130,0.35)' },
]

const heroStats = [
  { label: 'Competitions', target: 3 },
  { label: 'Countries', target: 6 },
  { label: 'Starting Capital', target: 100, prefix: '$', suffix: 'K' },
]

export default function CompetitionsMotion() {
  const activeCount = competitions.filter(c => c.status === 'Open').length
  const [scrollY, setScrollY] = useState(0)
  const [counts, setCounts] = useState([0, 0, 0])
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })
  const btnRef = useRef<HTMLAnchorElement>(null)

  // Parallax scroll
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Count-up on mount
  useEffect(() => {
    const targets = [3, 6, 100]
    const duration = 1500
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounts(targets.map(t => Math.round(t * eased)))
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [])

  // Magnetic button
  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setBtnOffset({
      x: Math.max(-8, Math.min(8, (e.clientX - cx) * 0.4)),
      y: Math.max(-8, Math.min(8, (e.clientY - cy) * 0.4)),
    })
  }

  return (
    <>
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
    <main>
      <style dangerouslySetInnerHTML={{ __html: motionCSS }} />

      {/* ── HERO — MOTION HEAVY ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0E0C09', minHeight: '90vh', paddingTop: '68px' }}
      >
        {/* Breathing central orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.6}px)`,
            width: '700px', height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(249,115,22,1) 0%, transparent 70%)',
            animation: 'orb-breathe 3s ease-in-out infinite',
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-80px', left: '-80px',
            transform: `translateY(${scrollY * 0.4}px)`,
            width: '500px', height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(196,168,130,1) 0%, transparent 70%)',
            animation: 'orb-breathe 4s ease-in-out infinite reverse',
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              top: p.top,
              left: ('left' in p) ? p.left : undefined,
              right: ('right' in p) ? p.right : undefined,
              width: p.size,
              height: p.size,
              background: p.color,
              animation: p.anim,
            }}
          />
        ))}

        {/* Content */}
        <div
          className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8"
          style={{ minHeight: 'calc(90vh - 68px)', zIndex: 2 }}
        >
          <FadeIn>
            <p style={{ color: '#C4A882', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '32px' }}>
              Network Competitions
            </p>
          </FadeIn>

          {/* Staggered word entrance */}
          <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '32px', transform: `translateY(${scrollY * 0.3}px)` }}>
            {['Compete.', 'Learn.', 'Win.'].map((word, i) => (
              <span
                key={word}
                style={{
                  display: 'inline-block',
                  marginRight: '0.25em',
                  color: i === 2 ? '#F97316' : '#F5F0E8',
                  opacity: 0,
                  animation: `word-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards`,
                  animationDelay: `${0.1 + i * 0.15}s`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Count-up stats */}
          <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
            {heroStats.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#F97316', lineHeight: 1 }}>
                  {s.prefix || ''}{counts[i]}{s.suffix || ''}
                </div>
                <div style={{ fontSize: '11px', color: '#7A6B58', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '4px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: '#9A8B7A', fontSize: '17px', fontWeight: 300, maxWidth: '500px', lineHeight: 1.7, marginBottom: '40px' }}>
            Trading. Debate. Case study. The Ledger network runs challenges that build real financial thinking — at zero cost.
          </p>

          {/* Magnetic CTA */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              ref={btnRef}
              to="/register"
              className="btn-primary text-base px-8 py-4"
              style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`, transition: 'transform 0.15s ease-out' }}
              onMouseMove={handleBtnMouseMove}
              onMouseLeave={() => setBtnOffset({ x: 0, y: 0 })}
            >
              Register Now <ArrowRight size={16} />
            </Link>
            <Link
              to="#"
              className="btn-ghost text-base px-8 py-4"
            >
              Browse Competitions ↓
            </Link>
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
