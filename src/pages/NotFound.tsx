import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | The Ledger</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center pt-[68px]" style={{ background: '#0E0C09' }}>
        <div className="text-center px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: '#C4A882' }}>404</p>
          <h1 className="font-black text-cream mb-4" style={{ fontSize: 'clamp(3rem,7vw,5rem)' }}>Page Not Found</h1>
          <p className="text-xl font-light mb-8" style={{ color: '#6b7280' }}>That URL doesn't exist.</p>
          <Link to="/"
            className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-white transition-all hover:opacity-90"
            style={{ background: '#F97316' }}>
            Go Home
          </Link>
        </div>
      </main>
    </>
  )
}
