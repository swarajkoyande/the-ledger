import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Position {
  ticker: string
  shares: number
  avgCost: number
  totalInvested: number
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell'
  ticker: string
  dollarAmount: number
  sharesTransacted: number
  priceAtTime: number
  timestamp: number
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  school: string
  region: 'japan' | 'singapore' | 'india' | 'australia' | 'spain'
  club: string | null
  returnPct: number
  portfolioValue: number
}

interface PortfolioState {
  cash: number
  positions: Record<string, Position>
  transactions: Transaction[]
  leaderboard: LeaderboardEntry[]
}

type Action =
  | { type: 'BUY';  ticker: string; dollarAmount: number; currentPrice: number; stockName: string }
  | { type: 'SELL'; ticker: string; dollarAmount: number; currentPrice: number }
  | { type: 'LOAD'; state: PortfolioState }

// ─── Mock Leaderboard ────────────────────────────────────────────────────────

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'u1',  displayName: 'Yuto Nakamura',   school: 'Waseda University',       region: 'japan',     club: 'Waseda Finance Club',    returnPct: 31.4,  portfolioValue: 131400 },
  { userId: 'u2',  displayName: 'Arjun Mehta',      school: 'IIT Bombay',              region: 'india',     club: 'IIT Finance Society',    returnPct: 28.7,  portfolioValue: 128700 },
  { userId: 'u3',  displayName: 'Mei Tanaka',        school: 'Keio University',         region: 'japan',     club: 'Keio Trading Club',      returnPct: 24.1,  portfolioValue: 124100 },
  { userId: 'u4',  displayName: 'Priya Sharma',      school: 'NUS Singapore',           region: 'singapore', club: 'NUS Investment Club',    returnPct: 21.8,  portfolioValue: 121800 },
  { userId: 'u5',  displayName: 'Carlos García',     school: 'IE Business School',      region: 'spain',     club: 'IE Trading Society',     returnPct: 18.3,  portfolioValue: 118300 },
  { userId: 'u6',  displayName: 'Aisha Kaur',        school: 'Delhi University',        region: 'india',     club: null,                     returnPct: 16.9,  portfolioValue: 116900 },
  { userId: 'u7',  displayName: 'Kenji Watanabe',    school: 'Tokyo University',        region: 'japan',     club: 'UTokyo Finance',         returnPct: 14.2,  portfolioValue: 114200 },
  { userId: 'u8',  displayName: 'Sophie Chen',       school: 'UNSW Sydney',             region: 'australia', club: 'UNSW Invest Club',       returnPct: 12.5,  portfolioValue: 112500 },
  { userId: 'u9',  displayName: 'Ravi Krishnan',     school: 'IIM Ahmedabad',           region: 'india',     club: 'IIM Markets Group',      returnPct: 11.0,  portfolioValue: 111000 },
  { userId: 'u10', displayName: 'Elena Martínez',    school: 'ESADE Barcelona',         region: 'spain',     club: 'ESADE Finance Club',     returnPct: 9.7,   portfolioValue: 109700 },
  { userId: 'me',  displayName: 'You',               school: 'Your School',             region: 'japan',     club: 'The Ledger Club',        returnPct: 0,     portfolioValue: 100000 },
  { userId: 'u11', displayName: 'Hiroshi Sato',      school: 'Osaka University',        region: 'japan',     club: null,                     returnPct: 7.3,   portfolioValue: 107300 },
  { userId: 'u12', displayName: 'Liam O\'Brien',     school: 'University of Melbourne', region: 'australia', club: 'Unimelb Finance',        returnPct: 5.8,   portfolioValue: 105800 },
  { userId: 'u13', displayName: 'Nadia Rahman',      school: 'SMU Singapore',           region: 'singapore', club: 'SMU Finance Society',    returnPct: 4.1,   portfolioValue: 104100 },
  { userId: 'u14', displayName: 'Pablo Ruiz',        school: 'Universidad de Madrid',   region: 'spain',     club: null,                     returnPct: 2.4,   portfolioValue: 102400 },
  { userId: 'u15', displayName: 'Ananya Patel',      school: 'BITS Pilani',             region: 'india',     club: 'BITS FinTech Club',      returnPct: 1.1,   portfolioValue: 101100 },
  { userId: 'u16', displayName: 'Tomoko Ito',        school: 'Hitotsubashi University', region: 'japan',     club: 'Hitotsubashi Invest',    returnPct: -1.2,  portfolioValue: 98800  },
  { userId: 'u17', displayName: 'Wei Lim',           school: 'NTU Singapore',           region: 'singapore', club: 'NTU Trading Group',      returnPct: -3.4,  portfolioValue: 96600  },
  { userId: 'u18', displayName: 'Jack Morrison',     school: 'University of Sydney',    region: 'australia', club: null,                     returnPct: -5.7,  portfolioValue: 94300  },
  { userId: 'u19', displayName: 'Sanjay Verma',      school: 'IIT Delhi',               region: 'india',     club: 'IIT Delhi Markets',      returnPct: -7.9,  portfolioValue: 92100  },
]

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_STATE: PortfolioState = {
  cash: 100000,
  positions: {},
  transactions: [],
  leaderboard: MOCK_LEADERBOARD,
}

