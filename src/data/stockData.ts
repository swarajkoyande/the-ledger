// ─── Stock Data Layer ─────────────────────────────────────────────────────────
// Mock prices based on late-2024 approximate values.
// Structure is stable — swap mock feed for fetchLivePrice when API keys are ready.

export interface Stock {
  ticker: string
  name: string
  exchange: 'TSE' | 'NYSE' | 'NASDAQ'
  region: 'japan' | 'us'
  price: number
  change: number
  changePct: number
  marketCap: string
  peRatio: number | null
  week52High: number
  week52Low: number
  priceHistory: number[]  // 90 data points
  sector: string
  isFeatured: boolean
}

// Seeded pseudo-random walk — produces consistent, realistic-looking chart shapes
function seedRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateHistory(basePrice: number, seed: number, volatility = 0.012): number[] {
  const rng = seedRandom(seed)
  const points: number[] = []
  let price = basePrice * (0.88 + rng() * 0.12) // start 8-12% below current
  for (let i = 0; i < 90; i++) {
    const drift = (rng() - 0.46) * volatility // slight upward bias
    const shock = rng() > 0.94 ? (rng() - 0.5) * volatility * 4 : 0
    price = price * (1 + drift + shock)
    points.push(Math.round(price * 100) / 100)
  }
  // Nudge last point toward basePrice so chart ends at current price
  points[89] = basePrice
  return points
}

// ─── Japan Stocks (TSE) ──────────────────────────────────────────────────────

const JAPAN_STOCKS_RAW: Omit<Stock, 'priceHistory' | 'change' | 'changePct'>[] = [
  {
    ticker: '7203.T', name: 'Toyota Motor', exchange: 'TSE', region: 'japan',
    price: 3250, marketCap: '¥52.8T', peRatio: 9.4,
    week52High: 3890, week52Low: 2185, sector: 'Automotive', isFeatured: true,
  },
  {
    ticker: '6758.T', name: 'Sony Group', exchange: 'TSE', region: 'japan',
    price: 2780, marketCap: '¥17.3T', peRatio: 17.2,
    week52High: 3230, week52Low: 2210, sector: 'Technology', isFeatured: true,
  },
  {
    ticker: '9984.T', name: 'SoftBank Group', exchange: 'TSE', region: 'japan',
    price: 8920, marketCap: '¥14.1T', peRatio: null,
    week52High: 9870, week52Low: 5980, sector: 'Telecom & Tech', isFeatured: false,
  },
  {
    ticker: '7974.T', name: 'Nintendo', exchange: 'TSE', region: 'japan',
    price: 8540, marketCap: '¥11.1T', peRatio: 22.1,
    week52High: 9450, week52Low: 6120, sector: 'Gaming', isFeatured: true,
  },
  {
    ticker: '8306.T', name: 'Mitsubishi UFJ', exchange: 'TSE', region: 'japan',
    price: 1418, marketCap: '¥19.4T', peRatio: 12.8,
    week52High: 1698, week52Low: 872, sector: 'Banking', isFeatured: false,
  },
  {
    ticker: '6861.T', name: 'Keyence', exchange: 'TSE', region: 'japan',
    price: 68400, marketCap: '¥18.7T', peRatio: 41.3,
    week52High: 72200, week52Low: 51400, sector: 'Industrial Tech', isFeatured: false,
  },
  {
    ticker: '9983.T', name: 'Fast Retailing (Uniqlo)', exchange: 'TSE', region: 'japan',
    price: 52800, marketCap: '¥16.8T', peRatio: 38.6,
    week52High: 58400, week52Low: 38200, sector: 'Retail', isFeatured: false,
  },
  {
    ticker: '8035.T', name: 'Tokyo Electron', exchange: 'TSE', region: 'japan',
    price: 24500, marketCap: '¥11.6T', peRatio: 28.9,
    week52High: 28600, week52Low: 14800, sector: 'Semiconductors', isFeatured: false,
  },
  {
    ticker: '6098.T', name: 'Recruit Holdings', exchange: 'TSE', region: 'japan',
    price: 8340, marketCap: '¥13.9T', peRatio: 33.7,
    week52High: 9210, week52Low: 6380, sector: 'HR & Tech', isFeatured: false,
  },
  {
    ticker: '4063.T', name: 'Shin-Etsu Chemical', exchange: 'TSE', region: 'japan',
    price: 5620, marketCap: '¥11.2T', peRatio: 19.4,
    week52High: 6840, week52Low: 4510, sector: 'Chemicals', isFeatured: false,
  },
]

// ─── US Stocks ───────────────────────────────────────────────────────────────

