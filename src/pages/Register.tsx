import { useState } from 'react'
import { ArrowRight, Building2, Globe2, CheckCircle2, Loader2 } from 'lucide-react'
import { FadeIn } from '../components/FadeIn'

type FV = Record<string, string>
function useForm(init: FV) {
  const [v, set] = useState(init)
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const reset = () => set(init)
  return { values: v, onChange, reset }
}

const inp = 'w-full text-sm font-light rounded-xl px-4 py-3.5 focus:outline-none transition-all duration-200'
const inpStyle = { background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.12)', color: '#1A1510' }
const inpFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  Object.assign(e.target.style, { borderColor: 'rgba(249,115,22,0.5)' })
const inpBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  Object.assign(e.target.style, { borderColor: 'rgba(26,21,16,0.12)' })

const lbl = 'block text-[11px] font-medium uppercase tracking-[0.15em] mb-2'
const lblStyle = { color: '#7A6B58' }

const regions = ['Tokyo, Japan', 'Singapore', 'Gold Coast, Australia', 'Madrid, Spain', 'Delhi, India', 'Tamil Nadu, India', 'Gujarat, India', 'Other']

async function netlifySubmit(formName: string, values: FV) {
  const body = new URLSearchParams({ 'form-name': formName, ...values })
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

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
  const [clubLoading, setClubLoading] = useState(false)
  const [clubError, setClubError] = useState('')

  const [headDone, setHeadDone] = useState(false)
  const [headLoading, setHeadLoading] = useState(false)
  const [headError, setHeadError] = useState('')

  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setClubLoading(true)
    setClubError('')
    try {
      await netlifySubmit('register-club', club.values)
      setClubDone(true)
    } catch {
      setClubError('Something went wrong. Please try again or email us directly.')
    } finally {
      setClubLoading(false)
    }
  }

  const handleHeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHeadLoading(true)
    setHeadError('')
    try {
      await netlifySubmit('regional-head', head.values)
      setHeadDone(true)
    } catch {
      setHeadError('Something went wrong. Please try again or email us directly.')
    } finally {
      setHeadLoading(false)
    }
  }

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

      {/* ── FORMS — LIGHT ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" style={{ background: '#FAF8F3' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-6">

          {/* Register Your Club */}
          <FadeIn delay={0} direction="left">
            <div className="rounded-3xl overflow-hidden h-full"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.08)', boxShadow: '0 8px 40px rgba(14,12,9,0.07)' }}>
              <div className="p-7 flex items-start gap-4" style={{ borderBottom: '1px solid rgba(26,21,16,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)' }}>
                  <Building2 size={18} className="text-orange" />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#1A1510' }}>Register Your Club</h2>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#7A6B58' }}>Bring The Ledger to your school or university.</p>
                </div>
              </div>
              <div className="p-7">
                {clubDone ? (
                  <SuccessBanner title="Application Received!" sub="We'll review your registration and reach out within a few days with next steps." />
                ) : (
                  <form onSubmit={handleClubSubmit} className="space-y-4">
                    {/* Honeypot */}
                    <input type="hidden" name="bot-field" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl} style={lblStyle}>Club Name *</label>
                        <input type="text" name="clubName" required value={club.values.clubName} onChange={club.onChange} placeholder="Finance Club" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                      </div>
                      <div>
                        <label className={lbl} style={lblStyle}>School / University *</label>
                        <input type="text" name="schoolName" required value={club.values.schoolName} onChange={club.onChange} placeholder="Your institution" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Your Name *</label>
                      <input type="text" name="contactName" required value={club.values.contactName} onChange={club.onChange} placeholder="Full name" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Email Address *</label>
                      <input type="email" name="email" required value={club.values.email} onChange={club.onChange} placeholder="you@school.edu" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl} style={lblStyle}>Country *</label>
                        <input type="text" name="country" required value={club.values.country} onChange={club.onChange} placeholder="Japan" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                      </div>
                      <div>
                        <label className={lbl} style={lblStyle}>Approx. Members</label>
                        <input type="number" name="members" min="1" value={club.values.members} onChange={club.onChange} placeholder="15" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Tell us about your club</label>
                      <textarea name="about" rows={3} value={club.values.about} onChange={club.onChange} placeholder="Activities, focus areas, past events…" className={`${inp} resize-none`} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    {clubError && (
                      <p className="text-sm text-red-500 font-light">{clubError}</p>
                    )}
                    <button type="submit" disabled={clubLoading} className="w-full btn-primary py-4 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {clubLoading ? <Loader2 size={16} className="animate-spin" /> : <><span>Register Your Club</span> <ArrowRight size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Apply as Regional Head */}
          <FadeIn delay={100} direction="right">
            <div className="rounded-3xl overflow-hidden h-full"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,21,16,0.08)', boxShadow: '0 8px 40px rgba(14,12,9,0.07)' }}>
              <div className="p-7 flex items-start gap-4" style={{ borderBottom: '1px solid rgba(26,21,16,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#FAF8F3', border: '1px solid rgba(26,21,16,0.10)' }}>
                  <Globe2 size={18} style={{ color: '#9B8B75' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#1A1510' }}>Apply as Regional Head</h2>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#7A6B58' }}>Lead The Ledger's expansion in your region.</p>
                </div>
              </div>
              <div className="p-7">
                {headDone ? (
                  <SuccessBanner title="Application Submitted!" sub="We review every application carefully and will be in touch soon." />
                ) : (
                  <form onSubmit={handleHeadSubmit} className="space-y-4">
                    {/* Honeypot */}
                    <input type="hidden" name="bot-field" />
                    <div>
                      <label className={lbl} style={lblStyle}>Full Name *</label>
                      <input type="text" name="fullName" required value={head.values.fullName} onChange={head.onChange} placeholder="Your full name" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Email Address *</label>
                      <input type="email" name="email" required value={head.values.email} onChange={head.onChange} placeholder="you@email.com" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Region You Want to Lead *</label>
                      <select name="region" required value={head.values.region} onChange={head.onChange} className={`${inp} cursor-pointer appearance-none`} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur}>
                        <option value="">Select a region…</option>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Current School / University *</label>
                      <input type="text" name="school" required value={head.values.school} onChange={head.onChange} placeholder="Your institution" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Finance / Leadership Background</label>
                      <textarea name="background" rows={2} value={head.values.background} onChange={head.onChange} placeholder="Clubs, competitions, coursework, work experience…" className={`${inp} resize-none`} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    <div>
                      <label className={lbl} style={lblStyle}>Why do you want to be a Regional Head? *</label>
                      <textarea name="motivation" rows={3} required value={head.values.motivation} onChange={head.onChange} placeholder="Your vision for growing The Ledger in your region…" className={`${inp} resize-none`} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur} />
                    </div>
                    {headError && (
                      <p className="text-sm text-red-500 font-light">{headError}</p>
                    )}
                    <button type="submit" disabled={headLoading} className="w-full btn-ghost py-4 text-base mt-2 border-cream/15 hover:border-orange/40 hover:text-orange disabled:opacity-60 disabled:cursor-not-allowed">
                      {headLoading ? <Loader2 size={16} className="animate-spin" /> : <><span>Submit Application</span> <ArrowRight size={16} /></>}
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
