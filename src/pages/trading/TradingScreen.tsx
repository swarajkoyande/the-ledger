import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, TrendingUp, TrendingDown, Trophy, BarChart2 } from 'lucide-react'
import { useT, N, O } from '../AppDemo'
import { ALL_STOCKS, FEATURED_STOCKS, JAPAN_STOCKS, US_STOCKS, startMockPriceFeed } from '../../data/stockData'
import type { Stock } from '../../data/stockData'
import { usePortfolio, computePortfolio } from '../../store/portfolioStore'
import type { LeaderboardEntry } from '../../store/portfolioStore'

// ─── seedFromUserId ────────────────────────────────────────────────────────────

function seedFromUserId(userId: string, stocks: Stock[]): { stock: Stock; shares: number; avgCost: number }[] {
  let h = 0
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) & 0xfffffff
  const count = 3 + (h % 3)
  const result: { stock: Stock; shares: number; avgCost: number }[] = []
  const used = new Set<number>()
  for (let i = 0; i < count; i++) {
    let idx = (h * (i + 7) * 13) % stocks.length
    while (used.has(idx)) idx = (idx + 1) % stocks.length
    used.add(idx)
    const stock = stocks[idx]
    const invested = 10000 + (h * (i + 3)) % 30000
    const avgCost = stock.price * (0.7 + ((h * (i + 1)) % 30) / 100)
    const shares = invested / avgCost
    result.push({ stock, shares, avgCost })
  }
  return result
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ history, up, w = 64, h = 28 }: { history: number[]; up: boolean; w?: number; h?: number }) {
  const pts = history.slice(-14)
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const points = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const color = up ? '#16a34a' : '#dc2626'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ─── Stock Row ────────────────────────────────────────────────────────────────

function StockRow({ stock, liveData, onTap, compact }: {
  stock: Stock
  liveData?: { price: number; change: number; changePct: number }
  onTap: () => void
  compact?: boolean
}) {
  const { MT, GT, BR } = useT()
  const price    = liveData?.price    ?? stock.price
  const changePct = liveData?.changePct ?? stock.changePct
  const up = changePct >= 0
  const isJP = stock.region === 'japan'
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevRef = useRef(price)

  useEffect(() => {
    if (liveData && liveData.price !== prevRef.current) {
      setFlash(liveData.price > prevRef.current ? 'up' : 'down')
      prevRef.current = liveData.price
      setTimeout(() => setFlash(null), 700)
    }
  }, [liveData])

  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.02] transition-colors"
      style={{
        borderBottom: `1px solid ${BR}`,
        transition: 'background 0.5s',
        background: flash === 'up' ? 'rgba(22,163,74,0.06)' : flash === 'down' ? 'rgba(220,38,38,0.06)' : 'transparent',
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold" style={{ color: MT }}>{stock.ticker}</p>
        {!compact && <p className="text-[11px] mt-0.5 truncate" style={{ color: GT }}>{stock.name}</p>}
      </div>
      <Sparkline history={stock.priceHistory} up={up} w={48} h={22} />
      <div className="text-right flex-shrink-0 w-28">
        <p className="text-[13px] font-bold" style={{ color: MT }}>
          {isJP ? '¥' : '$'}{isJP ? Math.round(price).toLocaleString() : price.toFixed(2)}
        </p>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: up ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: up ? '#16a34a' : '#dc2626' }}>
          {up ? '+' : ''}{changePct.toFixed(2)}%
        </span>
      </div>
    </button>
  )
}

// ─── Featured Stock Card ───────────────────────────────────────────────────────

