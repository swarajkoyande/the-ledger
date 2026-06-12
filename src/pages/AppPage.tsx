import { useRef, useState } from 'react'
import { ArrowRight, Download, Globe, Monitor, Apple, Clock } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { DOWNLOAD_URLS } from '../config/downloads'

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
)

function OrbBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange/10 blur-[120px] animate-orb-2" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-tan/8 blur-[100px] animate-orb-1" />
    </div>
  )
}

const pillars = [
  {
    key: 'CONNECT',
    color: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.2)',
    textColor: '#F97316',
    desc: 'Build meaningful relationships with ambitious students who take finance as seriously as you do. Share market views, collaborate on strategies, and grow a global network that compounds over time.',
  },
  {
    key: 'LEARN',
    color: 'rgba(196,168,130,0.08)',
    border: 'rgba(196,168,130,0.18)',
    textColor: '#C4A882',
    desc: 'Access structured modules built for real-world application. From market fundamentals to portfolio theory — content designed to prepare you to act, not just pass an exam.',
  },
  {
    key: 'COMPETE',
    color: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.15)',
    textColor: '#4ade80',
    desc: 'Execute trades in live simulations. Climb the leaderboard. Competition here isn\'t about ego — it\'s about discipline, growth, and building a track record that speaks for itself.',
  },
]

const capabilities = [
  { icon: '📊', title: 'Live Trading Simulations', desc: 'Execute real trades in a live environment. No real money, real consequences, real learning.' },
  { icon: '🏆', title: 'Global Leaderboards', desc: 'Track your rank against students across every chapter worldwide in real time.' },
  { icon: '📚', title: 'Structured Learning', desc: 'Finance modules covering markets, valuation, macro, and risk — built for doers.' },
  { icon: '🌏', title: 'Chapter Connections', desc: 'Instant access to the full global Ledger network — not just your campus.' },
  { icon: '📋', title: 'Competition History', desc: 'A shareable profile with your results, rankings, and track record — valuable to recruiters.' },
  { icon: '🎟', title: 'Summit Access', desc: 'Registered members get priority invitations to our annual worldwide summit events.' },
]

const whyDesktop = [
  { n: '01', title: 'Native Performance', desc: 'Launches in seconds. No tabs, no lag. Full keyboard control and multi-window layouts.' },
  { n: '02', title: 'Always Connected', desc: 'Real-time sync with your chapter. Notifications, leaderboard updates, competition alerts.' },
  { n: '03', title: 'Richer Data Views', desc: 'Desktop unlocks wider layouts for charts, portfolio analysis, and side-by-side data.' },
]

const previewScreens = [
  { label: 'Dashboard',    sub: 'Your portfolio at a glance',  emoji: '📊', src: '/previews/dashboard.png' },
  { label: 'Leaderboard', sub: 'Global rankings, live',        emoji: '🏆', src: '/previews/leaderboard.png' },
  { label: 'Learn',       sub: 'Structured finance modules',   emoji: '📚', src: '/previews/learn.png' },
]

