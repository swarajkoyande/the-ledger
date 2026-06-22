// Calculator game — live formula sandbox. Renders each field as a slider or
// currency input, recomputes the result on every change, and awards XP on first
// meaningful interaction. Compound-interest also shows a small inline growth bar.
import { useState, useMemo } from 'react'
import { Calculator as CalcIcon } from 'lucide-react'
import type { CalculatorConfig } from '../types'
import type { T } from '../theme'
import { O, N } from '../theme'
import { computeResult } from '../evalFormula'

function fmt(n: number, prefix = '', suffix = '') {
  if (!isFinite(n)) return '—'
  const rounded = Math.abs(n) >= 1000 ? Math.round(n).toLocaleString() : n.toFixed(2)
  return `${prefix}${rounded}${suffix}`
}

export function CalculatorGame({ config, t, onAward }: { config: CalculatorConfig; t: T; onAward: (xp: number) => void }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(config.fields.map(f => [f.id, f.defaultValue])),
  )
  const [awarded, setAwarded] = useState(false)

  const result = useMemo(() => computeResult(config.calculationType, config.formula, values), [values, config])

  function update(id: string, v: number) {
    setValues(prev => ({ ...prev, [id]: v }))
    if (!awarded) { setAwarded(true); onAward(config.xpReward) }
  }

  // Tiny growth visualization for compound interest (principal+contrib vs growth).
  const showGrowthBar = config.calculationType === 'compound-interest' && isFinite(result)
  const invested = showGrowthBar ? (values.principal || 0) + (values.monthlyContribution || 0) * (values.years || 0) * 12 : 0
  const growth = showGrowthBar ? Math.max(0, result - invested) : 0

  return (
    <div className="rounded-2xl p-4 border" style={{ background: t.W, borderColor: t.LINE, boxShadow: t.SH }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,118,26,0.15)' }}>
          <CalcIcon size={13} style={{ color: O }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: O }}>Calculator · +{config.xpReward} XP</span>
      </div>

      <div className="flex flex-col gap-4">
        {config.fields.map(f => (
          <div key={f.id}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-semibold" style={{ color: t.MT }}>{f.label}</label>
              <span className="text-[12px] font-bold tabular-nums" style={{ color: O }}>
                {f.type === 'currency' ? '$' : ''}{values[f.id].toLocaleString()}{f.unit || ''}
              </span>
            </div>
            {f.type === 'slider' ? (
              <input type="range" min={f.min} max={f.max} step={f.step || 1} value={values[f.id]}
                onChange={e => update(f.id, Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: O, background: t.CA }} />
            ) : (
              <input type="range" min={f.min} max={f.max} step={Math.max(1, Math.round((f.max - f.min) / 100))} value={values[f.id]}
                onChange={e => update(f.id, Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: O, background: t.CA }} />
            )}
            <div className="flex justify-between mt-1">
              <span className="text-[9px]" style={{ color: t.GT }}>{f.type === 'currency' ? '$' : ''}{f.min.toLocaleString()}</span>
              <span className="text-[9px]" style={{ color: t.GT }}>{f.type === 'currency' ? '$' : ''}{f.max.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live result */}
      <div className="mt-4 rounded-xl p-4 text-center" style={{ background: N }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#7687b2' }}>{config.resultLabel}</p>
        <p className="text-2xl font-extrabold tabular-nums" style={{ color: O }}>
          {fmt(result, config.resultPrefix || '', config.resultSuffix || '')}
        </p>
        {showGrowthBar && (
          <div className="mt-3">
            <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ width: `${result > 0 ? (invested / result) * 100 : 0}%`, background: '#7687b2' }} />
              <div style={{ width: `${result > 0 ? (growth / result) * 100 : 0}%`, background: O }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[9px]">
              <span style={{ color: '#7687b2' }}>Contributed {fmt(invested, '$')}</span>
              <span style={{ color: O }}>Growth {fmt(growth, '$')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
