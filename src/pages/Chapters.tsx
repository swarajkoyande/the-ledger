import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

const chapters = [
  {
    city: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    tag: 'Founding Chapter', tagStyle: { color: '#F97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' },
    stats: [{ v: '35+', l: 'Members' }, { v: '7', l: 'Schools' }],
    desc: 'Our flagship chapter unites 35+ members from 7 schools across Tokyo — bound by a belief that young people deserve to understand money, markets, and their financial future. Weekly market discussions, live trading simulations, and a growing alumni network that spans the city.',
  },
  {
    city: 'India', country: 'Delhi · Tamil Nadu · Gujarat', flag: '🇮🇳',
    tag: 'Expanding Fast', tagStyle: { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)' },
    stats: [{ v: '3', l: 'Regions' }, { v: '2024', l: 'Launched' }],
    desc: 'Spanning three regions — Delhi in the North, Tamil Nadu in the South, Gujarat in the West — India is The Ledger\'s most ambitious expansion. In one of the world\'s youngest nations, the demand for accessible, applied financial education is enormous. We\'re here for it.',
  },
  {
    city: 'Madrid', country: 'Spain', flag: '🇪🇸',
    tag: 'European Hub', tagStyle: { color: '#C4A882', background: 'rgba(196,168,130,0.08)', border: '1px solid rgba(196,168,130,0.2)' },
    stats: [{ v: 'EU', l: 'Chapter' }, { v: 'Active', l: 'Status' }],
    desc: 'The Ledger\'s European home brings together students passionate about economics, investing, and the kind of real financial knowledge that goes beyond the classroom. Market deep-dives, case competitions, and discussions on Europe\'s evolving economic landscape.',
  },
  {
    city: 'Gold Coast', country: 'Australia', flag: '🇦🇺',
    tag: 'Fintech Focus', tagStyle: { color: '#818cf8', background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)' },
    stats: [{ v: 'Fintech', l: 'Focus' }, { v: 'Active', l: 'Status' }],
    desc: 'Where finance meets technology. Gold Coast members pull apart fintech models, explore algorithmic trading, and understand how software is reshaping capital markets. The most technically focused chapter in the network — and proud of it.',
  },
]

export default function ChaptersPage() {
  return (
    <main>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative pt-[68px] pb-20 overflow-hidden" style={{ background: '#0E0C09' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange/8 blur-[120px] animate-orb-2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-tan/6 blur-[100px] animate-orb-1" />
        </div>
        <FadeIn className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-24 text-center">
          <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Our Network</p>
          <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-tight mb-5 text-cream">
            Chapters Around{' '}
            <span className="gradient-text">the World</span>
          </h1>
          <p className="text-stone text-xl font-light leading-relaxed">
            From Tokyo to Gold Coast, The Ledger is building a generation of financially literate leaders — one chapter at a time.
          </p>
        </FadeIn>
      </section>

      {/* ── CHAPTER CARDS ─────────────────────────────────────────────────── */}
      <section className="py-16 pb-28" style={{ background: '#0E0C09' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">
          {chapters.map((ch, i) => (
            <FadeIn key={ch.city} delay={i * 80} direction="up">
              <div className="glass rounded-3xl overflow-hidden card-hover">
                <div className="grid md:grid-cols-[260px_1fr]">
                  {/* Left panel */}
                  <div className="p-8 flex flex-col justify-between gap-6"
                    style={{ borderRight: '1px solid rgba(245,240,232,0.06)' }}>
                    <div>
                      <div className="text-5xl mb-4">{ch.flag}</div>
                      <h2 className="text-3xl font-black text-cream mb-1">{ch.city}</h2>
                      <div className="flex items-center gap-1.5 text-stone text-xs font-light mb-4">
                        <MapPin size={11} />{ch.country}
                      </div>
                      <span className="inline-flex text-[11px] font-semibold px-3 py-1 rounded-full" style={ch.tagStyle}>
                        {ch.tag}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {ch.stats.map(s => (
                        <div key={s.l} className="glass rounded-xl p-3 text-center">
                          <div className="text-orange font-black text-xl">{s.v}</div>
                          <div className="text-stone text-[11px] font-light mt-0.5">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right panel */}
                  <div className="p-8 md:p-10 flex items-center">
                    <p className="text-stone font-light text-lg leading-relaxed">{ch.desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── EXPANSION CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: '#141108', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
            <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">Don't See Your City?</p>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-black text-cream mb-5 leading-tight">
              Start a chapter in your city.
            </h2>
            <p className="text-stone text-xl font-light mb-10 max-w-xl mx-auto">
              The Ledger is actively expanding. Apply to become a Regional Head and bring the network to your community.
            </p>
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Apply as Regional Head <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </main>
  )
}
