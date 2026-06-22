import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useT, O, N } from '../AppDemo'
import type { Stock } from '../../data/stockData'
import { usePortfolio } from '../../store/portfolioStore'

// ─── Chart ────────────────────────────────────────────────────────────────────

type TimeRange = '1D' | '1W' | '1M' | '3M'
const RANGE_SLICES: Record<TimeRange, number> = { '1D': 7, '1W': 20, '1M': 45, '3M': 90 }

function PriceChart({ history, range }: { history: number[]; range: TimeRange }) {
  const pts = history.slice(-RANGE_SLICES[range])
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const r   = max - min || 1
  const W = 480, H = 180
  const isUp = pts[pts.length - 1] >= pts[0]
  const color = isUp ? '#16a34a' : '#dc2626'
  const fillId = `grad-desk-${range}`

  const coords = pts.map((p, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: H - ((p - min) / r) * (H - 20) - 10,
  }))

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
  const fillPath = `${linePath} L${W},${H} L0,${H} Z`

  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round((x / W) * (pts.length - 1))
    setHoverIdx(Math.max(0, Math.min(pts.length - 1, idx)))
  }

  const hoverPt = hoverIdx !== null ? coords[hoverIdx] : null
  const hoverPrice = hoverIdx !== null ? pts[hoverIdx] : null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 180, display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          key={range}
          d={fillPath}
          fill={`url(#${fillId})`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        />
        <motion.path
          key={`line-${range}`}
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {hoverPt && (
          <>
            <line x1={hoverPt.x} y1={0} x2={hoverPt.x} y2={H} stroke={color} strokeWidth="1" strokeOpacity={0.3} strokeDasharray="3,3" />
            <circle cx={hoverPt.x} cy={hoverPt.y} r="5" fill={color} />
            <circle cx={hoverPt.x} cy={hoverPt.y} r="3" fill="white" />
          </>
        )}
      </svg>
      {hoverPt && hoverPrice !== null && (
        <div style={{
          position: 'absolute',
          top: Math.max(0, (hoverPt.y / H) * 100 - 16) + '%',
          left: Math.min((hoverPt.x / W) * 100, 80) + '%',
          transform: 'translateX(-50%)',
          background: N,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 8,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          {pts[0] > 999 ? '¥' : '$'}{pts[0] > 999 ? Math.round(hoverPrice).toLocaleString() : hoverPrice.toFixed(2)}
        </div>
      )}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: 'buy' | 'sell'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
        background: type === 'buy' ? '#16a34a' : '#d97706',
        color: '#fff', padding: '10px 20px', borderRadius: 14,
        fontSize: 13, fontWeight: 700, textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
      }}
    >
      {msg}
    </motion.div>
  )
}

// ─── Confirm Dialog (desktop — centered modal) ────────────────────────────────