const US_STOCKS_RAW: Omit<Stock, 'priceHistory' | 'change' | 'changePct'>[] = [
  {
    ticker: 'AAPL', name: 'Apple', exchange: 'NASDAQ', region: 'us',
    price: 229.04, marketCap: '$3.5T', peRatio: 35.8,
    week52High: 237.23, week52Low: 164.08, sector: 'Technology', isFeatured: true,
  },
  {
    ticker: 'MSFT', name: 'Microsoft', exchange: 'NASDAQ', region: 'us',
    price: 415.32, marketCap: '$3.1T', peRatio: 32.4,
    week52High: 468.35, week52Low: 344.79, sector: 'Technology', isFeatured: false,
  },
  {
    ticker: 'NVDA', name: 'Nvidia', exchange: 'NASDAQ', region: 'us',
    price: 136.02, marketCap: '$3.3T', peRatio: 54.7,
    week52High: 148.88, week52Low: 47.32, sector: 'Semiconductors', isFeatured: true,
  },
  {
    ticker: 'AMZN', name: 'Amazon', exchange: 'NASDAQ', region: 'us',
    price: 198.90, marketCap: '$2.1T', peRatio: 43.2,
    week52High: 215.90, week52Low: 151.61, sector: 'E-commerce & Cloud', isFeatured: false,
  },
  {
    ticker: 'GOOGL', name: 'Alphabet', exchange: 'NASDAQ', region: 'us',
    price: 172.14, marketCap: '$2.1T', peRatio: 23.6,
    week52High: 193.31, week52Low: 130.67, sector: 'Technology', isFeatured: false,
  },
  {
    ticker: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', region: 'us',
    price: 352.56, marketCap: '$1.1T', peRatio: 119.2,
    week52High: 488.54, week52Low: 138.80, sector: 'Automotive & Energy', isFeatured: true,
  },
  {
    ticker: 'JPM', name: 'JPMorgan Chase', exchange: 'NYSE', region: 'us',
    price: 241.58, marketCap: '$695B', peRatio: 13.1,
    week52High: 254.90, week52Low: 183.75, sector: 'Banking', isFeatured: false,
  },
  {
    ticker: 'BRK.B', name: 'Berkshire Hathaway', exchange: 'NYSE', region: 'us',
    price: 455.20, marketCap: '$987B', peRatio: 23.4,
    week52High: 483.70, week52Low: 348.80, sector: 'Diversified', isFeatured: false,
  },
  {
    ticker: 'META', name: 'Meta Platforms', exchange: 'NASDAQ', region: 'us',
    price: 578.65, marketCap: '$1.5T', peRatio: 27.8,
    week52High: 638.40, week52Low: 394.78, sector: 'Social Media & Tech', isFeatured: false,
  },
  {
    ticker: 'V', name: 'Visa', exchange: 'NYSE', region: 'us',
    price: 311.40, marketCap: '$635B', peRatio: 31.2,
    week52High: 323.30, week52Low: 252.86, sector: 'Financial Services', isFeatured: false,
  },
]

// Build full stock objects with seeded price history and derived change
function buildStock(
  raw: Omit<Stock, 'priceHistory' | 'change' | 'changePct'>,
  seed: number
): Stock {
  const vol = raw.region === 'japan' ? 0.014 : 0.016
  const history = generateHistory(raw.price, seed, vol)
  const prevClose = history[88]
  const change = Math.round((raw.price - prevClose) * 100) / 100
  const changePct = Math.round((change / prevClose) * 10000) / 100
  return { ...raw, priceHistory: history, change, changePct }
}

export const JAPAN_STOCKS: Stock[] = JAPAN_STOCKS_RAW.map((s, i) => buildStock(s, 1000 + i * 37))
export const US_STOCKS: Stock[]    = US_STOCKS_RAW.map((s, i)    => buildStock(s, 2000 + i * 41))
export const ALL_STOCKS: Stock[]   = [...JAPAN_STOCKS, ...US_STOCKS]

export const FEATURED_STOCKS: Stock[] = ALL_STOCKS.filter(s => s.isFeatured)

// ─── Mock Price Feed ─────────────────────────────────────────────────────────

export function startMockPriceFeed(
  onUpdate: (updates: Record<string, { price: number; change: number; changePct: number }>) => void
): () => void {
  const tickers = ALL_STOCKS.map(s => s.ticker)
  let prices: Record<string, number> = {}
  let prevCloses: Record<string, number> = {}

  ALL_STOCKS.forEach(s => {
    prices[s.ticker]     = s.price
    prevCloses[s.ticker] = s.priceHistory[88]
  })

  const interval = setInterval(() => {
    // Pick 2-3 random stocks to update
    const shuffled = [...tickers].sort(() => Math.random() - 0.5)
    const count = 2 + Math.floor(Math.random() * 2)
    const toUpdate = shuffled.slice(0, count)

    const updates: Record<string, { price: number; change: number; changePct: number }> = {}
    toUpdate.forEach(ticker => {
      const move = (Math.random() - 0.49) * 0.008 // ±0.1% to ±0.8%
      const newPrice = Math.round(prices[ticker] * (1 + move) * 100) / 100
      prices[ticker] = newPrice
      const change = Math.round((newPrice - prevCloses[ticker]) * 100) / 100
      const changePct = Math.round((change / prevCloses[ticker]) * 10000) / 100
      updates[ticker] = { price: newPrice, change, changePct }
    })

    onUpdate(updates)
  }, 8000)

  return () => clearInterval(interval)
}

// ─── Real API stub ─────────────────────────────────────────────────────────
// Replace the mock feed with this when API keys are ready from the Lovable app.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchLivePrice(_ticker: string, _apiKey: string): Promise<number> {
  // TODO: wire up Yahoo Finance or Alpha Vantage
  // endpoint: https://query1.finance.yahoo.com/v8/finance/chart/${ticker}
  throw new Error('fetchLivePrice not yet implemented — add API key from Lovable app')
}
