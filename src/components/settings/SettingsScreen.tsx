import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Bell, Globe, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react'
import { useT, O } from '../../pages/AppDemo'

export function SettingsScreen({ onBack, onOpenPrivacy, onOpenNotifications, onOpenLanguage }: {
  onBack: () => void
  onOpenPrivacy: () => void
  onOpenNotifications: () => void
  onOpenLanguage: () => void
}) {
  const { BG, W, MT, ST, GT, CA, ACTX, ACBG, BR, SH } = useT()

  const sections = [
    // 0: account card
    // 1: preferences
    // 2: support
    // 3: sign out
    // 4: version
  ]

  return (
    <div className="min-h-full pb-safe-lg" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 mb-4" style={{ background: W, borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: CA }}>
          <ArrowLeft size={16} style={{ color: ST }}/>
        </button>
        <div>
          <h1 className="text-base font-bold" style={{ color: MT }}>Settings</h1>
          <p className="text-[10px]" style={{ color: GT }}>App preferences & account</p>
        </div>
      </div>

      {/* Account Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 * 0.07 }}
        className="rounded-2xl mx-5 mb-4 p-4 flex items-center gap-3"
        style={{ background: W, boxShadow: SH }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#0A1F44' }}>
          <span className="text-white font-black text-lg">S</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: MT }}>Swasmac</p>
          <p className="text-[11px] truncate" style={{ color: GT }}>sanman_pvt@yahoo.com</p>
        </div>
        <button>
          <span className="text-[11px] font-semibold" style={{ color: ACTX }}>Edit Profile</span>
        </button>
      </motion.div>

      {/* PREFERENCES section label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 * 0.07 }}
        className="px-5 mb-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GT }}>Preferences</p>
      </motion.div>

      {/* Preferences Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 * 0.07 }}
        className="rounded-2xl mx-5 mb-4 overflow-hidden"
        style={{ background: W, boxShadow: SH }}
      >
        {[
          { icon: Shield, label: 'Privacy & Security', action: onOpenPrivacy },
          { icon: Bell, label: 'Notifications', action: onOpenNotifications },
          { icon: Globe, label: 'Language & Region', action: onOpenLanguage },
        ].map(({ icon: Icon, label, action }, i, arr) => (
          <button
            key={label}
            onClick={action}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
            style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BR}` : undefined }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: ACBG }}>
              <Icon size={15} style={{ color: ACTX }}/>
            </div>
            <span className="text-sm font-medium flex-1" style={{ color: MT }}>{label}</span>
            <ChevronRight size={15} style={{ color: GT, marginLeft: 'auto' }}/>
          </button>
        ))}
      </motion.div>

      {/* SUPPORT section label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 * 0.07 }}
        className="px-5 mb-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GT }}>Support</p>
      </motion.div>

      {/* Support Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4 * 0.07 }}
        className="rounded-2xl mx-5 mb-4 overflow-hidden"
        style={{ background: W, boxShadow: SH }}
      >
        <div className="px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: `1px solid ${BR}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: ACBG }}>
            <HelpCircle size={15} style={{ color: ACTX }}/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: MT }}>Help &amp; FAQ</p>
            <p className="text-[11px]" style={{ color: GT }}>Visit our help centre</p>
          </div>
          <ChevronRight size={15} style={{ color: GT }}/>
        </div>
        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: ACBG }}>
            <FileText size={15} style={{ color: ACTX }}/>
          </div>
          <span className="text-sm font-medium flex-1" style={{ color: MT }}>Terms &amp; Privacy</span>
          <ChevronRight size={15} style={{ color: GT }}/>
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 * 0.07 }}
        className="rounded-2xl mx-5 overflow-hidden"
        style={{ background: W, boxShadow: SH }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#fee2e2' }}>
            <LogOut size={15} style={{ color: '#ef4444' }}/>
          </div>
          <span className="text-sm font-medium" style={{ color: '#ef4444' }}>Sign Out</span>
        </motion.button>
      </motion.div>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 6 * 0.07 }}
        className="text-[10px] text-center mt-6"
        style={{ color: GT }}
      >
        The Ledger · v1.0.0 · Built with ❤️
      </motion.p>
    </div>
  )
}
