import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useScrollY } from '../hooks/useScrollY'

const navLinks = [
  { label: 'Chapters', to: '/chapters' },
  { label: 'The App', to: '/app' },
  { label: 'Register', to: '/register' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrollY = useScrollY()
  const location = useLocation()
  const scrolled = scrollY > 40

  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [location.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: 'rgba(14,12,9,0.85)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="group flex items-baseline gap-[3px] flex-shrink-0">
            <span className="text-[22px] font-light tracking-tight text-cream/80 group-hover:text-cream transition-colors duration-300">The</span>
            <span className="text-[22px] font-black tracking-tight text-orange group-hover:text-orange-light transition-colors duration-300">Ledger</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active ? 'text-cream' : 'text-stone hover:text-cream'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="https://app.theledger.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-5 py-2.5 rounded-lg"
            >
              Get the App <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-cream/70 hover:text-cream hover:bg-cream/5 transition-all"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{ background: 'rgba(10,8,6,0.97)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
      >
        <div className="relative h-full flex flex-col pt-[80px] px-6 pb-10">
          {/* Decorative orb */}
          <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-orange/5 blur-3xl pointer-events-none" />

          <nav className="flex-1 flex flex-col gap-2 mt-8">
            {navLinks.map((link, i) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between px-5 py-5 rounded-2xl text-2xl font-light transition-all duration-300 ${
                    active ? 'text-orange glass-warm' : 'text-cream/60 hover:text-cream hover:bg-cream/4'
                  }`}
                  style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
                >
                  {link.label}
                  {active && <span className="w-2 h-2 rounded-full bg-orange" />}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-col gap-3 mt-auto">
            <a
              href="https://app.theledger.online"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-4 text-base w-full"
            >
              Get the App Free <ArrowRight size={16} />
            </a>
            <Link to="/register" className="btn-ghost py-4 text-base w-full">
              Register Your Club
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
