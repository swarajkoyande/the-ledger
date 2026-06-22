import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, Trophy, Users, KeyRound, Smartphone, Download, Trash2, ChevronRight } from 'lucide-react'
import { useT, O } from '../../pages/AppDemo'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
      style={{ background: on ? O : '#cbd2d9' }}>
      <motion.span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ left: on ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  )
}

export function PrivacySecurityScreen({ onBack }: { onBack: () => void }) {
  const { BG, W, MT, ST, GT, CA, BR, SH } = useT()

  const [privateProfile, setPrivateProfile] = useState(false)
  const [showLeaderboards, setShowLeaderboards] = useState(true)
  const [allowInvites, setAllowInvites] = useState(true)
  const [shareActivity, setShareActivity] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const RED = '#ef4444'

  const privacyRows = [
    { icon: Eye, label: 'Private profile', desc: 'Only club members can view your profile', on: privateProfile, set: setPrivateProfile },
    { icon: Trophy, label: 'Show on leaderboards', desc: 'Display your rank publicly', on: showLeaderboards, set: setShowLeaderboards },
    { icon: Users, label: 'Allow club invites', desc: 'Let clubs invite you to join', on: allowInvites, set: setAllowInvites },
    { icon: Shield, label: 'Share learning activity', desc: 'Let friends see lessons you complete', on: shareActivity, set: setShareActivity },
  ]

  return (
    <div className="min-h-full pb-safe-lg" style={{ background: BG }}>
      <div className="flex items-center gap-3 px-4 py-3 mb-2" style={{ background: W, borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CA }}>
          <ArrowLeft size={16} style={{ color: ST }}/>
        </button>
        <div>
          <h1 className="text-base font-bold" style={{ color: MT }}>Privacy & Security</h1>
          <p className="text-[10px]" style={{ color: GT }}>Control your data and account safety</p>
        </div>
      </div>

      {/* PRIVACY */}
      <div className="px-5 mt-2">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: GT }}>Privacy</p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          {privacyRows.map((r, i) => (
            <div key={r.label} className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < privacyRows.length - 1 ? `1px solid ${BR}` : 'none' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
                <r.icon size={16} style={{ color: ST }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: MT }}>{r.label}</p>
                <p className="text-[11px] leading-tight" style={{ color: GT }}>{r.desc}</p>
              </div>
              <Toggle on={r.on} onClick={() => r.set(v => !v)} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* SECURITY */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: GT }}>Security</p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left" style={{ borderBottom: `1px solid ${BR}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
              <KeyRound size={16} style={{ color: ST }} />
            </div>
            <p className="flex-1 text-sm font-semibold" style={{ color: MT }}>Change password</p>
            <ChevronRight size={16} style={{ color: GT }} />
          </button>

          <button onClick={() => setTwoFA(v => !v)} className="w-full flex items-center gap-3 px-4 py-3 text-left"
            style={{ borderBottom: `1px solid ${BR}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
              <Smartphone size={16} style={{ color: ST }} />
            </div>
            <p className="flex-1 text-sm font-semibold" style={{ color: MT }}>Two-factor authentication</p>
            <span className="text-xs font-semibold" style={{ color: twoFA ? O : GT }}>{twoFA ? 'On' : 'Off'}</span>
            <ChevronRight size={16} style={{ color: GT }} />
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
              <Lock size={16} style={{ color: ST }} />
            </div>
            <p className="flex-1 text-sm font-semibold" style={{ color: MT }}>Active sessions</p>
            <span className="text-xs" style={{ color: GT }}>2 devices</span>
            <ChevronRight size={16} style={{ color: GT }} />
          </button>
        </motion.div>
      </div>

      {/* YOUR DATA */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: GT }}>Your Data</p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left" style={{ borderBottom: `1px solid ${BR}` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
              <Download size={16} style={{ color: ST }} />
            </div>
            <p className="flex-1 text-sm font-semibold" style={{ color: MT }}>Download my data</p>
            <ChevronRight size={16} style={{ color: GT }} />
          </button>

          <button onClick={() => setShowDelete(true)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fee2e2' }}>
              <Trash2 size={16} style={{ color: RED }} />
            </div>
            <p className="flex-1 text-sm font-semibold" style={{ color: RED }}>Delete account</p>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDelete && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDelete(false)}>
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="w-full max-w-[300px] rounded-2xl p-5" style={{ background: W, boxShadow: SH }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: '#fee2e2' }}>
                <Trash2 size={20} style={{ color: RED }} />
              </div>
              <h2 className="text-base font-bold mb-1" style={{ color: MT }}>Delete account?</h2>
              <p className="text-xs leading-relaxed mb-4" style={{ color: ST }}>
                This permanently erases your profile, progress, and club memberships. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowDelete(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: RED }}>
                  Delete
                </button>
                <button onClick={() => setShowDelete(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: CA, color: MT }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