const LS_KEY = 'ledger_portfolio'

function loadFromStorage(): PortfolioState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    // Always use fresh mock leaderboard (other entries are static)
    return { ...INITIAL_STATE, ...parsed, leaderboard: MOCK_LEADERBOARD }
  } catch {
    return INITIAL_STATE
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: PortfolioState, action: Action): PortfolioState {
  switch (action.type) {
    case 'LOAD':
      return action.state

    case 'BUY': {
      const { ticker, dollarAmount, currentPrice } = action
      if (dollarAmount < 1 || dollarAmount > state.cash) return state
      const shares = dollarAmount / currentPrice
      const existing = state.positions[ticker]
      const newShares = (existing?.shares ?? 0) + shares
      const newInvested = (existing?.totalInvested ?? 0) + dollarAmount
      const position: Position = {
        ticker,
        shares: newShares,
        avgCost: newInvested / newShares,
        totalInvested: newInvested,
      }
      const tx: Transaction = {
        id: `${Date.now()}-buy-${ticker}`,
        type: 'buy',
        ticker,
        dollarAmount,
        sharesTransacted: shares,
        priceAtTime: currentPrice,
        timestamp: Date.now(),
      }
      return {
        ...state,
        cash: Math.round((state.cash - dollarAmount) * 100) / 100,
        positions: { ...state.positions, [ticker]: position },
        transactions: [tx, ...state.transactions],
      }
    }

    case 'SELL': {
      const { ticker, dollarAmount, currentPrice } = action
      const pos = state.positions[ticker]
      if (!pos) return state
      const sharesToSell = dollarAmount / currentPrice
      if (sharesToSell > pos.shares + 0.0001) return state // float tolerance
      const remainingShares = pos.shares - sharesToSell
      const tx: Transaction = {
        id: `${Date.now()}-sell-${ticker}`,
        type: 'sell',
        ticker,
        dollarAmount,
        sharesTransacted: sharesToSell,
        priceAtTime: currentPrice,
        timestamp: Date.now(),
      }
      const newPositions = { ...state.positions }
      if (remainingShares < 0.0001) {
        delete newPositions[ticker]
      } else {
        newPositions[ticker] = {
          ...pos,
          shares: remainingShares,
          totalInvested: pos.avgCost * remainingShares,
        }
      }
      return {
        ...state,
        cash: Math.round((state.cash + dollarAmount) * 100) / 100,
        positions: newPositions,
        transactions: [tx, ...state.transactions],
      }
    }

    default:
      return state
  }
}

// ─── Computed Values ──────────────────────────────────────────────────────────

export function computePortfolio(
  state: PortfolioState,
  livePrices: Record<string, number>
) {
  const positionValues = Object.values(state.positions).map(pos => {
    const price = livePrices[pos.ticker] ?? pos.avgCost
    return pos.shares * price
  })
  const totalPositionsValue = positionValues.reduce((a, b) => a + b, 0)
  const totalPortfolioValue = state.cash + totalPositionsValue
  const totalReturnDollars = totalPortfolioValue - 100000
  const totalReturnPct = (totalReturnDollars / 100000) * 100
  return { totalPortfolioValue, totalReturnDollars, totalReturnPct }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface PortfolioCtx {
  state: PortfolioState
  dispatch: React.Dispatch<Action>
}

const Ctx = createContext<PortfolioCtx | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // Load from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD', state: loadFromStorage() })
  }, [])

  // Persist every change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        cash: state.cash,
        positions: state.positions,
        transactions: state.transactions,
      }))
    } catch { /* quota exceeded — ignore */ }
  }, [state.cash, state.positions, state.transactions])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function usePortfolio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
