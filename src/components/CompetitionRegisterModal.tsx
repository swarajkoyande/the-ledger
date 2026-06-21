import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

interface Props {
  competition: 'economix' | 'ngya' | 'summit'
  competitionName: string
  onClose: () => void
}

const COMPETITION_FIELDS = [
  { id: 'name',       label: 'Full Name',              type: 'text',  placeholder: 'Your full name' },
  { id: 'email',      label: 'Email',                  type: 'email', placeholder: 'your@email.com' },
  { id: 'school',     label: 'School / University',    type: 'text',  placeholder: 'Institution name' },
  { id: 'team_name',  label: 'Team Name',              type: 'text',  placeholder: 'Your team name' },
  { id: 'grade_year', label: 'Grade / Year',           type: 'text',  placeholder: 'e.g. Grade 11 or Year 2' },
]

const SUMMIT_FIELDS = [
  { id: 'name',       label: 'Full Name',              type: 'text',  placeholder: 'Your full name' },
  { id: 'email',      label: 'Email',                  type: 'email', placeholder: 'your@email.com' },
  { id: 'school',     label: 'School / Organization',  type: 'text',  placeholder: 'School, university, or company' },
  { id: 'grade_year', label: 'Grade, Year, or Role',   type: 'text',  placeholder: 'e.g. Grade 11, Year 2, or Professional' },
]

export default function CompetitionRegisterModal({ competition, competitionName, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', school: '', team_name: '', grade_year: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isSummit = (competition as string) === 'summit'
  const FIELDS = isSummit ? SUMMIT_FIELDS : COMPETITION_FIELDS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const payload = isSummit
      ? { competition, name: form.name, email: form.email, school: form.school, team_name: '', grade_year: form.grade_year }
      : { competition, ...form }
    if (!supabase) { setErrorMsg('Registration unavailable — please contact us directly.'); setStatus('error'); return }
    const { error } = await supabase.from('competition_registrations').insert(payload)
    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(14,12,9,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#141210',
        border: '1px solid rgba(249,115,22,0.25)',
        borderRadius: '16px',
        padding: '36px',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        boxShadow: '0 0 60px rgba(249,115,22,0.12), 0 24px 80px rgba(0,0,0,0.6)',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B5E50', padding: '4px' }}
        >
          <X size={18} />
        </button>

        <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(249,115,22,0.6)', marginBottom: '8px', textTransform: 'uppercase' }}>
          [ REGISTER ]
        </p>
        <h2 style={{ fontFamily: '"Futura","Century Gothic",sans-serif', fontSize: '18px', fontWeight: 900, color: '#F5F0E8', marginBottom: '24px', lineHeight: 1.3 }}>
          {competitionName}
        </h2>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
            <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '16px', marginBottom: '8px', fontFamily: '"Futura","Century Gothic",sans-serif' }}>
              Registration received!
            </p>
            <p style={{ color: '#7A6B58', fontSize: '13px', lineHeight: 1.6 }}>
              We'll be in touch at <span style={{ color: '#F97316' }}>{form.email}</span> with next steps.
            </p>
            <button onClick={onClose} className="cf-btn-primary" style={{ marginTop: '24px' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FIELDS.map(f => (
              <div key={f.id}>
                <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4A3F35', marginBottom: '6px', fontFamily: 'monospace' }}>
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.id as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#F5F0E8',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            ))}

            {status === 'error' && (
              <p style={{ color: '#f87171', fontSize: '12px' }}>{errorMsg || 'Something went wrong. Please try again.'}</p>
            )}

            <p style={{ fontSize: '11px', color: '#4A3F35', lineHeight: 1.5 }}>
              One registration per team. All Ledger chapter members globally are eligible.
            </p>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="cf-btn-primary"
              style={{ marginTop: '4px', opacity: status === 'loading' ? 0.6 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
