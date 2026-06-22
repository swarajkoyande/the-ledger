// ─── Daily Quiz Engine ────────────────────────────────────────────────────────
// Generates a fresh 5-question set each day: 3 MCQs + 2 interactives.
// Uses the date string as a seed so every user sees the same questions daily.

export interface DailyMCQ {
  type: 'mcq'
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: string
}

export interface DailySortBuckets {
  type: 'sort-buckets'
  id: string
  prompt: string
  buckets: { id: string; label: string; emoji: string }[]
  items: { id: string; label: string; correctBucket: string }[]
  explanation: string
  topic: string
}

export interface DailyMatchPairs {
  type: 'match-pairs'
  id: string
  prompt: string
  pairs: { left: string; right: string }[]
  explanation: string
  topic: string
}

export type DailyQuestion = DailyMCQ | DailySortBuckets | DailyMatchPairs

// ─── Static question banks ───────────────────────────────────────────────────

const MCQ_BANK: Omit<DailyMCQ, 'type' | 'id'>[] = [
  { question: 'What does compound interest mean?', options: ['Interest on principal only', 'Interest on principal + previously earned interest', 'A flat fee charged monthly', 'Tax on savings'], correctIndex: 1, explanation: 'Compound interest earns returns on your returns, accelerating growth exponentially over time.', topic: 'Personal Finance' },
  { question: 'In the 50/30/20 rule, what does the 20% represent?', options: ['Wants', 'Needs', 'Savings & debt repayment', 'Entertainment'], correctIndex: 2, explanation: 'The 20% bucket covers savings and paying down debt — your future financial foundation.', topic: 'Personal Finance' },
  { question: 'A high-yield savings account (HYSA) is best used for…', options: ['Daily spending', 'Emergency fund & short-term savings', 'Long-term retirement investing', 'Business expenses'], correctIndex: 1, explanation: 'HYSAs combine FDIC safety with 4-5% APY — ideal for money you might need within 1-3 years.', topic: 'Personal Finance' },
  { question: "What is a Roth IRA's key tax advantage?", options: ['Contributions are tax-deductible', 'Withdrawals in retirement are tax-free', 'No contribution limits', 'Employer matching guaranteed'], correctIndex: 1, explanation: 'Roth IRAs use after-tax money now so all future qualified withdrawals are 100% tax-free.', topic: 'Personal Finance' },
  { question: 'Opportunity cost refers to…', options: ['The cost to buy a product', 'The value of the best alternative you give up', 'A penalty for early withdrawal', 'Sales tax on investments'], correctIndex: 1, explanation: 'Every financial decision has an opportunity cost — what you forgo by choosing one option over the next best.', topic: 'Personal Finance' },
  { question: 'What is the P/E ratio?', options: ['Profit divided by Equity', 'Price divided by Earnings per share', 'Portfolio over Expenses', 'Principal plus Earnings'], correctIndex: 1, explanation: 'The P/E ratio compares a stock\'s price to its earnings per share — a valuation benchmark.', topic: 'Markets' },
  { question: 'A limit order differs from a market order in that…', options: ['It always fills instantly', 'It executes only at your specified price or better', 'It costs more in fees', 'It can only be used for selling'], correctIndex: 1, explanation: 'Limit orders give you price control — they fill at your price or better, but may not fill at all if the market doesn\'t reach it.', topic: 'Markets' },
  { question: 'Support in technical analysis refers to…', options: ['A price where sellers overwhelm buyers', 'A price level where buying historically prevents further decline', 'A bond\'s coupon rate', 'Government subsidies for stocks'], correctIndex: 1, explanation: 'Support is a floor price level where buyer demand tends to emerge, stopping price from falling further.', topic: 'Markets' },
  { question: 'Diversification mainly reduces…', options: ['Market-wide risk', 'Company-specific (idiosyncratic) risk', 'Interest rate risk', 'Inflation risk'], correctIndex: 1, explanation: 'Spreading investments across many stocks removes company-specific risk, but can\'t eliminate broad market risk.', topic: 'Markets' },
  { question: 'EV/EBITDA is preferred over P/E because it is…', options: ['Always higher', 'Capital-structure neutral', 'Easier to compute', 'Tax-adjusted'], correctIndex: 1, explanation: 'EV/EBITDA removes the effect of different debt levels, making it a fairer comparison across companies.', topic: 'Markets' },
  { question: 'EBITDA stands for…', options: ['Earnings Before Investments, Taxes, Debt, and Amortization', 'Earnings Before Interest, Taxes, Depreciation, and Amortization', 'Equity Before Income Tax and Dividend Allocation', 'Estimated Business Income Tax and Deductions Amount'], correctIndex: 1, explanation: 'EBITDA strips out financing and accounting choices to show a company\'s core operating profitability.', topic: 'Corporate Finance' },
  { question: 'In an LBO, leverage amplifies equity returns because…', options: ['Debt is free', 'You control a large asset with a small equity check', 'Debt reduces taxes only', 'The bank takes the risk'], correctIndex: 1, explanation: 'Using 60-70% debt means any improvement in the company\'s value disproportionately benefits the equity holders.', topic: 'Private Equity' },
  { question: 'A DCF valuation calculates…', options: ['Historical accounting profits', 'The present value of future cash flows', 'Book value of assets minus liabilities', 'Revenue minus operating costs'], correctIndex: 1, explanation: 'DCF discounts projected future free cash flows back to today using WACC as the discount rate.', topic: 'Investment Banking' },
  { question: 'A "control premium" in M&A refers to…', options: ['Management salary in a takeover', 'The extra price paid above market value to acquire a controlling stake', 'Legal fees in a merger', 'Shareholder voting rights costs'], correctIndex: 1, explanation: 'Buyers pay a control premium (typically 20-40%) above market price to gain control of a target company.', topic: 'M&A' },
  { question: 'A business is "accretive" when a deal…', options: ['Lowers the acquirer\'s EPS', 'Increases the acquirer\'s EPS', 'Has zero synergies', 'Reduces revenue'], correctIndex: 1, explanation: 'Accretive means the acquisition boosts earnings per share for the acquiring company\'s shareholders.', topic: 'M&A' },
  { question: 'Net Revenue Retention (NRR) above 100% means…', options: ['You acquired more than 100 customers', 'Existing customers expand faster than they churn', 'You charged 100% more than competitors', 'No customers churned this year'], correctIndex: 1, explanation: 'NRR > 100% means the revenue base grows from expansions and upsells even with zero new customers.', topic: 'Business' },
  { question: 'In a perpetual futures contract, positive funding rates mean…', options: ['The exchange pays all traders', 'Longs pay shorts because the contract trades above spot', 'Shorts pay longs because the contract trades above spot', 'Funding is suspended for the day'], correctIndex: 1, explanation: 'Positive funding keeps the perp anchored to spot by making longs pay shorts to hold their positions.', topic: 'Trading' },
  { question: 'The 1% position sizing rule means…', options: ['You invest 1% of income per month', 'You risk no more than 1% of total capital on any single trade', 'You buy 1% of available shares only', 'Stop-losses are always set at 1%'], correctIndex: 1, explanation: 'Risking 1% per trade means 100 consecutive losses to blow up — it\'s the professional\'s survival rule.', topic: 'Trading' },
  { question: 'CAC stands for…', options: ['Capital Acquisition Cost', 'Customer Acquisition Cost', 'Compound Annual Cost', 'Credit Accumulation Charge'], correctIndex: 1, explanation: 'CAC is the total cost to acquire one customer — the key denominator in LTV/CAC unit economics.', topic: 'Business' },
  { question: 'The Fed\'s primary tool for fighting inflation is…', options: ['Printing more money', 'Raising the federal funds rate', 'Cutting corporate tax rates', 'Selling government bonds to consumers'], correctIndex: 1, explanation: 'Raising the federal funds rate increases borrowing costs economy-wide, slowing spending and reducing inflation.', topic: 'Macro' },
  { question: 'A bond trading at a discount means…', options: ['Its coupon rate is above market yield', 'Its price is below face value because its coupon is below market yield', 'It defaults soon', 'It has no maturity date'], correctIndex: 1, explanation: 'When market yields rise above a bond\'s coupon, its price falls below par to equalize returns.', topic: 'Markets' },
  { question: 'Working capital = …', options: ['Total assets minus total liabilities', 'Current assets minus current liabilities', 'Revenue minus operating costs', 'Cash plus investments'], correctIndex: 1, explanation: 'Working capital measures short-term liquidity — what\'s left from current assets after current liabilities.', topic: 'Corporate Finance' },
  { question: 'A startup\'s runway is…', options: ['Total revenue earned since founding', 'Cash balance divided by monthly net burn rate', 'The number of months since the last funding round', 'Annual recurring revenue'], correctIndex: 1, explanation: 'Runway = cash / net burn — it tells founders how long they have before raising again or reaching breakeven.', topic: 'Business' },
  { question: 'The Volcker Rule primarily restricts banks from…', options: ['Lending to small businesses', 'Proprietary trading with their own capital', 'Accepting deposits', 'Offering mortgages'], correctIndex: 1, explanation: 'The Volcker Rule (part of Dodd-Frank) prevents banks from proprietary trading to reduce systemic risk.', topic: 'Regulation' },
  { question: 'What does MOIC stand for in private equity?', options: ['Margin Over Invested Capital', 'Multiple of Invested Capital', 'Management Override Income Calculation', 'Minimum Operating Investment Constraint'], correctIndex: 1, explanation: 'MOIC measures total value returned divided by capital invested — a 3x MOIC means you tripled your money.', topic: 'Private Equity' },
]

