import { useState } from 'react'
import { ArrowRight, Building2, Globe2, CheckCircle2 } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

type FV = Record<string, string>
function useForm(init: FV) {
  const [v, set] = useState(init)
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(prev => ({ ...prev, [e.target.name]: e.target.value }))
  return { values: v, onChange }
}

const inp = [
  'w-full text-sm font-light text-cream placeholder-stone/50 rounded-xl px-4 py-3.5',
  'bg-cream/4 border border-cream/8 focus:outline-none focus:border-orange/50 focus:bg-cream/6',
  'transition-all duration-200',
].join(' ')

const lbl = 'block text-stone text-[11px] font-medium uppercase tracking-[0.15em] mb-2'

const regions = ['Tokyo, Japan', 'Singapore', 'Gold Coast, Australia', 'Madrid, Spain', 'Delhi, India', 'Tamil Nadu, India', 'Gujarat, India', 'Other']

function SuccessBanner({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl glass-warm flex items-center justify-center mb-5">
        <CheckCircle2 size={28} className="text-orange" />
      </div>
      <h3 className="text-cream text-2xl font-bold mb-2">{title}</h3>
      <p className="text-stone font-light text-sm max-w-xs leading-relaxed">{sub}</p>
    </div>
  )
}

export default function RegisterPage() {
  const club = useForm({ clubName: '', schoolName: '', contactName: '', email: '', country: '', members: '', about: '' })
  const head = useForm({ fullName: '', email: '', region: '', school: '', background: '', motivation: '' })
  const [clubDone, setClubDone] = useState(false)
  const [headDone, setHeadDone] = useState(false)

  return (
    <main>
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="relative pt-[68px] pb-16 overflow-hidden" style={{ background: '#0E0C09' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange/6 blur-[120px] animate-orb-2" />
        </div>
        <FadeIn className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-20 text-center">
          <p className="text-tan text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">Join Us</p>
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-black leading-tight mb-4 text-cream">
            Join The Ledger{' '}
            <span className="gradient-text">Network.</span>
          </h1>
          <p className="text-stone text-xl font-light mb-3">
            Be part of the generation that leads the change.
          </p>
          <p className="text-stone/60 text-sm font-light">
            Register your club to access competitions, summits, and a global student community — or apply to lead a region.
          </p>
        </FadeIn>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <FadeIn>
        <div style={{ background: '#0A0806', borderTop: '1px solid rgba(245,240,232,0.05)', borderBottom: '1px solid rgba(245,240,232,0.05)' }} className="py-5">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-center gap-6 text-stone text-sm font-light">
            {['70+ students in the network', '15+ active chapters', '6 countries', '3 competitions in 2025–26'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── FORMS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" style={{ background: '#0E0C09' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-6">

          {/* Register Your Club */}
          <FadeIn delay={0} direction="left">
            <div className="glass rounded-3xl overflow-hidden h-full" style={{ boxShadow: '0 0 60px rgba(249,115,22,0.04)' }}>
              <div className="p-7 flex items-start gap-4" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
                <div className="w-11 h-11 rounded-xl glass-orange flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-orange" />
                </div>
                <div>
                  <h2 className="text-cream text-xl font-bold">Register Your Club</h2>
                  <p className="text-stone text-sm font-light mt-0.5">Bring The Ledger to your school or university.</p>
                </div>
              </div>
              <div className="p-7">
                {clubDone ? (
                  <SuccessBanner title="Application Received!" sub="We'll review your registration and reach out within a few days with next steps." />
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setClubDone(true) }} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Club Name *</label>
                        <input type="text" name="clubName" required value={club.values.clubName} onChange={club.onChange} placeholder="Finance Club" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>School / University *</label>
                        <input type="text" name="schoolName" required value={club.values.schoolName} onChange={club.onChange} placeholder="Your institution" className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Your Name *</label>
                      <input type="text" name="contactName" required value={club.values.contactName} onChange={club.onChange} placeholder="Full name" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Email Address *</label>
                      <input type="email" name="email" required value={club.values.email} onChange={club.onChange} placeholder="you@school.edu" className={inp} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Country *</label>
                        <input type="text" name="country" required value={club.values.country} onChange={club.onChange} placeholder="Japan" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Approx. Members</label>
                        <input type="number" name="members" min="1" value={club.values.members} onChange={club.onChange} placeholder="15" className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Tell us about your club</label>
                      <textarea name="about" rows={3} value={club.values.about} onChange={club.onChange} placeholder="Activities, focus areas, past events…" className={`${inp} resize-none`} />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 text-base mt-2">
                      Register Your Club <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Apply as Regional Head */}
          <FadeIn delay={100} direction="right">
            <div className="glass rounded-3xl overflow-hidden h-full">
              <div className="p-7 flex items-start gap-4" style={{ borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
                <div className="w-11 h-11 rounded-xl glass flex items-center justify-center flex-shrink-0">
                  <Globe2 size={18} className="text-stone" />
                </div>
                <div>
                  <h2 className="text-cream text-xl font-bold">Apply as Regional Head</h2>
                  <p className="text-stone text-sm font-light mt-0.5">Lead The Ledger's expansion in your region.</p>
                </div>
              </div>
              <div className="p-7">
                {headDone ? (
                  <SuccessBanner title="Application Submitted!" sub="We review every application carefully and will be in touch soon." />
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setHeadDone(true) }} className="space-y-4">
                    <div>
                      <label className={lbl}>Full Name *</label>
                      <input type="text" name="fullName" required value={head.values.fullName} onChange={head.onChange} placeholder="Your full name" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Email Address *</label>
                      <input type="email" name="email" required value={head.values.email} onChange={head.onChange} placeholder="you@email.com" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Region You Want to Lead *</label>
                      <select name="region" required value={head.values.region} onChange={head.onChange} className={`${inp} cursor-pointer appearance-none`}>
                        <option value="">Select a region…</option>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>Current School / University *</label>
                      <input type="text" name="school" required value={head.values.school} onChange={head.onChange} placeholder="Your institution" className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Finance / Leadership Background</label>
                      <textarea name="background" rows={2} value={head.values.background} onChange={head.onChange} placeholder="Clubs, competitions, coursework, work experience…" className={`${inp} resize-none`} />
                    </div>
                    <div>
                      <label className={lbl}>Why do you want to be a Regional Head? *</label>
                      <textarea name="motivation" rows={3} required value={head.values.motivation} onChange={head.onChange} placeholder="Your vision for growing The Ledger in your region…" className={`${inp} resize-none`} />
                    </div>
                    <button type="submit" className="w-full btn-ghost py-4 text-base mt-2 border-cream/15 hover:border-orange/40 hover:text-orange">
                      Submit Application <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
