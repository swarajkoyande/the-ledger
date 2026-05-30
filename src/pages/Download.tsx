import { Apple, Monitor, Download, Zap, Wifi, Layout } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

const whyFeatures = [
  {
    icon: Zap,
    title: 'Always Within Reach',
    desc: 'Native performance on Mac and Windows means the app launches instantly. No browser lag, no tab juggling.',
  },
  {
    icon: Layout,
    title: 'Richer Experience',
    desc: 'Desktop unlocks deeper data visualization, multi-window layouts, and keyboard-driven workflows for serious students.',
  },
  {
    icon: Wifi,
    title: 'Stay Connected',
    desc: 'Real-time sync with your chapter, live competition standings, and instant notifications — without opening a browser.',
  },
]

export default function DownloadPage() {
  return (
    <main className="bg-navy min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/25 rounded-full px-4 py-1.5 mb-6">
              <Download size={13} className="text-orange" />
              <span className="text-orange text-xs font-semibold tracking-wide uppercase">Desktop App · v1.0</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-5">
              The Ledger App.{' '}
              <span className="gradient-text">Now on Desktop.</span>
            </h1>
            <p className="text-white/55 text-xl leading-relaxed max-w-2xl mx-auto mb-4">
              Everything you need to connect, learn, and compete — now as a native desktop experience. Faster, richer, and always within reach.
            </p>
            <div className="flex items-center justify-center gap-5 text-white/30 text-sm mt-2">
              <span>v1.0</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>macOS &amp; Windows</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>6+ Countries</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Download cards */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-5">
          {/* Mac */}
          <FadeIn delay={0}>
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center card-hover group h-full">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-orange/30 transition-colors">
                <Apple size={30} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">macOS</h3>
              <p className="text-white/40 text-sm mb-6">Native experience · macOS 12+</p>
              <a
                href="#"
                className="w-full btn-primary py-3.5 text-sm"
              >
                <Download size={15} />
                Download for Mac (.dmg)
              </a>
            </div>
          </FadeIn>

          {/* Windows */}
          <FadeIn delay={100}>
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center card-hover group h-full">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-orange/30 transition-colors">
                <Monitor size={28} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">Windows</h3>
              <p className="text-white/40 text-sm mb-6">Native experience · Windows 10+</p>
              <a
                href="#"
                className="w-full btn-secondary py-3.5 text-sm"
              >
                <Download size={15} />
                Download for Windows (.exe)
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Web app CTA */}
        <FadeIn delay={200}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-5">
            <div className="bg-orange/10 border border-orange/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold">Prefer the browser?</p>
                <p className="text-white/50 text-sm">The Ledger App is also available on the web.</p>
              </div>
              <a
                href="https://app.theledger.online"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 btn-primary text-sm px-5 py-3"
              >
                Open Web App →
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Why desktop */}
      <section className="bg-navy-800 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-orange text-xs font-semibold uppercase tracking-widest">Why Desktop</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">
              Built for students who{' '}
              <span className="gradient-text">mean business.</span>
            </h2>
          </FadeIn>

          <div className="space-y-4">
            {whyFeatures.map((f, i) => (
              <FadeIn key={f.title} delay={i * 100} direction="up">
                <div className="glass rounded-2xl p-7 flex gap-6 items-start card-hover">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center">
                    <f.icon size={20} className="text-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-white/50 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center flex-shrink-0 text-5xl font-black text-white/[0.04] select-none">
                    0{i + 1}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