const SORT_BUCKETS_BANK: Omit<DailySortBuckets, 'type' | 'id'>[] = [
  {
    prompt: 'Sort these financial accounts into the right bucket based on their primary purpose.',
    buckets: [
      { id: 'spend', label: 'Spending', emoji: '💳' },
      { id: 'save',  label: 'Saving',   emoji: '🏦' },
      { id: 'grow',  label: 'Investing', emoji: '📈' },
    ],
    items: [
      { id: 'i1', label: 'Checking account', correctBucket: 'spend' },
      { id: 'i2', label: 'High-yield savings account', correctBucket: 'save' },
      { id: 'i3', label: 'Roth IRA', correctBucket: 'grow' },
      { id: 'i4', label: 'Debit card account', correctBucket: 'spend' },
      { id: 'i5', label: 'S&P 500 index fund', correctBucket: 'grow' },
      { id: 'i6', label: 'Emergency fund', correctBucket: 'save' },
    ],
    explanation: 'Match the time horizon: checking/debit for daily spending, HYSA for accessible savings, and retirement/brokerage accounts for long-term growth.',
    topic: 'Personal Finance',
  },
  {
    prompt: 'Are these statements about tax brackets TRUE or FALSE?',
    buckets: [
      { id: 'true',  label: 'True',  emoji: '✅' },
      { id: 'false', label: 'False', emoji: '❌' },
    ],
    items: [
      { id: 'b1', label: 'A raise into a higher bracket taxes ALL your income at that rate', correctBucket: 'false' },
      { id: 'b2', label: 'US tax brackets are marginal — only new dollars are taxed higher', correctBucket: 'true' },
      { id: 'b3', label: 'Tax credits reduce taxable income dollar-for-dollar', correctBucket: 'false' },
      { id: 'b4', label: 'The standard deduction reduces your taxable income', correctBucket: 'true' },
    ],
    explanation: 'Marginal brackets only tax NEW income at the higher rate. Credits reduce tax OWED (more powerful than deductions, which only reduce taxable income).',
    topic: 'Taxation',
  },
  {
    prompt: 'Sort these valuation methods: are they based on MARKET DATA or INTRINSIC value?',
    buckets: [
      { id: 'market',    label: 'Market-based',  emoji: '📊' },
      { id: 'intrinsic', label: 'Intrinsic',      emoji: '🔬' },
    ],
    items: [
      { id: 'v1', label: 'DCF (Discounted Cash Flow)', correctBucket: 'intrinsic' },
      { id: 'v2', label: 'Comparable Company Analysis', correctBucket: 'market' },
      { id: 'v3', label: 'Precedent Transactions', correctBucket: 'market' },
      { id: 'v4', label: 'Sum-of-the-parts', correctBucket: 'intrinsic' },
    ],
    explanation: 'DCF and sum-of-the-parts rely on internal projections (intrinsic). Comps and precedents are anchored to what the market has actually paid.',
    topic: 'Valuation',
  },
  {
    prompt: 'Sort these startup metrics: are they LEADING (predictive) or LAGGING (outcome)?',
    buckets: [
      { id: 'leading', label: 'Leading', emoji: '🔭' },
      { id: 'lagging', label: 'Lagging', emoji: '📋' },
    ],
    items: [
      { id: 's1', label: 'D7 retention rate', correctBucket: 'leading' },
      { id: 's2', label: 'Annual revenue', correctBucket: 'lagging' },
      { id: 's3', label: 'New user sign-ups', correctBucket: 'leading' },
      { id: 's4', label: 'Net profit margin', correctBucket: 'lagging' },
      { id: 's5', label: 'NPS score', correctBucket: 'leading' },
    ],
    explanation: 'Leading metrics (retention, signups, NPS) predict future performance. Lagging metrics (revenue, profit) measure what already happened.',
    topic: 'Business',
  },
  {
    prompt: 'Sort each market order type by its key characteristic.',
    buckets: [
      { id: 'fast',  label: 'Guaranteed fill', emoji: '⚡' },
      { id: 'price', label: 'Price control',   emoji: '🎯' },
    ],
    items: [
      { id: 'o1', label: 'Market order', correctBucket: 'fast' },
      { id: 'o2', label: 'Limit order', correctBucket: 'price' },
      { id: 'o3', label: 'Stop-market order', correctBucket: 'fast' },
      { id: 'o4', label: 'Stop-limit order', correctBucket: 'price' },
    ],
    explanation: 'Market and stop-market orders guarantee execution but sacrifice price control. Limit and stop-limit orders control price but may not fill if the market doesn\'t reach the level.',
    topic: 'Trading',
  },
  {
    prompt: 'Drop each feature into the correct business model type.',
    buckets: [
      { id: 'saas', label: 'SaaS', emoji: '☁️' },
      { id: 'mkt',  label: 'Marketplace', emoji: '🛒' },
      { id: 'ads',  label: 'Advertising', emoji: '📢' },
    ],
    items: [
      { id: 'm1', label: 'Monthly recurring revenue', correctBucket: 'saas' },
      { id: 'm2', label: 'Take-rate on gross merchandise value', correctBucket: 'mkt' },
      { id: 'm3', label: 'Revenue per thousand impressions (CPM)', correctBucket: 'ads' },
      { id: 'm4', label: 'Annual subscription + seat-based pricing', correctBucket: 'saas' },
      { id: 'm5', label: 'Network effects between buyers and sellers', correctBucket: 'mkt' },
    ],
    explanation: 'SaaS earns subscriptions; marketplaces earn a % of transactions (GMV); ad-based models earn from impressions and clicks on free-to-use platforms.',
    topic: 'Business',
  },
]

