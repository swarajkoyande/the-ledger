import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  Flame,
  Trophy,
  Users,
  Mail,
  MessageSquare,
  Megaphone,
  Moon,
} from 'lucide-react'
import { useT, O } from '../../pages/AppDemo'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
      style={{ background: on ? O : '#cbd2d9' }}
    >
      <motion.span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

type RowDef = {
  key: string
  icon: typeof Bell
  title: string
  desc?: string
}

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const { BG, W, MT, GT, CA, BR, SH } = useT()

  const [state, setState] = useState<Record<string, boolean>>({
    push: true,
    streak: true,
    quest: true,
    club: true,
    challenge: true,
    messages: true,
    digest: true,
    news: false,
    dnd: false,
  })

  const toggle = (k: string) =>
    setState((s) => ({ ...s, [k]: !s[k] }))

  const sections: { label: string; rows: RowDef[] }[] = [
    {
      label: 'PUSH NOTIFICATIONS',
      rows: [
        { key: 'push', icon: Bell, title: 'Push notifications', desc: 'Master switch for all alerts' },
        { key: 'streak', icon: Flame, title: 'Streak reminders', desc: "Nudge me before my streak resets" },
        { key: 'quest', icon: Bell, title: 'Daily quest reminders', desc: "Don't miss today's lesson" },
      ],
    },
    {
      label: 'ACTIVITY',
      rows: [
        { key: 'club', icon: Users, title: 'Club activity', desc: 'Posts and updates from your clubs' },
        { key: 'challenge', icon: Trophy, title: 'Challenge updates', desc: 'Leaderboard moves and results' },
        { key: 'messages', icon: MessageSquare, title: 'New messages', desc: 'Direct and group chat replies' },
      ],
    },
    {
      label: 'EMAIL',
      rows: [
        { key: 'digest', icon: Mail, title: 'Weekly digest', desc: 'Your progress, every Sunday' },
        { key: 'news', icon: Megaphone, title: 'Product news & tips', desc: 'Features and learning tips' },
      ],
    },
    {
      label: 'QUIET HOURS',
      rows: [
        { key: 'dnd', icon: Moon, title: 'Do not disturb', desc: 'Mute 10pm – 7am' },
      ],
    },
  ]

  let rowIndex = 0

  return (
    <div className="min-h-full pb-safe-lg" style={{ background: BG }}>
      <div
        className="flex items-center gap-3 px-4 py-3 mb-2"
        style={{ background: W, borderBottom: `1px solid ${BR}` }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: CA }}
        >
          <ArrowLeft size={16} style={{ color: GT }} />
        </button>
        <div>
          <h1 className="text-base font-bold" style={{ color: MT }}>
            Notifications
          </h1>
          <p className="text-[10px]" style={{ color: GT }}>
            Manage how The Ledger reaches you
          </p>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1"
              style={{ color: GT }}
            >
              {section.label}
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
              {section.rows.map((row, ri) => {
                const Icon = row.icon
                const i = rowIndex++
                const last = ri === section.rows.length - 1
                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: last ? 'none' : `1px solid ${BR}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: CA }}
                    >
                      <Icon size={17} style={{ color: state[row.key] ? O : GT }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: MT }}>
                        {row.title}
                      </p>
                      {row.desc && (
                        <p className="text-[11px] leading-tight" style={{ color: GT }}>
                          {row.desc}
                        </p>
                      )}
                    </div>
                    <Toggle on={state[row.key]} onClick={() => toggle(row.key)} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
