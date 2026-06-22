// Scenario game — branching decision. User picks one option; we reveal that
// option's feedback + consequence, mark correct/incorrect, then reveal the overall
// explanation. XP is awarded on reveal.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, GitBranch, ArrowRight } from 'lucide-react'
import type { ScenarioConfig } from '../types'
import type { T } from '../theme'
import { GREEN, RED, O } from '../theme'

export function ScenarioGame({ config, t, onAward }: { config: ScenarioConfig; t: T; onAward: (xp: number) => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const chosen = config.options.find(o => o.id === picked)

  function choose(id: string) {
    if (picked) return
    setPicked(id)
    onAward(config.xpReward)
  }

  return (
    <div className="rounded-2xl p-4 border" style={{ background: t.W, borderColor: t.LINE, boxShadow: t.SH }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <GitBranch size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>Scenario · +{config.xpReward} XP</span>
      </div>
      <p className="text-[13px] font-medium mb-3 leading-relaxed" style={{ color: t.MT }}>{config.scenario}</p>

      <div className="flex flex-col gap-2">
        {config.options.map(opt => {
          const isChosen = opt.id === picked
          let bg = t.W, border = t.LINE
          if (picked) {
            if (opt.isCorrect) { bg = 'rgba(22,163,74,0.08)'; border = GREEN }
            else if (isChosen) { bg = 'rgba(220,38,38,0.06)'; border = RED }
          }
          return (
            <button key={opt.id} onClick={() => choose(opt.id)} disabled={!!picked}
              className="flex items-start gap-2.5 rounded-xl px-3 py-3 text-left transition-colors"
              style={{ background: bg, border: `1.5px solid ${border}`, opacity: picked && !opt.isCorrect && !isChosen ? 0.5 : 1 }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                   style={{ border: `1.5px solid ${picked && opt.isCorrect ? GREEN : picked && isChosen ? RED : t.GT}` }}>
                {picked && opt.isCorrect ? <CheckCircle2 size={13} style={{ color: GREEN }} />
                 : picked && isChosen ? <XCircle size={13} style={{ color: RED }} /> : null}
              </div>
              <span className="text-[12.5px] leading-snug" style={{ color: t.MT }}>{opt.text}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-col gap-2">
            <div className="rounded-xl px-3 py-2.5" style={{ background: chosen.isCorrect ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.06)' }}>
              <p className="text-[12px] font-bold mb-1" style={{ color: chosen.isCorrect ? GREEN : RED }}>
                {chosen.isCorrect ? 'Correct choice' : 'Not the best choice'}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>{chosen.feedback}</p>
            </div>
            <div className="rounded-xl px-3 py-2.5 flex gap-2" style={{ background: t.BG }}>
              <ArrowRight size={13} style={{ color: t.GT }} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: t.GT }}>Consequence</p>
                <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>{chosen.consequence}</p>
              </div>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(253,118,26,0.08)' }}>
              <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>
                <span className="font-bold" style={{ color: O }}>Takeaway: </span>{config.correctExplanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