const MATCH_PAIRS_BANK: Omit<DailyMatchPairs, 'type' | 'id'>[] = [
  {
    prompt: 'Match each financial term to its definition.',
    pairs: [
      { left: 'EBITDA', right: 'Earnings before interest, taxes, depreciation & amortization' },
      { left: 'WACC', right: 'Blended cost of debt and equity used to discount cash flows' },
      { left: 'DCF', right: 'Valuation method using discounted future free cash flows' },
      { left: 'EV', right: 'Total company value including debt and minus cash' },
    ],
    explanation: 'These four concepts are the core language of corporate valuation — mastering them unlocks financial modelling and M&A analysis.',
    topic: 'Corporate Finance',
  },
  {
    prompt: 'Match each account type to its defining feature.',
    pairs: [
      { left: 'Checking', right: 'Built for daily transactions and bill pay' },
      { left: 'HYSA', right: 'Earns 4-5% APY — ideal for emergency funds' },
      { left: 'Roth IRA', right: 'Tax-free withdrawals in retirement' },
      { left: '401(k)', right: 'Employer-sponsored, pre-tax contributions with IRS limits' },
    ],
    explanation: 'Different accounts serve different financial jobs — matching each to its primary purpose is the first step in smart money management.',
    topic: 'Personal Finance',
  },
  {
    prompt: 'Match each trading concept to its correct description.',
    pairs: [
      { left: 'Support', right: 'A price floor where buying interest historically emerges' },
      { left: 'Resistance', right: 'A price ceiling where selling pressure caps advances' },
      { left: 'Golden cross', right: '50-day MA crosses above the 200-day MA — bullish signal' },
      { left: 'RSI > 70', right: 'Overbought condition — potential reversal warning' },
    ],
    explanation: 'Technical analysis uses these reference points to identify high-probability entries and exits with defined risk-reward ratios.',
    topic: 'Markets',
  },
  {
    prompt: 'Match each startup stage to the investor type that leads it.',
    pairs: [
      { left: 'Pre-seed', right: 'Angels and friends & family' },
      { left: 'Seed', right: 'Micro-VCs and angel syndicates' },
      { left: 'Series A', right: 'Institutional VC firms, product-market fit proven' },
      { left: 'Series B+', right: 'Growth equity and crossover funds' },
    ],
    explanation: 'Each funding stage has different metrics requirements and investor types — understanding this ladder shapes how founders should pitch and time their raises.',
    topic: 'Business',
  },
  {
    prompt: 'Match each PE / M&A concept to its definition.',
    pairs: [
      { left: 'MOIC', right: 'Total exit value divided by invested capital' },
      { left: 'IRR', right: 'Annualized rate of return accounting for timing of cash flows' },
      { left: 'Control premium', right: 'Extra price paid above market to gain a majority stake' },
      { left: 'Carried interest', right: 'GP\'s 20% share of profits above the hurdle rate' },
    ],
    explanation: 'These terms define how PE firms measure and share returns — essential vocabulary for anyone working in or investing in private markets.',
    topic: 'Private Equity',
  },
  {
    prompt: 'Match each leverage trading concept to its meaning.',
    pairs: [
      { left: 'Funding rate', right: 'Periodic payment between longs and shorts to anchor perp to spot' },
      { left: 'Mark price', right: 'Manipulation-resistant price used to calculate liquidations' },
      { left: 'Isolated margin', right: 'Risk capped to the margin allocated to one position only' },
      { left: 'Cascade liquidation', right: 'Chain reaction of forced position closures amplifying price moves' },
    ],
    explanation: 'Understanding these mechanics is essential before using leverage — each concept protects or threatens your capital in specific ways.',
    topic: 'Trading',
  },
]