function PhoneShell({ emoji, label, src }: { emoji: string; label: string; src?: string }) {
  return (
    <div style={{
      position: 'relative', width: '100%', borderRadius: '50px', padding: '7px',
      background: 'linear-gradient(160deg, #4a4540 0%, #2a2520 30%, #1a1510 70%, #0d0b08 100%)',
      boxShadow: '0 50px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    }}>
      {/* Screen */}
      <div style={{ borderRadius: '44px', overflow: 'hidden', aspectRatio: '9/19.5', background: '#000', display: 'flex', flexDirection: 'column' }}>

        {/* ── iOS Status Bar ── */}
        <div style={{ flexShrink: 0, position: 'relative', height: '6%', background: '#141108', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 'clamp(6px, 2.8%, 11px)', letterSpacing: '-0.3px' }}>9:41</span>
          {/* Dynamic Island */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '30%', aspectRatio: '3.4/1', background: '#000', borderRadius: '999px', boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }} />
          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="11" height="8" viewBox="0 0 11 8" fill="white"><rect x="0" y="5" width="2" height="3" rx="0.4"/><rect x="3" y="3" width="2" height="5" rx="0.4"/><rect x="6" y="1.5" width="2" height="6.5" rx="0.4"/><rect x="9" y="0" width="2" height="8" rx="0.4"/></svg>
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M5.5 6.5 L6.3 5.3 Q5.9 5 5.5 5 Q5.1 5 4.7 5.3Z" fill="white"/><path d="M3.5 4 Q4.4 2.8 5.5 2.8 Q6.6 2.8 7.5 4" stroke="white" strokeWidth="0.9" strokeLinecap="round"/><path d="M1.5 2.2 Q3.3 0.2 5.5 0.2 Q7.7 0.2 9.5 2.2" stroke="white" strokeWidth="0.9" strokeLinecap="round"/></svg>
            <svg width="18" height="9" viewBox="0 0 18 9" fill="none"><rect x="0.5" y="0.5" width="14" height="8" rx="2" stroke="white" strokeOpacity="0.35"/><rect x="15" y="2.5" width="2" height="4" rx="1" fill="white" fillOpacity="0.4"/><rect x="1.5" y="1.5" width="11" height="6" rx="1.2" fill="white"/></svg>
          </div>
        </div>

        {/* ── App Screenshot ── */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#141108', minHeight: 0, scrollbarWidth: 'none' }}>
          {src ? (
            <img src={src} alt={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(160deg, rgba(249,115,22,0.12) 0%, rgba(14,12,9,0.95) 60%)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <span style={{ fontSize: 18 }}>{emoji}</span>
              </div>
              <p style={{ color: '#7A6B58', fontSize: 9, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Add Screenshot</p>
            </div>
          )}
        </div>

        {/* ── Safari Browser Chrome ── */}
        <div style={{ flexShrink: 0, background: '#1c1c1e', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          {/* Address bar */}
          <div style={{ padding: '5px 7px 3px' }}>
            <div style={{ background: '#2c2c2e', borderRadius: 9, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="7" height="9" viewBox="0 0 7 9" fill="none"><rect x="0.5" y="3.5" width="6" height="5" rx="1" stroke="#8e8e93" strokeWidth="0.8"/><path d="M1.5 3.5V2.5a2 2 0 014 0v1" stroke="#8e8e93" strokeWidth="0.8" strokeLinecap="round"/></svg>
              <span style={{ color: '#e5e5ea', fontWeight: 500, fontSize: 'clamp(7px, 2.8%, 10px)', letterSpacing: '0.01em' }}>app.theledger</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ marginLeft: 'auto' }}><circle cx="4" cy="4" r="3.2" stroke="#636366" strokeWidth="0.8"/><path d="M4 2.2v1.8l1 0.8" stroke="#636366" strokeWidth="0.8" strokeLinecap="round"/></svg>
            </div>
          </div>
          {/* Nav row */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '2px 6px 4px' }}>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M8 2L4 6l4 4" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M5 2l4 4-4 4" stroke="#3a3a3c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v8M3.5 4l3-3 3 3" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 9v3h9V9" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2h9v10L6.5 9.5 2 12z" stroke="#8e8e93" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="3" width="8.5" height="8.5" rx="1.5" stroke="#8e8e93" strokeWidth="1.4"/><path d="M3.5 3V2a1.2 1.2 0 011.2-1.2h6.1A1.2 1.2 0 0112 2v6.1a1.2 1.2 0 01-1.2 1.2H10" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          {/* Home indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 7, paddingTop: 1 }}>
            <div style={{ width: '28%', height: 3, background: 'rgba(255,255,255,0.28)', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Action button — left */}
      <div style={{ position: 'absolute', left: -3, top: '12%', width: 3, height: '5%', minHeight: 18, borderRadius: '3px 0 0 3px', background: 'linear-gradient(180deg, #3a3530, #2a2520)' }} />
      {/* Volume up — left */}
      <div style={{ position: 'absolute', left: -3, top: '22%', width: 3, height: '8%', minHeight: 28, borderRadius: '3px 0 0 3px', background: 'linear-gradient(180deg, #3a3530, #2a2520)' }} />
      {/* Volume down — left */}
      <div style={{ position: 'absolute', left: -3, top: '33%', width: 3, height: '8%', minHeight: 28, borderRadius: '3px 0 0 3px', background: 'linear-gradient(180deg, #3a3530, #2a2520)' }} />
      {/* Power button — right */}
      <div style={{ position: 'absolute', right: -3, top: '25%', width: 3, height: '13%', minHeight: 44, borderRadius: '0 3px 3px 0', background: 'linear-gradient(180deg, #3a3530, #2a2520)' }} />
    </div>
  )
}

function PhoneCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIdx(Math.min(Math.max(idx, 0), previewScreens.length - 1))
  }

  return (
    <>
      <div ref={scrollRef} onScroll={handleScroll}
        className="lg:hidden -mx-5 sm:-mx-8 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}>
        {previewScreens.map((screen, i) => (
          <div key={screen.label}
            className="snap-center flex-shrink-0 flex flex-col items-center px-4"
            style={{ width: '100vw' }}>
            <div style={{ width: 220 }}>
              <PhoneShell emoji={screen.emoji} label={screen.label} src={screen.src} />
            </div>
            <p className="text-cream font-semibold text-sm mt-5">{screen.label}</p>
            <p className="text-stone text-xs font-light mt-0.5">{screen.sub}</p>
          </div>
        ))}
      </div>
      <div className="lg:hidden flex justify-center gap-2 mt-5">
        {previewScreens.map((s, i) => (
          <div key={s.label}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx ? '#F97316' : 'rgba(196,168,130,0.25)',
            }} />
        ))}
      </div>
    </>
  )
}

export default function AppPage() {
  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center pt-[68px] overflow-hidden" style={{ background: '#0E0C09' }}>
        <OrbBg />
        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-24 text-center w-full">
          <FadeIn>
            <div className="inline-flex items-center gap-2 glass-warm rounded-full px-4 py-1.5 mb-8">
              <Globe size={12} className="text-orange" />
              <span className="text-tan text-[11px] font-medium uppercase tracking-[0.18em]">Available on Web & Desktop</span>
            </div>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[1.0] tracking-tight mb-6">
              <span className="text-cream font-light block">One app.</span>
              <span className="gradient-text block">Every edge.</span>
            </h1>
            <p className="text-stone text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
              From live trading simulations and competition leaderboards to global chapter connections and structured learning — The Ledger App is where ambitious students build their financial futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
                className="btn-primary text-base px-8 py-4 text-lg">
                Get Started Free <ArrowRight size={18} />
              </a>
              <a href="#download" className="btn-ghost text-base px-8 py-4 text-lg">
                Download for Desktop ↓
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── APP PREVIEWS ──────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-36 overflow-hidden" style={{ background: '#0A0804' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-orange/8 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F97316' }}>In-App Experience</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black text-cream leading-tight">
              Built for how you think.
            </h2>
            <p className="text-stone font-light mt-4 max-w-xl mx-auto text-lg">
              Every screen designed around one goal — giving ambitious students the tools to act.
            </p>
          </FadeIn>

          {/* Mobile/tablet carousel — hidden on lg+ */}
          <PhoneCarousel />

          {/* Desktop side-by-side — hidden below lg */}
          <div className="hidden lg:block">
            <div className="flex items-end justify-center gap-8">
              {[
                { ...previewScreens[0], delay: 0,   scale: 'scale-[0.88]', mt: 'mt-10' },
                { ...previewScreens[1], delay: 100, scale: 'scale-100',    mt: 'mt-0'  },
                { ...previewScreens[2], delay: 200, scale: 'scale-[0.88]', mt: 'mt-10' },
              ].map((screen) => (
                <FadeIn key={screen.label} delay={screen.delay} direction="up"
                  className={`${screen.scale} ${screen.mt} origin-bottom flex-shrink-0`}>
                  <div style={{ width: 260 }}>
                    <PhoneShell emoji={screen.emoji} label={screen.label} src={screen.src} />
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-8">
              {[
                { ...previewScreens[0], scale: 'scale-[0.88]' },
                { ...previewScreens[1], scale: 'scale-100'    },
                { ...previewScreens[2], scale: 'scale-[0.88]' },
              ].map((s) => (
                <div key={s.label} className={`${s.scale} w-[260px] flex-shrink-0 text-center origin-bottom`}>
                  <p className="text-cream font-semibold text-sm">{s.label}</p>
                  <p className="text-stone text-xs font-light mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA row */}
          <FadeIn delay={400} className="mt-14 text-center">
            <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
              Try the App Free <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#141108' }}>
        <div className="absolute right-0 top-1/2 w-96 h-96 rounded-full bg-tan/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F97316' }}>Core Pillars</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black text-cream leading-tight">Three ways to grow.</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <FadeIn key={p.key} delay={i * 100} direction="up">
                <div className="rounded-3xl p-8 card-hover h-full flex flex-col relative overflow-hidden"
                  style={{ background: p.color, border: `1px solid ${p.border}` }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: p.textColor }}>{p.key}</p>
                  <h3 className="text-cream text-3xl font-black tracking-tight mb-5">{p.key}</h3>
                  <p className="text-stone font-light leading-relaxed flex-1">{p.desc}</p>
                  <div className="absolute bottom-4 right-6 text-7xl font-black opacity-[0.03] select-none text-cream">{i + 1}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES — LIGHT ──────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#FAF8F3' }}>
        <div className="absolute left-1/3 top-0 w-80 h-80 rounded-full bg-orange/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F97316' }}>What You Get</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight" style={{ color: '#1A1510' }}>
              Everything you need to excel.
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((c, i) => (
              <FadeIn key={c.title} delay={i * 60} direction="up">
                <div className="rounded-2xl p-7 card-hover-light h-full"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.08)', boxShadow: '0 4px 20px rgba(14,12,9,0.05)' }}>
                  <div className="text-3xl mb-4">{c.icon}</div>
                  <h4 className="font-semibold mb-2" style={{ color: '#1A1510' }}>{c.title}</h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: '#7A6B58' }}>{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400} className="mt-10">
            <div className="rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.20)' }}>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: '#1A1510' }}>Available on the web, right now.</h4>
                <p className="text-sm font-light" style={{ color: '#7A6B58' }}>No download required. Open your browser and start.</p>
              </div>
              <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 px-7 py-3.5">
                Open Web App <ArrowRight size={15} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── DESKTOP DOWNLOAD ──────────────────────────────────────────────── */}
      <section id="download" className="py-28 sm:py-36 relative overflow-hidden" style={{ background: '#141108' }}>
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-tan/6 blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-16">
            <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">Desktop App · v1.0</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-black text-cream leading-tight mb-4">
              The Ledger App.{' '}
              <span className="gradient-text">Now on Desktop.</span>
            </h2>
            <p className="text-stone font-light text-lg max-w-xl mx-auto">
              A native experience for Mac and Windows. Faster, richer, and always within reach.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {/* Mac */}
            <FadeIn delay={0}>
              <div className="glass rounded-3xl p-10 card-hover flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 glass-md group-hover:border-orange/30 transition-colors">
                  <Apple size={28} className="text-cream-dim group-hover:text-cream transition-colors" />
                </div>
                <h3 className="text-cream text-2xl font-bold mb-1.5">macOS</h3>
                <p className="text-stone text-sm font-light mb-7">Native experience · macOS 12+</p>
                <div className="w-full flex gap-2.5">
                  {DOWNLOAD_URLS.mac ? (
                    <a href={DOWNLOAD_URLS.mac} download className="btn-primary flex-1 py-4 text-sm">
                      <Download size={14} /> Download for Mac (.dmg)
                    </a>
                  ) : (
                    <span className="flex-1 btn-primary py-4 text-sm opacity-60 cursor-default flex items-center justify-center gap-2">
                      <Clock size={14} /> Coming Soon
                    </span>
                  )}
                  {DOWNLOAD_URLS.macGithub && (
                    <a href={DOWNLOAD_URLS.macGithub} target="_blank" rel="noopener noreferrer"
                      title="Download the .dmg from GitHub"
                      className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-3 rounded-xl text-[10px] font-semibold leading-tight text-center transition-all duration-300 hover:opacity-90"
                      style={{ background: '#FFFFFF', color: '#1A1510' }}>
                      <GithubIcon size={16} />
                      <span>Download<br />via GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
            {/* Windows */}
            <FadeIn delay={100}>
              <div className="glass rounded-3xl p-10 card-hover flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 glass-md group-hover:border-orange/30 transition-colors">
                  <Monitor size={26} className="text-cream-dim group-hover:text-cream transition-colors" />
                </div>
                <h3 className="text-cream text-2xl font-bold mb-1.5">Windows</h3>
                <p className="text-stone text-sm font-light mb-7">Native experience · Windows 10+</p>
                {DOWNLOAD_URLS.windows ? (
                  <a href={DOWNLOAD_URLS.windows} download className="btn-ghost w-full py-4 text-sm">
                    <Download size={14} /> Download for Windows (.exe)
                  </a>
                ) : (
                  <span className="w-full btn-ghost py-4 text-sm opacity-60 cursor-default flex items-center justify-center gap-2">
                    <Clock size={14} /> Coming Soon
                  </span>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Why desktop */}
          <div className="space-y-4 mt-12">
            <FadeIn>
              <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-center">
                Why Choose Desktop?
              </p>
            </FadeIn>
            {whyDesktop.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80} direction="up">
                <div className="glass-warm rounded-2xl p-6 flex gap-6 items-start card-hover">
                  <div className="text-4xl font-black text-orange/15 font-mono flex-shrink-0 select-none">{f.n}</div>
                  <div>
                    <h4 className="text-cream font-semibold mb-1.5">{f.title}</h4>
                    <p className="text-stone font-light text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #EA6C0A 0%, #F97316 50%, #FB923C 100%)' }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <FadeIn className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white leading-tight mb-4">
            Start building your edge today.
          </h2>
          <p className="text-white/75 text-xl font-light mb-10 max-w-lg mx-auto">
            The app is free. The network is global. The opportunity is yours.
          </p>
          <a href="https://app.theledger.online" target="_blank" rel="noopener noreferrer"
            className="btn-cream text-lg px-10 py-5">
            Get the App — Free <ArrowRight size={18} />
          </a>
        </FadeIn>
      </section>
    </main>
  )
}