function FeaturedCard({ stock, liveData, onTap }: {
  stock: Stock
  liveData?: { price: number; change: number; changePct: number }
  onTap: () => void
}) {
  const { W, MT, GT, SH } = useT()
  const price    = liveData?.price    ?? stock.price
  const changePct = liveData?.changePct ?? stock.changePct
  const up = changePct >= 0
  const isJP = stock.region === 'japan'
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prevRef = useRef(price)

  useEffect(() => {
    if (liveData && liveData.price !== prevRef.current) {
      setFlash(liveData.price > prevRef.current ? 'up' : 'down')
      prevRef.current = liveData.price
      setTimeout(() => setFlash(null), 600)
    }
  }, [liveData])

  return (
    <motion.button
      onClick={onTap}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl p-4 text-left flex flex-col gap-2"
      style={{
        background: flash ? (flash === 'up' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)') : W,
        boxShadow: SH,
        transition: 'background 0.4s',
        border: `1px solid transparent`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-bold" style={{ color: MT }}>{stock.ticker}</p>
          <p className="text-[10px] mt-0.5 truncate max-w-[100px]" style={{ color: GT }}>{stock.name}</p>
        </div>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: up ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: up ? '#16a34a' : '#dc2626' }}>
          {up ? '+' : ''}{changePct.toFixed(2)}%
        </span>
      </div>
      <Sparkline history={stock.priceHistory} up={up} w={72} h={28} />
      <p className="text-[14px] font-bold" style={{ color: MT }}>
        {isJP ? '¥' : '$'}{isJP ? Math.round(price).toLocaleString() : price.toFixed(2)}
      </p>
    </motion.button>
  )
}

// ─── Public Portfolio Panel ────────────────────────────────────────────────────

