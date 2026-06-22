// Drag-drop game — sort labelled items into buckets. Uses tap-to-place (mobile
// friendly): tap an item to pick it up, tap a bucket to drop it. On submit,
// validates each item.correctCategory, shows per-item correctness, then reveals
// the explanation and awards XP once.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Sparkles, RotateCcw } from 'lucide-react'
import type { DragDropConfig } from '../types'
import type { T } from '../theme'
import { GREEN, RED, O } from '../theme'

export function DragDropGame({ config, t, onAward }: { config: DragDropConfig; t: T; onAward: (xp: number) => void }) {
  const [placement, setPlacement] = useState<Record<string, string>>({}) // itemId -> categoryId
  const [picked, setPicked] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const unplaced = config.items.filter(i => !placement[i.id])
  const allPlaced = unplaced.length === 0
  const correctCount = config.items.filter(i => placement[i.id] === i.correctCategory).length

  function place(catId: string) {
    if (submitted) return
    if (picked) { setPlacement(p => ({ ...p, [picked]: catId })); setPicked(null) }
  }
  function pickUp(itemId: string) {
    if (submitted) return
    setPlacement(p => { const n = { ...p }; delete n[itemId]; return n })
    setPicked(itemId)
  }
  function submit() {
    setSubmitted(true)
    onAward(config.xpReward)
  }
  function reset() {
    setPlacement({}); setPicked(null); setSubmitted(false)
  }

  return (
    <div className="rounded-2xl p-4 border" style={{ background: t.W, borderColor: t.LINE, boxShadow: t.SH }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <Sparkles size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>Interactive · +{config.xpReward} XP</span>
      </div>
      <p className="text-[13px] font-medium mb-3 leading-relaxed" style={{ color: t.MT }}>{config.scenario}</p>

      {/* Unplaced item tray */}
      {!submitted && (
        <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem]">
          {unplaced.length === 0 && <span className="text-[11px] italic" style={{ color: t.GT }}>All items placed — submit to check.</span>}
          {unplaced.map(item => (
            <button key={item.id} onClick={() => setPicked(picked === item.id ? null : item.id)}
              className="text-[11.5px] font-medium rounded-xl px-3 py-2 text-left transition-all"
              style={{ background: picked === item.id ? O : t.CA, color: picked === item.id ? '#fff' : t.MT,
                       border: `1.5px solid ${picked === item.id ? O : t.LINE}`, transform: picked === item.id ? 'scale(1.03)' : 'none' }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      {picked && !submitted && <p className="text-[10.5px] mb-2" style={{ color: O }}>Now tap a category below to drop it.</p>}

      {/* Buckets */}
      <div className="flex flex-col gap-2.5">
        {config.categories.map(cat => {
          const inBucket = config.items.filter(i => placement[i.id] === cat.id)
          return (
            <button key={cat.id} onClick={() => place(cat.id)} disabled={submitted || !picked}
              className="rounded-xl p-3 text-left transition-all"
              style={{ background: t.BG, border: `2px dashed ${picked && !submitted ? cat.color : t.LINE}`,
                       cursor: picked && !submitted ? 'pointer' : 'default' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                <span className="text-[12px] font-bold" style={{ color: t.MT }}>{cat.label}</span>
              </div>
              {cat.description && <p className="text-[10px] mb-2" style={{ color: t.GT }}>{cat.description}</p>}
              <div className="flex flex-wrap gap-1.5">
                {inBucket.length === 0 && <span className="text-[10.5px] italic" style={{ color: t.GT }}>Empty</span>}
                {inBucket.map(item => {
                  const ok = item.correctCategory === cat.id
                  return (
                    <span key={item.id} onClick={(e) => { e.stopPropagation(); pickUp(item.id) }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium rounded-lg px-2 py-1"
                      style={{ background: submitted ? (ok ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.10)') : t.W,
                               border: `1px solid ${submitted ? (ok ? GREEN : RED) : t.LINE}`, color: t.MT }}>
                      {submitted && (ok ? <CheckCircle2 size={11} style={{ color: GREEN }} /> : <XCircle size={11} style={{ color: RED }} />)}
                      {item.label}
                    </span>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>

      {/* Actions / result */}
      {!submitted ? (
        <button onClick={submit} disabled={!allPlaced}
          className="w-full mt-3 rounded-xl py-3 text-[13px] font-bold text-white transition-all disabled:opacity-40"
          style={{ background: N_OR_O(allPlaced) }}>
          Check Answers
        </button>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <div className="rounded-xl px-3 py-2.5 mb-2" style={{ background: correctCount === config.items.length ? 'rgba(22,163,74,0.10)' : 'rgba(217,119,6,0.10)' }}>
              <p className="text-[12px] font-bold mb-1" style={{ color: correctCount === config.items.length ? GREEN : O }}>
                {correctCount} / {config.items.length} correct · +{config.xpReward} XP
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: t.ST }}>{config.correctExplanation}</p>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: t.GT }}>
              <RotateCcw size={12} /> Try again
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

const N_OR_O = (active: boolean) => (active ? O : '#999')