function ConfirmDialog({
  stock, amount, type, currentPrice, onConfirm, onCancel, isJP
}: {
  stock: Stock; amount: number; type: 'buy' | 'sell'; currentPrice: number
  onConfirm: () => void; onCancel: () => void; isJP: boolean
}) {
  const { W, MT, ST, GT, BR } = useT()
  const shares = amount / currentPrice
  const sym = isJP ? '¥' : '$'

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black z-40"
        onClick={onCancel}
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        className="absolute z-50 rounded-2xl p-6 shadow-xl"
        style={{
          background: W,
          top: '50%', left: 8, right: 8,
          transform: 'translateY(-50%)',
        }}
      >
        <h3 className="text-[15px] font-bold mb-4" style={{ color: MT }}>
          {type === 'buy' ? 'Confirm Purchase' : 'Confirm Sale'}
        </h3>
        <div className="rounded-xl p-4 mb-4" style={{ background: type === 'buy' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)' }}>
          <div className="flex justify-between mb-2">
            <span className="text-[12px]" style={{ color: ST }}>{stock.name}</span>
            <span className="text-[12px] font-bold" style={{ color: MT }}>
              {sym}{isJP ? Math.round(amount).toLocaleString() : amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[12px]" style={{ color: ST }}>Est. shares</span>
            <span className="text-[12px] font-bold" style={{ color: MT }}>{shares.toFixed(4)}</span>
          </div>
        </div>
        <p className="text-[10px] text-center mb-4" style={{ color: GT }}>Paper trading — no real money involved</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: BR, color: ST }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white"
            style={{ background: type === 'buy' ? '#16a34a' : '#dc2626' }}>
            Confirm
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─── Action Panel (right column, always visible) ──────────────────────────────

function ActionPanel({ stock, currentPrice, isJP }: { stock: Stock; currentPrice: number; isJP: boolean }) {
  const { W, MT, ST, GT, BR, CA } = useT()
  const { state, dispatch } = usePortfolio()
  const pos = state.positions[stock.ticker]
  const hasPosition = !!pos

  const [tab, setTab]         = useState<'buy' | 'sell'>('buy')
  const [inputStr, setInputStr] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [toast, setToast]     = useState<string | null>(null)
  const [toastType, setToastType] = useState<'buy' | 'sell'>('buy')

  const amount = parseFloat(inputStr) || 0
  const posValue = pos ? pos.shares * currentPrice : 0
  const canBuy  = amount >= 1 && amount <= state.cash
  const canSell = tab === 'sell' && amount >= 1 && amount <= posValue + 0.01
  const disabled = tab === 'buy' ? !canBuy : !canSell

  const sym = isJP ? '¥' : '$'

  function execute() {
    setConfirm(false)
    if (tab === 'buy') {
      dispatch({ type: 'BUY', ticker: stock.ticker, dollarAmount: amount, currentPrice, stockName: stock.name })
      setToastType('buy')
      setToast(`Bought ${sym}${isJP ? Math.round(amount).toLocaleString() : amount.toFixed(2)} of ${stock.name}`)
    } else {
      dispatch({ type: 'SELL', ticker: stock.ticker, dollarAmount: amount, currentPrice })
      setToastType('sell')
      setToast(`Sold ${sym}${isJP ? Math.round(amount).toLocaleString() : amount.toFixed(2)} of ${stock.name}`)
    }
    setInputStr('')
  }

  // Preset buttons
  const presets = tab === 'buy'
    ? [1000, 5000, 10000].filter(p => p <= state.cash)
    : [posValue * 0.25, posValue * 0.5, posValue].filter(p => p >= 1).map(p => Math.floor(p))

  return (
    <div className="flex flex-col h-full px-5 py-5" style={{ borderTop: `1px solid ${BR}`, background: W }}>
      <h3 className="text-[13px] font-bold mb-4" style={{ color: MT }}>Place Order</h3>

      {/* Buy/Sell tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: CA }}>
        {(['buy', 'sell'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-[12px] font-bold relative"
            style={{ color: tab === t ? '#fff' : GT }}>
            {tab === t && (
              <motion.div layoutId="desk-action-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: t === 'buy' ? '#16a34a' : '#dc2626' }}
                transition={{ type: 'spring', stiffness: 480, damping: 32 }} />
            )}
            <span className="relative z-10">{t === 'buy' ? 'Buy' : 'Sell'}</span>
          </button>
        ))}
      </div>

      {/* Dollar input */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-1" style={{ background: CA }}>
        <span className="text-[15px] font-bold" style={{ color: GT }}>{sym}</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={inputStr}
          onChange={e => setInputStr(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent outline-none text-[15px] font-bold"
          style={{ color: MT }}
        />
      </div>

      <p className="text-[11px] mb-3 px-1" style={{ color: GT }}>
        {tab === 'buy'
          ? `Available: ${sym}${state.cash.toFixed(2)}`
          : `Position value: ${sym}${isJP ? Math.round(posValue).toLocaleString() : posValue.toFixed(2)}`
        }
      </p>

      {/* Preset buttons */}
      {presets.length > 0 && (
        <div className="flex gap-1.5 mb-4">
          {presets.map(p => (
            <button key={p}
              onClick={() => setInputStr(String(p))}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-bold"
              style={{ background: CA, color: GT }}>
              {sym}{p >= 1000 ? `${(p / 1000).toFixed(0)}k` : p.toFixed(0)}
            </button>
          ))}
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => !disabled && setConfirm(true)}
        className="w-full py-3 rounded-xl text-[14px] font-bold text-white mt-auto"
        style={{
          background: disabled ? '#c0c4cc' : tab === 'buy' ? '#16a34a' : '#dc2626',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {tab === 'buy' ? 'Buy' : 'Sell'}
      </button>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            stock={stock} amount={amount} type={tab} currentPrice={currentPrice}
            isJP={isJP} onConfirm={execute} onCancel={() => setConfirm(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast} type={toastType} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface StockDetailProps {
  stock: Stock
  liveData?: { price: number; change: number; changePct: number }
  onBack: () => void
}

export function StockDetailScreen({ stock, liveData, onBack }: StockDetailProps) {
  const { BG, W, MT, ST, GT, CA, SH, BR } = useT()
  const { state } = usePortfolio()
  const [range, setRange] = useState<TimeRange>('1M')

  const price     = liveData?.price    ?? stock.price
  const change    = liveData?.change   ?? stock.change
  const changePct = liveData?.changePct ?? stock.changePct
  const up = changePct >= 0
  const isJP = stock.region === 'japan'
  const sym = isJP ? '¥' : '$'
  const pos = state.positions[stock.ticker]

  const fmtPrice = (p: number) => isJP ? `¥${Math.round(p).toLocaleString()}` : `$${p.toFixed(2)}`

  const posValue = pos ? pos.shares * price : 0
  const posReturn = pos ? ((price - pos.avgCost) / pos.avgCost) * 100 : 0
  const posReturnUp = posReturn >= 0

  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
          <ArrowLeft size={15} style={{ color: ST }} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-bold" style={{ color: MT }}>{stock.ticker}</p>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: CA, color: GT }}>
              {stock.exchange}
            </span>
          </div>
          <p className="text-[11px] truncate" style={{ color: GT }}>{stock.name}</p>
        </div>
        {/* Live price in header */}
        <div className="text-right">
          <p className="text-[18px] font-bold leading-none" style={{ color: MT }}>{fmtPrice(price)}</p>
          <span className="text-[11px] font-bold" style={{ color: up ? '#16a34a' : '#dc2626' }}>
            {up ? '+' : ''}{isJP ? Math.round(change) : change.toFixed(2)} ({up ? '+' : ''}{changePct.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0">
        {/* Left: chart + stats */}
        <div className="flex-1 min-w-0 overflow-y-auto no-scrollbar">
          {/* Chart */}
          <div className="px-5 pt-4 pb-2">
            <PriceChart history={stock.priceHistory} range={range} />
          </div>

          {/* Time range pills */}
          <div className="flex gap-1.5 px-5 mb-5">
            {(['1D', '1W', '1M', '3M'] as TimeRange[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors"
                style={{ background: range === r ? N : CA, color: range === r ? '#fff' : GT }}>
                {r}
              </button>
            ))}
          </div>

          {/* Stats grid */}
          <div className="px-5 grid grid-cols-4 gap-2.5 mb-4">
            {[
              { label: 'Market Cap', value: stock.marketCap },
              { label: 'P/E Ratio',  value: stock.peRatio !== null ? stock.peRatio.toFixed(1) : '—' },
              { label: '52W High',   value: fmtPrice(stock.week52High) },
              { label: '52W Low',    value: fmtPrice(stock.week52Low)  },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: W, boxShadow: SH }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: GT }}>{label}</p>
                <p className="text-[13px] font-bold" style={{ color: MT }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Position card */}
          {pos && (
            <div className="mx-5 rounded-xl p-4 mb-4"
              style={{
                background: posReturnUp ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                border: `1px solid ${posReturnUp ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`,
              }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GT }}>Your Position</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px]" style={{ color: ST }}>Shares</p>
                  <p className="text-[13px] font-bold" style={{ color: MT }}>{pos.shares.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: ST }}>Avg cost</p>
                  <p className="text-[13px] font-bold" style={{ color: MT }}>{fmtPrice(pos.avgCost)}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: ST }}>Return</p>
                  <p className="text-[13px] font-bold" style={{ color: posReturnUp ? '#16a34a' : '#dc2626' }}>
                    {posReturnUp ? '+' : ''}{posReturn.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: action panel */}
        <div className="w-64 flex-shrink-0 border-l relative" style={{ borderColor: BR }}>
          <ActionPanel stock={stock} currentPrice={price} isJP={isJP} />
        </div>
      </div>
    </div>
  )
}
