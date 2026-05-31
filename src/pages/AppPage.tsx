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