function PublicPortfolioPanel({ entry, onClose }: { entry: LeaderboardEntry; onClose: () => void }) {
  const { BG, W, MT, GT, BR, SH } = useT()
  const up = entry.returnPct >= 0
  const holdings = seedFromUserId(entry.userId, ALL_STOCKS)
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.stock.price, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 340, damping: 36 }}
      className="flex flex-col h-full"
      style={{ background: BG }}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${BR}` }}>
        <div>
          <p className="text-[15px] font-bold" style={{ color: MT }}>{entry.displayName}</p>
          <p className="text-[11px]" style={{ color: GT }}>{entry.school}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BR }}>
          <X size={13} style={{ color: GT }} />
        </button>
      </div>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${BR}` }}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: GT }}>Portfolio Value</p>
          <p className="text-[22px] font-bold" style={{ color: MT }}>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <span className="text-[12px] font-bold px-3 py-1 rounded-full"
          style={{ background: up ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: up ? '#16a34a' : '#dc2626' }}>
          {up ? '+' : ''}{entry.returnPct.toFixed(2)}%
        </span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <p className="text-[10px] font-bold uppercase tracking-widest px-5 pt-3 pb-2" style={{ color: GT }}>Holdings</p>
        <div className="mx-4 rounded-xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
          {holdings.map(({ stock, shares, avgCost }) => {
            const value = shares * stock.price
            const ret = ((stock.price - avgCost) / avgCost) * 100
            const posUp = ret >= 0
            return (
              <div key={stock.ticker} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${BR}` }}>
                <div>
                  <p className="text-[12px] font-bold" style={{ color: MT }}>{stock.ticker}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: GT }}>{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold" style={{ color: MT }}>${value.toFixed(2)}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: posUp ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: posUp ? '#16a34a' : '#dc2626' }}>
                    {posUp ? '+' : ''}{ret.toFixed(2)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-center text-[10px] px-6 py-4" style={{ color: GT }}>Paper trading — illustrative only</p>
      </div>
    </motion.div>
  )
}

// ─── Leaderboard Panel ────────────────────────────────────────────────────────

function LeaderboardPanel({ livePrices, onViewPortfolio, viewingEntry }: {
  livePrices: Record<string, number>
  onViewPortfolio: (entry: LeaderboardEntry | null) => void
  viewingEntry: LeaderboardEntry | null
}) {
  const { BG, W, MT, GT, BR, SH } = useT()
  const { state } = usePortfolio()
  const [filter, setFilter] = useState<'all' | 'region' | 'club'>('all')
  const [regionPick, setRegionPick] = useState<string>('all')
  const { totalReturnPct, totalPortfolioValue } = computePortfolio(state, livePrices)

  const entries = state.leaderboard.map(e =>
    e.userId === 'me'
      ? { ...e, returnPct: Math.round(totalReturnPct * 100) / 100, portfolioValue: Math.round(totalPortfolioValue) }
      : e
  )

  const filtered = entries.filter(e => {
    if (filter === 'region' && regionPick !== 'all') return e.region === regionPick
    if (filter === 'club') return e.club !== null
    return true
  }).sort((a, b) => b.returnPct - a.returnPct)

  const medals = ['🥇', '🥈', '🥉']

  if (viewingEntry) {
    return <PublicPortfolioPanel entry={viewingEntry} onClose={() => onViewPortfolio(null)} />
  }

  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: `1px solid ${BR}` }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} style={{ color: O }} />
          <h3 className="text-[13px] font-bold" style={{ color: MT }}>Leaderboard</h3>
        </div>
        <div className="flex gap-1.5">
          {(['all', 'region', 'club'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"
              style={{
                background: filter === f ? O : 'transparent',
                color: filter === f ? '#fff' : GT,
                border: `1px solid ${filter === f ? O : BR}`,
              }}>
              {f === 'all' ? 'All' : f === 'region' ? 'Region' : 'Club'}
            </button>
          ))}
        </div>
        {filter === 'region' && (
          <select value={regionPick} onChange={e => setRegionPick(e.target.value)}
            className="mt-2 w-full text-[11px] rounded-lg px-2 py-1.5 border outline-none"
            style={{ background: W, color: MT, borderColor: BR }}>
            <option value="all">All regions</option>
            <option value="japan">Japan</option>
            <option value="singapore">Singapore</option>
            <option value="india">India</option>
            <option value="australia">Australia</option>
            <option value="spain">Spain</option>
          </select>
        )}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.map((entry, i) => {
          const isMe = entry.userId === 'me'
          const up = entry.returnPct >= 0
          const row = (
            <div className="flex items-center gap-2.5 px-4 py-2.5"
              style={{
                borderBottom: `1px solid ${BR}`,
                borderLeft: isMe ? `2px solid ${O}` : '2px solid transparent',
                background: isMe ? `rgba(253,118,26,0.05)` : 'transparent',
              }}>
              <span className="text-[11px] font-bold w-5 text-center flex-shrink-0" style={{ color: i < 3 ? MT : GT }}>
                {i < 3 ? medals[i] : i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold truncate" style={{ color: MT }}>
                  {entry.displayName}{isMe ? ' (You)' : ''}
                </p>
                <p className="text-[10px] truncate" style={{ color: GT }}>{entry.school}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] font-bold" style={{ color: up ? '#16a34a' : '#dc2626' }}>
                  {up ? '+' : ''}{entry.returnPct.toFixed(2)}%
                </p>
                <p className="text-[9px]" style={{ color: GT }}>${entry.portfolioValue.toLocaleString()}</p>
              </div>
            </div>
          )
          return isMe ? (
            <div key={entry.userId}>{row}</div>
          ) : (
            <button key={entry.userId} className="w-full text-left" onClick={() => onViewPortfolio(entry)}>{row}</button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Trading Screen ──────────────────────────────────────────────────────

interface TradingScreenProps {
  onBack: () => void
  onStock: (stock: Stock) => void
  onPortfolio: () => void
  livePrices: Record<string, { price: number; change: number; changePct: number }>
  onPricesUpdate: (u: Record<string, { price: number; change: number; changePct: number }>) => void
}

export function TradingScreen({ onBack, onStock, onPortfolio, livePrices, onPricesUpdate }: TradingScreenProps) {
  const { BG, W, MT, ST, GT, CA, SH, BR } = useT()
  const { state } = usePortfolio()
  const [query, setQuery] = useState('')
  const [viewingPortfolio, setViewingPortfolio] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    const stop = startMockPriceFeed(onPricesUpdate)
    return stop
  }, [onPricesUpdate])

  const liveNumeric: Record<string, number> = {}
  Object.entries(livePrices).forEach(([k, v]) => { liveNumeric[k] = v.price })

  const hasPositions = Object.keys(state.positions).length > 0
  const { totalPortfolioValue, totalReturnPct, totalReturnDollars } = computePortfolio(state, liveNumeric)
  const returnUp = totalReturnPct >= 0

  const q = query.toLowerCase()
  const searchResults = q
    ? ALL_STOCKS.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    : []

  const meEntry = state.leaderboard.find(e => e.userId === 'me')!
  const myRank = [...state.leaderboard].sort((a, b) => b.returnPct - a.returnPct).findIndex(e => e.userId === 'me') + 1

  return (
    <div className="flex h-full" style={{ background: BG }}>
      {/* ── Left: Stock List ── */}
      <div className="flex flex-col flex-1 min-w-0 border-r" style={{ borderColor: BR }}>
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${BR}` }}>
          <div className="flex items-center gap-2">
            <BarChart2 size={16} style={{ color: O }} />
            <h1 className="text-[16px] font-bold" style={{ color: MT }}>Markets</h1>
          </div>
          {hasPositions && (
            <button onClick={onPortfolio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold"
              style={{ background: N, color: '#fff' }}>
              <span>${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              <span style={{ color: returnUp ? '#4ade80' : '#f87171' }}>{returnUp ? '+' : ''}{totalReturnPct.toFixed(1)}%</span>
              <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: CA }}>
            <Search size={13} style={{ color: GT }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search stocks, e.g. Toyota, AAPL"
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: MT }}
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={12} style={{ color: GT }} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Search results */}
          {q.length > 0 ? (
            <div>
              {searchResults.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm" style={{ color: GT }}>No stocks found for "{query}"</p>
              ) : searchResults.map(s => (
                <StockRow key={s.ticker} stock={s} liveData={livePrices[s.ticker]} onTap={() => onStock(s)} />
              ))}
            </div>
          ) : (
            <>
              {/* My rank strip */}
              <div className="px-4 pb-3 pt-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: `rgba(253,118,26,0.08)`, border: `1px solid rgba(253,118,26,0.2)` }}>
                  <span className="text-[11px] font-bold" style={{ color: O }}>
                    #{myRank > 0 ? myRank : '—'} You
                  </span>
                  <span className="text-[11px]" style={{ color: GT }}>·</span>
                  <span className="text-[11px] font-bold" style={{ color: meEntry.returnPct >= 0 ? '#16a34a' : '#dc2626' }}>
                    {meEntry.returnPct >= 0 ? '+' : ''}{meEntry.returnPct.toFixed(2)}%
                  </span>
                  {hasPositions && (
                    <button onClick={onPortfolio} className="ml-auto text-[10px] font-bold" style={{ color: O }}>
                      View Portfolio →
                    </button>
                  )}
                </div>
              </div>

              {/* Featured section */}
              <div className="px-4 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: GT }}>Popular with Ledger students</p>
                <div className="grid grid-cols-3 gap-2">
                  {FEATURED_STOCKS.map(s => (
                    <FeaturedCard key={s.ticker} stock={s} liveData={livePrices[s.ticker]} onTap={() => onStock(s)} />
                  ))}
                </div>
              </div>

              {/* Japan section */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 px-4 mb-1.5">
                  <span className="text-[12px]">🇯🇵</span>
                  <p className="text-[11px] font-bold" style={{ color: MT }}>Japan · TSE</p>
                </div>
                <div className="mx-4 rounded-xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
                  {JAPAN_STOCKS.map(s => (
                    <StockRow key={s.ticker} stock={s} liveData={livePrices[s.ticker]} onTap={() => onStock(s)} />
                  ))}
                </div>
              </div>

              {/* US section */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 px-4 mb-1.5">
                  <span className="text-[12px]">🇺🇸</span>
                  <p className="text-[11px] font-bold" style={{ color: MT }}>United States · NYSE & NASDAQ</p>
                </div>
                <div className="mx-4 rounded-xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
                  {US_STOCKS.map(s => (
                    <StockRow key={s.ticker} stock={s} liveData={livePrices[s.ticker]} onTap={() => onStock(s)} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right: Leaderboard Panel ── */}
      <div className="w-64 flex-shrink-0 overflow-hidden">
        <LeaderboardPanel
          livePrices={liveNumeric}
          onViewPortfolio={setViewingPortfolio}
          viewingEntry={viewingPortfolio}
        />
      </div>
    </div>
  )
}