// ─── Seeded pseudo-random ────────────────────────────────────────────────────

function seededRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  let s = h
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5
    return ((s >>> 0) / 0x100000000)
  }
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Daily quiz generator ────────────────────────────────────────────────────

export const DAILY_QUIZ_LS_KEY = 'ledger_daily_quiz'

export interface DailyQuizState {
  date: string
  questions: DailyQuestion[]
  answers: Record<string, boolean>   // questionId → correct
  completed: boolean
  xpEarned: number
}

export function getTodayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function generateDailyQuestions(dateKey: string): DailyQuestion[] {
  const rng = seededRandom(dateKey)

  const shuffledMCQ     = seededShuffle(MCQ_BANK, rng)
  const shuffledSort    = seededShuffle(SORT_BUCKETS_BANK, rng)
  const shuffledMatch   = seededShuffle(MATCH_PAIRS_BANK, rng)

  // 3 MCQs + 1 sort-buckets + 1 match-pairs, interleaved
  const mcqs: DailyMCQ[] = shuffledMCQ.slice(0, 3).map((q, i) => ({
    type: 'mcq', id: `dq-mcq-${i}`, ...q,
  }))

  const sort: DailySortBuckets = {
    type: 'sort-buckets', id: 'dq-sort-0',
    ...shuffledSort[0],
    // shuffle the items deterministically
    items: seededShuffle(shuffledSort[0].items, rng),
  }

  const match: DailyMatchPairs = {
    type: 'match-pairs', id: 'dq-match-0',
    ...shuffledMatch[0],
    // shuffle right-side definitions
    pairs: shuffledMatch[0].pairs.map(p => p), // order kept; right side is shuffled in component
  }

  // Interleave: MCQ, MCQ, Sort, MCQ, Match
  return [mcqs[0], mcqs[1], sort, mcqs[2], match]
}

export function loadDailyQuizState(): DailyQuizState {
  const today = getTodayKey()
  try {
    const raw = localStorage.getItem(DAILY_QUIZ_LS_KEY)
    if (raw) {
      const saved: DailyQuizState = JSON.parse(raw)
      if (saved.date === today) return saved
    }
  } catch {}
  // Fresh quiz for today
  return {
    date: today,
    questions: generateDailyQuestions(today),
    answers: {},
    completed: false,
    xpEarned: 0,
  }
}

export function saveDailyQuizState(state: DailyQuizState) {
  localStorage.setItem(DAILY_QUIZ_LS_KEY, JSON.stringify(state))
}
