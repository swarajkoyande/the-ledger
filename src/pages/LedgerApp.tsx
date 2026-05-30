import { ArrowRight, Users, BookOpen, Trophy, TrendingUp, Shield, Globe, Zap, BarChart3 } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

const pillars = [
  {
    key: 'CONNECT',
    icon: Users,
    accent: 'orange',
    border: 'border-orange/25',
    bg: 'bg-orange/5',
    iconBg: 'bg-orange/15 border-orange/30 text-orange',
    description:
      'Build meaningful relationships with ambitious students who care about finance as much as you do. Share insights, discuss strategies, exchange ideas, and grow your network in an environment built for collaboration.',
  },
  {
    key: 'LEARN',
    icon: BookOpen,
    accent: 'blue',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    description:
      'Access structured finance content designed to take you from fundamentals to applied thinking. Each module builds practical understanding, preparing you to analyze markets, manage risk, and think strategically.',
  },
  {
    key: 'COMPETE',
    icon: Trophy,
    accent: 'green',
    border: 'border-green-500/25',
    bg: 'bg-green-500/5',
    iconBg: 'bg-green-500/15 border-green-500/30 text-green-400',
    description:
      "Put your knowledge into action through real-time competitions. Execute trades, track performance transparently, and climb the leaderboard. Competition isn't about ego — it's about discipline, feedback, and measurable growth.",
  },
]

const capabilities = [
  { icon: BarChart3, title: 'Learn the Fundamentals', desc: 'Structured modules covering markets, valuation, macro, and risk management.' },
  { icon: TrendingUp, title: 'Test Your Strategies', desc: 'Simulate real trades in a live environment without the real-world downside.' },
  { icon: Trophy, title: 'Compete with Peers', desc: 'Regional and global competitions with a transparent, live leaderboard.' },
  { icon: Globe, title: 'Grow a Real Network', desc: 'Connect with students and professionals across 6+ countries worldwide.' },
  { icon: Shield, title: 'Build Credibility', desc: 'Your Ledger profile and competition results are shareable with recruiters.' },
  { icon: Zap, title: 'Access Premium Content', desc: 'Exclusive interviews, summit recordings, and industry expert sessions.' },
]

export default function LedgerAppPage() {
  return (
    <main className="bg-navy min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <span className="text-orange text-xs font-semibold uppercase tracking-widest">The Platform</span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mt-3 mb-5 leading-tight">
              Join the{' '}
              <span className="gradient-text">movement.</span>
            </h1>
            <p className="text-white/55 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Ledger isn't just a trading simulator. It's where future finance leaders build skill, confidence, and credibility.
            </p>
            <a
              href="https://app.theledger.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4 glow-orange-sm"
            >
              Get the App — Free <ArrowRight size={18} />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Three pillars */}
      <section className="bg-navy-800 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-orange text-xs font-semibold uppercase tracking-widest">Core Pillars</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Three ways to grow.</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <FadeIn key={p.key} delay={i * 100} direction="up">
                <div className={`relative border ${p.border} ${p.bg} rounded-2xl p-8 card-hover h-full flex flex-col`}>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${p.iconBg}`}>
                    <p.icon size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-widest mb-4">{p.key}</h3>
                  <p className="text-white/55 leading-relaxed flex-1">{p.description}</p>
                  <div className="absolute bottom-4 right-6 text-6xl font-black opacity-[0.03] select-none">{i + 1}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="bg-navy py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-orange text-xs font-semibold uppercase tracking-widest">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              Everything you need to excel.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 60} direction="up">
                <div className="glass rounded-2xl p-6 card-hover h-full">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center mb-4">
                    <cap.icon size={18} className="text-orange" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{cap.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-orange py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <FadeIn className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            This, is the Ledger App.
          </h2>
          <p className="text-white/75 text-xl mb-10">
            Join thousands of ambitious students already building their edge on the platform.
          </p>
          <a
            href="https://app.theledger.online"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange font-black px-10 py-5 rounded-xl text-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl"
          >
            Get the App! <ArrowRight size={20} />
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-white/40 text-sm">
            {['Tokyo', 'Singapore', 'Gold Coast', 'Madrid', 'India'].map((city, i, arr) => (
              <span key={city} className="flex items-center gap-2">
                {city}
                {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white/20" />}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
