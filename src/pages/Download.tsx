import { Apple, Monitor, Download, Zap, Wifi, Layout, Clock } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'
import { DOWNLOAD_URLS } from '../config/downloads'

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
)

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
              <div className="w-full flex gap-2.5">
                {DOWNLOAD_URLS.mac ? (
                  <a href={DOWNLOAD_URLS.mac} download className="flex-1 btn-primary py-3.5 text-sm">
                    <Download size={15} /> Download for Mac (.dmg)
                  </a>
                ) : (
                  <span className="flex-1 btn-primary py-3.5 text-sm opacity-60 cursor-default flex items-center justify-center gap-2">
                    <Clock size={15} /> Coming Soon
                  </span>
                )}
                {DOWNLOAD_URLS.macGithub && (
                  <a href={DOWNLOAD_URLS.macGithub} target="_blank" rel="noopener noreferrer"
                    title="Download the .dmg from GitHub"
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl text-[10px] font-semibold leading-tight text-center transition-all duration-300 hover:opacity-90"
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
            <div className="glass rounded-2xl p-8 flex flex-col items-center text-center card-hover group h-full">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-orange/30 transition-colors">
                <Monitor size={28} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">Windows</h3>
              <p className="text-white/40 text-sm mb-6">Native experience · Windows 10+</p>
              {DOWNLOAD_URLS.windows ? (
                <a href={DOWNLOAD_URLS.windows} download className="w-full btn-ghost py-3.5 text-sm">
                  <Download size={15} /> Download for Windows (.exe)
                </a>
              ) : (
                <span className="w-full btn-ghost py-3.5 text-sm opacity-60 cursor-default flex items-center justify-center gap-2">
                  <Clock size={15} /> Coming Soon
                </span>
              )}
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
