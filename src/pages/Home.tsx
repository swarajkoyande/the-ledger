import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { MarqueeStrip } from '../components/Marquee'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
// ── Background orbs for liquid glass hero ─────────────────────────────────────
function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Large warm orange orb */}
      <div className="absolute -top-20 -left-32 w-[500px] h-[500px] rounded-full bg-orange/12 blur-[120px] animate-orb-1" />
      {/* Tan/cream orb */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-tan/10 blur-[100px] animate-orb-2" />
      {/* Small stone orb */}
      <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-stone/8 blur-[80px] animate-orb-3" />
      {/* Cream accent */}
      <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full bg-cream/3 blur-[60px] animate-orb-4" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,240,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
    </div>
  )
}

// ── App mockup ────────────────────────────────────────────────────────────────
function AppMockup() {
  const board = [
    { initial: 'Y', name: 'Yuki T.', ret: '+18.4%' },
    { initial: 'P', name: 'Priya S.', ret: '+15.2%' },
    { initial: 'C', name: 'Carlos M.', ret: '+11.9%' },
  ]
  return (
    <div className="relative w-full max-w-[340px] mx-auto animate-float">
      <div className="glass-md rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,240,232,0.10)' }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-stone text-[10px] font-semibold uppercase tracking-[0.18em]">Portfolio</span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
            </span>
          </div>
          <div className="text-3xl font-black text-cream tracking-tight">$24,840</div>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp size={11} style={{ color: '#4ade80' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#4ade80' }}>+12.4%</span>
            <span className="text-stone text-[11px] font-light">this week</span>
          </div>
        </div>
        {/* Sparkline */}
        <div className="px-5 py-3">
          <svg viewBox="0 0 300 56" className="w-full h-10">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points="0,50 35,42 70,46 105,28 140,34 175,16 210,24 245,10 280,16 300,12"
              fill="none" stroke="#F97316" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            <polygon points="0,50 35,42 70,46 105,28 140,34 175,16 210,24 245,10 280,16 300,12 300,56 0,56"
              fill="url(#sg)" />
          </svg>
        </div>
        {/* Leaderboard */}
        <div className="px-5 pb-5">
          <p className="text-stone text-[10px] font-semibold uppercase tracking-[0.18em] mb-3">Global Leaderboard</p>
          {board.map((r, i) => (
            <div key={r.name} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < 2 ? '1px solid rgba(245,240,232,0.04)' : 'none' }}>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-orange/50 w-4">#{i + 1}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-orange"
                  style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {r.initial}
                </div>
                <span className="text-cream-dim text-sm font-light">{r.name}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>{r.ret}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Floating badge — rank */}
      <div className="absolute -top-5 -right-5 animate-float-delay"
        style={{ background: 'rgba(249,115,22,0.95)', borderRadius: '14px', padding: '8px 14px', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
        <p className="text-white text-[11px] font-bold leading-none">🏆 Rank #3 Global</p>
      </div>
      {/* Floating badge — chapters */}
      <div className="absolute -bottom-5 -left-5 glass-warm animate-float"
        style={{ borderRadius: '14px', padding: '10px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <p className="text-stone text-[10px] font-medium mb-0.5">Chapters Active</p>
        <p className="text-cream text-sm font-semibold">6+ Countries</p>
      </div>
    </div>
  )
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView()
  const count = useCountUp(value, 1800, inView)
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-black text-cream tabular-nums">{count}{suffix}</div>
      <div className="text-black text-sm font-light mt-2 tracking-wide">{label}</div>
    </div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqItems = [
  {
    q: 'Is The Ledger free to join?',
    a: 'Yes — joining The Ledger and creating an account on the app is completely free. There are no subscription fees, no paywalls on course content, and no hidden costs. The competition has no entry fee either. We believe access to economics and finance education shouldn\'t depend on what school you attend or where you live.',
  },
  {
    q: 'Do I need to be part of a school club to sign up?',
    a: 'No. Any high school student can create a Ledger account and access the app independently — you don\'t need to be part of a registered chapter or club. That said, if your school doesn\'t have a Ledger chapter yet, you\'re always welcome to start one. We provide full onboarding support for new chapter founders.',
  },
  {
    q: 'How does the Economics & Finance Competition work?',
    a: 'The competition runs in two phases over 4–6 weeks. In Phase 1, teams of 2–4 students submit a 600–900 word analytical essay responding to a Japan economics case study prompt, co-designed with the Japan Economics Organisation. Essays are graded by The Ledger\'s proprietary AI grading system and reviewed by a human panel. The top teams advance to Phase 2 — a live in-person case challenge where teams present and debate economic proposals before a judging panel. Every participant receives a personal AI scorecard with criterion-level feedback.',
  },
  {
    q: 'What countries and cities is The Ledger active in?',
    a: 'We currently have chapters and active members in Japan (Tokyo), India (Mumbai and Delhi), Singapore, and Australia (Gold Coast). The Ledger App is open globally — if you\'re a high school student anywhere with an interest in economics or finance, you\'re welcome to join. To bring a chapter to your city, reach out at theledger.japan@gmail.com.',
  },
  {
    q: 'Do I need prior knowledge of economics or finance to join?',
    a: 'Not at all. The Ledger is built for students at every level — from complete beginners to those already studying economics at school. The app includes structured learning content starting from the fundamentals. Curiosity is the only requirement.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" style={{ background: '#0E0C09' }}>
      <div className="absolute left-1/4 bottom-0 w-80 h-80 rounded-full bg-orange/5 blur-[100px] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
        <FadeIn className="mb-12 text-center">
          <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">Support</p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black text-cream leading-tight">
            Frequently asked questions
          </h2>
        </FadeIn>
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                onMouseEnter={() => setOpen(i)}
                className="glass rounded-2xl overflow-hidden cursor-default"
                style={{
                  border: isOpen
                    ? '1px solid rgba(234,115,23,0.25)'
                    : '1px solid rgba(245,240,232,0.07)',
                  borderLeft: isOpen ? '3px solid #ea7317' : '3px solid rgba(245,240,232,0.07)',
                  transition: 'border-color 0.3s ease',
                }}
              >
                <div className="w-full px-6 py-5 text-left">
                  <span className="text-cream font-medium text-base leading-snug">{item.q}</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p className="text-stone font-light leading-relaxed text-sm px-6 pb-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const marqueeItems = [
  'Real Market Simulations',
  'Global Student Network',
  'Invite-Only Summits',
  'Live Leaderboards',
  '6 Countries & Growing',
  'Structured Finance Content',
  'Career-Building Competitions',
  'Connect With Industry Leaders',
]

export default function Home() {
  return (
    <>
    <Helmet>
      <title>The Ledger — Student Finance & Economics Network</title>
      <meta name="description" content="Free student-led finance and economics network across Tokyo, Singapore, Mumbai, Delhi, Gold Coast, and Madrid. Learn markets, pitch stocks, compete, and connect." />
      <link rel="canonical" href="https://theledger.online/" />
    </Helmet>
    <main>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-[68px] overflow-hidden" style={{ background: '#0E0C09' }}>
        <HeroOrbs />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 lg:py-28 w-full">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <FadeIn delay={0}>
                <div className="inline-flex items-center gap-2 glass-warm rounded-full px-4 py-1.5 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                  <span className="text-tan text-[11px] font-medium uppercase tracking-[0.18em]">
                    Global Student Finance Network
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-[1.0] tracking-tight mb-6">
                  <span className="text-cream font-light block">The finance and economics</span>
                  <span className="text-cream font-light block">network built for</span>
                  <span className="gradient-text block">ambitious students.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={160}>
                <p className="text-stone text-lg font-light leading-relaxed max-w-lg mb-10">
                  Connecting students across Tokyo, Singapore, Mumbai, Delhi, Gold Coast, and Madrid — learning markets, pitching stocks, running competitions, and meeting industry mentors. Free, student-led, and growing.
                </p>
              </FadeIn>

              <FadeIn delay={240}>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-base px-8 py-4">
                    Join the App — Free <ArrowRight size={16} />
                  </a>
                  <Link to="/register" className="btn-ghost text-base px-8 py-4">
                    Register Your Club
                  </Link>
                </div>
                <p style={{ fontSize: '13px', letterSpacing: '0.08em', opacity: 0.75, marginTop: '16px', marginBottom: '48px', textTransform: 'uppercase', color: '#F5F0E8' }}>
                  70+ Members · 5 Countries · 1 Annual Competition · Free to Join
                </p>
              </FadeIn>

              <FadeIn delay={320}>
                <div className="flex items-center gap-3 text-stone text-sm font-light">
                  <div className="flex -space-x-2">
                    {['Y', 'P', 'C', 'A', 'S'].map((l, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-orange"
                        style={{ borderColor: '#0E0C09', background: 'rgba(249,115,22,0.2)' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <span>70+ students across 15+ chapters</span>
                </div>
              </FadeIn>
            </div>

            {/* Right: App mockup */}
            <FadeIn delay={200} direction="left" className="hidden lg:flex justify-center">
              <AppMockup />
            </FadeIn>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-cream/50" />
          <div className="w-1 h-1 rounded-full bg-cream/50" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ─────────────────────────────────────────────────── */}
      <div className="py-5" style={{ borderTop: '1px solid rgba(245,240,232,0.05)', borderBottom: '1px solid rgba(245,240,232,0.05)', background: '#0A0806' }}>
        <MarqueeStrip items={marqueeItems} />
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #EA6C0A 0%, #F97316 50%, #FB923C 100%)' }} className="py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value={70} suffix="+" label="Student Members" />
            <Stat value={15} suffix="+" label="Chapters Worldwide" />
            <Stat value={6} suffix="+" label="Countries" />
            <Stat value={3} label="Competitions" />
          </div>
        </div>
      </section>

      {/* ── WHAT IS THE LEDGER — LIGHT ────────────────────────────────── */}
      <section className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#FAF8F3' }}>
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'rgba(249,115,22,0.05)', filter: 'blur(120px)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#F97316' }}>What We Are</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.5rem)] font-black leading-tight mb-6" style={{ color: '#1A1510' }}>
                Finance education is broken.
                <span className="block font-light" style={{ color: '#7A6B58' }}>We built the fix.</span>
              </h2>
              <p className="text-lg font-light leading-relaxed mb-6" style={{ color: '#7A6B58' }}>
                Most finance clubs are passive — weekly readings, theoretical discussions, no stakes. The Ledger is different. We're a global network where ambition meets application: real trading simulations, live competitions, and annual summits with industry professionals.
              </p>
              <p className="font-light leading-relaxed" style={{ color: '#7A6B58' }}>
                From Tokyo to Gold Coast, our chapters are building a generation that doesn't just study markets — they move in them.
              </p>
            </FadeIn>

            <FadeIn direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📈', label: 'Live Competitions', sub: 'Real trades, real stakes, live leaderboards across 6 countries.' },
                  { icon: '🌏', label: 'Global Chapters', sub: 'Tokyo · Singapore · Gold Coast · Madrid · India' },
                  { icon: '🎓', label: 'Learn by Doing', sub: 'Structured content that leads directly to competition.' },
                  { icon: '🏔', label: 'Invite-Only Summits', sub: 'Annual gatherings with industry professionals worldwide.' },
                ].map((f, i) => (
                  <div key={f.label} className="rounded-2xl p-6 card-hover-light"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(26,21,16,0.08)',
                      boxShadow: '0 4px 20px rgba(14,12,9,0.05)',
                      transitionDelay: `${i * 60}ms`,
                    }}>
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h4 className="text-sm font-semibold mb-1.5" style={{ color: '#1A1510' }}>{f.label}</h4>
                    <p className="text-xs font-light leading-relaxed" style={{ color: '#7A6B58' }}>{f.sub}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── GLASS BENTO FEATURES ──────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#141108' }}>
        <div className="absolute left-1/4 top-0 w-96 h-96 rounded-full bg-orange/6 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">The Platform</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black text-cream leading-tight mb-4">
              Three pillars. One network.
            </h2>
            <p className="text-stone font-light text-lg max-w-xl mx-auto">
              Everything you need to go from curious student to credible finance professional.
            </p>
          </FadeIn>

          {/* Bento grid */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* CONNECT — tall left */}
            <FadeIn delay={0} direction="up" className="lg:row-span-2">
              <div className="glass rounded-3xl p-8 card-hover h-full flex flex-col relative overflow-hidden"
                style={{ minHeight: 340, border: '1px solid rgba(249,115,22,0.15)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-orange/8 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-orange"
                    style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Connect</p>
                  <h3 className="text-cream text-2xl font-bold leading-tight mb-4">Build a network that outlasts your degree.</h3>
                  <p className="text-stone font-light leading-relaxed">
                    Share market insights, collaborate on strategies, and build real relationships with ambitious students across 6+ countries. The Ledger connects you with people who take finance as seriously as you do.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* LEARN */}
            <FadeIn delay={100} direction="up">
              <div className="glass rounded-3xl p-8 card-hover relative overflow-hidden"
                style={{ border: '1px solid rgba(196,168,130,0.12)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-tan/8 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-tan"
                    style={{ background: 'rgba(196,168,130,0.1)', border: '1px solid rgba(196,168,130,0.18)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-tan text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Learn</p>
                  <h3 className="text-cream text-2xl font-bold leading-tight mb-3">Content built for the real world.</h3>
                  <p className="text-stone font-light leading-relaxed text-sm">
                    From market fundamentals to advanced valuation — structured modules designed to prepare you to act, not just pass exams.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* COMPETE */}
            <FadeIn delay={200} direction="up">
              <div className="glass rounded-3xl p-8 card-hover relative overflow-hidden"
                style={{ border: '1px solid rgba(74,222,128,0.12)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                  style={{ background: 'rgba(74,222,128,0.06)' }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)', color: '#4ade80' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#4ade80' }}>Compete</p>
                  <h3 className="text-cream text-2xl font-bold leading-tight mb-3">Real trades. Real stakes. Real growth.</h3>
                  <p className="text-stone font-light leading-relaxed text-sm">
                    Execute live simulations, track your portfolio, climb the global leaderboard. Competition here is about discipline and measurable growth.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Wide stats card */}
            <FadeIn delay={150} direction="up" className="lg:col-span-2">
              <div className="glass-warm rounded-3xl p-8 card-hover"
                style={{ border: '1px solid rgba(196,168,130,0.10)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-tan text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">The Ledger Network</p>
                    <h3 className="text-cream text-2xl font-bold mb-2">Growing in every timezone.</h3>
                    <p className="text-stone font-light text-sm max-w-sm">From founding chapter in Tokyo to new expansions in India and Europe — the network is live and expanding.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                    {[['15+', 'Chapters'], ['6+', 'Countries'], ['3', 'Competitions'], ['2026', 'Summit Tour']].map(([v, l]) => (
                      <div key={l} className="text-center glass rounded-xl px-4 py-3">
                        <div className="text-2xl font-black text-orange">{v}</div>
                        <div className="text-stone text-xs font-light mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOR CLUB LEADERS — LIGHT ──────────────────────────────────── */}
      <section className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#F2EDE5' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'rgba(196,168,130,0.12)', filter: 'blur(120px)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <FadeIn direction="left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#F97316' }}>For Club Leaders</p>
              <h2 className="text-[clamp(2.2rem,4vw,3.5rem)] font-black leading-tight mb-6" style={{ color: '#1A1510' }}>
                Your club deserves
                <span className="gradient-text block">a global stage.</span>
              </h2>
              <p className="text-lg font-light leading-relaxed mb-8" style={{ color: '#7A6B58' }}>
                Register with The Ledger and unlock access to international competitions, annual summit invitations, and a worldwide community of finance-focused students — all through one platform.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Access to interclub, regional, and global competitions',
                  'Priority invitations to The Ledger Summit 2026',
                  'Structured resources and learning content for members',
                  'A worldwide directory connecting chapters globally',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 font-light" style={{ color: '#7A6B58' }}>
                    <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.30)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                Register Your Club <ArrowRight size={16} />
              </Link>
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-4">
                <div className="rounded-2xl p-7 card-hover-light"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.08)', boxShadow: '0 8px 32px rgba(14,12,9,0.08)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-semibold" style={{ color: '#1A1510' }}>Summits 2026</h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange bg-orange/10 rounded-full px-3 py-1">Upcoming</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ c: 'Tokyo', f: '🇯🇵' }, { c: 'Singapore', f: '🇸🇬' }, { c: 'Gold Coast', f: '🇦🇺' }, { c: 'Delhi', f: '🇮🇳' }].map(s => (
                      <div key={s.c} className="rounded-xl p-4 flex items-center gap-3 transition-colors"
                        style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.07)' }}>
                        <span className="text-xl">{s.f}</span>
                        <span className="text-sm font-medium" style={{ color: '#1A1510' }}>{s.c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl p-6 card-hover-light"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.07)', boxShadow: '0 4px 16px rgba(14,12,9,0.05)' }}>
                  <p className="text-xs font-light" style={{ color: '#7A6B58' }}>
                    Registered clubs receive priority summit invitations, chapter spotlight features, and direct connections to industry mentors. It takes 2 minutes to apply.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────────────────────── */}
      <div className="py-4" style={{ background: '#0A0806', borderTop: '1px solid rgba(245,240,232,0.04)' }}>
        <MarqueeStrip items={['Tokyo', 'Singapore', 'Gold Coast', 'Madrid', 'Delhi', 'Gujarat', 'Tamil Nadu']} reverse speed="35s" />
      </div>

      {/* ── PRE-FOOTER CTA ────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-36 overflow-hidden" style={{ background: 'linear-gradient(135deg, #EA6C0A 0%, #F97316 60%, #FB923C 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <FadeIn className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-[0.25em] mb-5">Join The Network</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black text-white leading-tight mb-5">
            Your edge starts here.
          </h2>
          <p className="text-white/75 text-xl font-light mb-12 max-w-lg mx-auto">
            Join the network shaping the next generation of financial leaders. Free to start. Global by design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
              className="btn-cream text-base px-10 py-4 text-lg font-semibold">
              Join Now — It's Free <ArrowRight size={18} />
            </a>
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold rounded-xl px-10 py-4 text-lg hover:border-white hover:bg-white/10 transition-all">
              Register Your Club
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FAQ />
    </main>
    </>
  )
}
