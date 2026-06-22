import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useT, O, N } from '../AppDemo'
import { ALL_STOCKS } from '../../data/stockData'
import type { Stock } from '../../data/stockData'
import { usePortfolio, computePortfolio } from '../../store/portfolioStore'
import { supabase } from '../../lib/supabase'

// ─── Portfolio history chart ──────────────────────────────────────────────────

function SnapshotChart({ data }: { data: { date: string; value: number }[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 220, H = 80

  useEffect(() => {
    if (!svgRef.current || data.length < 2) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const x = d3.scalePoint()
      .domain(data.map(d => d.date))
      .range([0, W])

    const [minV, maxV] = d3.extent(data, d => d.value) as [number, number]
    const pad = (maxV - minV) * 0.1 || 1
    const y = d3.scaleLinear().domain([minV - pad, maxV + pad]).range([H - 4, 4])

    const line = d3.line<{ date: string; value: number }>()
      .x(d => x(d.date) ?? 0)
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom)

    const area = d3.area<{ date: string; value: number }>()
      .x(d => x(d.date) ?? 0)
      .y0(H)
      .y1(d => y(d.value))
      .curve(d3.curveCatmullRom)

    const defs = svg.append('defs')
    const grad = defs.append('linearGradient').attr('id', 'sc-grad').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    grad.append('stop').attr('offset', '0%').attr('stop-color', O).attr('stop-opacity', 0.18)
    grad.append('stop').attr('offset', '100%').attr('stop-color', O).attr('stop-opacity', 0)

    svg.append('path').datum(data).attr('d', area).attr('fill', 'url(#sc-grad)')
    svg.append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', O).attr('stroke-width', 2).attr('stroke-linecap', 'round')

    const last = data[data.length - 1]
    svg.append('circle').attr('cx', x(last.date) ?? 0).attr('cy', y(last.value)).attr('r', 3.5).attr('fill', O)
  }, [data])

  if (data.length < 2) {
    return (
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>
        Not enough history yet
      </p>
    )
  }

  return <svg ref={svgRef} width={W} height={H} style={{ display: 'block', overflow: 'visible' }} />
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyIllustration() {
  return (
    <svg width="100" height="70" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="8,64 28,44 44,52 64,28 84,36 112,12" stroke="#e2e3ea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="112" cy="12" r="4" fill={O} />
      <circle cx="64" cy="28" r="3" fill="#c5c6cf" />
    </svg>
  )
}

// ─── Portfolio Screen ─────────────────────────────────────────────────────────

interface PortfolioScreenProps {
  onBack: () => void
  onStock: (stock: Stock) => void
  onStartTrading: () => void
  onLearnMore: () => void
  livePrices: Record<string, { price: number; change: number; changePct: number }>
}

export function PortfolioScreen({
  onBack, onStock, onStartTrading, onLearnMore, livePrices
}: PortfolioScreenProps) {
  const { BG, W, MT, ST, GT, CA, SH, BR } = useT()
  const { state } = usePortfolio()

  const [snapshots, setSnapshots] = useState<{ date: string; value: number }[]>([])
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      supabase
        .from('portfolio_snapshots')
        .select('snapshot_date, total_value')
        .eq('user_id', data.user.id)
        .gte('snapshot_date', since)
        .order('snapshot_date', { ascending: true })
        .limit(30)
        .then(({ data: rows }) => {
          if (rows) setSnapshots(rows.map(r => ({ date: r.snapshot_date, value: Number(r.total_value) })))
        })
    })
  }, [])

  const liveNumeric: Record<string, number> = {}
  Object.entries(livePrices).forEach(([k, v]) => { liveNumeric[k] = v.price })

  const { totalPortfolioValue, totalReturnPct, totalReturnDollars } = computePortfolio(state, liveNumeric)
  const returnUp = totalReturnPct >= 0
  const hasPositions = Object.keys(state.positions).length > 0

  const positionRows = Object.values(state.positions).map(pos => {
    const stock = ALL_STOCKS.find(s => s.ticker === pos.ticker)
    const livePrice = liveNumeric[pos.ticker] ?? pos.avgCost
    const currentValue = pos.shares * livePrice
    const returnPct = ((livePrice - pos.avgCost) / pos.avgCost) * 100
    const returnDollars = currentValue - pos.totalInvested
    return { pos, stock, currentValue, returnPct, returnDollars }
  }).sort((a, b) => b.currentValue - a.currentValue)

  function fmtDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BR}` }}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: CA }}>
          <ArrowLeft size={15} style={{ color: ST }} />
        </button>
        <h1 className="text-[16px] font-bold" style={{ color: MT }}>My Portfolio</h1>
      </div>

      {hasPositions ? (
        <div className="flex flex-1 min-h-0">
          {/* ── Left: summary + positions ── */}
          <div className="flex flex-col w-[55%] border-r overflow-y-auto no-scrollbar pb-6" style={{ borderColor: BR }}>
            {/* Summary card */}
            <div className="mx-5 mt-5 rounded-2xl p-5 mb-5 flex-shrink-0" style={{ background: N, boxShadow: SH }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Value</p>
              <p className="text-[32px] font-bold text-white leading-none">
                ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center gap-3 mt-2">
                {returnUp
                  ? <ArrowUpRight size={14} style={{ color: '#4ade80' }} />
                  : <ArrowDownRight size={14} style={{ color: '#f87171' }} />}
                <span className="text-[13px] font-bold" style={{ color: returnUp ? '#4ade80' : '#f87171' }}>
                  {returnUp ? '+' : ''}{totalReturnPct.toFixed(2)}%
                </span>
                <span className="text-[13px] font-bold" style={{ color: returnUp ? '#4ade80' : '#f87171' }}>
                  {returnUp ? '+' : ''}${Math.abs(totalReturnDollars).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="grid grid-cols-2 mt-4 pt-4 gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Cash Available</p>
                  <p className="text-[15px] font-bold text-white">${state.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Starting Capital</p>
                  <p className="text-[15px] font-bold text-white">$100,000</p>
                </div>
              </div>
            </div>

            {/* History chart */}
            {snapshots.length > 0 && (
              <div className="mx-5 mb-5 rounded-2xl px-4 py-3 flex-shrink-0" style={{ background: N, boxShadow: SH }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>30-Day History</p>
                <SnapshotChart data={snapshots} />
              </div>
            )}

            {/* Positions */}
            <p className="text-[11px] font-bold uppercase tracking-widest px-5 mb-3" style={{ color: GT }}>Positions</p>
            <div className="mx-5 rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
              {positionRows.map(({ pos, stock, currentValue, returnPct, returnDollars }, i) => {
                const up = returnPct >= 0
                const isJP = stock?.region === 'japan'
                return (
                  <motion.button key={pos.ticker}
                    onClick={() => stock && onStock(stock)}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className="w-full flex items-center gap-4 px-4 py-3.5 text-left"
                    style={{ borderBottom: i < positionRows.length - 1 ? `1px solid ${BR}` : 'none' }}
                  >
                    {/* Ticker + name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold" style={{ color: MT }}>{pos.ticker}</p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: GT }}>{stock?.name ?? pos.ticker}</p>
                    </div>
                    {/* Shares */}
                    <div className="text-center">
                      <p className="text-[11px]" style={{ color: GT }}>Shares</p>
                      <p className="text-[12px] font-bold" style={{ color: ST }}>{pos.shares.toFixed(3)}</p>
                    </div>
                    {/* Value + return */}
                    <div className="text-right">
                      <p className="text-[13px] font-bold" style={{ color: MT }}>
                        {isJP ? '¥' : '$'}{isJP ? Math.round(currentValue).toLocaleString() : currentValue.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: up ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', color: up ? '#16a34a' : '#dc2626' }}>
                          {up ? '+' : ''}{returnPct.toFixed(2)}%
                        </span>
                        <span className="text-[10px]" style={{ color: up ? '#16a34a' : '#dc2626' }}>
                          ({up ? '+' : ''}${Math.abs(returnDollars).toFixed(0)})
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* ── Right: Transaction History (always expanded) ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-y-auto no-scrollbar pb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest px-5 pt-5 mb-3" style={{ color: GT }}>Transaction History</p>
            <div className="mx-5 rounded-2xl overflow-hidden" style={{ background: W, boxShadow: SH }}>
              {state.transactions.length === 0 ? (
                <p className="px-4 py-8 text-sm text-center" style={{ color: GT }}>No transactions yet</p>
              ) : state.transactions.map((tx, i) => {
                const stock = ALL_STOCKS.find(s => s.ticker === tx.ticker)
                const isJP = stock?.region === 'japan'
                const sym = isJP ? '¥' : '$'
                const isBuy = tx.type === 'buy'
                return (
                  <div key={tx.id} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: i < state.transactions.length - 1 ? `1px solid ${BR}` : 'none' }}>
                    {/* Type badge */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: isBuy ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)' }}>
                      {isBuy
                        ? <ArrowUpRight size={13} style={{ color: '#16a34a' }} />
                        : <ArrowDownRight size={13} style={{ color: '#dc2626' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-bold" style={{ color: MT }}>{tx.ticker}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                          style={{
                            background: isBuy ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)',
                            color: isBuy ? '#16a34a' : '#dc2626',
                          }}>
                          {tx.type}
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color: GT }}>{fmtDate(tx.timestamp)} · {tx.sharesTransacted.toFixed(4)} shares</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-bold" style={{ color: MT }}>
                        {sym}{isJP ? Math.round(tx.dollarAmount).toLocaleString() : tx.dollarAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center flex-1 px-12">
          <EmptyIllustration />
          <h2 className="text-[18px] font-bold mt-6 mb-2 text-center" style={{ color: MT }}>Your portfolio is empty</h2>
          <p className="text-[13px] text-center mb-8 leading-relaxed max-w-xs" style={{ color: GT }}>
            Invest in stocks to start tracking your returns and climbing the leaderboard.
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={onStartTrading}
              className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white"
              style={{ background: O }}>
              Start Trading
            </button>
            <button onClick={onLearnMore}
              className="flex-1 py-3 rounded-2xl text-[14px] font-bold"
              style={{ background: CA, color: MT }}>
              Learn More
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
