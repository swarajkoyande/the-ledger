import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)
const LiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const body = new URLSearchParams({ 'form-name': 'newsletter', email })
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
    } catch { /* show success regardless */ }
    setDone(true)
  }

  return (
    <footer style={{ background: '#0A0806', borderTop: '1px solid rgba(245,240,232,0.05)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand — spans 2 cols */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-baseline gap-[3px] mb-5">
              <span className="text-2xl font-light text-cream/60">The</span>
              <span className="text-2xl font-black text-orange">Ledger</span>
            </Link>
            <p className="text-stone text-sm font-light leading-relaxed mb-6 max-w-[200px]">
              The global network for student finance leaders.
            </p>
            <div className="flex gap-2">
              {[
                { href: 'https://instagram.com/the_ledger.jp', icon: <IgIcon /> },
                { href: 'https://linkedin.com/company/theledgeronline', icon: <LiIcon /> },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-stone hover:text-orange hover:border-orange/30 transition-all duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-cream/25 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Navigate</p>
            <ul className="space-y-3">
              {[['Chapters', '/chapters'], ['The App', '/app'], ['Register', '/register']].map(([l, to]) => (
                <li key={to}>
                  <Link to={to} className="text-stone hover:text-cream text-sm font-light transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chapters */}
          <div>
            <p className="text-cream/25 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Chapters</p>
            <ul className="space-y-3">
              {['Tokyo', 'Singapore', 'Gold Coast', 'Madrid', 'India'].map(c => (
                <li key={c} className="text-stone text-sm font-light">{c}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-cream/25 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Stay Updated</p>
            <p className="text-stone text-sm font-light mb-4 leading-relaxed">Summits, competitions, network news.</p>
            {done ? (
              <p className="text-tan text-sm font-medium">You're on the list ✦</p>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-cream/4 border border-cream/8 rounded-lg px-4 py-2.5 text-sm font-light text-cream placeholder-stone/60 focus:outline-none focus:border-orange/40 transition-all"
                />
                <button type="submit"
                  className="w-full flex items-center justify-center gap-1.5 bg-cream/8 hover:bg-orange text-cream text-sm font-medium py-2.5 rounded-lg transition-all duration-300 group">
                  Subscribe <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mt-12 mb-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-stone/50 text-xs font-light">
            © {new Date().getFullYear()} The Ledger Network. All rights reserved.
          </p>
          <p className="text-stone/40 text-xs font-light tracking-widest">
            TOKYO · SINGAPORE · GOLD COAST · MADRID · INDIA
          </p>
        </div>
        <div className="mt-4 text-center sm:text-left">
          <p className="text-stone/50 text-xs font-light">
            Contact:{' '}
            <a href="mailto:theledger.japan@gmail.com" className="hover:text-stone transition-colors">
              theledger.japan@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
