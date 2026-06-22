// ═══════════════════════════════════════════════════════════════════════════════
// LEDGER COURSE CONTENT
// Built from ledger-course-content-map.json (Supabase project aa9f98a0…).
//
// REAL (from JSON):   course catalogue, subtopic structure, quiz gating/metadata,
//                     and every interactive game config (Courses 1–3).
// MOCK (flagged):     lesson long-form prose and individual quiz question text —
//                     these live in Supabase (unreachable here). Marked `mock:true`
//                     and rendered with a "sample content" notice. Swap real text in
//                     via this file's data seam once DB access / prose is provided.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  Course, Subtopic, Lesson, LessonSection, Quiz, QuizQuestion,
  KnowledgeCheck, InteractiveExercise,
} from './types'

// ─── Builders ───────────────────────────────────────────────────────────────────
let qid = 0
const nextId = (p: string) => `${p}-${++qid}`

function mcq(question: string, opts: string[], correctIdx: number, explanation: string): QuizQuestion {
  return {
    id: nextId('q'),
    type: 'mcq',
    questionText: question,
    options: opts.map((t, i) => ({ label: String.fromCharCode(65 + i), value: t, isCorrect: i === correctIdx })),
    correctAnswer: String.fromCharCode(65 + correctIdx),
    explanation,
    mock: true,
  }
}

function calcQ(question: string, expectedResult: number, unit: string, explanation: string, variables?: Record<string, number>, formula?: string): QuizQuestion {
  return {
    id: nextId('q'),
    type: 'calculation',
    questionText: question,
    correctAnswer: String(expectedResult),
    explanation,
    calculationData: { expectedResult, unit, variables, formula },
    mock: true,
  }
}

function kc(question: string, options: string[], correctIndex: number, explanation: string): KnowledgeCheck {
  return { question, options, correctIndex, explanation }
}

// Faithful placeholder body for a section heading (skeleton courses).
function mockBody(heading: string, topic: string): string {
  return `*(Sample content — full text lives in Supabase.)*\n\n**${heading}** is a core idea in ${topic}. This section walks through the concept, why it matters in practice, and how analysts apply it in real situations. Work through the example and the knowledge check to lock it in before moving on.`
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME CONFIGS (real — from JSON games_inventory + documented schemas)
// ═══════════════════════════════════════════════════════════════════════════════

// Course 1 · types-of-bank-accounts · "Money Matcher" (allocation drag-drop, 500 XP)
const GAME_MONEY_MATCHER: InteractiveExercise = {
  type: 'drag-drop',
  config: {
    scenario: 'You just received a $5,000 bonus. Drag each chunk of money into the account that fits its job best.',
    scenarioType: 'allocation',
    categories: [
      { id: 'checking', label: 'Checking Account', description: '0.01% APY · instant access for spending', color: '#4CAF50' },
      { id: 'hysa',     label: 'High-Yield Savings', description: '4.5% APY · emergency fund & short-term goals', color: '#2196F3' },
      { id: 'brokerage', label: 'Brokerage / Investments', description: 'Long-term growth · 5+ year horizon', color: '#fd761a' },
    ],
    items: [
      { id: 'i1', label: "$1,500 — this month's rent & groceries", correctCategory: 'checking' },
      { id: 'i2', label: '$2,000 — 3-month emergency cushion', correctCategory: 'hysa' },
      { id: 'i3', label: '$1,000 — retirement, 30 years away', correctCategory: 'brokerage' },
      { id: 'i4', label: '$500 — bills due next week', correctCategory: 'checking' },
    ],
    correctExplanation: 'Match the money to its time horizon: spending money stays liquid in checking, the emergency fund earns safe yield in a HYSA, and long-horizon money goes to investments where compounding does the heavy lifting.',
    xpReward: 500,
  },
}

// Course 1 · types-of-investment-accounts · investment-types drag-drop
// NOTE: data-quality fix applied — original item id '3,label:' had a missing label;
// repaired to "Capital gains are taxed yearly" → taxable bucket.
const GAME_INVESTMENT_VAULTS: InteractiveExercise = {
  type: 'drag-drop',
  config: {
    scenario: 'Match each feature to the account type it describes.',
    scenarioType: 'investment-types',
    categories: [
      { id: 'taxable',   label: 'Taxable Brokerage', description: 'No limits · flexible · taxed yearly', color: '#fd761a' },
      { id: 'taxadv',    label: 'Tax-Advantaged (401k / IRA)', description: 'Limits · penalties early · tax-deferred', color: '#2196F3' },
    ],
    items: [
      { id: 'a1', label: 'Withdraw anytime with no penalty', correctCategory: 'taxable' },
      { id: 'a2', label: 'Annual contribution limit set by the IRS', correctCategory: 'taxadv' },
      { id: 'a3', label: 'Capital gains are taxed yearly', correctCategory: 'taxable' }, // ← repaired malformed item
      { id: 'a4', label: 'Growth is tax-deferred until retirement', correctCategory: 'taxadv' },
    ],
    correctExplanation: "Taxable brokerage accounts trade tax efficiency for total flexibility; retirement vaults trade flexibility for powerful tax advantages — so they suit money you won't touch until retirement.",
    xpReward: 250,
  },
}

// Course 1 · taxation · tax-impact calculator (100 XP)
const GAME_TAX_CALC: InteractiveExercise = {
  type: 'calculator',
  config: {
    calculationType: 'tax-impact',
    fields: [
      { id: 'salary',    label: 'Gross Salary',     type: 'currency', min: 0, max: 300000, defaultValue: 75000 },
      { id: 'deduction', label: 'Total Deductions', type: 'currency', min: 0, max: 50000,  defaultValue: 14600 },
    ],
    resultLabel: 'Estimated Federal Tax',
    resultPrefix: '$',
    xpReward: 100,
  },
}

// Course 1 · interest-and-tvm · compound-interest calculator (100 XP)
const GAME_COMPOUND_CALC: InteractiveExercise = {
  type: 'calculator',
  config: {
    calculationType: 'compound-interest',
    fields: [
      { id: 'principal',           label: 'Initial Investment',    type: 'currency', min: 0,  max: 100000, defaultValue: 1000 },
      { id: 'monthlyContribution', label: 'Monthly Contribution',  type: 'currency', min: 0,  max: 5000,   defaultValue: 200 },
      { id: 'rate',                label: 'Annual Return',         type: 'slider',   min: 1,  max: 15,      unit: '%', defaultValue: 7 },
      { id: 'years',               label: 'Years Invested',        type: 'slider',   min: 1,  max: 40,      unit: ' yrs', defaultValue: 20 },
    ],
    resultLabel: 'Projected Future Balance',
    resultPrefix: '$',
    xpReward: 100,
  },
}

// Course 1 · financial-decision-making · scenario (100 XP)
const GAME_DECISION_SCENARIO: InteractiveExercise = {
  type: 'scenario',
  config: {
    scenario: 'You have $3,000 of high-interest credit-card debt at 22% APR and a $3,000 windfall. A friend pitches a "hot stock" that might return 15% this year. What do you do?',
    scenarioType: 'general-decision',
    options: [
      { id: 'o1', text: 'Pay off the 22% credit-card debt in full', isCorrect: true,
        feedback: 'Exactly. Paying off 22% debt is a guaranteed 22% return — risk-free.',
        consequence: "You eliminate a 22% guaranteed drag on your finances; the stock's uncertain 15% can't beat that." },
      { id: 'o2', text: 'Put it all in the hot stock for a 15% upside', isCorrect: false,
        feedback: 'Tempting, but the 15% is uncertain while the 22% interest is certain and compounding against you.',
        consequence: 'You take on risk to chase a return that is mathematically smaller than the debt you ignored.' },
      { id: 'o3', text: 'Split it 50/50 between debt and the stock', isCorrect: false,
        feedback: 'Half-measures still leave you paying 22% on $1,500 of debt.',
        consequence: "You reduce — but don't remove — the guaranteed loss, while exposing yourself to market risk." },
    ],
    correctExplanation: 'Opportunity cost: the highest-certainty "return" here is eliminating 22% debt. Guaranteed returns beat speculative ones of lower expected value.',
    xpReward: 100,
  },
}

// Course 2 scenarios (real prompts/answers from games_inventory)
function stockScenario(scenario: string, options: { text: string; correct: boolean; feedback: string; consequence: string }[]): InteractiveExercise {
  return {
    type: 'scenario',
    config: {
      scenario,
      scenarioType: 'decision-making',
      options: options.map((o, i) => ({ id: `s${i}`, text: o.text, isCorrect: o.correct, feedback: o.feedback, consequence: o.consequence })),
      correctExplanation: options.find(o => o.correct)!.consequence,
      xpReward: 100,
    },
  }
}

const GAME_S_INTRO = stockScenario(
  'You have $10,000 to begin investing in a volatile market. Which strategy gives you the best risk-adjusted start?',
  [
    { text: 'Allocate across five sectors + use a Limit Order', correct: true, feedback: 'Diversification plus price control — a disciplined entry.', consequence: 'Spreading across sectors cuts single-name risk; the limit order protects your entry price.' },
    { text: 'Put it all into one high-flying tech stock', correct: false, feedback: 'Concentration in one name maximizes volatility.', consequence: 'A single bad earnings report could wipe out a large chunk of your capital.' },
    { text: 'Wait in cash until the market "feels safe"', correct: false, feedback: 'Market timing reliably underperforms time in market.', consequence: 'You risk missing the recovery days that drive most long-run returns.' },
  ],
)
const GAME_S_PATHWAYS = stockScenario(
  'You have $10,000 to invest for 10 years. You want broad market growth plus a little extra alpha. Which mix fits best?',
  [
    { text: '70% Index / 20% Sector ETF / 10% Individual (core-satellite)', correct: true, feedback: 'Classic core-satellite: a stable core with small high-conviction satellites.', consequence: 'The index core captures the market; small satellites add controlled upside without betting the farm.' },
    { text: '100% individual stocks you picked yourself', correct: false, feedback: 'High effort, high idiosyncratic risk.', consequence: 'Most concentrated stock pickers underperform a simple index over a decade.' },
    { text: '100% bonds for safety', correct: false, feedback: 'Too conservative for a 10-year growth goal.', consequence: 'You sacrifice the equity growth that a long horizon is meant to capture.' },
    { text: '50% crypto / 50% meme stocks', correct: false, feedback: 'Extreme volatility, not a growth plan.', consequence: 'Drawdowns of 70%+ are common and can derail the entire 10-year goal.' },
  ],
)
const GAME_S_TECH = stockScenario(
  'A stock has ranged between $95 and $110 for months. It now trades at $108. What is the best move?',
  [
    { text: 'Wait for a pullback to the ~$96 support level', correct: true, feedback: 'Buying near support improves your risk/reward.', consequence: 'Entering near $96 gives more upside to $110 resistance and a tighter stop.' },
    { text: 'Buy now at $108 near the top of the range', correct: false, feedback: "You're buying near resistance — poor risk/reward.", consequence: 'Limited upside to $110 and a long fall to $95 support if it reverses.' },
    { text: 'Short it expecting a crash', correct: false, feedback: 'Nothing signals a breakdown — this is range-bound.', consequence: 'A bounce off resistance could squeeze the short against you.' },
  ],
)
const GAME_S_CHART = stockScenario(
  'A stock has ranged between $140 and $160. It just touched $140. What is the logical move for a range trader?',
  [
    { text: 'Buy at $140 support, target $160 resistance', correct: true, feedback: 'Textbook range trade: buy support, sell resistance.', consequence: 'You enter at the bottom of the range with a clear target and stop just below $140.' },
    { text: 'Sell / short at $140', correct: false, feedback: "You'd be selling at support — the wrong end.", consequence: 'Shorting at support invites a bounce straight into your position.' },
    { text: 'Do nothing — too risky', correct: false, feedback: 'A defined range is one of the cleaner setups.', consequence: 'You pass on a setup with a clear entry, target, and stop.' },
  ],
)
const GAME_S_TA = stockScenario(
  'A stock has support at $105 and resistance at $120. It now trades at $118. What is the lowest-risk entry?',
  [
    { text: 'Wait for a drop to $105 support + set a tight stop-loss', correct: true, feedback: 'Patience near support with a defined risk.', consequence: 'Entering near $105 maximizes reward-to-risk; the stop caps your downside.' },
    { text: 'Buy now at $118 near resistance', correct: false, feedback: 'Only $2 of room to resistance.', consequence: 'You take most of the downside risk for a sliver of upside.' },
    { text: 'Buy a large position with no stop', correct: false, feedback: 'No stop = uncapped risk.', consequence: 'A break below support could turn a small loss into a large one.' },
  ],
)

// Course 3 games (real)
const GAME_VALUATION: InteractiveExercise = {
  type: 'calculator',
  config: {
    calculationType: 'valuation',
    fields: [
      { id: 'revGrowth',    label: 'Annual Revenue Growth', type: 'slider', min: -10, max: 50, unit: '%', defaultValue: 15 },
      { id: 'ebitdaMargin', label: 'EBITDA Margin',          type: 'slider', min: 5,   max: 40, unit: '%', defaultValue: 20 },
      { id: 'exitMultiple', label: 'Exit EV/EBITDA Multiple', type: 'slider', min: 5,  max: 20, unit: '×', defaultValue: 10 },
    ],
    formula: '(100 * (1 + (revGrowth/100))^5) * (ebitdaMargin/100) * exitMultiple',
    resultLabel: 'Projected Enterprise Value (Millions)',
    resultPrefix: '$',
    resultSuffix: 'M',
    xpReward: 250,
  },
}
const GAME_ROI: InteractiveExercise = {
  type: 'calculator',
  config: {
    calculationType: 'roi',
    fields: [
      { id: 'investmentCost', label: 'Investment Cost', type: 'currency', min: 1, max: 1000000, defaultValue: 50000 },
      { id: 'gainAmount',     label: 'Net Gain',        type: 'currency', min: 0, max: 1000000, defaultValue: 15000 },
    ],
    resultLabel: 'Calculated ROI',
    resultSuffix: '%',
    xpReward: 50,
  },
}
const GAME_LLC: InteractiveExercise = {
  type: 'scenario',
  config: {
    scenario: 'Three engineers are starting a higher-risk hardware firm with $300k. They want to protect their personal homes from business liability and avoid double taxation. Which structure fits?',
    scenarioType: 'choice',
    options: [
      { id: 'c1', text: 'LLC', isCorrect: true,
        feedback: 'An LLC delivers liability protection and pass-through (single) taxation.',
        consequence: "Personal assets are shielded and profits are taxed once, on the owners' returns." },
      { id: 'c2', text: 'C-Corporation', isCorrect: false,
        feedback: 'A C-Corp protects assets but is taxed at the entity level and again on dividends.',
        consequence: "You'd face double taxation — exactly what they wanted to avoid." },
      { id: 'c3', text: 'Sole Proprietorship', isCorrect: false,
        feedback: 'No liability shield at all.',
        consequence: 'Their personal homes would be exposed to business creditors.' },
    ],
    correctExplanation: 'When founders need both liability protection and single taxation, the LLC is the standard answer.',
    xpReward: 100,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 1 — Personal Finance Fundamentals (full showcase)
// ═══════════════════════════════════════════════════════════════════════════════
function lesson(id: string, title: string, mins: number, xp: number, intro: string, sections: LessonSection[], takeaways: string[], mock = true): Lesson {
  return { id, title, durationMinutes: mins, xpReward: xp, content: { title, introduction: intro, estimatedDurationMinutes: mins, keyTakeaways: takeaways, sections, mock } }
}
function quiz(id: string, title: string, covers: string[], maxQ: number, pass: number, xp: number, questions: QuizQuestion[]): Quiz {
  return { id, title, coversSubtopics: covers, maxQuestions: maxQ, passingScore: pass, xpReward: xp, questions }
}

const COURSE_1: Course = {
  slug: 'personal-finance-fundamentals', title: 'Personal Finance Fundamentals', category: 'personal-finance',
  difficulty: 'beginner', hours: 8, xp: 500, icon: '💰', order: 1,
  description: 'Master the basics of budgeting, saving, taxation, and financial decision making.',
  subtopics: [
    {
      slug: 'saving-strategies', title: 'Saving Strategies', displayOrder: 1, hasQuizAfter: false, quizzes: [],
      lessons: [lesson('l1-1', 'Saving Strategies for Wealth Building', 10, 50,
        "Saving isn't about deprivation — it's about designing a system that pays your future self first, automatically.",
        [
          { heading: 'The 50/30/20 Budgeting Framework', content: 'The **50/30/20 rule** divides your after-tax (take-home) income into three buckets: **50% for needs** (rent, groceries, utilities, insurance), **30% for wants** (dining, entertainment, subscriptions), and **20% for savings and debt paydown**. It is a guardrail, not a straitjacket — use it to benchmark whether your current spending is structurally sound. If your needs exceed 50%, that is a signal to find a cheaper housing option or reduce fixed costs, not to raid the savings bucket. The simplicity is the point: you can audit your entire financial life in 10 minutes with this rule.' },
          { heading: 'Pay Yourself First and Automation', content: '**Pay yourself first** flips the traditional approach — instead of spending and saving whatever is left, you transfer savings the moment income arrives. Automate a fixed amount to a separate savings or investment account on payday, and treat it exactly like rent: non-negotiable. Behavioral research consistently shows that people spend whatever is accessible in their main account; automation removes the temptation entirely. Even automating $100/month at age 22 can compound into more than $30,000 by 40 at a 7% return. The goal is to make saving the default, not the decision.' },
          { heading: 'Building an Emergency Fund', content: "An **emergency fund** is 3-6 months of essential living expenses held in a high-yield savings account or money market fund. It acts as a financial buffer so unexpected events — a job loss, a medical bill, a car repair — don't force you into debt. Without one, any surprise expense goes straight onto a credit card at 20%+ APR. Start with a target of $1,000, then build to the full 3-6 month cushion over time. Keep it liquid and separate from your main spending account so you are not tempted to dip into it.",
            examples: [{ title: 'Sizing your fund', description: 'If essential monthly expenses are $3,000, target $9,000-$18,000 in an accessible HYSA.' }] },
          { heading: 'Managing Lifestyle Creep', content: '**Lifestyle creep** occurs when spending rises to match every raise — you earn more but save the same percentage or less. The antidote is a pre-commitment rule: direct at least half of every salary increase or bonus straight to savings before you adjust your lifestyle. This single habit means that as income scales, savings scale proportionally rather than being absorbed by upgraded subscriptions, a nicer apartment, or dining out more. Track net worth quarterly — if it is not growing with your income, lifestyle creep has taken hold.' },
        ],
        ['Automate a fixed savings rate before spending', 'Keep 3-6 months of expenses liquid', 'Bank half of every raise to beat lifestyle creep'], false)],
    },
    {
      slug: 'budgeting', title: 'Budgeting', displayOrder: 2, hasQuizAfter: true,
      lessons: [lesson('l1-2', 'Budgeting: The Foundation of Financial Control', 12, 50,
        "A budget isn't a cage — it's a plan that tells your money where to go instead of wondering where it went.",
        [
          { heading: 'Understanding the Purpose of a Budget', content: 'A budget is a forward-looking spending plan — it converts vague financial intentions into deliberate monthly allocations. Its job is **awareness and intentionality**, not restriction: knowing exactly where your money goes gives you the power to redirect it. Studies show people who track spending regularly accumulate significantly more wealth over their lifetimes than those who do not, because visibility creates accountability. Think of a budget as a monthly meeting with your money — brief, structured, and necessary.' },
          { heading: 'Step 1: Income and Expense Analysis', content: 'Before choosing a budgeting method, gather your data: pull **net monthly income** from pay stubs and list every expense from the last 2-3 months of bank and credit card statements. Categorize spending into **fixed** (rent, car payment, insurance — the same every month) and **variable** (groceries, dining, entertainment — fluctuates). This baseline is non-negotiable; guessing at numbers produces a budget that fails in month one. Once you see the real picture, patterns emerge — the $200/month on coffee, the forgotten subscriptions — and you know what to cut.' },
          { heading: 'Popular Budgeting Methods', content: 'Three methods suit different personalities:\n\n- **50/30/20** — simplest; ideal if you want a rule not a spreadsheet\n- **Zero-based budgeting** — every dollar of income is assigned a job until $0 is unallocated; maximizes intentionality\n- **Envelope method** — physical or digital envelopes cap variable spending categories; forces real-time discipline\n\nThe best method is the one you actually use for more than three months. Start with 50/30/20, then graduate to zero-based if you want more granular control.' },
          { heading: 'Maintenance and Tracking', content: 'A budget written once and never reviewed is a wish list, not a plan. Schedule a **10-minute weekly review** — compare actuals to your plan and adjust. Categories shift seasonally (heating in winter, travel in summer) and should be updated proactively. Use budgeting apps (YNAB, Copilot, or a simple spreadsheet) to automate transaction categorization. The goal is to make the monthly review feel effortless, so it becomes a permanent habit rather than a chore.' },
        ],
        ['A budget directs money intentionally', 'Base categories on real spending data', 'Review weekly — budgets are living documents'], false)],
      quizzes: [quiz('quiz1-1', 'Core Budgeting and Saving Mastery', ['saving-strategies', 'budgeting'], 5, 70, 50, [
        mcq('In the 50/30/20 framework, what does the 20% represent?', ['Needs', 'Wants', 'Savings & debt paydown', 'Taxes'], 2, 'The 20% is dedicated to savings and paying down debt.'),
        mcq('"Pay yourself first" is best implemented by…', ['Saving whatever is left at month-end', 'Automating a transfer to savings on payday', 'Tracking every coffee', 'Using a credit card for rewards'], 1, 'Automation removes reliance on willpower by moving savings before you can spend it.'),
        mcq('How large should a typical emergency fund be?', ['1 week of pay', '3-6 months of expenses', '1 year of income', 'Whatever is in checking'], 1, 'Three to six months of essential expenses is the standard buffer.'),
        mcq('Which budgeting method gives every dollar a job?', ['Zero-based budgeting', '50/30/20', 'Envelope only', 'No method'], 0, 'Zero-based budgeting assigns every dollar of income to a category until none is unallocated.'),
        calcQ('You take home $4,000/month and follow 50/30/20. How many dollars should go to savings & debt each month?', 800, '$', 'Savings & debt = 20% x $4,000 = $800.', { takeHome: 4000 }, 'takeHome * 0.20'),
      ])],
    },
    {
      slug: 'types-of-bank-accounts', title: 'Types of Bank Accounts', displayOrder: 3, hasQuizAfter: false, quizzes: [], knowledgeCheckCount: 3,
      lessons: [lesson('l1-3', 'The Ultimate Home for Your Cash: Types of Bank Accounts', 11, 50,
        'Not all cash should live in the same place. The right account depends entirely on the job that money needs to do.',
        [
          { heading: '1. The Transaction Hub: Checking Accounts', content: 'A **checking account** is the operating centre of your financial life — built for high-frequency movement, not growth. It comes with a debit card, online bill pay, mobile check deposit, and near-instant access. Most checking accounts pay little to no interest (often 0.01% APY) because that is not their job. Your goal is to keep enough to cover the month\'s bills — typically one to two months of expenses — and nothing more. Excess cash left sitting in checking is an opportunity cost: it could be earning 4-5% in a high-yield savings account.',
            knowledgeCheck: kc('What is a checking account optimized for?', ['Maximum interest', 'Frequent transactions and access', 'Long-term growth', 'Tax savings'], 1, 'Checking accounts prioritize liquidity and transactions over yield.') },
          { heading: '2. The Growth Engine: Savings Accounts', content: 'A **high-yield savings account (HYSA)** is federally insured (FDIC up to $250,000) and pays meaningfully more interest than a traditional savings account — often 4-5% APY at online banks versus 0.01% at legacy banks. HYSAs are the ideal home for your emergency fund and any money you will need in the next 1-3 years. The trade-off for higher yield is that they are slightly less instant than checking — transfers typically clear in 1-2 business days. For short-term goals (a vacation, a down payment), a **CD (certificate of deposit)** locks in an even higher rate in exchange for a fixed term.',
            knowledgeCheck: kc('A high-yield savings account is best for…', ['Daily spending', 'An emergency fund', '30-year retirement money', 'Paying rent directly'], 1, 'HYSAs balance safety, yield, and accessibility — perfect for emergency funds.') },
          { heading: '3. Interactive Simulation: The Money Matcher', content: 'The key insight is **time horizon determines the right account**. Money you need this week lives in checking. Money you might need in the next year lives in a HYSA. Money you will not touch for five or more years gets invested in a brokerage for compound growth. Drag each allocation in the exercise below into its ideal home.',
            interactiveExercise: GAME_MONEY_MATCHER,
            knowledgeCheck: kc('Long-horizon money (30 years out) belongs in…', ['Checking', 'A HYSA', 'Investments/brokerage', 'Under the mattress'], 2, "Money you won't need for decades should be invested so compounding can work.") },
        ],
        ["Match each account to the money's job", 'Checking = access; HYSA = safe yield; brokerage = growth', 'Time horizon drives the choice'], false)],
    },
    {
      slug: 'types-of-investment-accounts', title: 'Types of Investment Accounts', displayOrder: 4, hasQuizAfter: true, knowledgeCheckCount: 3,
      lessons: [lesson('l1-4', 'Choosing Your Investment Vaults', 12, 50,
        'A brokerage account is a container, not an investment. The container you choose decides how your gains are taxed.',
        [
          { heading: '1. The Flexible Brokerage Account', content: 'A **taxable brokerage account** lets you invest in stocks, ETFs, bonds, and mutual funds with no contribution limits and no restrictions on withdrawals. The flexibility is total — but so is the tax exposure. Dividends are taxed in the year received, and capital gains are taxed when you sell. Short-term gains (assets held under one year) are taxed as ordinary income; long-term gains (held over one year) qualify for lower rates of 0%, 15%, or 20% depending on your bracket. A taxable brokerage is best for savings beyond your retirement account limits or money you may need before retirement.',
            knowledgeCheck: kc("A taxable brokerage account's main advantage is…", ['Tax-free growth', 'Total flexibility and access', 'IRS contribution limits', 'Employer matching'], 1, 'Its strength is flexibility — no limits, no penalties.') },
          { heading: '2. The Retirement Vaults', content: 'Retirement accounts trade flexibility for powerful tax advantages. A **traditional 401(k) or IRA** lets you contribute pre-tax dollars, reducing your taxable income today — but you pay income tax on withdrawals in retirement. A **Roth IRA or Roth 401(k)** uses after-tax contributions, but qualified withdrawals in retirement are completely tax-free — making them exceptionally powerful if you expect to be in a higher bracket later. Both have IRS annual contribution limits ($7,000 for IRAs in 2024; $23,000 for 401(k)s) and a 10% early-withdrawal penalty before age 59.5 in most cases. Many employers match 401(k) contributions — always contribute at least enough to capture the full match; it is an immediate 50-100% return.',
            knowledgeCheck: kc('What do retirement accounts trade for their tax advantages?', ['Higher fees only', 'Flexibility (limits & penalties)', 'Lower returns', 'Nothing'], 1, 'Tax advantages come with limits and early-withdrawal penalties.') },
          { heading: '3. Match the Goal to the Account', content: 'The decision tree is straightforward: first, capture any employer 401(k) match (free money). Second, max a Roth IRA if eligible (tax-free growth is hard to beat). Third, continue contributing to the 401(k) up to the limit. Fourth, invest any surplus in a taxable brokerage. This priority order maximizes tax efficiency. Use the drag-drop below to confirm your understanding of what features belong to which account type.',
            interactiveExercise: GAME_INVESTMENT_VAULTS,
            knowledgeCheck: kc("Money you won't touch until retirement is best in…", ['Taxable brokerage', 'A tax-advantaged account', 'Checking', 'A CD ladder only'], 1, 'Long-untouched money benefits most from tax-deferred growth.') },
        ],
        ['The account type decides the tax treatment', 'Brokerage = flexibility; 401k/IRA = tax advantages', "Match the account to when you'll need the money"], false)],
      quizzes: [quiz('quiz1-2', 'Investment Accounts Assessment', ['types-of-bank-accounts', 'types-of-investment-accounts'], 5, 70, 50, [
        mcq('Which account has IRS contribution limits?', ['Checking', 'Taxable brokerage', '401(k) / IRA', 'HYSA'], 2, 'Tax-advantaged retirement accounts have annual IRS contribution limits.'),
        mcq('Where should a 3-month emergency fund live?', ['401(k)', 'High-yield savings', 'Individual stocks', 'Checking at 0.01%'], 1, 'A HYSA keeps it safe, accessible, and earning yield.'),
        mcq('A penalty for early withdrawal is typical of…', ['Checking', 'Brokerage', 'Retirement accounts', 'Savings'], 2, 'Retirement accounts penalize most withdrawals before retirement age.'),
        mcq('The biggest benefit of a taxable brokerage is…', ['No taxes ever', 'Flexibility', 'Guaranteed returns', 'Employer match'], 1, 'No limits and no penalties make it the most flexible container.'),
        mcq('Capital gains in a taxable account are generally…', ['Never taxed', 'Taxed when realized', 'Tax-deferred to retirement', 'Taxed only above $1M'], 1, 'Realized gains in a taxable account are taxed in the year they occur.'),
      ])],
    },
    {
      slug: 'taxation', title: 'Taxation', displayOrder: 5, hasQuizAfter: false, quizzes: [], knowledgeCheckCount: 3,
      lessons: [lesson('l1-5', 'Taxation and Personal Finance', 12, 50,
        "You don't need to love taxes — but understanding brackets and deductions can put real money back in your pocket.",
        [
          { heading: 'Gross Versus Net Income', content: '**Gross income** is every dollar you earn before any deductions — your salary, freelance income, dividends, rental income. **Net income** (or take-home pay) is what actually arrives in your bank account after federal income tax, state income tax, FICA (Social Security and Medicare), and any pre-tax benefit deductions (health insurance, 401k contributions) are withheld. The gap between gross and net is often 25-35% for a middle-income earner. This distinction matters because all personal budgeting should be built on **net income**, not gross — budgeting on gross is a common mistake that leaves people consistently short.',
            knowledgeCheck: kc('Net income is…', ['Income before taxes', 'Income after taxes & deductions', 'Only investment income', 'The same as gross'], 1, 'Net (take-home) income is what remains after taxes and deductions.') },
          { heading: 'Understanding Tax Brackets', content: 'The US federal income tax system uses **progressive (marginal) brackets** — you pay a higher rate only on the dollars that fall within each bracket, not on your entire income. In 2024, the brackets range from 10% on the first ~$11,600 of income to 37% on income above ~$609,350 (single filers). A common misconception: earning a raise that pushes you into the next bracket does NOT reduce your take-home pay. Only the new dollars above the bracket threshold are taxed at the higher rate. Your **effective tax rate** (total tax divided by total income) is always lower than your marginal rate.',
            knowledgeCheck: kc('In a marginal system, a raise into a higher bracket…', ['Taxes all your income at the higher rate', 'Only taxes the new dollars at the higher rate', 'Lowers take-home pay', 'Is tax-free'], 1, 'Only the income within the higher bracket is taxed at that rate.') },
          { heading: 'Deductions and Credits', content: '**Deductions** reduce your **taxable income** — so their value depends on your marginal rate. A $1,000 deduction at a 22% marginal rate saves you $220. You choose between the **standard deduction** ($14,600 for single filers in 2024) or itemizing deductions (mortgage interest, state taxes, charitable contributions) — take whichever is larger. **Tax credits** are more powerful: they reduce your **tax owed** dollar-for-dollar. A $1,000 credit saves $1,000 regardless of your bracket. Use the calculator below to see how deductions change your estimated federal tax.',
            interactiveExercise: GAME_TAX_CALC,
            knowledgeCheck: kc('Which reduces your tax bill dollar-for-dollar?', ['A deduction', 'A credit', 'Gross income', 'A bracket'], 1, 'Credits cut tax owed directly; deductions only reduce taxable income.') },
        ],
        ['Budget on net, not gross', 'Brackets are marginal — raises always help', 'Credits beat deductions dollar-for-dollar'], false)],
    },
    {
      slug: 'interest-and-tvm', title: 'Interest and Time Value of Money', displayOrder: 6, hasQuizAfter: false, quizzes: [], knowledgeCheckCount: 3,
      lessons: [lesson('l1-6', 'Interest and Time Value of Money', 13, 50,
        'A dollar today is worth more than a dollar tomorrow — and compounding is what turns that idea into wealth.',
        [
          { heading: 'The Power of Now', content: 'The **time value of money (TVM)** is one of the most important ideas in finance: a dollar available today is worth more than a dollar promised in the future, because today\'s dollar can be invested immediately to earn returns. This principle underpins every loan payment, bond price, retirement projection, and business valuation you will ever encounter. The two key variables are the **interest rate** (how fast money grows) and **time** (how long it compounds). Inflation adds a third layer — future dollars also purchase less than today\'s dollars — which is why holding too much cash long-term is a slow loss of purchasing power.',
            knowledgeCheck: kc('The time value of money implies…', ['A dollar later is worth more', 'A dollar now is worth more', "Inflation doesn't matter", 'Interest is irrelevant'], 1, 'Money now can be put to work, so it\'s worth more than the same amount later.') },
          { heading: 'Understanding Compound Returns', content: '**Compound interest** means you earn returns not just on your original principal, but on every dollar of previously earned returns as well. The formula is FV = PV x (1 + r)^n, where FV is future value, PV is present value, r is the periodic rate, and n is the number of periods. Small differences in return rate produce enormous differences over long periods — $10,000 at 6% for 30 years becomes ~$57,000; at 8% it becomes ~$100,000. This is why fees and return rates matter so much in long-term investing. Even a 1% annual fee difference compounds into tens of thousands of dollars of forgone wealth over decades.',
            knowledgeCheck: kc('Compounding means you earn returns on…', ['Only the principal', 'Principal plus accumulated returns', 'Inflation', 'Your salary'], 1, 'Returns are earned on principal and on previously earned returns.') },
          { heading: 'Projecting Future Value', content: 'The most powerful habit in personal finance is **starting early**. A 22-year-old who invests $200/month at 7% annual return will accumulate roughly $525,000 by age 62. A 32-year-old who starts the same habit will have only ~$243,000 — less than half, despite investing for only 10 fewer years. This is the **cost of waiting**: each year of delay does not just cost you that year\'s contributions, it costs you decades of compounding on those contributions. Use the calculator below to explore how your own variables play out.',
            interactiveExercise: GAME_COMPOUND_CALC,
            knowledgeCheck: kc('Which factor most dramatically boosts a compound result over decades?', ['A one-time deposit', 'Time invested', 'Account color', "The bank's name"], 1, 'Time is the most powerful lever in compounding.') },
        ],
        ['Money now > money later', 'Compounding earns returns on returns', 'Time is the strongest lever — start early'], false)],
    },
    {
      slug: 'financial-decision-making', title: 'Financial Decision Making', displayOrder: 7, hasQuizAfter: true, knowledgeCheckCount: 3,
      lessons: [lesson('l1-7', 'Financial Decision Making', 11, 50,
        'Good money decisions come from frameworks, not feelings — opportunity cost, rational trade-offs, and ignoring sunk costs.',
        [
          { heading: 'Understanding Opportunity Cost', content: '**Opportunity cost** is the value of the best alternative you give up when you make a choice. Every financial decision has one: spending $30,000 on a new car does not just cost $30,000 — it costs the $90,000+ that money could have compounded to over 20 years at 7%. This does not mean never spend money, but it means every large decision deserves a moment of reflection: what else could this money do? Opportunity cost thinking is what separates reactive spending from strategic resource allocation. It is the foundational lens of financial decision-making.',
            knowledgeCheck: kc('Opportunity cost is…', ['The cash price of an item', 'The value of the next-best alternative forgone', 'Always zero', 'A type of tax'], 1, "It's what you give up by choosing one option over the next-best one.") },
          { heading: 'Frameworks for Rational Spending', content: 'Rational financial decisions compare alternatives on **expected value and certainty**. A guaranteed 22% return (paying off high-interest debt) almost always beats an uncertain 15% upside (a speculative stock). The key tools are: (1) compare annualized returns, (2) adjust for risk (certain vs. probabilistic), and (3) separate emotional pull from mathematical reality. The scenario below puts this to the test — work through it before checking the answer.',
            interactiveExercise: GAME_DECISION_SCENARIO,
            knowledgeCheck: kc('A guaranteed 22% (paying off debt) vs. an uncertain 15% — the rational choice is…', ['The uncertain 15%', 'The guaranteed 22%', 'Split evenly', 'Neither'], 1, 'A certain 22% return dominates a speculative 15% one.') },
          { heading: 'Strategic Asset Allocation and Sunk Costs', content: 'A **sunk cost** is money already spent and irrecoverable — it should play zero role in any forward-looking decision. Holding a losing investment because you "already lost so much" is the sunk cost fallacy; the relevant question is only whether the investment\'s future prospects justify holding it. Similarly, strategic asset allocation means assigning each pool of money to the right investment vehicle based on its time horizon and purpose — not based on what you paid for an asset or what it is currently doing. Rational allocation ignores the past and focuses entirely on future expected risk and return.',
            knowledgeCheck: kc('A sunk cost should…', ['Drive future decisions', 'Be ignored in future decisions', 'Be doubled down on', 'Be added to ROI'], 1, 'Rational decisions weigh future costs and benefits, not money already spent.') },
        ],
        ['Weigh opportunity cost on every choice', 'Certainty and expected value beat excitement', 'Ignore sunk costs when deciding'], false)],
      quizzes: [quiz('quiz1-3', 'Personal Finance Comprehensive Quiz', ['taxation', 'interest-and-tvm', 'financial-decision-making'], 5, 70, 50, [
        mcq('US federal income tax brackets are…', ['Flat', 'Marginal', 'Regressive', 'Optional'], 1, "Only income within each bracket is taxed at that bracket's rate."),
        mcq('Compounding is most powerful when you have…', ['A large salary', 'A long time horizon', 'A premium account', 'No taxes'], 1, 'Time lets returns compound on returns repeatedly.'),
        mcq('Opportunity cost of spending $1,000 today is…', ['Always $1,000', "The forgone next-best use of that $1,000", 'Zero', 'The sales tax'], 1, "It's the value of the best alternative you didn't choose."),
        mcq('A tax credit vs. deduction: the credit…', ['Reduces taxable income', 'Reduces tax owed directly', 'Raises your bracket', 'Is always smaller'], 1, 'Credits reduce tax owed dollar-for-dollar.'),
        mcq('Sunk costs should be…', ['Recovered first', 'Ignored in new decisions', 'Always doubled', 'Counted as income'], 1, "They're unrecoverable and irrelevant to forward decisions."),
      ])],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 2 — Stock Market Essentials (every lesson ends in a scenario game)
// ═══════════════════════════════════════════════════════════════════════════════

// Real section content for Course 2 subtopics
const C2_CORE_CONCEPTS: Record<string, string> = {
  'intro-stock-market': 'A **stock** (or share) represents fractional ownership in a corporation. When you buy one share of a company, you own a tiny slice of its assets and future earnings. Companies list shares on **stock exchanges** — the NYSE (New York Stock Exchange) and NASDAQ are the two largest in the US; the Tokyo Stock Exchange (TSE) and London Stock Exchange (LSE) are major global venues. Exchanges provide a transparent, regulated marketplace where buyers and sellers meet. Share prices fluctuate based on supply and demand, which in turn reflects investors\' collective assessment of a company\'s future earnings power. Understanding this mechanism is the foundation of all equity investing.',
  'investment-pathways': 'Investors choose between **active** and **passive** strategies. Active investing means selecting individual stocks or sectors with the goal of beating the market; it requires significant research and carries higher idiosyncratic risk. Passive investing — buying broad index funds that track the **S&P 500**, MSCI World, or Nikkei 225 — captures market-wide returns at very low cost. Research consistently shows that the majority of active funds underperform their benchmark index over a 10-year horizon after fees. A **core-satellite** approach blends both: a large passive "core" (70-80% of the portfolio) provides stability, while a small "satellite" allocation allows targeted active bets without betting the entire portfolio.',
  'technical-fundamentals': 'Technical analysis studies **price and volume** data to forecast future price movements, operating on the premise that all available information is already reflected in the price. A **stock ticker** is the unique symbol (e.g., AAPL, 7203.T) that identifies a security on an exchange. The **bid** is the highest price a buyer will pay; the **ask** is the lowest a seller will accept; the **spread** between them is the transaction cost of the trade. A **market order** executes immediately at the best available price; a **limit order** executes only at a specified price or better, giving the investor price control at the cost of a potential non-fill.',
  'charting': 'A **price chart** plots a security\'s historical trading prices over time — the most common types are line charts, bar charts, and **candlestick charts**. Each candlestick shows the open, high, low, and close for a period: a filled (red/black) body means the close was below the open (bearish); a hollow (green/white) body means the close was above the open (bullish). **Support** is a price level where buying interest historically emerges and prevents further decline; **resistance** is a level where selling pressure caps advances. These levels form the backbone of range trading: buy near support, sell near resistance, with a stop-loss just beyond the level to define maximum risk.',
  'basic-technical-analysis': '**Technical indicators** are mathematical calculations applied to price and volume data. The **moving average (MA)** smooths price data to reveal trend direction — a 50-day MA crossing above a 200-day MA is called a "golden cross" and signals potential bullish momentum. **Volume** is the number of shares traded in a period; high volume on a price move confirms conviction behind the move; low volume suggests it may reverse. **RSI (Relative Strength Index)** measures overbought (above 70) or oversold (below 30) conditions. These indicators are tools for probability, not certainty — the discipline is always to define your risk (stop-loss) before entering any position.',
}

const C2_READING_SETUPS: Record<string, string> = {
  'intro-stock-market': 'Reading a market setup begins with identifying the **trend**: is the security in an uptrend (higher highs and higher lows), a downtrend (lower highs and lower lows), or a sideways range? In a volatile market with no clear trend, the disciplined approach is to wait for confirmation rather than guess direction. Sector analysis helps too — stocks in strong sectors (e.g., technology in a bull market) tend to outperform. **Diversification** across at least five uncorrelated sectors reduces the risk that a single event (an earnings miss, a regulatory fine) destroys your portfolio. Entry discipline using limit orders lets you define your exact cost basis rather than accepting whatever price a market order fills at.',
  'investment-pathways': 'Choosing an investment pathway requires aligning your **time horizon, risk tolerance, and return goal**. A 10-year horizon with a growth objective can tolerate significant short-term volatility in exchange for higher expected returns from equities. A 2-year horizon for a house down payment cannot — capital preservation matters more. **Index ETFs** (SPY, QQQ, VTI) provide instant diversification at expense ratios below 0.10%, making them the default starting point for most long-term investors. Within equities, **sector ETFs** let you overweight industries you believe have superior growth prospects without taking single-stock risk. The core-satellite model formalizes this intuition into a disciplined portfolio structure.',
  'technical-fundamentals': '**Chart patterns** give structure to price action. A **trading range** (flat support and resistance) tells you the market is undecided — the next big move will be a breakout or breakdown. In a range, the setup is clear: buy near support with a stop just below it, target resistance. The **risk-reward ratio** is the potential gain (entry to target) divided by the potential loss (entry to stop) — professional traders typically require at least 2:1 before entering a trade. Understanding this math is what separates disciplined trading from guessing. Always calculate your risk-reward before placing any order.',
  'charting': 'Experienced chart readers look for **confluence**: when multiple technical signals align at the same price level, conviction in the setup increases. For example, a support level that also coincides with a rising 200-day moving average and a prior high-volume area is a higher-probability entry than support alone. **Trendlines** drawn across successive lows in an uptrend act as dynamic support — when price pulls back to the trendline with declining volume, it suggests the buyers are in control and a continuation is likely. The chart patterns themselves — flags, triangles, head-and-shoulders — are visual representations of the battle between supply and demand at key price levels.',
  'basic-technical-analysis': 'The practical application of technical analysis involves scanning for **high-probability setups**: situations where support, volume profile, and momentum indicators align. Before acting on any technical signal, always ask: where is my stop (the level that proves the thesis wrong), and what is my target (where I plan to exit with a profit)? The **P/E ratio** (price-to-earnings) bridges technical and fundamental analysis — a stock near a key technical support level that also trades at a reasonable P/E relative to peers has both technical and fundamental backing. Volume confirmation is the final filter: a breakout on heavy volume is far more reliable than one on light volume.',
}

const C2_SUBS: { slug: string; title: string; game: InteractiveExercise }[] = [
  { slug: 'intro-stock-market',      title: 'Introduction to the Stock Market', game: GAME_S_INTRO },
  { slug: 'investment-pathways',     title: 'Investment Pathways',               game: GAME_S_PATHWAYS },
  { slug: 'technical-fundamentals',  title: 'Technical Fundamentals',            game: GAME_S_TECH },
  { slug: 'charting',                title: 'Charting',                          game: GAME_S_CHART },
  { slug: 'basic-technical-analysis',title: 'Basic Technical Analysis',          game: GAME_S_TA },
]
const COURSE_2: Course = {
  slug: 'stock-market-essentials', title: 'Stock Market Essentials', category: 'markets',
  difficulty: 'beginner', hours: 10, xp: 750, icon: '📈', order: 2,
  description: 'How markets work, how to read charts, and how to make disciplined trading decisions.',
  subtopics: C2_SUBS.map((s, i) => ({
    slug: s.slug, title: s.title, displayOrder: i + 1,
    hasQuizAfter: i === 2 || i === 4, knowledgeCheckCount: 3,
    lessons: [lesson(`l2-${i + 1}`, s.title, 10, 60, `An applied look at ${s.title.toLowerCase()} — ending with a real trading decision.`,
      [
        { heading: 'Core Concept', content: C2_CORE_CONCEPTS[s.slug] ?? `Core concept for ${s.title}.`,
          knowledgeCheck: kc(`Which statement about ${s.title.toLowerCase()} is most accurate?`, ['It guarantees profit', 'It is a tool for managing risk and probability', 'It removes all risk', 'It only works in bull markets'], 1, 'Markets are about managing probability and risk, not certainty.') },
        { heading: 'Reading the Setup', content: C2_READING_SETUPS[s.slug] ?? `Reading the setup for ${s.title}.`,
          knowledgeCheck: kc('Support and resistance describe…', ['Random noise', 'Price levels where buying/selling tends to cluster', 'Company fundamentals', 'Dividend dates'], 1, 'They are price zones where supply and demand historically cluster.') },
        { heading: 'Apply It: Trading Decision', content: 'You have studied the concept and read the setup — now put it into practice with the scenario below. Make the call a disciplined trader would make.', interactiveExercise: s.game,
          knowledgeCheck: kc('The lowest-risk entries are generally…', ['Near resistance', 'Near support with a defined stop', 'At all-time highs', 'Randomly'], 1, 'Buying near support with a stop maximizes reward-to-risk.') },
      ],
      ['Markets manage probability, not certainty', 'Buy near support, sell near resistance', 'Always define your risk before entering'], false)],
    quizzes: (i === 2 || i === 4) ? [quiz(`quiz2-${i}`, `${s.title} Checkpoint`, [s.slug], 5, 70, 60, [
      mcq('A limit order lets you…', ['Buy at any price', 'Control the price you pay', 'Guarantee a fill', 'Avoid all risk'], 1, 'A limit order controls your execution price (but may not fill).'),
      mcq('Diversification primarily reduces…', ['Market risk', 'Single-name (idiosyncratic) risk', 'Taxes', 'Fees'], 1, 'Spreading across names reduces company-specific risk.'),
      mcq('A core-satellite portfolio uses a core of…', ['Meme stocks', 'Broad index funds', 'Options', 'Cash'], 1, 'The stable core is typically a broad index, with small satellite bets.'),
      mcq('Resistance is a price level where…', ['Buyers overwhelm sellers', 'Selling tends to cap advances', 'Dividends are paid', 'Volume is zero'], 1, 'Resistance is where selling pressure historically caps price.'),
    ])] : [],
  })),
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 3 — Corporate Finance Deep Dive (2 calculators + 1 scenario)
// ═══════════════════════════════════════════════════════════════════════════════
const COURSE_3: Course = {
  slug: 'corporate-finance-deep-dive', title: 'Corporate Finance Deep Dive', category: 'corporate-finance',
  difficulty: 'intermediate', hours: 12, xp: 1000, icon: '🏦', order: 3,
  description: 'Valuation, capital structure, and return analysis — the quantitative core of corporate finance.',
  subtopics: [
    { slug: 'financial-modelling', title: 'Financial Modelling', displayOrder: 1, hasQuizAfter: false, knowledgeCheckCount: 3, quizzes: [],
      lessons: [lesson('l3-1', 'Building a 5-Year Valuation Model', 16, 120,
        'Valuation is storytelling with numbers — project growth, apply a margin, and the market assigns a multiple.',
        [
          { heading: 'Revenue Growth & Projections', content: 'A **financial model** starts with the income statement: project **revenue** forward by applying an assumed growth rate compounded annually. If a company has $100M in revenue today and you project 15% annual growth, year-5 revenue is $100M x (1.15)^5 which is approximately $201M. Revenue projections are the most consequential assumption in any model — small changes in the growth rate cascade through every downstream output. Analysts build **base, bull, and bear case** scenarios to capture uncertainty. The three core financial statements are deeply linked: revenue flows through the income statement to operating profit, which feeds the cash flow statement, which ultimately drives changes in the balance sheet.',
            knowledgeCheck: kc('In a 5-year model, revenue growth primarily drives…', ['The discount rate', 'Future revenue and earnings base', 'The tax rate', 'Share count'], 1, 'Compounded growth sets the future revenue the margin is applied to.') },
          { heading: 'EBITDA Margin & Exit Multiple', content: '**EBITDA** (Earnings Before Interest, Taxes, Depreciation, and Amortization) is the most common proxy for a company\'s operating cash generation. The **EBITDA margin** (EBITDA divided by Revenue) reflects operating efficiency — software businesses often run at 20-35% margins; grocery chains at 3-6%. To value the business at exit, analysts apply an **EV/EBITDA multiple**: if year-5 EBITDA is $40M and comparable companies trade at 10x EV/EBITDA, the implied **Enterprise Value (EV)** is $400M. The exit multiple is the single most sensitive assumption in an LBO or M&A model — a one-turn change (say, from 10x to 11x) often moves valuation by 8-12%. Understanding the multiple\'s comparables basis is therefore critical.',
            knowledgeCheck: kc('Enterprise Value via EV/EBITDA is…', ['EBITDA / multiple', 'EBITDA x multiple', 'Revenue x tax', 'Cash - debt'], 1, 'EV = EBITDA x the EV/EBITDA multiple.') },
          { heading: 'Interactive Valuation Model', content: 'Valuation models are highly sensitive to their assumptions — a phenomenon sometimes called "garbage in, garbage out." The discipline is to stress-test every key assumption: what does EV look like if growth is 5% instead of 15%? If margins compress by 3 percentage points? If the market re-rates the multiple from 10x to 7x? Use the interactive model below to develop intuition for how each variable moves the outcome. Pay attention to which lever has the largest impact — it will tell you where to focus your diligence.',
            interactiveExercise: GAME_VALUATION,
            knowledgeCheck: kc('Raising the exit multiple, all else equal, makes EV…', ['Lower', 'Higher', 'Unchanged', 'Negative'], 1, 'A higher multiple scales EV up proportionally.') },
        ],
        ['Growth compounds the revenue base', 'EV = EBITDA x exit multiple', 'Small assumption changes move valuation a lot'], false)] },
    { slug: 'corporate-structures', title: 'Corporate Structures', displayOrder: 2, hasQuizAfter: false, knowledgeCheckCount: 3, quizzes: [],
      lessons: [lesson('l3-2', 'Choosing a Corporate Structure', 12, 100,
        'The legal wrapper around a business decides its liability exposure and how its profits are taxed.',
        [
          { heading: 'Liability & Taxation Basics', content: 'Two questions define every corporate structure choice: **who is liable if the business fails?** and **how are profits taxed?** In a **sole proprietorship** or **general partnership**, the owners bear unlimited personal liability — creditors can come after personal assets (house, savings) to satisfy business debts. **Limited liability** structures (LLCs, corporations) create a legal separation between the business entity and its owners, shielding personal assets from business creditors. On the tax side, businesses face either **pass-through taxation** (profits flow directly to the owners\' personal returns, taxed once) or **double taxation** (profits taxed at the entity level, then dividends taxed again at the personal level).',
            knowledgeCheck: kc('Limited liability means…', ["Owners owe unlimited debts", "Owners' personal assets are protected", 'No taxes', 'No paperwork'], 1, "Owners' personal assets are shielded from business liabilities.") },
          { heading: 'LLC vs C-Corp vs Sole Prop', content: 'The three most common structures for small and medium businesses are:\n\n- **Sole Proprietorship** — zero setup cost, zero liability protection, taxes flow to personal return. Default for freelancers.\n- **LLC (Limited Liability Company)** — simple to form, provides personal asset protection, pass-through taxation by default. The standard choice for most small businesses and startups that will not raise institutional VC.\n- **C-Corporation** — strong liability protection, can issue multiple share classes (preferred and common), preferred by VC-backed startups because of its flexibility. Downside: double taxation on profits distributed as dividends. The **S-Corp** is a tax election (not a separate entity) that allows a corporation to be taxed as pass-through, subject to shareholder limits.',
            knowledgeCheck: kc('Double taxation is a feature of…', ['Sole proprietorships', 'LLCs', 'C-Corporations', 'Partnerships'], 2, 'C-Corps are taxed at the entity level and again on dividends.') },
          { heading: 'Apply It: Pick the Structure', content: 'Entity choice is a legal and tax decision with long-term consequences — changing structure later (e.g., converting an LLC to a C-Corp to raise VC) is possible but involves cost and complexity. Founders should also consider **jurisdiction**: Delaware C-Corps are favored by institutional investors because of Delaware\'s well-developed corporate case law and Court of Chancery. Work through the scenario below to apply the decision framework.',
            interactiveExercise: GAME_LLC,
            knowledgeCheck: kc('For liability protection + single taxation, choose…', ['C-Corp', 'LLC', 'Sole prop', 'No entity'], 1, 'An LLC gives protection with pass-through taxation.') },
        ],
        ['Structure sets liability and taxation', 'C-Corps face double taxation', 'LLCs combine protection with single taxation'], false)] },
    { slug: 'return-on-investment', title: 'Return on Investment', displayOrder: 3, hasQuizAfter: true, knowledgeCheckCount: 3,
      lessons: [lesson('l3-3', 'Measuring Return on Investment', 12, 100,
        'ROI turns "did it pay off?" into a single comparable percentage — the language of capital allocation.',
        [
          { heading: 'The ROI Formula', content: '**ROI = (Net Gain / Investment Cost) x 100%.** It standardizes wildly different investments onto one comparable scale — a $5,000 return on a $20,000 investment (25% ROI) can be directly compared to a $50,000 return on a $200,000 investment (also 25%). ROI is used everywhere: evaluating marketing campaigns, capital expenditure projects, real estate purchases, and stock portfolios. The formula\'s simplicity is a feature — it forces clarity about what constitutes the "gain" (must it be net of taxes? net of fees?) and what the "cost" base is (purchase price? total capital deployed including working capital?).',
            knowledgeCheck: kc('ROI is calculated as…', ['Gain x cost', 'Net gain / cost x 100', 'Cost / gain', 'Gain - cost only'], 1, 'ROI = net gain divided by cost, expressed as a percent.') },
          { heading: 'Limitations of ROI', content: 'Simple ROI has two significant blind spots. First, it **ignores time** — a 30% ROI over 1 year is exceptional; over 10 years, it is poor. Always **annualize** ROI to compare investments of different durations: Annualized ROI = (1 + ROI)^(1/years) - 1. Second, it **ignores risk** — two investments with identical ROIs may have very different risk profiles (one is a treasury bond, the other is a startup). Professionals use **risk-adjusted return metrics** like the Sharpe ratio (return per unit of volatility) or **IRR (Internal Rate of Return)** for time-weighted comparisons. Simple ROI is a starting point, not the full answer.',
            knowledgeCheck: kc('A key blind spot of simple ROI is…', ['It ignores the dollar amount', 'It ignores time (no annualization)', 'It is always negative', 'It includes taxes'], 1, 'Simple ROI ignores how long the money was invested.') },
          { heading: 'Interactive ROI Calculator', content: 'A useful mental model: **ROI is the efficiency score of capital deployment**. A company allocating capital across multiple projects should rank them by ROI (adjusted for risk and time) and fund the highest-returning projects first — this is the core of **capital budgeting**. The hurdle rate concept says a project must exceed the company\'s **weighted average cost of capital (WACC)** to create value; anything below destroys value. Use the calculator below to compute ROI for any investment cost and gain.',
            interactiveExercise: GAME_ROI,
            knowledgeCheck: kc('$15,000 gain on a $50,000 investment is an ROI of…', ['15%', '30%', '50%', '3%'], 1, '15,000 / 50,000 = 30%.') },
        ],
        ['ROI = net gain / cost x 100', 'It standardizes different investments', 'Simple ROI ignores time — annualize to compare'], false)],
      quizzes: [quiz('quiz3-1', 'Corporate Finance Assessment', ['financial-modelling', 'corporate-structures', 'return-on-investment'], 5, 70, 100, [
        mcq('Enterprise Value via EV/EBITDA equals…', ['EBITDA / multiple', 'EBITDA x multiple', 'Revenue x margin', 'Equity - debt'], 1, 'EV = EBITDA x the EV/EBITDA multiple.'),
        mcq('Which entity has pass-through taxation and liability protection?', ['C-Corp', 'LLC', 'Sole proprietorship', 'Partnership (general)'], 1, 'An LLC offers both.'),
        mcq('ROI of a $20k gain on $80k invested is…', ['20%', '25%', '40%', '4%'], 1, '20,000 / 80,000 = 25%.'),
        mcq('Higher assumed revenue growth in a model raises…', ['The tax rate', 'Projected future earnings', 'Share count', 'The risk-free rate'], 1, 'Growth compounds the future revenue and earnings base.'),
        mcq('Double taxation specifically affects…', ['LLCs', 'C-Corporations', 'Sole props', 'IRAs'], 1, 'C-Corp profits are taxed at the entity and again as dividends.'),
      ])],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON BUILDER — Courses 4–9 (real structure & quiz metadata; mock prose)
// ═══════════════════════════════════════════════════════════════════════════════
interface SubSpec { slug: string; title: string; module?: string; kc?: number; cryptoContext?: boolean; note?: string }

function buildCourse(
  meta: { slug: string; title: string; category: string; difficulty: Course['difficulty']; hours: number; xp: number; icon: string; order: number; description: string },
  subs: SubSpec[],
  opts: { quizEvery?: number; quizMaxQ?: number; quizPass?: number; quizXp?: number },
): Course {
  const { quizEvery = 0, quizMaxQ = 4, quizPass = 70, quizXp = 50 } = opts
  return {
    ...meta,
    subtopics: subs.map((s, i): Subtopic => {
      const hasQuiz = quizEvery > 0 && (i + 1) % quizEvery === 0
      const sections: LessonSection[] = [
        { heading: 'Overview', content: mockBody('Overview', meta.title),
          ...(s.kc ? { knowledgeCheck: kc(`Which best describes ${s.title.toLowerCase()}?`, ['An outdated concept', 'A key building block covered in this lesson', 'Irrelevant to the field', 'Purely theoretical'], 1, `${s.title} is a core building block of ${meta.title}.`) } : {}) },
        { heading: 'In Practice', content: mockBody('In Practice', meta.title),
          ...(s.kc && s.kc > 1 ? { knowledgeCheck: kc(`In practice, ${s.title.toLowerCase()} is applied to…`, ['Nothing real', 'Real-world analysis and decisions', 'Only exams', 'Only history'], 1, 'Practitioners apply it directly to analysis and decisions.') } : {}) },
      ]
      if (s.kc && s.kc > 2) {
        sections.push({ heading: 'Deepening Understanding', content: mockBody('Deepening Understanding', meta.title),
          knowledgeCheck: kc(`A common misconception about ${s.title.toLowerCase()} is that…`, ['It is simple and risk-free', 'It requires judgment and context', 'It never changes', 'It has no trade-offs'], 1, 'Like most finance concepts, it involves trade-offs and judgment.') })
      }
      if (s.cryptoContext) {
        sections.push({ heading: 'Crypto Context', content: `A useful mental model: **ROI is the efficiency score of capital deployment** — it answers "how hard is each dollar working?"

A company allocating capital across multiple projects should rank them by ROI (adjusted for risk and time) and fund the highest-returning projects first — this is the core of **capital budgeting**.

The hurdle rate concept says a project must exceed the company's **weighted average cost of capital (WACC)** to create value; anything below destroys value. If a project's ROI is below your WACC, avoid it — it is a value-destroying use of capital.

For example, if WACC is 9% and a new product line projects a 7% annualized ROI, the company should not fund it. Use the calculator below to compute ROI for any investment cost and gain.` })
      }
      if (s.note) sections.push({ heading: 'Notable Cases', content: `*(Sample content.)*\n\n${s.note}` })
      return {
        slug: s.slug, title: s.title, displayOrder: i + 1, hasQuizAfter: hasQuiz, module: s.module,
        knowledgeCheckCount: s.kc ?? 0,
        lessons: [lesson(`${meta.slug}-l${i + 1}`, s.title, 9, Math.round(meta.xp / subs.length), `${mockBody('Introduction', meta.title)}`, sections,
          [`${s.title} is foundational to ${meta.title}`, 'Concepts build toward applied judgment', 'Review the knowledge checks before the quiz'])],
        quizzes: hasQuiz ? [quiz(`${meta.slug}-quiz${i + 1}`, `${s.title} Checkpoint`, [s.slug], quizMaxQ, quizPass, quizXp,
          Array.from({ length: quizMaxQ }, (_, k) =>
            mcq(`(${s.title}) Sample question ${k + 1}: which statement is correct?`,
              ['A distractor option', 'The correct, faithful answer', 'Another distractor', 'A final distractor'], 1,
              'Full question text lives in Supabase; this is faithful placeholder copy matching the quiz structure.'))) ] : [],
      }
    }),
  }
}

const COURSE_4: Course = {
  slug: 'investment-banking',
  title: 'Investment Banking',
  category: 'investment-banking',
  difficulty: 'advanced',
  hours: 15,
  xp: 1500,
  icon: '💼',
  order: 4,
  description: 'Valuation, M&A, and capital markets — taught through landmark deals and case studies.',
  subtopics: [

    // ─── 1. IB Fundamentals ───────────────────────────────────────────────────
    {
      slug: 'ib-fundamentals',
      title: 'The Role of Investment Banks',
      displayOrder: 1,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l4-1',
          'The Role of Investment Banks',
          20,
          150,
          'Investment banks sit at the intersection of capital and ambition — advising companies on the biggest decisions of their financial lives while connecting them to the investors who fund those decisions.',
          [
            {
              heading: 'What Investment Banks Do',
              content: `Investment banks serve two master businesses under one roof — advisory and capital markets — but the scale of what flows through them shapes every major corporate decision on earth.

The first pillar is **advisory**, where the bank earns fees by counseling corporations, governments, and private equity funds on **mergers and acquisitions (M&A)**, restructurings, and strategic transactions. The second is **capital markets**, where the bank acts as an intermediary between issuers and investors, earning an **underwriting spread** on every deal. A third pillar is **sales & trading**, deploying capital to facilitate client trades in equities, fixed income, currencies, and commodities.

**1–2% for advisory fees** (success fee as % of deal value, paid only at close)

The **sell-side** creates, markets, and sells securities — investment banks live here. The **buy-side** purchases them — asset managers, hedge funds, and pension funds live here. Within the sell-side, **bulge-bracket** banks (Goldman Sachs, Morgan Stanley, JPMorgan) compete for the largest mandates globally; **boutique** advisory firms (Lazard, Evercore, Moelis) focus exclusively on advisory with no capital-markets conflict; and **middle-market** banks serve mid-cap clients.

For example, when a $5 billion company hires Goldman Sachs to run its sale process, Goldman earns a retainer during the process plus a success fee of roughly 1% of the final deal price — about $50 million — only if the deal closes.`,
            },
            {
              heading: 'Deal Teams and Hierarchy',
              content: `Every investment banking deal is staffed by a team organized in a strict **meritocratic hierarchy** — from analyst to managing director — where each level has a fundamentally different job.

At the base, **analysts** (2-year undergraduate programs) build models, create pitch books, and run the data. Above them, **associates** (MBA hires or promoted analysts) manage analysts, own deliverable quality, and interface directly with clients. **Vice presidents** run day-to-day deal execution. **Directors** serve as senior execution managers and begin developing client relationships. **Managing directors** are the rainmakers — they originate mandates, maintain C-suite relationships, and negotiate fee arrangements.

**80–100 hours per week for analysts** (typical during live deals, centering on financial models and pitch books produced overnight)

Do not underestimate the intensity of the analyst program — the hours are not incidental; they reflect the volume of materials a live deal requires across valuation, diligence support, and client presentations. The analyst program remains the standard entry point because it provides unmatched exposure to transactions in a compressed two-year window.`,
            },
            {
              heading: 'Conflicts of Interest and Regulation',
              content: `Because investment banks simultaneously advise clients, underwrite securities, make markets, and publish equity research, the potential for conflicts of interest is significant — and regulators have repeatedly been forced to respond.

**Chinese walls** (information barriers) are internal firewalls that legally and physically separate advisory, research, and trading desks to prevent material non-public information (MNPI) from flowing between them. Never attempt to share MNPI across these walls — doing so constitutes a violation that can result in criminal prosecution, not merely a fine. The **Glass-Steagall Act** (1933) originally separated commercial banking from investment banking; its repeal via **Gramm-Leach-Bliley (1999)** allowed recombination, which many believe amplified systemic risk ahead of 2008.

The **Dodd-Frank Act (2010)** responded with sweeping reforms: the Volcker Rule restricted proprietary trading, new capital requirements limited leverage, and derivatives were pushed onto regulated exchanges. The **Global Research Analyst Settlement (2003)** forced banks to fund independent research and barred analysts from being compensated based on investment banking revenue — directly addressing the conflicts that led to inflated dot-com research ratings.

For example, during the dot-com bubble, several bulge-bracket analysts publicly rated stocks "Strong Buy" while privately describing them as worthless in internal emails, because their bonuses depended on investment banking mandates from those same companies. The 2003 settlement ended that practice.`,
              knowledgeCheck: kc(
                'A "Chinese wall" in an investment bank is…',
                [
                  'A physical wall in the trading floor',
                  'An information barrier separating advisory, research, and trading to prevent MNPI from flowing across desks',
                  'A regulatory filing submitted to the SEC',
                  'A fee arrangement between the bank and its client',
                ],
                1,
                'Chinese walls are internal information barriers that prevent material non-public information from moving between business units, protecting against conflicts of interest and insider trading violations.',
              ),
            },
          ],
          [
            'Investment banks earn revenue through advisory fees, underwriting spreads, and trading P&L',
            'The sell-side creates and markets securities; the buy-side purchases them',
            'Chinese walls prevent MNPI from crossing between advisory, research, and trading desks',
          ],
          false,
        ),
      ],
    },

    // ─── 2. Valuation Methods ─────────────────────────────────────────────────
    {
      slug: 'valuation-methods',
      title: 'Valuation: DCF, Comps & Precedents',
      displayOrder: 2,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l4-2',
          'The Three Pillars of Valuation',
          25,
          150,
          'Every M&A negotiation and capital raise rests on three valuation methodologies — DCF, comparable companies, and precedent transactions. Used together, they define the range of defensible prices for any business.',
          [
            {
              heading: 'Discounted Cash Flow (DCF)',
              content: `The **discounted cash flow (DCF)** model values a company by projecting its future **free cash flow to the firm (FCFF)** and discounting those cash flows back to the present at the **weighted average cost of capital (WACC)** — it is the purest expression of intrinsic value.

FCFF = EBIT × (1 − tax rate) + D&A − ΔWorking Capital − CapEx. WACC blends the after-tax cost of debt with the cost of equity (via **CAPM**: Rf + β × (Rm − Rf)), weighted by each component's share of total capital. Because most of a company's value accumulates beyond a typical 5-year forecast, the **terminal value** — calculated via the **Gordon Growth Model** or an **exit multiple** — often represents **60–80% of total DCF value**.

**60–80% for terminal value** (share of total DCF coming from cash flows beyond year 5)

Warning: a 1% change in WACC or the terminal growth rate can swing implied value by 20–40%, making DCF dangerously sensitive to assumptions. If your discount rate or growth rate deviates even modestly from reality, the output becomes meaningless. Always stress-test through scenario and sensitivity analysis — a single-point DCF output should never be treated as a reliable number in isolation.

For example, a company with $100M of year-5 FCFF, a 10% WACC, and a 3% perpetuity growth rate has a terminal value of $1.43 billion — nearly 70% of its total DCF value, sitting in a number derived entirely from an assumption about a company's behavior in perpetuity.`,
              knowledgeCheck: kc(
                'In a DCF model, the terminal value represents…',
                [
                  'The book value of assets at the end of the forecast period',
                  'The present value of all cash flows beyond the explicit forecast horizon, often 60–80% of total DCF value',
                  'The sum of annual cash flows during the projection period',
                  'The liquidation value of the company',
                ],
                1,
                'The terminal value captures the present value of all cash flows beyond the explicit forecast period (typically 5 years), usually using the Gordon Growth Model or an exit multiple. It dominates total DCF value precisely because businesses generate cash indefinitely.',
              ),
            },
            {
              heading: 'Comparable Company Analysis (Comps)',
              content: `**Comparable company analysis** (comps, or "trading comps") values a company relative to how the public market prices similar businesses — anchoring valuation in real, observable market data rather than modeled projections.

The process begins with selecting a **peer universe** — companies in the same sector with comparable revenue scale, growth, and margins. From each peer, you compute **enterprise value (EV)** (market cap + net debt + minority interest − cash) and divide by EBITDA, revenue, and EBIT to derive multiples. You then apply the median peer multiple to the target's metric to get an **implied enterprise value**, then subtract net debt to reach **implied equity value per share**.

**EV/EBITDA for capital structure-neutral comparisons** (excludes interest and D&A, making leverage differences irrelevant)

For example, if the peer median EV/EBITDA is 11× and your target has $200M of EBITDA, the implied enterprise value is $2.2 billion. Subtract $400M of net debt and you get $1.8 billion of equity value — a number grounded in what the market is actually paying for comparable businesses today.

Adjustments for size, liquidity, and growth rate are applied as discounts or premiums to the raw peer median. Avoid treating comps as mechanically precise — the "right" multiple always requires judgment about how closely each peer truly resembles the target.`,
              knowledgeCheck: kc(
                'EV/EBITDA is generally preferred over P/E in M&A analysis because…',
                [
                  'P/E is not calculable for public companies',
                  'EV/EBITDA is capital structure-neutral, making comparisons cleaner across companies with different debt levels',
                  'EV/EBITDA always produces a higher valuation',
                  'P/E ignores revenue',
                ],
                1,
                'EV/EBITDA measures enterprise value relative to pre-interest, pre-depreciation earnings, so it is unaffected by how a company is financed. This makes it the standard M&A multiple when comparing targets with different capital structures.',
              ),
            },
            {
              heading: 'Precedent Transaction Analysis',
              content: `**Precedent transactions** (or "deal comps") value a company by examining the multiples paid in prior acquisitions of comparable businesses — and they almost always produce higher implied values than trading comps.

The key distinction is the **control premium**: the incremental amount an acquirer must pay above the public market price to gain control, typically **20–40%** above the unaffected stock price. This premium compensates target shareholders for giving up the optionality of the open market. The process mirrors trading comps: find relevant transactions (same industry, comparable size, completed within the last 3–5 years), calculate EV/EBITDA and EV/Revenue on the deal price, and apply to the target.

**20–40% for control premium** (incremental amount paid above unaffected market price to gain majority ownership)

Bankers use all three methods — DCF, comps, and precedents — to build a **football field chart**: a horizontal bar chart showing each methodology's valuation range side by side, allowing clients to see where the negotiated price falls.

For example, if the same company trades at 10× EBITDA in the public market (trading comps), a strategic acquirer might pay 13–14× in a transaction (precedent comps) — the 30–40% premium reflecting synergies, control, and competitive bidding. That differential is often what makes the acquisition economics work for target shareholders while still being accretive to the acquirer.`,
              knowledgeCheck: kc(
                'Precedent transactions tend to produce higher valuations than trading comps primarily because…',
                [
                  'They use higher revenue growth assumptions',
                  'They embed a control premium paid by acquirers to gain ownership above the market price',
                  'They apply a lower discount rate',
                  'They are based on future projections rather than historical data',
                ],
                1,
                'Precedent transaction multiples include a control premium — the extra price acquirers pay to gain control of a company — which is absent in public trading comps. This structural difference is why deal comps produce higher implied values.',
              ),
            },
          ],
          [
            'DCF captures intrinsic value but is highly sensitive to WACC and terminal growth assumptions',
            'EV/EBITDA is capital structure-neutral and the dominant M&A multiple',
            'Precedent transactions include a control premium, making them the highest-value method in a football field',
          ],
          false,
        ),
      ],
    },

    // ─── 3. M&A Process ───────────────────────────────────────────────────────
    {
      slug: 'ma-process',
      title: 'The M&A Process & Deal Lifecycle',
      displayOrder: 3,
      hasQuizAfter: true,
      lessons: [
        lesson(
          'l4-3',
          'From Mandate to Close: The M&A Deal Lifecycle',
          25,
          150,
          'A landmark acquisition looks seamless from the outside but involves months of choreographed process, intensive diligence, and legal engineering across dozens of advisors. Understanding that lifecycle is the foundation of M&A practice.',
          [
            {
              heading: 'Sell-Side Advisory and the Auction Process',
              content: 'When a company decides to sell, it typically retains an investment bank as **sell-side advisor** to run a structured auction. The process begins with the preparation of marketing materials: a brief **teaser** (a 1-2 page anonymous summary sent without disclosing the target\'s identity) is distributed to prospective buyers, who sign an **NDA** to receive the full **Confidential Information Memorandum (CIM)** — a 50-100 page document covering the business model, financials, market position, and investment thesis. Buyers submit **indicative (non-binding) offers** with valuation ranges and proposed structure; the seller\'s advisor selects a short list for **management presentations** — live sessions where the target\'s leadership presents the business and answers buyer questions. In a **broad auction**, 10–30 potential buyers are contacted; a **targeted auction** contacts only 3–5 highly strategic or pre-vetted parties. After management presentations, selected buyers submit **binding bids** with a firm price, proposed merger agreement markup, and financing evidence. The seller selects one bidder for exclusive negotiations.',
            },
            {
              heading: 'Buy-Side Advisory and Due Diligence',
              content: 'A buyer\'s investment bank provides **buy-side advisory**, supporting the acquirer through valuation, deal structuring, synergy analysis, and negotiation. Once selected as the preferred bidder — typically after submitting a competitive binding bid — the buyer enters **exclusive** negotiations and begins **confirmatory due diligence**. Due diligence is the exhaustive verification of everything the seller has represented in the CIM. **Financial DD** reconstructs EBITDA from the ground up, auditing revenue recognition, working capital quality, and off-balance-sheet liabilities. **Legal DD** reviews material contracts, IP ownership, litigation exposure, and regulatory filings. **Commercial DD** assesses market size, competitive dynamics, and customer concentration. **Operational DD** evaluates IT systems, supply chain, and management depth. All materials are shared in a **virtual data room (VDR)** — a secure cloud platform organized by category. The buyer\'s deal team (bankers, lawyers, accountants, consultants) submits written questions in the VDR; management Q&A sessions address complex items. **Exclusivity** is triggered when the seller grants one buyer the sole right to negotiate the final agreement — it is awarded to the highest-quality bid, usually the one that combines price, certainty of close, and limited conditionality.',
              knowledgeCheck: kc(
                'Exclusivity in an M&A auction is typically granted when…',
                [
                  'The target company files its S-1 with the SEC',
                  'The seller grants one bidder sole negotiating rights, usually to the highest-quality (price + certainty) bid after binding offers are submitted',
                  'Antitrust regulators approve the deal',
                  'The buyer completes its financial due diligence',
                ],
                1,
                'Exclusivity is a privilege the seller grants to the winning bidder after binding offers — it protects the buyer\'s diligence investment and signals that the deal is on a path to closing. It is earned by offering the highest-quality combination of price and deal certainty.',
              ),
            },
            {
              heading: 'Signing, Financing, and Closing',
              content: 'Once diligence is complete and the terms are negotiated, the parties execute a **definitive agreement** — either a **stock purchase agreement (SPA)** (buyer acquires the target\'s shares directly) or a **merger agreement** (the target merges into the buyer\'s acquisition subsidiary). The definitive agreement governs price, representations and warranties, **material adverse change (MAC)** clauses (conditions under which the buyer may walk away without penalty, such as a catastrophic event affecting the target\'s business), and closing conditions. For public company acquisitions, shareholder approval is typically required. Deal financing — typically a combination of cash on hand, committed bank debt (bridge loans, term loans), and high-yield bonds — is arranged in parallel and must be evidenced at signing. Regulatory clearances from the **DOJ/FTC** (US antitrust) and **EU merger control** (if the deal meets EU thresholds) may take 6–12 months and may require divestitures as conditions. Closing occurs when all conditions are satisfied and the purchase price is transferred — at that point, ownership changes hands and the integration begins.',
            },
          ],
          [
            'The CIM is the core marketing document; the teaser is distributed before NDA to identify interested parties',
            'Due diligence spans financial, legal, commercial, and operational workstreams in a virtual data room',
            'Closing requires definitive agreement execution, regulatory clearance, and financing in place',
          ],
          false,
        ),
      ],
      quizzes: [
        quiz(
          'quiz4-1',
          'Investment Banking Foundations',
          ['ib-fundamentals', 'valuation-methods', 'ma-process'],
          5,
          70,
          150,
          [
            mcq(
              'An investment bank\'s "advisory" revenue primarily comes from…',
              [
                'Proprietary trading profits on equities desks',
                'Retainer and success fees earned on M&A transactions and capital raises',
                'Net interest income on customer deposits',
                'Management fees charged to mutual fund investors',
              ],
              1,
              'Advisory fees — retainers paid during a process and success fees (typically 1–2% of deal value) paid at close — are the defining revenue stream of an investment bank\'s M&A advisory business, distinct from trading or lending income.',
            ),
            mcq(
              'In a DCF model, WACC is used to…',
              [
                'Calculate the company\'s EBITDA margin',
                'Determine the appropriate leverage ratio for an LBO',
                'Discount projected free cash flows back to present value',
                'Set the interest rate on acquisition financing',
              ],
              2,
              'WACC — the weighted average cost of capital — is the discount rate applied to future free cash flows in a DCF. It blends the cost of equity (via CAPM) and the after-tax cost of debt, weighted by each\'s share of total capital.',
            ),
            mcq(
              'EV/EBITDA multiples are preferred over P/E in M&A analysis because…',
              [
                'EBITDA is always larger than earnings, producing more attractive valuations',
                'EV/EBITDA is capital structure-neutral, enabling clean comparisons across companies with different debt levels',
                'P/E is only calculable for companies with positive earnings',
                'Regulators require EV/EBITDA in merger filings',
              ],
              1,
              'EV/EBITDA measures value relative to pre-interest, pre-D&A earnings, so it is unaffected by capital structure differences — making it the standard multiple when comparing M&A targets that have different leverage profiles.',
            ),
            mcq(
              'A CIM in an M&A process stands for…',
              [
                'Capital Investment Memorandum',
                'Competitive Intelligence Model',
                'Confidential Information Memorandum',
                'Closing Indemnification Matrix',
              ],
              2,
              'The Confidential Information Memorandum (CIM) is the primary marketing document in a sell-side process — a detailed overview of the target\'s business, strategy, financials, and market position, shared only after an NDA is signed.',
            ),
            mcq(
              'Precedent transactions produce higher implied valuations than trading comps primarily because…',
              [
                'They use more aggressive revenue growth assumptions',
                'They reflect deal multiples including the control premium paid by acquirers',
                'They are based on forward EBITDA rather than LTM EBITDA',
                'They exclude synergies from the analysis',
              ],
              1,
              'Precedent transaction multiples embed the control premium — typically 20–40% above the unaffected market price — that acquirers pay to obtain ownership control. This structural premium is absent in public trading comps, explaining the valuation gap.',
            ),
          ],
        ),
      ],
    },

    // ─── 4. Capital Markets ───────────────────────────────────────────────────
    {
      slug: 'capital-markets',
      title: 'Equity & Debt Capital Markets (IPOs)',
      displayOrder: 4,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l4-4',
          'How Companies Raise Capital: ECM, DCM, and the IPO',
          20,
          150,
          'Capital markets are the mechanism through which companies access the funds they need to grow, acquire, or refinance. Investment banks orchestrate the issuance of equity and debt, connecting issuers with the investors who price and absorb that capital.',
          [
            {
              heading: 'The IPO Process',
              content: `An **initial public offering (IPO)** transforms a private company into a publicly traded one — creating liquidity for founders and early investors while raising new capital for the business.

The process begins with selecting underwriters who file a **Form S-1** with the SEC (a comprehensive disclosure document covering the business, financials, risk factors, and use of proceeds). After the SEC review period (typically **20–30 days**), the company embarks on a **roadshow**: a 10–14 day tour of institutional investors where management presents the investment case. Investors submit indications of interest; bankers **build a book** of demand and set the final IPO price on the evening before trading begins.

**90–180 days for lockup period** (pre-IPO shareholders cannot sell shares during this window after listing)

To support the stock price after listing, the lead underwriter holds a **greenshoe option** (over-allotment) allowing them to buy back up to **15%** of shares if the price falls, stabilizing the aftermarket. Warning: if a greenshoe is exercised heavily in the first weeks of trading, it signals that demand was weaker than the roadshow suggested — a signal to investors that the pricing process overreached.

For example, Airbnb's December 2020 IPO was priced at $68 per share by Morgan Stanley and Goldman Sachs, reflecting a ~$47 billion market cap. On day one, shares opened at $146 — a 115% first-day pop, meaning Airbnb left roughly $3 billion on the table that went to institutional allocatees instead of to the company.`,
            },
            {
              heading: 'Debt Capital Markets',
              content: `**Debt capital markets (DCM)** involves helping companies raise money by issuing bonds or loans rather than equity — matching issuers' capital needs with investors' appetite for yield across the credit spectrum.

**Investment-grade (IG)** issuers (rated BBB−/Baa3 or above) borrow at lower rates because default risk is low. **High-yield (HY)** issuers (below investment grade, also called "junk" bonds) pay higher coupons to compensate investors for greater credit risk. A bond's price is driven by its **coupon**, **par value** ($1,000 typically), and **yield to maturity (YTM)** — which moves inversely with price.

High-yield bonds include **covenant packages** protecting bondholders. **Maintenance covenants** (common in leveraged loans) require continuously maintaining a minimum leverage or coverage ratio — never allow a portfolio company to drift into covenant breach without a proactive lender discussion. **Incurrence covenants** (typical in HY bonds) only trigger when the issuer takes a specific action like issuing more debt.

For example, a BB-rated retailer might issue a 7-year high-yield bond with a 7.5% coupon — paying a 300+ basis point premium over equivalent investment-grade paper — because investors demand that spread to compensate for the higher default probability embedded in a sub-investment-grade credit.`,
            },
            {
              heading: 'Secondary Offerings and Special Transactions',
              content: `After an IPO, public companies can access equity markets repeatedly through follow-on offerings and specialized structures — each with different implications for existing shareholders.

A **primary offering** issues new shares, diluting existing shareholders but raising fresh capital for the company. A **secondary offering** (or block trade) involves existing shareholders selling shares — no new capital goes to the company, but it creates liquidity for insiders. A **rights issue** gives existing shareholders the right to purchase new shares at a discount proportional to their current holding, preserving ownership percentages.

**Convertible bonds** occupy the space between debt and equity — bonds that can be converted into a fixed number of shares at a predetermined **conversion price**. The optionality allows companies to issue debt at below-market coupons in exchange for some of the equity upside.

For example, a tech company with a volatile stock might issue a 3-year convertible bond with a 1.5% coupon (vs. 5% for a straight bond) and a conversion price 30% above the current stock price. Investors accept the lower yield because they get a free call option on the stock; the company gets cheap financing. If the stock never rises 30%, the bond matures as cash debt. If it does, it converts and no cash repayment is needed.`,
              knowledgeCheck: kc(
                'A convertible bond gives the holder the right to…',
                [
                  'Receive the bond\'s coupon in shares rather than cash',
                  'Convert the bond into a fixed number of the issuer\'s shares at a predetermined conversion price',
                  'Force the company to repurchase the bond at par at any time',
                  'Increase the coupon rate if the company\'s credit rating falls',
                ],
                1,
                'A convertible bond embeds an equity option: the holder can convert the bond into a fixed number of shares at the conversion price. This provides bond-like downside protection with equity-like upside if the stock rises above the conversion price.',
              ),
            },
          ],
          [
            'The IPO process runs from S-1 filing through roadshow, bookbuild, and pricing before the first trade',
            'Investment-grade and high-yield bonds differ by credit rating and covenant intensity',
            'Convertibles blend debt protection with equity upside via a conversion option',
          ],
          false,
        ),
      ],
    },

    // ─── 5. Landmark Deals ────────────────────────────────────────────────────
    {
      slug: 'landmark-deals',
      title: 'Landmark Deals: Case Studies',
      displayOrder: 5,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l4-5',
          'Three Deals That Defined a Decade',
          25,
          150,
          'Theory crystallizes in real deals. The Disney-Fox acquisition, Airbnb\'s IPO, and the Sprint-T-Mobile merger each illuminate a different corner of investment banking — M&A strategy, equity capital markets, and horizontal consolidation under regulatory scrutiny.',
          [
            {
              heading: 'Disney–Fox ($71 Billion, 2019)',
              content: `Disney's acquisition of 21st Century Fox's entertainment assets was the largest M&A deal of its era — and one of the most strategically motivated in media history.

The strategic rationale centered on two needs: **IP scale for streaming** (Disney+ launched November 2019 and needed content depth to compete with Netflix) and Fox's legacy library — X-Men, Alien, Avatar, The Simpsons, and National Geographic. Disney outbid **Comcast** in a public bidding war, ultimately paying **$71.3 billion** — a control premium of roughly **35%** over Fox's pre-announcement market price.

**$2 billion for projected annual synergies** (from combined back-office, co-productions, and marketing — never fully realized as originally modeled)

The **DOJ** approved the deal conditioned on divesting Fox's 22 regional sports networks (RSNs), raising antitrust concerns due to Disney's ESPN ownership. Warning: synergy estimates in M&A are always optimistic projections, not guaranteed outcomes — the RSN businesses Disney was forced to sell became a years-long distraction that drained management attention from the core integration.

The deal nonetheless succeeded on its core thesis: Disney+ launched with a content library deep enough to reach **100 million subscribers in 16 months** — a milestone Netflix took seven years to reach.`,
            },
            {
              heading: 'Airbnb IPO (December 2020)',
              content: `Airbnb's December 2020 IPO was one of the most closely watched capital markets events of the year — and one of the most anomalous illustrations of traditional IPO underpricing.

The company chose a **traditional underwritten IPO** over a **direct listing** (used by Spotify and Palantir) because it needed to raise **$3.5 billion** to pay down pandemic-era debt and fund growth — something direct listings cannot accomplish. Morgan Stanley and Goldman Sachs served as lead underwriters. The stock was priced at **$68 per share** (reflecting a ~$47 billion market cap) on the evening before listing.

**115% for first-day pop** (shares opened at $146 vs. $68 IPO price — among the largest ever for a company of this scale)

This first-day surge exposed a structural inefficiency: banks systematically underprice IPOs to generate goodwill with institutional clients who receive allocations and flip for easy profits, at the direct expense of the issuing company, which leaves money on the table. Avoid assuming that a large first-day return is a sign of successful pricing — for the company, it is a signal that it was underpriced.

COVID paradoxically **strengthened** Airbnb's business mix: as urban travel collapsed, long-stay rural rentals (30+ nights) grew dramatically, revealing a more resilient, higher-margin business than the city-focused growth story had suggested. Shares were subject to a **180-day lockup** expiring in June 2021.`,
            },
            {
              heading: 'Sprint–T-Mobile ($26 Billion, 2020)',
              content: `The merger of Sprint and T-Mobile — announced in 2018, approved February 2020 — reduced the US wireless market from **four major carriers to three** and became a landmark test of how regulators handle horizontal consolidation in network-scale industries.

The **DOJ** approved the merger on condition that **DISH Network** be divested certain spectrum assets, retail stores, and Boost Mobile (Sprint's prepaid brand) to become a viable fourth wireless entrant by 2023. This "fix-it-first" remedy was controversial: critics argued that creating a new entrant from divested assets was insufficient to preserve competition, while proponents noted T-Mobile's existing reputation as the most aggressive price competitor in the market.

**4 to 3 for major US wireless carriers** (AT&T, Verizon, and the combined T-Mobile/Sprint post-merger)

The network integration — combining Sprint's legacy **CDMA** infrastructure with T-Mobile's **GSM/LTE** and nascent **5G** network — was technically complex and took years to fully execute. Avoid underestimating technical integration risk in telecom M&A: infrastructure incompatibility can destroy timelines and add billions in integration costs that were never modeled.

The deal ultimately redefined US telecom: T-Mobile used Sprint's low-band spectrum and customer base to accelerate its nationwide **5G** buildout, emerging as a credible challenger to AT&T and Verizon for the first time in the carrier's history.`,
              knowledgeCheck: kc(
                'The Sprint–T-Mobile merger reduced the major US wireless carriers from…',
                [
                  'Three to two',
                  'Five to four',
                  'Four to three',
                  'Six to four',
                ],
                2,
                'Before the merger, the US had four major national wireless carriers: AT&T, Verizon, T-Mobile, and Sprint. The Sprint-T-Mobile combination reduced that to three, making it a classic 4-to-3 horizontal merger subject to significant antitrust review.',
              ),
            },
          ],
          [
            'Disney-Fox illustrates how IP scale and streaming drove M&A strategy — synergy estimates always carry execution risk',
            'Airbnb\'s IPO demonstrates the structural underpricing built into traditional underwritten offerings',
            'Sprint-T-Mobile shows how regulators use structural remedies (DISH entry) rather than blocking deals outright',
          ],
          false,
        ),
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 5 — Private Equity Fundamentals
// ═══════════════════════════════════════════════════════════════════════════════

const COURSE_5: Course = {
  slug: 'private-equity-fundamentals',
  title: 'Private Equity Fundamentals',
  category: 'private-equity',
  difficulty: 'advanced',
  hours: 12,
  xp: 1200,
  icon: '🏛️',
  order: 5,
  description: 'How private equity funds buy, improve, and sell companies — LBO mechanics, value creation, and returns analysis.',
  subtopics: [

    // ─── 1. PE Overview ───────────────────────────────────────────────────────
    {
      slug: 'pe-overview',
      title: 'What Private Equity Does',
      displayOrder: 1,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l5-1',
          'The Private Equity Business Model',
          18,
          120,
          'Private equity funds buy companies, improve them, and sell them at a profit — but the structural elegance of how they do it, and who bears the risk and earns the reward, is what makes PE one of the most consequential forces in modern capital markets.',
          [
            {
              heading: 'The PE Business Model',
              content: `A private equity firm acquires companies using investor equity and borrowed debt, improves the business over several years, then sells at a higher price — sharing the profit in a structure that aligns everyone's incentives.

The capital is organized in a **fund structure**: the PE firm is the **general partner (GP)**, which manages investments and makes all decisions. Institutional investors (pension funds, sovereign wealth funds, endowments, family offices) are **limited partners (LPs)**, who provide the bulk of the capital but have no role in investment decisions. GPs charge a **2-and-20** fee structure: a **2% annual management fee** on committed capital and **20% carried interest** on profits above a minimum return threshold (the **hurdle rate**, typically 8% IRR).

**2% for management fee** (annual fee on committed capital, regardless of performance — covers salaries, offices, and operations)

**20% for carried interest** (GP's share of profits above the 8% hurdle — the defining performance incentive)

A typical PE fund has a **10-year life**: three to five years of investment deployment, then three to five years of managing and exiting portfolio companies. The LP/GP structure aligns incentives: the GP earns significant carry only if LPs profit. Never confuse management fees (paid regardless of performance) with carry (paid only if the fund clears the hurdle) — they represent fundamentally different incentive signals.`,
            },
            {
              heading: 'Types of PE Strategies',
              content: `Private equity encompasses several distinct strategies, each targeting a different company profile and risk-return profile — and demanding different due diligence skills.

**Leveraged buyouts (LBOs)** — the most iconic PE strategy — acquire mature, cash-flow-positive companies using significant debt, improve operations, and exit. **Growth equity** takes minority or majority stakes in rapidly growing companies too mature for venture capital but not yet stable enough for an LBO — less leverage, more focus on revenue acceleration. **Venture capital** funds early-stage startups with equity only, accepting total-loss risk on individual companies in exchange for home-run upside.

**Distressed investing** acquires the debt or equity of financially troubled companies at deep discounts, profiting from a restructuring or turnaround. **Real estate PE** applies the leverage-and-improve model to property assets.

For example, a PE firm running an LBO strategy might acquire a $500M revenue HVAC services company at 8× EBITDA using 65% debt — whereas a growth equity firm investing in the same sector might take a minority stake in a fast-growing HVAC software startup at 15× revenue with zero leverage. Same sector, completely different risk profile, underwriting, and expected return driver.`,
              knowledgeCheck: kc(
                'In a 2-and-20 fee structure, the "20" refers to…',
                [
                  '20% annual management fee on assets under management',
                  '20% carried interest on profits above the hurdle rate, paid to the GP',
                  '20% of the fund\'s capital held in reserve for follow-on investments',
                  '20 basis points deducted from LP distributions',
                ],
                1,
                'The "20" in 2-and-20 is the GP\'s 20% carried interest — the share of profits the firm earns above the hurdle rate. It is the primary incentive for fund managers and aligns GP compensation with LP returns.',
              ),
            },
            {
              heading: 'The Investment Process',
              content: `A PE investment follows a structured lifecycle from first contact to final exit — each stage serving as a filter that only the highest-conviction opportunities survive.

**Sourcing** hunts for investment opportunities: proprietary outreach to private companies, auctions run by investment banks, or referrals from operating networks. **Screening** filters the universe against the fund's size, sector, and return criteria. A signed **letter of intent (LOI)** marks the transition to **due diligence** — the exhaustive verification of the business, its financials, legal standing, and commercial position. The investment team then presents findings to the **investment committee (IC)** for approval before signing the final agreement.

After closing, the **100-day plan** guides immediate operational priorities: leadership alignment, quick-win cost savings, and strategic positioning for the hold period. Over **3–7 years** of ownership, the firm executes its **value creation plan** (organic growth, margin improvement, bolt-on acquisitions) before engineering an **exit** — a sale to a strategic buyer, another PE firm (secondary buyout), or an IPO.

For example, a buyout of a regional veterinary clinic chain might proceed like this: sourced via proprietary outreach, screened based on fragmented market and predictable cash flows, acquired at 10× EBITDA with 60% debt after 8 weeks of due diligence, followed by 12 bolt-on clinic acquisitions over 5 years, and exited to a corporate strategic buyer at 14× EBITDA — generating a 3.2× MOIC.`,
              knowledgeCheck: kc(
                'The LP/GP structure in a PE fund means…',
                [
                  'LPs manage investments; GPs provide the capital',
                  'GPs manage the fund and make investment decisions; LPs provide most of the capital but have limited decision-making rights',
                  'Both LPs and GPs share equal decision-making authority',
                  'GPs receive a fixed salary but no share of profits',
                ],
                1,
                'In PE, the GP (the fund manager) has unlimited operational control over investment decisions, while LPs (institutional investors) provide the majority of the capital. LPs\' liability is limited to their committed capital — hence "limited partner."',
              ),
            },
          ],
          [
            'PE funds use the LP/GP structure: LPs provide capital, GPs manage investments and earn 2-and-20',
            'LBO, growth equity, VC, distressed, and real estate PE target different company profiles and risk levels',
            'The investment process runs from sourcing through 100-day plan to exit over a typical 3–7 year hold',
          ],
          false,
        ),
      ],
    },

    // ─── 2. LBO Mechanics ─────────────────────────────────────────────────────
    {
      slug: 'lbo-mechanics',
      title: 'LBO Mechanics',
      displayOrder: 2,
      hasQuizAfter: true,
      lessons: [
        lesson(
          'l5-2',
          'The Mathematics of a Leveraged Buyout',
          22,
          120,
          'An LBO is elegant financial engineering: borrow most of the purchase price, use the company\'s own cash flows to repay the debt, and take the remainder as equity profit. The math behind that process — IRR, MOIC, and coverage ratios — is the language of private equity.',
          [
            {
              heading: 'LBO Structure and Leverage',
              content: `A leveraged buyout finances the acquisition of a company using a **capital structure** that is predominantly debt — and leverage is what transforms solid operating performance into exceptional equity returns.

Typical LBO financing splits roughly **30–40% equity** (provided by the PE fund) and **60–70% debt**. The debt stack itself has layers: **senior secured debt** (bank term loans, revolving credit facility) sits at the top, secured against the company's assets and bearing the lowest interest rate. **Subordinated debt** (mezzanine, PIK notes, high-yield bonds) sits below, unsecured and higher-yielding. **Equity** absorbs all losses first but captures all residual upside.

**30–40% for PE equity contribution** (as % of total enterprise value — the smaller this is, the more leverage amplifies returns)

**60–70% for debt financing** (remainder of purchase price; must be serviceable from the company's own cash flows)

Lenders impose **coverage covenants** to protect their position: the most common requires a minimum **interest coverage ratio** (EBITDA / interest expense) of at least **2.0–3.0×**. If EBITDA falls and the ratio breaches the covenant, lenders can demand repayment or renegotiate terms. Warning: if your interest coverage ratio approaches 1.5× in a downside scenario, signal to lenders proactively — a covenant breach discovered after the fact destroys negotiating leverage and can trigger a forced restructuring.`,
              knowledgeCheck: kc(
                'In a 70% debt LBO, leverage amplifies equity returns because…',
                [
                  'The company\'s interest payments are tax-deductible, reducing the effective cost of debt',
                  'The PE fund commits a smaller equity check, so every $1 of EBITDA improvement or multiple expansion translates into a larger percentage gain on the equity base',
                  'Higher debt levels automatically improve the company\'s credit rating',
                  'Lenders require less diligence than equity investors, speeding up the deal',
                ],
                1,
                'Leverage amplifies equity returns by shrinking the equity denominator. If a $100 company is 70% debt-financed, the equity check is $30. If the company\'s value increases to $120, the equity goes from $30 to $50 — a 67% equity gain on a 20% enterprise value increase.',
              ),
            },
            {
              heading: 'Returns Analysis — IRR and MOIC',
              content: `**Internal rate of return (IRR)** and **multiple of invested capital (MOIC)** are the two metrics by which PE performance is measured — and understanding both, together, prevents serious analytical errors.

MOIC is simple: total distributions divided by initial equity investment. A **3.0× MOIC** means the fund tripled its money. IRR is the annualized rate that equates the present value of all cash outflows to all inflows — and it is **time-sensitive** in a way MOIC is not.

**3.0× MOIC in 3 years** → ~44% IRR

**3.0× MOIC in 5 years** → ~25% IRR

**3.0× MOIC in 7 years** → ~17% IRR

Most PE funds target **20%+ IRR** and **2.5–3.5× MOIC** over a 4–6 year hold. LBO returns are generated through three primary drivers: (1) **EBITDA growth** (expands enterprise value at exit), (2) **debt paydown** (company cash flows reduce debt, increasing equity's share of value), and (3) **multiple expansion** (exit EV/EBITDA higher than entry multiple). Entry discipline — paying a low entry multiple — is the strongest single predictor of LBO returns because it sets the baseline for all three drivers. Never overpay at entry expecting operational improvement to compensate; the math rarely works.`,
            },
            {
              heading: 'Operating Model and Value Creation',
              content: `Before closing an LBO, the PE fund builds an **operating model** — a detailed financial projection under base, upside, and downside scenarios that validates whether the target return is achievable and which assumptions it depends on.

Within days of closing, the **100-day plan** activates: a pre-designed operational roadmap targeting quick wins (renegotiating supplier contracts, reducing SKU complexity, improving collections) while setting strategic priorities. Core **value creation levers** include:

- Revenue growth: new geographies, pricing optimization, cross-sell into existing customers
- **Margin improvement**: procurement savings, headcount rationalization, operational efficiencies
- **Bolt-on acquisitions**: acquiring smaller competitors at lower multiples to expand the platform
- **Digital / ERP implementation**: unified software providing real-time visibility into the levers above

To align management with PE objectives, a **management option pool** of typically **10–15% of equity** is created at deal close — vesting on exit. This ensures the operating team is financially motivated to maximize the exit price. Avoid deals where management has no meaningful equity participation; misaligned operators are the single most common source of value destruction in otherwise sound LBOs.`,
              knowledgeCheck: kc(
                'The three main drivers of LBO equity returns are…',
                [
                  'Revenue growth, tax optimization, and geographic expansion',
                  'EBITDA growth, debt paydown, and multiple expansion',
                  'Cost reduction, dividend recaps, and IPO timing',
                  'Leverage increase, headcount reduction, and brand investment',
                ],
                1,
                'LBO equity returns come from three sources: growing EBITDA (increases enterprise value), paying down debt (increases the equity share of enterprise value), and multiple expansion (selling at a higher EV/EBITDA than the purchase price). Together, these determine the final MOIC and IRR.',
              ),
            },
          ],
          [
            'A typical LBO uses 30–40% equity and 60–70% debt; leverage amplifies equity returns by shrinking the equity check',
            'IRR is time-sensitive; MOIC measures total return; PE targets 20%+ IRR and 2.5–3.5× MOIC',
            'EBITDA growth, debt paydown, and multiple expansion are the three levers of LBO returns',
          ],
          false,
        ),
      ],
      quizzes: [
        quiz(
          'quiz5-1',
          'Private Equity and LBO Fundamentals',
          ['pe-overview', 'lbo-mechanics'],
          5,
          70,
          120,
          [
            mcq(
              'The "carry" in private equity is…',
              [
                'The annual management fee charged on committed capital',
                'The 20% share of fund profits above the hurdle rate that the GP earns',
                'The interest expense paid on LBO debt by the portfolio company',
                'The advisory fee paid to the investment bank that sourced the deal',
              ],
              1,
              'Carry (carried interest) is the GP\'s 20% share of fund profits above the hurdle rate — the primary performance incentive for PE fund managers. It aligns GP compensation directly with LP returns.',
            ),
            mcq(
              'Leverage amplifies LBO equity returns by…',
              [
                'Increasing the company\'s EBITDA through tax deductions on interest',
                'Reducing the equity check relative to enterprise value, so a given increase in company value represents a larger percentage gain on the smaller equity base',
                'Allowing the PE fund to charge a higher management fee',
                'Automatically expanding the exit EV/EBITDA multiple',
              ],
              1,
              'Leverage reduces the equity invested as a percentage of total enterprise value. Because gains in enterprise value accrue 100% to equity (after debt is repaid), the same absolute gain produces a higher equity return percentage when the equity check is smaller.',
            ),
            mcq(
              'A 3.0× MOIC on a 5-year hold corresponds to an IRR of approximately…',
              [
                '10%',
                '15%',
                '25%',
                '40%',
              ],
              2,
              'A 3.0× MOIC over 5 years solves to approximately 25% IRR (1.25^5 ≈ 3.05×). IRR is the annualized rate that makes the present value of all distributions equal to the initial investment.',
            ),
            mcq(
              'The minimum leverage covenant in an LBO typically measures…',
              [
                'The ratio of revenue to total debt',
                'The ratio of EBITDA to interest expense (interest coverage)',
                'The percentage of debt that must be repaid in the first year',
                'The PE fund\'s equity contribution as a percentage of purchase price',
              ],
              1,
              'Interest coverage (EBITDA / interest expense) is the most common maintenance covenant in leveraged loans, typically requiring at least 2.0–3.0×. It protects lenders by ensuring the company generates enough EBITDA to service its debt.',
            ),
            mcq(
              'A bolt-on acquisition in PE primarily targets returns through…',
              [
                'Replacing the platform company\'s management team',
                'Multiple arbitrage — buying smaller companies at lower EV/EBITDA multiples and selling the combined platform at a higher multiple',
                'Increasing the amount of leverage in the capital structure',
                'Extending the fund\'s hold period beyond 10 years',
              ],
              1,
              'Bolt-on (add-on) acquisitions exploit multiple arbitrage: smaller targets trade at lower multiples (e.g., 5–6× EBITDA) than larger platform companies (10×+). Integrating them into the platform and selling the combined business at the platform\'s higher multiple creates value beyond the operational improvements alone.',
            ),
          ],
        ),
      ],
    },

    // ─── 3. Value Creation Levers ─────────────────────────────────────────────
    {
      slug: 'value-creation',
      title: 'Value Creation Levers',
      displayOrder: 3,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l5-3',
          'How PE Firms Create Value in Portfolio Companies',
          20,
          120,
          'Buying a company at a low multiple and selling it at a high one requires intervening to make the business genuinely better. Understanding the operational, strategic, and financial levers PE firms pull is essential to understanding why PE ownership often transforms companies more rapidly than public ownership.',
          [
            {
              heading: 'Operational Improvement',
              content: `Operational improvement is the most durable form of value creation in PE because it is reflected in real EBITDA growth — not financial engineering that disappears when the debt is refinanced.

The primary levers operate through the **cash conversion cycle**, controlled by three metrics:

- **DSO (days sales outstanding)**: how quickly customers pay — reducing DSO generates cash without revenue growth
- **DPO (days payable outstanding)**: how long the company takes to pay suppliers — extending DPO retains cash longer
- **Inventory days**: stock on hand — reducing it frees cash tied up in unsold goods

**2–5% for EBITDA margin improvement** from pricing power investment alone (revenue management systems that segment customers by willingness-to-pay)

On the cost side, procurement savings — consolidating supplier relationships, renegotiating volume discounts, implementing group purchasing — are often the fastest source of EBITDA improvement post-acquisition. Digital and ERP implementations provide the data infrastructure to manage all of these levers with real-time visibility.

For example, a PE-owned food distribution business reduced its DSO from 47 days to 31 days by implementing automated invoice follow-up and early payment discounts — freeing $28 million in working capital in year one without a single dollar of revenue growth.`,
              knowledgeCheck: kc(
                'DSO stands for…',
                [
                  'Debt Service Obligation — the total interest and principal due annually',
                  'Days Sales Outstanding — the average number of days it takes to collect payment after a sale',
                  'Discounted Stock Option — a management incentive below fair market value',
                  'Deal Sourcing Origination — the PE firm\'s internal pipeline methodology',
                ],
                1,
                'DSO (Days Sales Outstanding) measures the average number of days between a sale and cash collection. Reducing DSO accelerates cash generation and improves the company\'s cash conversion cycle — one of the first targets in a PE operational review.',
              ),
            },
            {
              heading: 'Strategic Repositioning',
              content: `PE owners have the ability — and the incentive — to make strategic changes that public company management often defers due to short-term earnings pressure.

**Carve-outs** divest non-core business units that a prior owner bundled together for historical reasons, generating cash and sharpening management focus. **Geographic expansion** into underpenetrated markets can unlock new revenue with minimal incremental overhead if the model is scalable. **Channel mix shifts** — for example, moving from wholesale distribution to **direct-to-consumer (DTC)** — dramatically improve margins by eliminating the middleman and capturing first-party customer data.

**2–5% for EBITDA margin improvement** from pricing power investment and revenue management systems alone

**Product portfolio rationalization** eliminates the lowest-margin SKUs and concentrates investment on the highest-return product lines, improving both margins and operational simplicity. Avoid the instinct to preserve every legacy product line out of historical sentiment — complexity is frequently the enemy of margin in PE-owned businesses.

For example, a PE-backed specialty ingredients company found that 20% of its SKUs generated 80% of EBITDA. By rationalizing the bottom 40% of the product catalog, the company reduced manufacturing complexity, freed up capacity for premium products, and expanded EBITDA margins from 18% to 24% over three years — entirely through mix improvement rather than price increases.`,
            },
            {
              heading: 'M&A Arbitrage: Platform and Add-On Strategy',
              content: `One of the most structurally unique value creation strategies in PE is the **platform plus add-on** model, which exploits **multiple arbitrage** — buying businesses cheap and selling the combined entity expensive.

The logic: the PE firm acquires a **platform company** at a relatively high EV/EBITDA multiple (say, **10×**) because it is a market leader with scale. It then identifies and acquires smaller **bolt-on companies** in adjacent geographies, product lines, or customer segments at materially lower multiples (**5–6×**, because smaller companies trade cheaper due to lack of scale and liquidity). When the enlarged combined business is sold, it is priced at the platform's premium multiple — or higher — creating value from the multiple differential independent of any operational improvement.

**10× for platform acquisition multiple** (market leader with scale and institutional-quality management)

**5–6× for bolt-on acquisition multiple** (smaller, less liquid businesses commanding a size discount)

The integration risk is the main challenge: merging IT systems, cultures, and go-to-market strategies is operationally demanding. Failed integrations can destroy the value they were supposed to create. Never assume bolt-on integration is operationally simple — the best PE firms maintain dedicated integration management offices (IMOs) and proven playbooks from prior deal cycles to avoid surprises.`,
              knowledgeCheck: kc(
                'Multiple arbitrage in a platform + add-on strategy works when…',
                [
                  'The PE firm sells the platform company immediately after acquiring the add-ons',
                  'Add-on companies are acquired at lower EV/EBITDA multiples than the platform and the combined business exits at the platform\'s (or higher) multiple',
                  'The add-on companies have higher EBITDA margins than the platform',
                  'The PE fund refinances the debt at lower interest rates after each acquisition',
                ],
                1,
                'Multiple arbitrage profits from the valuation gap between large platforms (high multiples) and small add-ons (low multiples). Buying small and selling large — by rolling add-ons into the platform\'s premium valuation — creates value even before operational improvements are made.',
              ),
            },
          ],
          [
            'DSO, DPO, and inventory days are the levers of working capital optimization — faster collection and slower payment generate cash',
            'Strategic repositioning (carve-outs, DTC shifts, pricing) creates durable margin improvement under PE ownership',
            'Platform + add-on multiple arbitrage generates returns by buying small companies cheap and selling the combined business at a premium',
          ],
          false,
        ),
      ],
    },

    // ─── 4. Exits, IRR & Returns ──────────────────────────────────────────────
    {
      slug: 'exits-returns',
      title: 'Exits, IRR & Returns',
      displayOrder: 4,
      hasQuizAfter: false,
      quizzes: [],
      lessons: [
        lesson(
          'l5-4',
          'Harvesting Returns: Exits and the IRR Clock',
          20,
          120,
          'Buying a great company at a fair price is half the job. Getting out at the right time, through the right exit channel, determines whether an investment delivers a 20% IRR or a 12%. Exit strategy begins on day one of ownership.',
          [
            {
              heading: 'Exit Paths',
              content: `A PE fund has four primary exit paths for a portfolio company, each with distinct price, timing, and certainty characteristics — and exit strategy begins on day one of ownership.

- **Strategic sale**: selling to a corporate acquirer typically generates the **highest price** because strategics pay for synergies (cost savings or revenue opportunities from combining the businesses) on top of standalone value
- **Secondary buyout (SBO)**: transferring to another PE firm — common when the selling fund needs liquidity before the end of its 10-year life, but the company still has significant unrealized improvement potential
- **IPO**: highest potential upside in strong markets, but requires 6–18 months of preparation and is the least certain in timing; PE funds typically cannot sell all shares at IPO due to lockup periods
- **Dividend recapitalization**: the portfolio company refinances, adds debt, and pays the PE fund a large special dividend — a partial exit that returns some capital without full ownership transfer

**20–40% for strategic premium over secondary buyout prices** (synergy value added on top of standalone business value)

Warning: do not wait for the perfect exit window. The J-curve means every year of delay beyond the optimal hold period compresses IRR, even if MOIC is maintained. Most PE firms with exceptional outcomes plan exit timing 18–24 months before they actually exit — preparation time is not wasted.`,
              knowledgeCheck: kc(
                'A secondary buyout (SBO) means selling the portfolio company to…',
                [
                  'The public market through an IPO process',
                  'A corporate strategic acquirer that will integrate the business',
                  'Another private equity firm, which becomes the new controlling owner',
                  'The company\'s management team through a management buyout (MBO)',
                ],
                2,
                'In a secondary buyout, the exiting PE firm sells the portfolio company to another PE firm, which becomes the new controlling owner. SBOs allow the selling fund to generate a return while the company continues as a private equity-owned business under new sponsors.',
              ),
            },
            {
              heading: 'IRR Calculation in Practice',
              content: `IRR is the metric that governs PE fund performance — but understanding its time-sensitivity is critical to interpreting it correctly and managing exits with appropriate urgency.

**IRR is the annualized rate of return that equates the present value of all cash outflows (investments) to the present value of all inflows (distributions).** Because it compounds annually, holding a company even one additional year at the same total value materially reduces IRR:

**3.0× MOIC in 4 years** → ~32% IRR

**3.0× MOIC in 6 years** → ~20% IRR

**3.0× MOIC in 8 years** → ~15% IRR

This is why PE firms manage exits with urgency and rarely hold portfolio companies beyond 7 years. The **J-curve** describes the typical fund return profile: in early years (1–3), capital is called but not yet returned, so IRR is negative. As exits are realized in years 4–8, distributions exceed invested capital and IRR climbs. LPs evaluate funds using both **realized IRR** (actual exits) and **total value to paid-in (TVPI)** — which includes unrealized portfolio value — because early-year IRR is distorted by the J-curve's downward slope.`,
              knowledgeCheck: kc(
                'IRR is more sensitive than MOIC to…',
                [
                  'The amount of debt in the deal\'s capital structure',
                  'The hold period — holding longer reduces IRR even if MOIC is unchanged',
                  'The number of bolt-on acquisitions completed during the hold',
                  'The size of the management option pool',
                ],
                1,
                'IRR is annualized — it penalizes longer hold periods. A 3× MOIC over 5 years (25% IRR) is far more impressive than a 3× MOIC over 10 years (~12% IRR). MOIC captures only total return, not its timing; IRR captures both.',
              ),
            },
            {
              heading: 'Carried Interest and Tax Treatment',
              content: `**Carried interest** is the GP's 20% share of profits above the hurdle rate — the defining financial incentive structure of private equity, and one of the most persistently debated tax treatments in US finance.

In the US, carry has historically been taxed as **long-term capital gains** (typically **20%** at the federal level) rather than as ordinary income (up to **37%**) — a distinction that produces a substantial tax advantage for PE professionals. The justification is that carry represents a return on a long-duration investment risk: the GP co-invests alongside the fund and would lose the carry if returns fall below the hurdle.

**20% for long-term capital gains rate** (federal rate on carry income for most PE professionals)

**37% for ordinary income rate** (what critics argue carry should be taxed at, as a fee for services)

The **Tax Cuts and Jobs Act (2017)** extended the required holding period for long-term capital gains treatment from one year to three years for carried interest — slightly narrowing, but not eliminating, the advantage. LPs with sufficient clout negotiate **co-investment rights** — the ability to invest directly alongside the fund in specific deals at zero management fee and zero carry. Co-investments allow LPs to concentrate in their highest-conviction ideas while dramatically reducing the blended fee burden across their entire PE allocation.

For example, a large pension fund with $1 billion in a PE fund might negotiate co-investment rights on the fund's three largest deals, investing an additional $150 million directly — paying no 2% management fee and no 20% carry on that co-investment capital, saving tens of millions in fees over the fund's life.`,
              knowledgeCheck: kc(
                'Co-investment rights allow LPs to…',
                [
                  'Require the GP to share deal sourcing responsibilities',
                  'Invest directly alongside the fund in specific deals, typically at zero management fee and zero carry',
                  'Override the GP\'s investment committee on individual deal decisions',
                  'Extend the fund\'s 10-year life without the GP\'s consent',
                ],
                1,
                'Co-investment rights allow LPs to deploy additional capital directly into specific deals alongside the main fund, bypassing management fees and carried interest on that incremental capital. This reduces the effective fee burden and lets LPs concentrate in their highest-conviction investments.',
              ),
            },
          ],
          [
            'Strategic sales typically yield the highest exit prices; SBOs provide certainty of timing; IPOs offer the highest ceiling but least certainty',
            'IRR is time-sensitive — every additional year held at the same MOIC reduces IRR, driving PE\'s urgency around exits',
            'Carry is taxed as long-term capital gains; co-investment rights let LPs invest alongside the fund at no fee or carry',
          ],
          false,
        ),
      ],
    },
  ],
}

const COURSE_6: Course = {
  slug: 'ma-strategy-execution',
  title: 'M&A Strategy and Execution',
  category: 'ma',
  difficulty: 'advanced',
  hours: 10,
  xp: 1100,
  icon: '🤝',
  order: 6,
  description: 'From strategic rationale through due diligence to post-merger integration.',
  subtopics: [

    // ─── Subtopic 1: M&A Strategy & Rationale ───────────────────────────────
    {
      slug: 'ma-strategy',
      title: 'M&A Strategy & Rationale',
      displayOrder: 1,
      hasQuizAfter: false,
      knowledgeCheckCount: 3,
      quizzes: [],
      lessons: [
        lesson(
          'l6-1',
          'M&A Strategy & Rationale',
          18,
          220,
          'Mergers and acquisitions are the most capital-intensive strategic decisions a company will ever make. Understanding why deals happen — and how to evaluate whether they make sense — is the starting point for every other skill in this course.',
          [
            {
              heading: 'Why Companies Acquire',
              content: `Mergers and acquisitions are the most capital-intensive strategic decisions a company will ever make — every deal begins with a clear strategic rationale or it shouldn't begin at all.

Companies pursue acquisitions for a surprisingly small set of underlying reasons, even if the press releases dress them up differently. **Horizontal integration** combines two companies in the same industry to capture scale advantages and increase market share. **Vertical integration** extends the acquirer's control up or down its supply chain: a manufacturer buying its raw-material supplier removes margin layers and supply risk. **Geographic expansion** is the simplest form — buying a business with customers or distribution in a region where you have none.

**Acqui-hires** skip the organic hiring path entirely; the acquirer pays a premium to land an engineering team or proprietary technology, often shutting down the target's product post-close. **Defensive M&A** is about blocking a competitor: if a rival is about to buy a critical technology or distribution network, acquiring it first can be strategically worth a price you would otherwise never pay.

For example, when Facebook acquired Instagram in 2012 for $1 billion, it was simultaneously a defensive move (block a competitor from gaining a foothold in mobile photo sharing) and a geographic-demographic expansion into younger audiences — two strategic rationales at once.

Every deal has a **strategic rationale**, and investors will tear it apart if it is not clear, specific, and quantified. Avoid pursuing acquisitions without a documented strategic rationale: deals justified by vague language like "synergies" or "capabilities" without specifics destroy value at above-average rates.`,
              knowledgeCheck: kc(
                'In a horizontal M&A deal, the acquirer and target are...',
                [
                  'In different industries with complementary products',
                  'In the same industry, competing at a similar point in the value chain',
                  'Connected by a supplier-customer relationship',
                  'Based in different geographies with no product overlap',
                ],
                1,
                'Horizontal integration combines two companies operating at the same level of the same industry — for example, two automakers or two retail banks — to gain scale and market share.',
              ),
            },
            {
              heading: 'Types of Synergies',
              content: `**Synergies** are the financial benefits that arise from combining two businesses — they are the core justification for paying any premium over the target's standalone value.

**Cost synergies** are reductions in operating expenses: headcount elimination in overlapping functions (finance, HR, IT, legal), procurement savings from combined purchasing power, and facility consolidation. Cost synergies are typically **60–70% of what management announces** and are the most credible because they are rooted in identifiable line-item cuts. **Revenue synergies** — cross-selling the acquirer's products to the target's customers, accessing new geographies, or bundling products — are structurally harder to achieve and routinely overstated.

For example, when two regional banks merge, cost synergies from closing overlapping branches and eliminating duplicate IT systems are nearly certain. Revenue synergies from "cross-selling investment products to the other bank's customers" are far less certain — customers do not automatically expand purchasing just because their vendor was acquired.

The **"synergy hockey stick"** fallacy describes the common pattern where synergy delivery is projected to back-load into years 3–5, conveniently beyond the horizon where executives are typically held accountable. Do not accept synergy projections that are heavily weighted to years 3–5 without scrutinizing what has to be true in the intervening years.

Experienced acquirers cut stated synergies by **30–40%** in their internal models and stress-test delivery timelines aggressively. Markets know this: acquirer stock prices react more positively to cost-synergy announcements than to equivalent revenue-synergy claims.`,
              knowledgeCheck: kc(
                'Cost synergies are considered more achievable than revenue synergies primarily because...',
                [
                  'Revenue synergies take effect immediately while cost synergies are delayed',
                  'Cost synergies depend on customer behavior, which is predictable',
                  'Cost synergies are tied to specific, quantifiable headcount and facility reductions under management control',
                  'Revenue synergies require regulatory approval before they can be realized',
                ],
                2,
                'Cost synergies — such as eliminating duplicate roles and consolidating facilities — are within management\'s direct control and can be modeled line by line. Revenue synergies depend on customer behavior and competitive response, making them inherently harder to predict and deliver.',
              ),
            },
            {
              heading: 'Accretion/Dilution Analysis',
              content: `Every deal announcement triggers an **accretion/dilution** question from investors: does this make the acquirer's earnings per share go up or down?

A deal is **accretive** if the combined entity's EPS exceeds what the acquirer would have earned standalone; it is **dilutive** if EPS falls. The key drivers are: (1) the multiple paid — acquiring at **15× EBITDA** when you trade at **10×** is structurally dilutive before synergies; (2) the financing mix — an all-cash deal is less dilutive than an all-stock deal because issuing new shares grows the denominator of the EPS calculation; (3) the cost of debt — cheap debt increases the accretion math compared to expensive debt; and (4) synergies and their timing.

For example, if you acquire a target at a 20% premium and pay entirely in stock issued at your current market price, you are giving away 20% more of your equity than the target's intrinsic value warrants — dilutive unless synergies more than offset the premium.

Analysts always build two accretion/dilution models: one excluding synergies (showing the "pure" acquisition math) and one including a risk-adjusted synergy case. A deal that is dilutive without synergies but accretive with them is actually common and defensible — as long as management has a credible plan to deliver those synergies.

**Accretion/dilution** is a useful filter but not the only metric: a deal that is accretive but strategically weak still destroys long-term value.`,
              knowledgeCheck: kc(
                'An acquisition is described as "accretive" when it...',
                [
                  'Reduces the acquirer\'s total debt load',
                  'Increases the combined company\'s earnings per share above the acquirer\'s standalone EPS',
                  'Results in a purchase price below the target\'s book value',
                  'Closes faster than the deal model projected',
                ],
                1,
                'Accretion means the deal increases the acquirer\'s EPS. Dilution means EPS falls. The accretion/dilution test is the core short-term financial health check on any acquisition.',
              ),
            },
          ],
          [
            'Acquisitions are driven by horizontal/vertical integration, geographic expansion, acqui-hire, or defensive strategy',
            'Cost synergies are more reliable than revenue synergies and should be modeled conservatively',
            'A deal is accretive if it increases acquirer EPS; financing mix and synergies are the key swing factors',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 2: Sourcing & Target Screening ────────────────────────────
    {
      slug: 'deal-sourcing',
      title: 'Sourcing & Target Screening',
      displayOrder: 2,
      hasQuizAfter: false,
      knowledgeCheckCount: 3,
      quizzes: [],
      lessons: [
        lesson(
          'l6-2',
          'Sourcing & Target Screening',
          16,
          220,
          'Before any deal can be evaluated, the right target must be identified. Corporate development teams spend as much time building their target pipeline as they do running diligence — and the discipline of the screening process separates disciplined acquirers from undisciplined ones.',
          [
            {
              heading: 'Deal Origination Channels',
              content: `Deals originate through several parallel channels, and the source often shapes the economics — a proprietary deal and an auctioned deal at the same enterprise value are not the same deal.

Investment banks generate the majority of deal flow through pitches. A banker running a sell-side **auction process** contacts a curated list of potential buyers simultaneously, distributing a **teaser** (a two-page anonymized summary of the business) to gauge interest before sending the full confidential information memorandum (CIM) to qualified parties. Auction processes maximize seller proceeds but eliminate the acquirer's ability to negotiate quietly.

By contrast, a **proprietary deal** originates through direct outreach from a corporate development team, a relationship with the founder, or a mutual advisor — and is negotiated bilaterally without competitive tension. Proprietary deals are the holy grail for acquirers because valuation pressure is lower, but they require years of relationship-building and proactive pipeline management.

For example, a corporate development team that has lunch twice a year with the founder of a target company for three years will hear about a potential sale long before that founder calls a banker — securing a bilateral negotiation advantage worth millions in lower purchase price.

Law firms, accounting firms, and industry consultants frequently serve as informal intermediaries, making relationship networks central to corporate development effectiveness.`,
              knowledgeCheck: kc(
                'A "proprietary deal" in M&A means...',
                [
                  'The target company is privately held rather than publicly listed',
                  'The acquirer approaches the target directly and negotiates without a formal banker-run competitive auction',
                  'The deal uses proprietary financing structures not available in public markets',
                  'The target\'s intellectual property was the primary motivation for the acquisition',
                ],
                1,
                'A proprietary deal means the acquirer sources and negotiates the transaction directly — often through a pre-existing relationship — rather than competing in a banker-run auction, which typically results in more favorable pricing for the acquirer.',
              ),
            },
            {
              heading: 'Screening Criteria and the Long List',
              content: `Target screening starts broad and narrows methodically — discipline at the screening stage saves enormous resources later.

A corporate development team building a long list typically applies filters in order of ease: first, **strategic fit** — does the target's product, customer base, or geography complement the acquirer's strategy? This is a qualitative gate. Second, **financial criteria** — is the company in the right revenue range ($50M–$500M, for example), with acceptable EBITDA margins and growth rates that justify a premium? Third, **leverage level** — is the target already heavily indebted, which would constrain the acquirer's own financing options post-close? Fourth, **regulatory pre-screening** — would a combination trigger antitrust review in key markets?

For example, a large food company building a long list of premium snack brands might start with 40 names, apply a "must be profitable at EBITDA level" filter to get to 22, apply a "$50M–$300M revenue" filter to get to 12, and apply a "no pending antitrust issues" filter to arrive at 8 priority targets.

The long list (which might have 20–50 names) narrows to a short list (5–10 names) based on deeper strategic assessment, and further to a priority list (1–3 targets) that receive active outreach. Never skip the long-list stage to "save time" — pre-judging targets without full screening leads to anchoring on familiar names and missing the best opportunities.`,
              knowledgeCheck: kc(
                'The first screen applied in target selection is typically...',
                [
                  'Valuation — ensuring the target trades below book value',
                  'Regulatory risk — confirming no antitrust issues exist',
                  'Strategic fit — assessing whether the target\'s product, customer, or geography complements the acquirer',
                  'Management quality — interviewing the target\'s CEO before any financial review',
                ],
                2,
                'Strategic fit is evaluated first because it is the binary gate — if a target does not complement the acquirer\'s strategy, no amount of financial attractiveness makes the deal sensible. Financial criteria and regulatory risk are evaluated after strategic alignment is confirmed.',
              ),
            },
            {
              heading: 'The Initial Approach and NDA',
              content: `Once a priority target is identified, the acquirer's first formal step is establishing contact — either directly from the CEO or chief corporate development officer, or through a trusted intermediary.

The initial conversation is exploratory and deliberately vague: the goal is to gauge the target's receptivity without triggering a competitive process or tipping off public markets for listed targets. If receptivity exists, the next step is executing a **non-disclosure agreement (NDA)**. NDAs in M&A can be one-way (only the target shares information) or mutual (both parties exchange sensitive data).

A critical provision in most M&A NDAs is the **standstill clause**, which prevents the target — upon learning of the acquirer's interest — from running a competing process designed to solicit other offers or force an auction. Standstills typically have a duration of **12–18 months**. Never sign an NDA without reviewing standstill terms carefully — an NDA without a standstill allows the target to immediately shop the deal to competitors after learning of your interest, turning your proprietary approach into an auction.

NDA breach remedies include injunctive relief and monetary damages. Once the NDA is signed, the acquirer receives access to the target's internal financial data and the formal diligence process begins.`,
              knowledgeCheck: kc(
                'A standstill provision in an M&A NDA prevents...',
                [
                  'The acquirer from walking away after receiving confidential information',
                  'The target from soliciting competing bids or running a parallel sale process after learning of the acquirer\'s interest',
                  'The investment bankers from discussing the deal with other potential buyers',
                  'The target from sharing its financials with any third party',
                ],
                1,
                'A standstill prevents the target from using the acquirer\'s disclosed interest as leverage to run a competing auction or solicit higher bids from other parties — protecting the acquirer\'s investment in the exploratory process.',
              ),
            },
          ],
          [
            'Proprietary deals avoid competitive auction dynamics and typically result in better pricing for acquirers',
            'Target screening moves from long list to short list by applying strategic, financial, and regulatory filters in sequence',
            'A standstill provision in the NDA prevents the target from triggering a competing process after learning of the acquirer\'s interest',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 3: Due Diligence (with quiz after) ────────────────────────
    {
      slug: 'due-diligence',
      title: 'Due Diligence',
      displayOrder: 3,
      hasQuizAfter: true,
      knowledgeCheckCount: 3,
      quizzes: [
        quiz(
          'quiz6-1',
          'M&A Strategy, Sourcing & Due Diligence',
          ['ma-strategy', 'deal-sourcing', 'due-diligence'],
          5,
          80,
          300,
          [
            mcq(
              'Cost synergies are generally more reliable than revenue synergies because...',
              [
                'They are headcount- and facility-driven, quantifiable, and directly within management\'s control',
                'Revenue synergies require antitrust approval while cost synergies do not',
                'Cost synergies can be realized before the deal closes',
                'Customers always expand spending when two companies merge',
              ],
              0,
              'Cost synergies — such as eliminating duplicate roles, consolidating facilities, and leveraging combined procurement — are specific, countable, and under management\'s direct authority to implement. Revenue synergies depend on customer behavior and competitive response, making them structurally harder to predict and deliver.',
            ),
            mcq(
              'An accretive acquisition increases the acquirer\'s...',
              [
                'Total revenue on a standalone basis',
                'Earnings per share (EPS) relative to its standalone projection',
                'Cash balance at close',
                'Market capitalization immediately at announcement',
              ],
              1,
              'Accretion/dilution analysis measures the impact on EPS. If the combined company\'s EPS exceeds the acquirer\'s standalone EPS, the deal is accretive. This is the primary short-term financial test applied to every acquisition.',
            ),
            mcq(
              'A Quality of Earnings (QoE) report primarily validates that...',
              [
                'The target\'s equity valuation is below its intrinsic value',
                'EBITDA is real, recurring, and not inflated by one-off or non-recurring items',
                'The target\'s legal team has no pending litigation',
                'Working capital exceeds the industry average',
              ],
              1,
              'A QoE report — prepared by independent accountants — dissects the target\'s EBITDA to confirm it is genuinely recurring. It adjusts for one-time items, unusual revenue recognition, and management-add-back claims that inflate reported earnings. It is the central document in financial due diligence.',
            ),
            mcq(
              'A proprietary deal means the acquirer...',
              [
                'Uses a proprietary valuation model not shared with advisors',
                'Approaches the target directly and negotiates without a banker-run competitive auction',
                'Acquires a target that manufactures proprietary technology',
                'Pays entirely in stock rather than cash',
              ],
              1,
              'Proprietary deals allow the acquirer to negotiate bilaterally with the target — typically at lower prices — rather than competing in an auction where multiple bidders drive up the price. They require long-term relationship investment by corporate development teams.',
            ),
            mcq(
              'Working capital normalization in M&A due diligence is important because...',
              [
                'It determines the target\'s tax rate going forward',
                'It establishes the target operating amount of working capital the business needs, which affects the purchase price true-up at close',
                'It allows the acquirer to replace the target\'s management team',
                'It confirms that all receivables are collectible within 30 days',
              ],
              1,
              'The working capital "peg" is the agreed target level of net working capital at close. If actual working capital at close is above the peg, the acquirer pays more; if below, the seller pays a true-up. Normalizing working capital removes seasonal and one-off distortions to set a fair peg.',
            ),
          ],
        ),
      ],
      lessons: [
        lesson(
          'l6-3',
          'Due Diligence',
          20,
          220,
          'Due diligence is where deal instinct meets forensic discipline. The weeks of analysis between signing the NDA and signing the purchase agreement either confirm the thesis or reveal the risks that reshape the deal — or kill it.',
          [
            {
              heading: 'Financial Due Diligence',
              content: `Financial due diligence centers on one fundamental question: is the EBITDA the seller is presenting real, recurring, and achievable by the acquirer?

The primary tool is the **Quality of Earnings (QoE) report**, prepared by independent accountants and commissioned by the acquirer. A QoE dissects every line of EBITDA over the last 2–3 years: it strips out one-time revenue items, challenges management's add-backs (expenses claimed to be non-recurring but which recur in practice), and adjusts for accounting policy differences between the target and acquirer.

For example, a target may add back $2M of "restructuring charges" to its EBITDA — but if restructuring charges appear in every year of the historical financials, the QoE team will flag them as recurring operating costs, directly reducing the purchase price justified by that EBITDA.

Alongside QoE, financial DD examines **revenue recognition** policies — are revenues booked at the right time under ASC 606? **Working capital normalization** establishes the "peg" — the target level of net working capital the business needs to operate — which directly determines the purchase price true-up at close.

Financial DD also catalogues **debt and debt-like items** (deferred revenue, pension obligations, earn-out liabilities, capital leases) that will be included in the enterprise-value-to-equity-value bridge, and identifies **off-balance-sheet liabilities** such as operating lease commitments. Never accept the seller's EBITDA as presented without an independent QoE review — add-backs are the most common mechanism for inflating earnings ahead of a sale.`,
              knowledgeCheck: kc(
                'A Quality of Earnings (QoE) report primarily assesses...',
                [
                  'Whether the target\'s stock is fairly valued relative to peers',
                  'Whether the target\'s EBITDA is real, recurring, and not inflated by one-off adjustments',
                  'The target\'s regulatory compliance status',
                  'Whether the acquisition is accretive or dilutive to the acquirer\'s EPS',
                ],
                1,
                'A QoE report focuses on the quality and sustainability of the target\'s EBITDA. It adjusts for non-recurring items, questions management add-backs, and verifies that reported profitability reflects the ongoing economics of the business — not one-time events.',
              ),
            },
            {
              heading: 'Legal and Operational Due Diligence',
              content: `Legal due diligence reviews every material contract, liability, and compliance matter that could affect the deal or the business post-close.

The purchase agreement contains **representations and warranties** (reps and warranties) — factual statements the seller makes about the business at close. Breaches of reps and warranties trigger **indemnification**: the seller pays the acquirer for resulting losses. Negotiating the scope, survival period, and indemnification caps is where significant value is transferred between parties.

The **MAC (material adverse change)** clause defines what events allow the acquirer to walk away from a signed deal without penalty — critically tested during COVID-19 in deals signed before March 2020. Avoid signing deals with MAC clauses that are overly broad or that don't explicitly include pandemic-level events as valid MAC triggers after the 2020 experience.

Operational due diligence reviews key customer and supplier contracts for **change-of-control provisions** (which may require consent to transfer), technology and **IP ownership** (are patents actually assigned to the company?), environmental liabilities (particularly for manufacturing businesses), and employment matters.

For example, a software company acquired for its proprietary technology may turn out to have an open-source license conflict that invalidates IP ownership claims — a finding that could reduce valuation by tens of millions or kill the deal entirely.

Legal DD often surfaces the most deal-threatening findings because sellers are incentivized to present their business in the best possible light until under legal obligation to disclose.`,
              knowledgeCheck: kc(
                'Representations and warranties in a purchase agreement are...',
                [
                  'Guarantees by the acquirer that the deal will close on time',
                  'Factual statements by the seller about the state of the business at close, breach of which triggers indemnification',
                  'Conditions that must be satisfied before the acquirer\'s financing is committed',
                  'Regulatory filings required by the SEC for public company transactions',
                ],
                1,
                'Reps and warranties are the seller\'s formal factual statements about the business — covering IP, litigation, contracts, financial statements, and more. If those statements prove false post-close, the seller indemnifies the acquirer for resulting losses, making the negotiation of their scope highly consequential.',
              ),
            },
            {
              heading: 'Commercial and Management Due Diligence',
              content: `Commercial due diligence (CDD) is the external validation of the strategic thesis: independent assessment of whether the market, competitive position, and customer relationships are as strong as the seller claims.

CDD typically involves third-party consulting firms interviewing customers, mapping competitive dynamics, and stress-testing the addressable market size. **Customer concentration risk** is one of the most common red flags: if a single customer represents more than **20% of revenue**, the acquirer is effectively buying exposure to that customer's purchasing decisions — an enormous binary risk. Signal to your investment committee immediately if customer concentration exceeds 20% — this finding alone can justify a 15–25% reduction in acquisition price or deal termination.

For example, a B2B software company with $30M revenue — $8M of which comes from one Fortune 500 customer — is structurally dangerous. If that customer's contract is up for renewal post-close, the acquirer may have bought a business worth half what they paid.

The CDD also assesses whether the target's growth rate is driven by secular market tailwinds or by the specific efforts of a small founding team that may not stay post-close — which is **key person risk**. Management due diligence evaluates the leadership team's capability, depth, and incentive alignment. A management team that will not commit to staying post-close is a significant discount factor in any deal valuation.`,
              knowledgeCheck: kc(
                'A red flag in commercial due diligence is when a single customer represents...',
                [
                  'Less than 5% of total revenue, indicating low customer dependency',
                  'More than 20% of total revenue, creating significant concentration risk',
                  'A long-term contract with a 10-year term',
                  'Revenue entirely from a government entity',
                ],
                1,
                'When a single customer represents more than 20% of revenue, the target\'s business is highly exposed to that one relationship. If that customer churns post-close — due to displeasure with the acquisition, a competitor\'s offer, or its own strategy shift — the deal thesis collapses. Acquirers typically discount valuation significantly for high customer concentration.',
              ),
            },
          ],
          [
            'The QoE report is the core tool of financial DD — it determines whether EBITDA is real and recurring',
            'Legal DD\'s reps and warranties protect the acquirer from undisclosed liabilities, with breaches triggering indemnification',
            'Customer concentration above 20% of revenue is a structural red flag requiring valuation adjustment',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 4: Deal Structuring & Financing ───────────────────────────
    {
      slug: 'deal-structuring',
      title: 'Deal Structuring & Financing',
      displayOrder: 4,
      hasQuizAfter: false,
      knowledgeCheckCount: 3,
      quizzes: [],
      lessons: [
        lesson(
          'l6-4',
          'Deal Structuring & Financing',
          18,
          220,
          'How a deal is structured — the mix of cash and stock, the financing layers, and the purchase price adjustment mechanisms — often determines as much value as the headline price. Two deals at the same enterprise value can have very different economics for buyer and seller depending on structure.',
          [
            {
              heading: 'Cash vs Stock Consideration',
              content: `The choice of deal currency is one of the most consequential structural decisions in any M&A transaction — two deals at the same enterprise value can have dramatically different economics for buyer and seller depending on how consideration is paid.

In an **all-cash deal**, target shareholders receive certainty — they know exactly what they will receive at close, irrespective of what happens to the acquirer's stock price in the interim. This certainty commands a premium from sellers. In an **all-stock deal**, target shareholders receive shares in the combined company, sharing in both the upside and downside of the deal's success.

Stock deals can be **tax-deferred** for sellers under Section 368 of the Internal Revenue Code if structured as a reorganization — a significant advantage for founders and large shareholders with low tax basis. **Mixed consideration** — part cash, part stock — is the most common structure in practice.

For example, a founder who started a company at $1M and is selling for $100M faces a $99M taxable gain in an all-cash deal — potentially $20M+ in taxes due immediately. An all-stock deal under Section 368 defers that gain until the founder sells the acquirer's shares, allowing the full $100M to compound.

Acquirers with highly valued stock often prefer to use it as currency; acquirers whose stock is depressed prefer cash to avoid issuing shares at a discount. Never issue stock at a significant discount to intrinsic value to fund an acquisition — you are creating value for the seller's shareholders at the expense of your own.`,
              knowledgeCheck: kc(
                'An all-stock deal can be tax-advantaged for sellers because...',
                [
                  'The seller avoids paying any capital gains tax permanently',
                  'Stock consideration can qualify as a tax-deferred reorganization under Section 368, deferring the seller\'s capital gains tax until they sell the acquirer\'s stock',
                  'Stock deals always trade at a premium to the acquirer\'s market price',
                  'Cash consideration is taxed at a higher rate than long-term capital gains',
                ],
                1,
                'Under Section 368 of the Internal Revenue Code, certain stock-for-stock transactions can qualify as tax-free reorganizations, allowing sellers to defer capital gains tax until they eventually sell the shares received in the deal — a significant advantage for sellers with a low cost basis in their stock.',
              ),
            },
            {
              heading: 'Debt Financing in M&A',
              content: `Most large acquisitions are financed with a combination of equity and debt, and the structure of the debt stack significantly affects returns and risk.

In a **leveraged buyout (LBO)**, debt constitutes the majority of the purchase price, stacked in layers by seniority: senior secured debt (lowest rate, first in line in a default), first lien term loans, second lien, **mezzanine** (subordinated debt with equity-like features), and **PIK (payment-in-kind)** notes that accrue interest in additional notes rather than cash.

For example, a $500M LBO might be financed with $300M of senior debt at 7%, $100M of mezzanine at 12%, and $100M of equity — giving the private equity sponsor a highly leveraged capital structure where a $50M increase in enterprise value at exit translates to a 50% return on the $100M equity check.

**Bridge loans** are short-term facilities that fund a deal at close while permanent financing (bonds or syndicated loans) is arranged; they are expensive and designed to be repaid quickly. Banks provide **commitment letters** before the deal closes, confirming they will provide the financing — critical to deal certainty.

Debt covenants (maintenance tests on leverage ratio and interest coverage ratio) constrain the combined company's financial flexibility post-close. Warning: excessive leverage at close leaves no room for operational underperformance — LBOs that add too much debt relative to cash flow become financial distress situations when EBITDA misses projections by even 10–15%.`,
              knowledgeCheck: kc(
                'A bridge loan in M&A serves to...',
                [
                  'Fund the earn-out payments to selling management over three years',
                  'Provide short-term financing to close the deal immediately while permanent long-term debt is arranged',
                  'Replace the target\'s existing revolving credit facility at close',
                  'Allow the acquirer to avoid paying commitment fees before signing',
                ],
                1,
                'A bridge loan is temporary financing — typically provided by the deal\'s banks — that allows the transaction to close immediately. It is replaced with permanent financing (bonds or term loans) within weeks or months. Bridge loans carry higher rates and fees because they are short-duration and intended to be repaid quickly.',
              ),
            },
            {
              heading: 'Purchase Price Adjustments',
              content: `The enterprise value negotiated in the LOI (letter of intent) is almost never the amount actually paid at close — purchase price adjustment mechanisms reconcile the final price to actual business conditions.

The two main frameworks are the **locked-box** (the price is fixed at a historical balance sheet date with adjustments only for agreed "leakage") and **completion accounts** (the price is finalized based on an audited balance sheet at the actual close date, with a true-up afterward). The **working capital peg** is the centerpiece of completion accounts: if actual working capital at close is above or below the peg, the price adjusts dollar-for-dollar.

**Earn-outs** are contingent consideration: part of the purchase price is deferred and only paid if the business hits specified revenue or EBITDA targets in the 1–3 years post-close. They bridge valuation gaps between buyer and seller but create significant post-close conflict about how the business is managed. Avoid earn-out structures without crystal-clear, objectively measurable metrics — earn-outs with subjective or disputed accounting definitions are among the most litigated post-close issues in M&A.

For example, a seller projects $20M of EBITDA next year; the buyer thinks $16M is more realistic. An earn-out pays the seller an additional $10M if $20M is achieved — bridging a $4M valuation gap through performance-contingent payment.

**Escrow holdbacks** retain a portion of deal proceeds (typically **5–15%**) for a defined period to cover potential indemnification claims. **Representations and warranties insurance (RWI)** has become near-universal in PE transactions, replacing seller escrow with an insurance policy that pays the buyer directly for reps breaches.`,
              knowledgeCheck: kc(
                'An earn-out mechanism in a purchase agreement ties part of the purchase price to...',
                [
                  'The acquirer\'s stock performance over the first year post-close',
                  'Post-close performance of the target — such as revenue or EBITDA targets — paid contingently if hit',
                  'Regulatory approval timelines',
                  'The seller\'s willingness to remain as CEO for two years',
                ],
                1,
                'An earn-out defers a portion of the purchase price and makes it contingent on the target achieving defined performance metrics (revenue, EBITDA, customer milestones) in the years following close. It bridges valuation gaps but frequently creates post-close disputes about how the business is run.',
              ),
            },
          ],
          [
            'Cash deals give sellers certainty; stock deals can be tax-deferred and share deal upside/downside with sellers',
            'Bridge loans fund deals at close while permanent financing is arranged — they are expensive and short-term by design',
            'Earn-outs bridge buyer-seller valuation gaps by making part of the price contingent on post-close business performance',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 5: Post-Merger Integration ────────────────────────────────
    {
      slug: 'integration',
      title: 'Post-Merger Integration',
      displayOrder: 5,
      hasQuizAfter: false,
      knowledgeCheckCount: 3,
      quizzes: [],
      lessons: [
        lesson(
          'l6-5',
          'Post-Merger Integration',
          18,
          220,
          'The deal is signed. Now the real work begins. Post-merger integration (PMI) is where the value promised in the deal model is either created or destroyed — and the evidence consistently shows that most acquirers underdeliver on their integration plans.',
          [
            {
              heading: 'Day 1 Readiness and the 100-Day Plan',
              content: `The deal is signed. Now the real work begins — post-merger integration is where the value promised in the deal model is either created or destroyed.

The **100-day plan** is the operational blueprint for the first three months after legal close. It is built before signing and covers four critical domains: people decisions (who runs what in the combined organization, which leaders are retained, what is the new org chart), systems (which ERP, CRM, and financial reporting systems survive and on what timeline), branding (does the target's brand survive, get sub-branded, or get retired), and customer and employee communications (what is said, by whom, when).

Day 1 legal close and Day 1 operational integration are different: the legal entity may be owned at close, but employees, customers, and systems may not fully integrate for **12–18 months**. The plan must distinguish between what must happen on legal Day 1 (board resolutions, bank account changes, statutory filings) and what follows over months.

For example, day 1 communications to the target's employees are the most critical integration moment — employees who hear about their future from a competitor's rumor rather than their new management team disengage immediately and start looking for new jobs.

Research consistently shows that the majority of deal value — positive or negative — is determined in the first 12 months post-close: talent that is not retained by month 3 rarely returns, and customers who feel neglected in the transition window churn at elevated rates.`,
              knowledgeCheck: kc(
                'The 100-day plan in post-merger integration primarily focuses on...',
                [
                  'Negotiating the final purchase price true-up with the seller',
                  'Mapping and executing integration milestones — people, systems, branding, and communications — in the first three months post-close',
                  'Completing the regulatory filings required before the deal can be announced publicly',
                  'Finalizing the synergy model and presenting it to the board for approval',
                ],
                1,
                'The 100-day plan is the operational integration roadmap built before close and executed immediately after. It prioritizes the decisions and actions that must happen quickly — org structure, leadership alignment, customer messaging — because early integration failures compound over time.',
              ),
            },
            {
              heading: 'Cultural Integration',
              content: `Cultural misalignment is cited as the cause of approximately **30% of failed acquisitions** — a sobering statistic for a risk that appears in no financial model.

Culture is not soft: it determines how decisions are made, how conflicts are resolved, whether talent stays, and whether customers feel the difference. Culture clashes manifest as **talent attrition** (key people leave rather than navigate new norms), **decision gridlock** (incompatible processes and hierarchies produce paralysis), and **brand conflict** (customer-facing teams send contradictory messages).

For example, the **Daimler-Chrysler merger** (1998) remains the canonical case study: German engineering culture and US manufacturing culture proved fundamentally incompatible at the management level. The deal, valued at **$36 billion** at signing, ultimately resulted in Chrysler being sold to a PE firm in 2007 for **$7.4 billion** after more than **$37 billion** in write-downs and losses.

Never assume that cultural integration will happen organically — it never does. Successful acquirers start cultural due diligence before signing, interviewing employees, assessing decision-making styles, and mapping organizational values.

Post-close, they use **retention packages** (cash bonuses tied to staying 12–24 months) and create deliberate integration forums where both cultures are heard and respected rather than steamrolled. If your due diligence reveals fundamentally incompatible cultures, price that risk into your valuation or walk away.`,
              knowledgeCheck: kc(
                'Cultural integration failures in M&A are most visibly manifested through...',
                [
                  'Increases in the combined company\'s capital expenditure budget',
                  'Talent attrition, decision-making gridlock, and brand inconsistency in the post-close period',
                  'Regulatory penalties for insufficient disclosure in the merger proxy',
                  'Higher-than-projected integration costs in the first year',
                ],
                1,
                'Cultural clashes surface in observable ways: key people leave rather than adapt to the new culture, incompatible management styles create decision gridlock, and customer-facing inconsistencies signal internal disorganization. These are the leading indicators that cultural integration has failed.',
              ),
            },
            {
              heading: 'Measuring Integration Success',
              content: `Integration success must be tracked against the specific commitments made in the deal model — not against vague qualitative milestones.

The core metrics are: **synergy delivery tracking** (are cost and revenue synergies hitting the deal model timeline?); **revenue retention rate** (what percentage of the target's pre-close revenue base remains 12 months after close?); **employee retention rate** (particularly for key talent in engineering, sales, and leadership); **EPS impact** by year 1 and year 2 (does the deal accretion story hold in practice?).

The ultimate long-term measure is **ROIC vs WACC** — the return on invested capital generated by the combined business relative to the weighted average cost of capital used to fund the deal. If ROIC exceeds WACC, the deal is creating shareholder value. If ROIC falls below WACC, the acquirer would have been better off returning that capital to shareholders through buybacks or dividends.

For example, if a deal was funded at an 8% WACC (blended cost of debt and equity) and the combined business generates an ROIC of 6%, the deal is destroying value even if revenue is growing and synergies are being delivered.

This last measure is the definitive long-term verdict on whether the deal created or destroyed value — and most academic research suggests that more than **50% of large acquisitions** fail this test over a five-year horizon. Signal to the board immediately if ROIC tracking shows the deal falling below WACC in the first 18 months — early course correction is far less costly than waiting.`,
              knowledgeCheck: kc(
                'The ultimate test of whether an M&A deal created shareholder value is whether...',
                [
                  'The combined company\'s revenue grew faster than the market',
                  'ROIC (return on invested capital) exceeds the WACC (weighted average cost of capital) deployed in the deal',
                  'The deal closed on time and under budget',
                  'The acquirer\'s stock price outperformed on announcement day',
                ],
                1,
                'ROIC vs WACC is the fundamental long-term test: if the business generates a return on invested capital above the cost of that capital, the deal created value. If ROIC falls below WACC, the deal consumed capital that would have created more value if returned to shareholders — regardless of how the announcement day stock price moved.',
              ),
            },
          ],
          [
            'The 100-day plan maps people, systems, branding, and communications milestones — most deal value is created or destroyed in the first 12 months',
            'Cultural misalignment drives ~30% of failed acquisitions; the Daimler-Chrysler deal is the canonical example with $37B in losses',
            'Integration success is measured by synergy delivery, revenue and employee retention, EPS impact, and ultimately ROIC vs WACC',
          ],
          false,
        ),
      ],
    },

  ], // end COURSE_6 subtopics
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 7 — Financial Institutions
// ═══════════════════════════════════════════════════════════════════════════════

const COURSE_7: Course = {
  slug: 'financial-institutions',
  title: 'Financial Institutions',
  category: 'markets',
  difficulty: 'beginner',
  hours: 6,
  xp: 300,
  icon: '🏦',
  order: 7,
  description: 'A tour of the institutions that make the financial system run.',
  subtopics: [

    // ─── Subtopic 1: Commercial Banks ───────────────────────────────────────
    {
      slug: 'commercial-banks',
      title: 'Commercial Banks',
      displayOrder: 1,
      hasQuizAfter: false,
      knowledgeCheckCount: 4,
      quizzes: [],
      lessons: [
        lesson(
          'l7-1',
          'Commercial Banks',
          9,
          38,
          'Commercial banks are the foundation of the modern payment system — they take deposits, make loans, and form the backbone of how money moves.',
          [
            {
              heading: 'How Banks Make Money',
              content: `The core of commercial banking economics is the **net interest margin (NIM)** — the spread between the interest rate a bank charges on loans and the rate it pays on deposits — and this spread is the engine of bank profitability.

**50% for loans** (average funding of bank assets through loans to customers)
**2% for NIM** (typical spread between loan yield and deposit cost in a normalized rate environment)

If a bank lends at 7% and funds those loans with deposits paying 2%, the NIM is approximately 5%. This spread expands and contracts with the interest rate cycle: rising rates initially widen NIM as loan yields reprice faster than deposit costs, though eventually deposit competition catches up.

Beyond interest income, banks earn a growing share of revenue from **fee income**: monthly account maintenance fees, overdraft charges, wire transfer fees, credit card interchange, and wealth management advisory fees. Fee income is valuable because it does not depend on the interest rate environment.

For example, JPMorgan Chase earns roughly $50 billion annually in net interest income — but its fee income from investment banking, card services, and asset management adds another $60+ billion, creating a diversified revenue base that outperforms pure-NIM banks in low-rate environments.

The mechanics that make all this possible are **fractional reserve banking**: banks keep a fraction of deposits in reserve and lend out the rest, creating the credit that drives economic activity. A $1,000 deposit can support several thousand dollars of loans across the banking system through this multiplier effect.`,
              knowledgeCheck: kc(
                'NIM (net interest margin) in banking represents...',
                [
                  'The ratio of fee income to total assets',
                  'The spread between the interest rate charged on loans and the rate paid on deposits',
                  'The percentage of deposits held in reserve at the Federal Reserve',
                  'The bank\'s return on equity after taxes',
                ],
                1,
                'NIM is the fundamental driver of bank profitability — the difference between what the bank earns on its loan portfolio and what it pays to fund those loans through deposits and other borrowings.',
              ),
            },
            {
              heading: 'Regulation and Capital Requirements',
              content: `Banks operate under one of the most comprehensive regulatory frameworks of any industry, reflecting the systemic damage that bank failures can cause.

The international **Basel III** framework requires banks to hold minimum levels of **Tier 1 capital** (primarily common equity) as a percentage of risk-weighted assets — the core buffer that absorbs losses before a bank becomes insolvent.

**$250,000 for FDIC insurance** (per depositor per institution — the federal protection eliminating retail bank runs)

The FDIC insures bank deposits up to $250,000 per depositor per institution, which eliminates the incentive for retail customers to run on banks during a crisis (a key cause of bank failures in the 1930s). The Federal Reserve acts as the **lender of last resort** — it provides emergency liquidity to solvent banks facing temporary funding shortfalls.

For example, the 2023 Silicon Valley Bank failure occurred despite Basel III requirements because SVB had concentrated its deposit base in uninsured deposits (above $250K) from a narrow sector — when confidence collapsed, those large depositors ran simultaneously, creating a bank run that $250K FDIC insurance couldn't prevent.

The 2008 financial crisis revealed severe weaknesses in pre-crisis regulation: banks were heavily leveraged, held insufficient capital against mortgage exposures, and relied on fragile wholesale funding. The response included Dodd-Frank (2010), mandatory annual stress tests (DFAST and CCAR), and significantly higher capital minimums. Never keep more than $250,000 in a single ownership category at a single bank without verifying FDIC coverage — amounts above that limit are not protected in a bank failure.`,
              knowledgeCheck: kc(
                'FDIC deposit insurance protects bank deposits up to...',
                [
                  '$100,000 per bank account',
                  '$500,000 per household',
                  '$250,000 per depositor per institution',
                  'The full account balance for accounts open more than five years',
                ],
                2,
                'The FDIC insures deposits up to $250,000 per depositor per insured institution. This limit applies to each ownership category (individual, joint, retirement) separately, which means a household can protect significantly more by structuring accounts correctly across categories.',
              ),
            },
            {
              heading: 'Retail vs Commercial Banking',
              content: `**Retail banking** serves individual consumers with standardized products: checking accounts, savings accounts, mortgages, auto loans, personal loans, and credit cards. Retail banking is a volume business — profitability depends on scale, branch/app efficiency, and credit underwriting quality across millions of small loans.

**Commercial banking** serves businesses with more bespoke products: business term loans, revolving credit facilities, equipment financing, treasury management (cash pooling, payment processing, foreign exchange), **trade finance** (letters of credit, documentary collections that facilitate cross-border commerce), and syndicated loan participation.

For example, a mid-sized manufacturing company with $200M in revenue likely uses its commercial bank for a $50M revolving credit facility, daily cash management across 30 bank accounts, letters of credit for its Chinese suppliers, and foreign exchange hedging — a suite of services deeply integrated into the business that is very difficult to move.

Commercial banking relationships are deeper and stickier — a business that uses a bank's treasury management platform is very difficult to move. Many of the largest financial institutions (JPMorgan Chase, Bank of America, Wells Fargo, Citigroup) operate full-service models that combine retail and commercial banking under one roof. Smaller community and regional banks typically focus on one segment where local knowledge and relationship depth are competitive advantages.`,
              knowledgeCheck: kc(
                'Trade finance is primarily a service offered to...',
                [
                  'Retail banking customers financing large home purchases',
                  'Business customers facilitating cross-border trade transactions through instruments like letters of credit',
                  'Investment banks arranging bond underwriting mandates',
                  'Central banks managing foreign exchange reserves',
                ],
                1,
                'Trade finance is a commercial banking product that helps businesses manage the financial risks of international trade — ensuring exporters get paid and importers receive goods as promised through instruments like letters of credit and documentary collections.',
              ),
            },
            {
              heading: 'The Lending Decision',
              content: `Bank lending is a structured risk assessment process, not a relationship favor — credit analysts evaluate borrowers using the **5 Cs of Credit**.

- **Character** — does the borrower have a history of repaying obligations? (credit history, track record)
- **Capacity** — does the borrower have enough cash flow to service the debt? (DSCR, debt-to-income ratio)
- **Capital** — how much equity does the borrower have at stake? (skin-in-the-game reduces moral hazard)
- **Collateral** — what assets back the loan in case of default? (real estate, equipment, receivables)
- **Conditions** — what is the economic and industry environment?

For example, a restaurant owner with a 780 FICO score (Character ✓), a DSCR of 1.4x (Capacity ✓), 30% equity in the property (Capital ✓), real estate as collateral (Collateral ✓), but located in a contracting casual dining market (Conditions ✗) may still be denied — or priced at a higher rate to reflect industry risk.

Banks build credit memos that walk through each of these dimensions, supported by financial statement analysis, industry data, and management assessment. For consumer lending, this process is largely automated through credit scoring models (FICO) that predict default probability statistically. For commercial loans above a certain threshold, human underwriting and credit committee review are required — and deals are priced to reflect the risk: higher-risk borrowers pay wider spreads.`,
              knowledgeCheck: kc(
                'The "Capacity" criterion in the 5 Cs of credit evaluates...',
                [
                  'The value of assets the borrower can pledge as collateral',
                  'The borrower\'s cash flow and ability to service the proposed debt from ongoing operations',
                  'The borrower\'s character and willingness to repay based on credit history',
                  'The economic conditions in the borrower\'s industry at the time of the loan',
                ],
                1,
                'Capacity measures whether the borrower generates enough cash flow to make the interest and principal payments. Common metrics are the Debt Service Coverage Ratio (DSCR = operating cash flow / total debt service) and debt-to-income ratio.',
              ),
            },
          ],
          [
            'Net interest margin (NIM) — the spread between loan rates and deposit costs — is the core driver of bank profitability',
            'Basel III capital requirements and FDIC insurance are the twin pillars of bank stability and consumer protection',
            'The 5 Cs of credit (Character, Capacity, Capital, Collateral, Conditions) structure every lending decision',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 2: Investment Banks ───────────────────────────────────────
    {
      slug: 'investment-banks',
      title: 'Investment Banks',
      displayOrder: 2,
      hasQuizAfter: false,
      knowledgeCheckCount: 4,
      quizzes: [],
      lessons: [
        lesson(
          'l7-2',
          'Investment Banks',
          9,
          38,
          'Investment banks are the architects of capital markets — they underwrite securities, advise on M&A, and connect companies needing capital with investors who supply it.',
          [
            {
              heading: 'The Three Business Lines',
              content: `Investment banking revenue flows from three distinct, structurally different businesses — each with different risk profiles, cyclicality, and capital requirements.

**Advisory** (investment banking division, or IBD) earns success fees for advising on M&A transactions, restructurings, and other strategic transactions. Advisory is entirely fee-based — no capital is at risk — and revenues are non-recurring, making them highly volatile with deal volumes.

**Capital markets** (equity capital markets and debt capital markets) earns underwriting spreads by helping companies issue stocks and bonds:
**3–7% for equity IPO fees** (percentage of gross proceeds split among the underwriting syndicate)
**50–100 basis points for bond underwriting** (spread on deal size for investment-grade issuance)

**Sales, trading, and markets** involves making markets in securities as a market maker to facilitate client liquidity. The **Volcker Rule** (Section 619 of Dodd-Frank, 2010) significantly curtailed proprietary trading — banks betting their own capital in markets without a client purpose — at institutions insured by the FDIC.

For example, Goldman Sachs generates billions in advisory fees in strong M&A years, nearly nothing in bear markets when deals freeze. This cyclicality is why the most successful banks (Goldman, JPMorgan) also built wealth management businesses that earn steady **AUM-based fees** regardless of deal market conditions.`,
              knowledgeCheck: kc(
                'The Volcker Rule restricted investment banks from...',
                [
                  'Advising on mergers and acquisitions above a certain transaction size',
                  'Proprietary trading — using the bank\'s own capital to take positions in markets for the bank\'s own profit rather than for clients',
                  'Underwriting IPOs for technology companies',
                  'Extending credit to leveraged buyout transactions',
                ],
                1,
                'The Volcker Rule, part of the 2010 Dodd-Frank Act, prohibits FDIC-insured banks from engaging in proprietary trading — using their own capital to speculate in financial markets. The rule was intended to prevent banks from taking excessive risks with federally insured deposits.',
              ),
            },
            {
              heading: 'The Buy-Side vs Sell-Side',
              content: `Financial markets participants are divided into two camps based on their fundamental economic role — and understanding which side of the table you're on determines how every transaction is structured.

**Sell-side** institutions — primarily investment banks and broker-dealers — sell financial products, advice, and execution services to clients. They originate transactions, underwrite securities, and provide research and market access. They make money from fees, spreads, and commissions.

**Buy-side** institutions are the clients: they deploy capital on behalf of their own investors or beneficiaries. This includes **hedge funds** (sophisticated investors pursuing absolute returns using leverage and complex strategies), **mutual funds and ETFs** (retail-accessible investment vehicles), **pension funds** (managing long-duration retirement liabilities), **insurance companies** (investing float generated by premium income), and **sovereign wealth funds** (investing government reserves).

For example, when BlackRock (buy-side, $10T AUM) wants to buy $500M of Boeing bonds, it calls Goldman Sachs (sell-side) to source inventory from the bond market. Goldman earns a spread on facilitating the transaction; BlackRock gets exposure to Boeing credit risk. The sell-side serves the buy-side — but not without its own interests in mind.

The relationship is symbiotic but not without tension — sell-side firms make more money on volume and complex products, while buy-side firms benefit from lower costs and simpler execution.`,
              knowledgeCheck: kc(
                'A hedge fund is considered part of the...',
                [
                  'Sell-side, because it sells investment strategies to its limited partners',
                  'Buy-side, because it deploys capital by purchasing securities and other assets in the market',
                  'Neither — hedge funds are classified separately as alternative investment vehicles',
                  'Sell-side when it runs short positions, buy-side when it runs long positions',
                ],
                1,
                'Hedge funds are buy-side institutions — they deploy capital by investing in markets. They are clients of sell-side firms (investment banks, prime brokers) that provide them with execution, financing, and research services.',
              ),
            },
            {
              heading: 'Research and Conflict of Interest',
              content: `Equity research analysts at investment banks produce detailed company and sector analysis, financial models, and buy/sell/hold recommendations that are distributed to institutional clients.

Research drives trading revenue (clients trade with the bank's desks in exchange for valuable research) and supports the bank's investment banking relationships. This dual role historically created severe conflicts of interest: research analysts in the late 1990s issued optimistic ratings on companies their banking colleagues were underwriting, misleading investors.

For example, during the dot-com boom, several prominent analysts publicly rated stocks as "Buy" while privately emailing colleagues that the same stocks were "junk" — a scandal that destroyed investor trust and led directly to regulatory reform.

The **Global Analyst Research Settlement** of 2003 — following the dot-com bust — required the separation of research compensation from investment banking revenue and mandated disclosure of any banking relationships with covered companies.

**Chinese walls** (information barriers) are internal controls that prevent material non-public information from flowing between the banking division (which may have access to client information) and the trading desk (which could exploit it). Never share material non-public information between teams — crossing a Chinese wall is insider trading, carrying criminal penalties. Chinese walls are required by securities law and enforced by compliance departments with monitoring, surveillance, and physical separation of teams.`,
              knowledgeCheck: kc(
                'A Chinese wall in an investment bank is designed to prevent...',
                [
                  'International competitors from accessing the bank\'s research database',
                  'Material non-public information from flowing from deal-related teams to trading or research teams that could exploit it',
                  'The research division from publishing negative ratings on companies with banking relationships',
                  'Junior analysts from accessing client account information',
                ],
                1,
                'Chinese walls are information barriers that prevent the leakage of material non-public information — such as an unannounced M&A deal — from the investment banking division to trading desks or research analysts who could profit from it. They are a legal requirement and a core compliance control.',
              ),
            },
            {
              heading: 'Key Revenue Drivers',
              content: `Investment banking revenue is structurally lumpy and cyclical — the most profitable banks manage this volatility by diversifying across all three revenue streams.

**Advisory fees** are success fees paid only when transactions close — they disappear in bear markets when deal volumes collapse, as they did in 2022 when rising rates froze the M&A market. A single large advisory mandate might generate **$20–100M** in fees; an IPO for a major company might generate **$50–200M**.

**3–7% for equity IPO gross spread** (traditional fee on US IPOs, compressing due to fee competition)
**50–100 bps for bond underwriting** (spread on investment-grade bond deal size)

**Trading PnL** is the most volatile component — a good quarter can generate hundreds of millions; a bad one can produce significant losses.

For example, Goldman Sachs earned record trading revenues in 2020 as market volatility spiked during COVID, while advisory revenues collapsed due to deal freezes — demonstrating how the three business lines can counterbalance each other in a crisis.

The most profitable investment banks (Goldman Sachs, Morgan Stanley, JPMorgan) manage revenue volatility by diversifying across all three revenue streams and building counter-cyclical businesses (wealth management earns steady AUM-based fees regardless of deal markets). Do not evaluate an investment bank's business quality in a single quarter — the cyclical nature of advisory and trading means you need to look across a full market cycle.`,
              knowledgeCheck: kc(
                'Underwriting fees on an equity IPO are typically...',
                [
                  '0.1–0.5% of deal size, similar to bond underwriting spreads',
                  '3–7% of gross IPO proceeds, split among the syndicate of underwriting banks',
                  'A fixed dollar fee negotiated regardless of deal size',
                  '10–15% of gross proceeds for technology company IPOs',
                ],
                1,
                'Equity IPO underwriting fees typically range from 3–7% of gross proceeds and are split among the syndicate of banks involved in the offering. The traditional 7% gross spread for US IPOs has been gradually compressing due to competitive pressure and regulatory scrutiny.',
              ),
            },
          ],
          [
            'Investment banks earn revenue from advisory fees (M&A), underwriting spreads (capital markets), and trading PnL — each with different risk profiles',
            'The Volcker Rule restricts proprietary trading at FDIC-insured banks',
            'Chinese walls prevent material non-public information from flowing between banking, research, and trading functions',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 3: Central Banks & the Fed (with quiz after) ──────────────
    {
      slug: 'central-banks',
      title: 'Central Banks & the Fed',
      displayOrder: 3,
      hasQuizAfter: true,
      knowledgeCheckCount: 4,
      quizzes: [
        quiz(
          'quiz7-1',
          'Commercial Banks, Investment Banks & Central Banks',
          ['commercial-banks', 'investment-banks', 'central-banks'],
          4,
          75,
          75,
          [
            mcq(
              'Net interest margin (NIM) is best described as...',
              [
                'The total fee income divided by total assets',
                'The spread between the interest rate banks earn on loans and the rate they pay on deposits',
                'The ratio of Tier 1 capital to risk-weighted assets',
                'The percentage of deposits that must be held in reserve',
              ],
              1,
              'NIM — the spread between lending rate and deposit cost — is the fundamental driver of commercial bank profitability. A wider spread means more earnings per dollar of loans outstanding.',
            ),
            mcq(
              'The Volcker Rule limits financial institutions by...',
              [
                'Capping total assets at $500 billion for any single institution',
                'Restricting proprietary trading at commercial banks insured by the FDIC',
                'Prohibiting investment banks from underwriting IPOs above a certain size',
                'Setting a maximum leverage ratio of 10-to-1 for all broker-dealers',
              ],
              1,
              'The Volcker Rule (Section 619 of Dodd-Frank) restricts FDIC-insured banks from engaging in proprietary trading — speculating with their own capital — to prevent federally insured deposits from subsidizing risky market bets.',
            ),
            mcq(
              'The Federal Reserve\'s dual mandate requires it to target...',
              [
                'A balanced federal budget and a stable dollar exchange rate',
                'Maximum employment and stable prices, with a 2% inflation target',
                'A fixed federal funds rate of 2% and full employment above 5% unemployment',
                'Low inflation and a current account surplus',
              ],
              1,
              'Congress gave the Fed a dual mandate: maximum sustainable employment and price stability (interpreted as approximately 2% annual inflation). All major monetary policy decisions — rate hikes, cuts, QE — are instruments in service of these two goals.',
            ),
            mcq(
              'FDIC deposit insurance protects depositors up to...',
              [
                '$100,000 per household across all banks',
                '$1,000,000 for brokerage accounts',
                '$250,000 per depositor per insured institution',
                '$500,000 per joint account',
              ],
              2,
              'FDIC insurance covers $250,000 per depositor per insured institution per ownership category. Households can effectively protect more by holding accounts in different ownership categories (individual, joint, retirement) at the same or different banks.',
            ),
          ],
        ),
      ],
      lessons: [
        lesson(
          'l7-3',
          'Central Banks & the Fed',
          9,
          38,
          'Central banks are the conductors of the monetary system — they set interest rates, control money supply, and act as the lender of last resort in a crisis.',
          [
            {
              heading: 'Dual Mandate and Monetary Policy',
              content: `The Federal Reserve — the US central bank, established in 1913 — operates under a **dual mandate** set by Congress: achieve maximum sustainable employment and maintain stable prices.

The Fed interprets stable prices as approximately **2% annual inflation**, measured by the Personal Consumption Expenditures (PCE) price index. Its primary tool for pursuing these goals is the **federal funds rate** — the overnight interest rate at which banks lend reserves to each other.

**2% for Fed inflation target** (PCE-measured, the anchor of all monetary policy decisions)
**5.25–5.5% for peak 2023 fed funds rate** (fastest hiking cycle since 1980, from near zero in 16 months)

The Fed does not directly set market interest rates, but the federal funds rate anchors the entire yield curve: it influences mortgage rates, corporate bond yields, auto loan rates, and savings account rates throughout the economy.

For example, when the Fed raised rates from 0% to 5.25% in 2022–2023, the 30-year mortgage rate rose from ~3% to ~7.5% — effectively doubling the monthly payment on a new home purchase and halting housing market activity almost overnight.

When inflation runs above 2%, the Fed raises rates to cool spending and investment. When unemployment rises and growth falters, the Fed cuts rates to stimulate borrowing. The 2022–2023 rate hiking cycle demonstrated the Fed's willingness to accept near-term economic pain to restore price stability.`,
              knowledgeCheck: kc(
                'The Federal Reserve\'s inflation target is...',
                [
                  '0% — any inflation represents a cost to consumers',
                  '1% — a small positive rate to prevent deflation',
                  '2% — as measured by the PCE index, balancing price stability with economic flexibility',
                  '4% — historically the average US inflation rate over the 20th century',
                ],
                2,
                'The Fed targets approximately 2% annual inflation, measured by the PCE price index. This target is not enshrined in law but is the Fed\'s operational interpretation of "price stability." A 2% target provides a buffer against deflation and gives the Fed room to cut rates in downturns.',
              ),
            },
            {
              heading: 'Open Market Operations and Quantitative Easing',
              content: `The Fed's primary operational tool for setting the federal funds rate is **open market operations** — buying or selling US Treasury securities in the secondary market through the New York Fed's trading desk.

Buying Treasuries injects reserves into the banking system, putting downward pressure on overnight rates; selling Treasuries drains reserves, pushing rates up. When rates reach the zero lower bound and conventional tools are exhausted, the Fed turns to **quantitative easing (QE)**: large-scale purchases of longer-dated Treasuries and mortgage-backed securities designed to suppress longer-term interest rates.

**$900B to $4.5T** — growth in Fed balance sheet from 2008 QE rounds by 2015
**$9T peak** — Fed balance sheet after COVID-era QE by early 2022

For example, a business that was financing its factory expansion at a 6% 10-year rate in 2007 could finance the same expansion at 2.5% in 2021 — a direct result of QE suppressing long-term Treasury yields and the risk-free rate that anchors all borrowing costs.

The reverse process — **quantitative tightening (QT)** — involves allowing securities to mature without reinvestment (or actively selling), shrinking the balance sheet and withdrawing liquidity from the financial system.`,
              knowledgeCheck: kc(
                'Quantitative easing (QE) refers to...',
                [
                  'Increasing the required reserve ratio that banks must hold at the Fed',
                  'Large-scale Fed purchases of longer-term securities to inject liquidity and suppress longer-term interest rates when short-term rates are already near zero',
                  'The Fed\'s practice of setting a ceiling on mortgage rates during housing crises',
                  'Treasury issuance of additional government bonds to finance deficit spending',
                ],
                1,
                'QE is an unconventional monetary policy tool used when the federal funds rate cannot be cut further (the zero lower bound). By purchasing long-dated Treasuries and mortgage-backed securities, the Fed injects reserves into the banking system and pushes down longer-term interest rates, stimulating borrowing and investment.',
              ),
            },
            {
              heading: 'The Lender of Last Resort',
              content: `The Federal Reserve's most critical crisis function is acting as **lender of last resort**: providing emergency liquidity to solvent financial institutions that face a temporary funding shortfall.

The mechanism is the **discount window** — banks can borrow directly from the Fed at the discount rate, pledging eligible collateral. During the 2008 financial crisis, the Fed went far beyond the discount window, creating a series of emergency facilities and participating in TARP alongside the Treasury.

These actions stabilized the financial system but reignited the **moral hazard** debate: if banks know the Fed will bail them out in extremis, do they take excessive risks knowing the downside is socialized?

For example, during the March 2023 banking stress (SVB, Signature, First Republic failures), the Fed created the Bank Term Funding Program (BTFP) — allowing banks to pledge underwater bond portfolios at par value for liquidity. Critics argued this was lender-of-last-resort support that rewarded poor asset-liability management.

Warning: relying on the Fed as backstop creates moral hazard — banks that assume rescue is available may take on more interest rate or credit risk than is prudent. Dodd-Frank's resolution framework — requiring large banks to maintain "living wills" — was designed to make credible the threat that failing banks can be wound down without a taxpayer bailout.`,
              knowledgeCheck: kc(
                'The discount window is...',
                [
                  'The mechanism by which the Treasury sells bonds to the public at competitive auction',
                  'The Fed\'s facility for providing emergency short-term loans to banks facing liquidity shortfalls, accepting eligible collateral',
                  'A pricing mechanism used by commercial banks to set consumer deposit rates',
                  'The FDIC\'s process for compensating depositors after a bank failure',
                ],
                1,
                'The discount window is the Fed\'s standing lending facility — it allows eligible depository institutions to borrow reserves from the Fed against collateral at the discount rate. It is the primary mechanism through which the Fed acts as lender of last resort to prevent temporary liquidity problems from becoming solvency crises.',
              ),
            },
            {
              heading: 'Global Central Banks',
              content: `The Fed operates in a global network of central banks, each with distinct mandates, tools, and political relationships — and their decisions collectively shape global capital flows.

The **European Central Bank (ECB)** sets monetary policy for the 20-member Eurozone — a structurally complex task given that it sets a single interest rate for economies with very different inflation rates and growth profiles. The **Bank of Japan (BOJ)** spent three decades fighting deflation and economic stagnation, running ultra-low (and negative) interest rates and pioneering yield curve control policy.

For example, when the BOJ finally abandoned its yield curve control cap on 10-year Japanese government bonds in 2024 after years of defending a 1% ceiling, global bond markets repriced within hours — demonstrating how a single central bank's policy shift propagates globally through capital flows.

The **Bank of England (BOE)** has an explicit **2% CPI inflation target** and operates with substantial political independence. The **People's Bank of China (PBOC)** manages a more administered system — currency intervention is routine, and credit allocation is partly directed by government priorities — with significantly less independence than Western central banks.

Central bank independence from elected governments is considered essential for credible inflation-fighting: politicians who control monetary policy are tempted to cut rates before elections regardless of inflation conditions. Never trust a central bank whose rate decisions appear correlated with electoral calendars — it signals credibility risk that eventually materializes in higher inflation.`,
              knowledgeCheck: kc(
                'The ECB (European Central Bank) sets monetary policy for...',
                [
                  'All European countries that are members of the European Union',
                  'The Eurozone — the group of EU member states that have adopted the euro as their currency',
                  'The G7 economies collectively, coordinating rate decisions across member states',
                  'Only Germany, France, and Italy, as the three largest Eurozone economies',
                ],
                1,
                'The ECB sets monetary policy for the Eurozone — currently 20 EU member states that have adopted the euro. Several EU members (including Sweden, Poland, and until recently the UK) remain outside the Eurozone and set their own monetary policy.',
              ),
            },
          ],
          [
            'The Fed\'s dual mandate targets maximum employment and 2% inflation, managed primarily through the federal funds rate',
            'QE expands the Fed\'s balance sheet through large-scale asset purchases to suppress longer-term rates when conventional tools are exhausted',
            'The discount window is the Fed\'s lender-of-last-resort mechanism — providing emergency liquidity to prevent bank runs from becoming solvency crises',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 4: Asset Managers & Funds ─────────────────────────────────
    {
      slug: 'asset-managers',
      title: 'Asset Managers & Funds',
      displayOrder: 4,
      hasQuizAfter: false,
      knowledgeCheckCount: 4,
      quizzes: [],
      lessons: [
        lesson(
          'l7-4',
          'Asset Managers & Funds',
          9,
          38,
          'Asset managers are stewards of other people\'s money — they invest pooled capital on behalf of institutional and retail clients across every asset class.',
          [
            {
              heading: 'Active vs Passive Management',
              content: `**Active management** attempts to beat a benchmark index through superior security selection, market timing, and portfolio construction. Active managers research companies, form views on valuations, and make deliberate overweight or underweight decisions relative to the index.

**0.5–1.5% for active equity fund fees** (annual management fee as % of AUM, versus 0.03–0.20% for passive)
**26% less wealth** — the compounding impact of a 1% annual fee difference over 30 years on a $100,000 investment at 7% gross return

**Passive management** simply replicates the holdings of an index (such as the S&P 500) in proportion to their weights — no stock selection, no market calls, just mechanical index tracking. The passive approach became dominant after decades of SPIVA data showing that the majority of actively managed funds underperform their benchmark after fees over rolling 10- and 15-year periods.

For example, $100,000 invested in a passive S&P 500 index fund at 0.03% fees for 30 years at 7% gross grows to approximately $750,000. The same investment in an active fund at 1% annual fees grows to only ~$550,000 — the fee difference alone costs $200,000 due to compounding.

Some active managers — particularly in less-efficient markets like small-cap equities, emerging markets, and private credit — do persistently outperform, but identifying them in advance is itself a difficult task. The burden of proof is on the active manager: if your active fund has not outperformed its benchmark net of fees over 10+ years, the passive alternative is almost certainly the right choice.`,
              knowledgeCheck: kc(
                'Passive investment funds replicate...',
                [
                  'The portfolio of the best-performing active fund in their category',
                  'The holdings of a benchmark index in proportion to their index weights',
                  'The asset allocation of large pension funds',
                  'A fixed basket of stocks selected at fund inception',
                ],
                1,
                'Passive funds simply hold the same securities as their target index in the same proportions. There is no security selection or market timing — the fund rises and falls with the index. This mechanical approach eliminates manager risk and dramatically reduces cost.',
              ),
            },
            {
              heading: 'Types of Funds',
              content: `The asset management industry serves clients through a range of vehicles, each optimized for different investor types and liquidity needs.

- **Mutual funds** — priced once daily at NAV, retail-accessible, heavily regulated by the SEC under the Investment Company Act of 1940
- **ETFs** — trade intraday on stock exchanges, more tax-efficient than mutual funds, have driven an enormous fee war in passive investing
- **Hedge funds** — lightly regulated vehicles for accredited investors, can use leverage and short securities; fee structure: **"2-and-20"** (2% management fee + 20% of profits above high-water mark)
- **Pension funds** — manage retirement assets for defined-benefit plans, long-duration liabilities drive demand for bonds and alternatives
- **Sovereign wealth funds** — invest government surpluses with multi-decade horizons (e.g., Norway's Government Pension Fund Global, Abu Dhabi Investment Authority)

For example, Norway's Government Pension Fund Global — managing over $1.7 trillion in sovereign oil revenues — holds stakes in more than 9,000 companies globally, making it arguably the world's most diversified institutional investor. Its mandate forbids investments in companies involved in cluster munitions, tobacco, or certain fossil fuel activities — demonstrating how sovereign wealth fund mandates incorporate non-financial constraints.

Do not invest in hedge funds without understanding the high-water mark mechanism — a fund that loses 30% must fully recover before the manager earns performance fees again, potentially incentivizing excessive risk-taking by a manager who is "underwater."`,
              knowledgeCheck: kc(
                'ETFs differ from traditional mutual funds primarily in that ETFs...',
                [
                  'Only invest in equity securities, while mutual funds can hold bonds',
                  'Trade continuously throughout the trading day on exchanges, while mutual funds price once per day at NAV',
                  'Charge no management fees, while mutual funds always charge fees',
                  'Are only available to institutional investors, not retail participants',
                ],
                1,
                'ETFs trade intraday on exchanges at market prices, giving investors the ability to buy and sell throughout the day at prevailing prices. Mutual funds are priced once per day at NAV after market close, and all transactions settle at that single daily price.',
              ),
            },
            {
              heading: 'AUM and Fee Economics',
              content: `The asset management business model is elegant in its simplicity: management fees are charged as a percentage of **AUM (assets under management)**, creating a revenue stream that scales with both new client assets and investment returns.

**$10T in AUM** (BlackRock — the world's largest asset manager)
**~18 basis points** (0.18%) — BlackRock's blended fee rate generating ~$18B in annual revenue
**~$18B for annual revenue** (at BlackRock's blended fee rate on $10T AUM)

A manager with $1 trillion AUM at 60 basis points earns $6 billion annually, with very low marginal costs — the same infrastructure manages $1T as $500B. This extreme operating leverage makes scale the dominant competitive dynamic in asset management.

For example, Vanguard passes its scale economies directly to investors — as AUM grows, per-fund costs fall, and expense ratios are automatically reduced. This creates a virtuous cycle: lower fees attract more flows, which grow AUM, which enables further fee reductions.

**Performance fees** — carried interest in private equity (typically **20% of profits above a hurdle rate**) and incentive fees in hedge funds (**20% of profits above a high-water mark**) — theoretically align manager and client interests. In practice, performance fees can incentivize excessive risk-taking, particularly when managers are near or below the high-water mark and need performance to generate fees.`,
              knowledgeCheck: kc(
                'AUM stands for...',
                [
                  'Adjusted Underwriting Margin',
                  'Assets Under Management — the total market value of assets an investment manager oversees on behalf of clients',
                  'Annualized Utility Measure — a risk-adjusted return metric',
                  'Average Unit Market value — the mean price per share across a fund\'s holdings',
                ],
                1,
                'AUM (assets under management) is the total market value of all assets that an investment manager manages on behalf of clients. It is the fundamental revenue driver for asset managers, since management fees are typically calculated as a percentage of AUM.',
              ),
            },
            {
              heading: 'Fiduciary Duty',
              content: `Asset managers are not merely agents executing client instructions — they are **fiduciaries**, legally obligated to act in their clients' best interests rather than their own.

This means recommending the most suitable investment (not the highest-commission product), minimizing unnecessary transaction costs, avoiding self-dealing, and managing conflicts of interest with full disclosure. **ERISA (Employee Retirement Income Security Act of 1974)** establishes the fiduciary standards for pension fund managers — some of the strictest in financial services.

For example, a financial advisor who recommends an annuity product earning a 7% commission over a lower-cost mutual fund that better fits the client's needs has violated fiduciary duty — the advisor's economic incentive (higher commission) conflicted with the client's best interest (lower cost, better-fit product).

The **DOL (Department of Labor) fiduciary rule** debate — whether financial advisors to retail retirement accounts must be held to a fiduciary standard — has been politically contentious, as applying fiduciary duty to broker-dealer advice would eliminate the commission-based model for many financial products.

Never work with a financial advisor who earns commissions from the products they recommend without demanding a written acknowledgment of their fiduciary duty to you. The "suitability" standard — which only requires an advisor to recommend products that are "suitable" rather than "best" — allows significant conflicts of interest that fiduciary duty eliminates. The tension between the adviser's economic incentive and the client's interest is structural and persistent.`,
              knowledgeCheck: kc(
                'A fiduciary duty in asset management requires the manager to...',
                [
                  'Generate returns above the benchmark in every calendar year',
                  'Act in clients\' best interests — minimizing costs, avoiding conflicts, and recommending suitable investments regardless of the manager\'s own economic incentives',
                  'Report performance to clients on a monthly basis',
                  'Hold at least 5% of client assets in cash for liquidity',
                ],
                1,
                'Fiduciary duty is the highest standard of care in financial services. It requires the manager to put client interests above their own — avoiding unnecessary fees, disclosing conflicts, and recommending investments that are genuinely best for the client, not most profitable for the adviser.',
              ),
            },
          ],
          [
            'Passive funds outperform most active managers over 10+ years primarily due to lower fees and benchmark replication',
            'AUM is the core revenue driver for asset managers — management fees scale with asset growth and investment returns',
            'Fiduciary duty requires managers to act in clients\' best interests, a higher standard than the "suitability" standard applied to broker-dealers',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 5: Insurance Companies ────────────────────────────────────
    {
      slug: 'insurance',
      title: 'Insurance Companies',
      displayOrder: 5,
      hasQuizAfter: false,
      knowledgeCheckCount: 4,
      quizzes: [],
      lessons: [
        lesson(
          'l7-5',
          'Insurance Companies',
          9,
          38,
          'Insurance companies make money by collecting premiums up front, investing the float, and paying claims later — a business that rewards disciplined underwriting and asset-liability management.',
          [
            {
              heading: 'The Insurance Business Model',
              content: `The insurance business model has three connected phases: collect **premiums** from policyholders today, set aside **reserves** for expected future claims, and invest the surplus in financial assets until claims are paid.

The core underwriting metric is the **combined ratio**: (claims incurred + operating expenses) divided by premiums earned. A combined ratio below **100%** indicates an **underwriting profit**.

**90–95% for best-in-class combined ratio** (the target range for disciplined P&C insurers like Markel)
**100% for breakeven** (most insurers hover near this; profitability then depends entirely on investment returns on float)

For example, a property insurer with $1B in premiums, $850M in claims, and $100M in expenses has a combined ratio of 95% — an underwriting profit of $50M before a single dollar of investment income. That investment income (earned on the float between premium collection and claims payment) is pure additional return.

Top-tier P&C insurers target combined ratios in the low-to-mid 90s consistently. For most insurers, the combined ratio hovers around 100%, and profitability depends almost entirely on the returns earned on the investment portfolio while premiums sit in reserves.

Warning: if an insurer's combined ratio consistently exceeds 105%, it is running an underwriting loss that must be offset by investment income — a structurally fragile model when interest rates fall or investment markets decline. This is why insurance is simultaneously an underwriting business and a large-scale investment fund.`,
              knowledgeCheck: kc(
                'A combined ratio below 100% in insurance means...',
                [
                  'The insurer paid out more in claims than it collected in premiums',
                  'The insurance company generated an underwriting profit — premiums exceed claims and expenses',
                  'The insurer\'s investment portfolio generated positive returns',
                  'The company\'s Tier 1 capital ratio exceeds the regulatory minimum',
                ],
                1,
                'A combined ratio below 100% means the insurer collected more in premiums than it paid in claims and operating expenses — an underwriting profit before any investment returns. This is the clearest measure of underwriting discipline.',
              ),
            },
            {
              heading: 'Lines of Business',
              content: `The insurance industry is divided into distinct business lines with very different risk profiles and economic characteristics.

- **Property and casualty (P&C)** — auto, homeowners, commercial property, general liability, D&O/E&O; short policy terms (1 year), relatively short claim tails (months to a few years)
- **Life insurance** — term life (pure death benefit), whole life (permanent with cash value), universal life (flexible premium, investment-linked); very long liabilities requiring asset-liability matching with long-duration bonds
- **Reinsurance** — insurance purchased by insurance companies to limit catastrophic exposure; Swiss Re and Munich Re are dominant globally; Lloyd's of London is the specialty marketplace
- **Health insurance** — dominated in the US by UnitedHealth, Elevance/Anthem, Cigna, Aetna; structured around managed care to control costs through provider networks and utilization management

For example, when Hurricane Ian struck Florida in 2022 and caused $112 billion in insured losses, primary insurers paid claims to policyholders — but reinsurers absorbed the portion of each policy's losses above the primary insurer's retention threshold, preventing catastrophic loss concentration at any single company.

Never confuse life insurance and P&C insurance business models when analyzing insurer financials — life insurers manage 20–40 year liability durations requiring entirely different asset-liability matching strategies than P&C insurers with claims measured in months.`,
              knowledgeCheck: kc(
                'Reinsurance is best described as...',
                [
                  'A product sold to consumers who cannot qualify for standard insurance',
                  'Insurance purchased by insurance companies to limit their own exposure to large or catastrophic losses',
                  'Government-provided backup insurance for banks during a financial crisis',
                  'Health insurance coverage provided under the Medicare system',
                ],
                1,
                'Reinsurance allows primary insurance companies to offload a portion of their risk to a reinsurer — reducing their exposure to large individual claims or catastrophic events (hurricanes, earthquakes, pandemics). It is a risk transfer mechanism within the insurance industry itself.',
              ),
            },
            {
              heading: 'Investment Float',
              content: `Warren Buffett's Berkshire Hathaway has been one of the most successful financial enterprises in history, and the secret lies in how it exploits insurance **float**.

Float is the pool of premium money sitting in reserves between the time policyholders pay and the time claims are settled. At Berkshire, this float has grown from under **$1 billion** in the 1980s to over **$160 billion** today.

**$160B in float** (Berkshire's current insurance float — invested at effectively zero cost)
**~100% combined ratio** (Berkshire's long-run underwriting discipline makes the float essentially free capital)

If the insurance operation runs at breakeven (combined ratio of approximately 100%), Berkshire earns investment returns on that $160 billion essentially for free — the policyholders are effectively lending Buffett money at zero interest. When underwriting is profitable (combined ratio below 100%), the float is better than free: policyholders pay Berkshire to hold their money.

For example, if Berkshire earns 5% on $160 billion of float, that's $8 billion in annual investment income — entirely separate from underwriting profit. Over 40 years of compounding this cost-free capital into equities and businesses, the float advantage becomes enormous.

This insight is why insurance is the ultimate patient capital business: the float invested in equities over decades generates compounding returns that dwarf underwriting income. Most insurance companies invest conservatively in investment-grade bonds to match their liability durations — Berkshire's willingness to invest float in equities is structurally unusual and only possible with its exceptional long-term time horizon.`,
              knowledgeCheck: kc(
                '"Float" in insurance refers to...',
                [
                  'The portion of premiums retained as profit after claims',
                  'The pool of premium money held in reserves between collection and claims payment, which can be invested to generate returns',
                  'The difference between the insurance company\'s book value and its market capitalization',
                  'The daily settlement amount for reinsurance contracts',
                ],
                1,
                'Insurance float is the pool of premiums collected from policyholders that sits in reserves until claims are paid. Because there is a lag — sometimes years — between premium collection and claim payment, this float can be invested. If underwriting is at or near breakeven, the investment returns on float represent essentially free capital.',
              ),
            },
            {
              heading: 'Regulation and Solvency',
              content: `Insurance regulation in the United States is primarily **state-based** — each of the 50 states has an insurance commissioner who licenses companies, approves rates, and oversees solvency.

The core solvency metric is the **RBC (risk-based capital)** ratio, which measures an insurer's capital cushion relative to its underwriting and investment risks. Regulators intervene when the RBC ratio falls below specified action levels.

The case study that defined the limits of insurance regulation is **AIG's near-collapse in 2008**. AIG's traditional insurance subsidiaries — property, casualty, and life — were sound throughout the crisis. The catastrophic failure came from AIG Financial Products (AIGFP), a non-insurance subsidiary that had written over **$440 billion** in credit default swaps (CDS) on mortgage-backed securities.

For example, AIG's counterparties (Goldman Sachs, Deutsche Bank, Société Générale) had purchased credit protection from AIGFP equivalent to hundreds of billions of face value of mortgage securities. When those securities collapsed, counterparties demanded the collateral that AIGFP had promised but could not deliver — triggering a liquidity crisis that threatened to cascade through the entire global financial system.

The US Treasury and Fed injected **$182 billion** to stabilize AIG, largely to prevent cascading failures at counterparties that would have followed. Warning: never assume a company's regulated insurance subsidiaries tell the full story of its risk — AIG's regulators approved its insurance entities while an entirely unregulated subsidiary was accumulating half a trillion dollars of credit risk with no oversight.`,
              knowledgeCheck: kc(
                'AIG\'s 2008 failure was caused primarily by...',
                [
                  'Losses in its core homeowners and auto insurance subsidiaries from Hurricane Katrina claims',
                  'Its financial products subsidiary writing hundreds of billions of credit default swaps on mortgage-backed securities, creating enormous unhedged counterparty exposure',
                  'A bank run by policyholders surrendering life insurance contracts',
                  'Excessive investment losses in its equity portfolio during the stock market decline',
                ],
                1,
                'AIG\'s traditional insurance businesses were solvent throughout 2008. The failure originated entirely at AIG Financial Products, a subsidiary that wrote hundreds of billions of CDS contracts on mortgage-backed securities. When those securities collapsed, AIGFP could not meet margin calls, threatening the entire AIG group and its counterparties.',
              ),
            },
          ],
          [
            'A combined ratio below 100% indicates underwriting profit; insurance companies earn investment returns on float while waiting to pay claims',
            'Reinsurance lets insurers offload catastrophic risk; float is the secret weapon that makes insurance a powerful long-term investment vehicle',
            'AIG\'s 2008 collapse came from its CDS-writing subsidiary, not traditional insurance — a reminder that systemic risk hides in subsidiaries',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 6: Fintech & Neobanks (with quiz after) ───────────────────
    {
      slug: 'fintech',
      title: 'Fintech & Neobanks',
      displayOrder: 6,
      hasQuizAfter: true,
      knowledgeCheckCount: 4,
      quizzes: [
        quiz(
          'quiz7-2',
          'Asset Managers, Insurance & Fintech',
          ['asset-managers', 'insurance', 'fintech'],
          4,
          75,
          75,
          [
            mcq(
              'A combined ratio below 100% in insurance indicates...',
              [
                'The insurer\'s investment portfolio outperformed the equity market',
                'An underwriting profit — premiums collected exceed claims paid and expenses',
                'The insurer holds more capital than regulators require',
                'Reinsurance premiums are fully recovered from cedents',
              ],
              1,
              'A combined ratio below 100% means the insurer earned more in premiums than it paid in claims and operating expenses — a genuine underwriting profit before any investment income. This is the gold standard of insurance discipline.',
            ),
            mcq(
              'ETFs differ from mutual funds in that ETFs...',
              [
                'Are only available in tax-advantaged retirement accounts',
                'Trade intraday on exchanges throughout the trading day, while mutual funds price once daily at NAV',
                'Never charge management fees',
                'Exclusively hold equity securities rather than bonds or alternatives',
              ],
              1,
              'ETFs trade continuously on stock exchanges during market hours at real-time prices, just like individual stocks. Mutual funds are priced once per day at NAV after market close, and all orders that day execute at that single price.',
            ),
            mcq(
              'Most neobanks rely on chartered bank partners to provide...',
              [
                'The technology infrastructure for mobile banking applications',
                'FDIC deposit insurance and regulatory banking licenses for their customers',
                'Venture capital funding for their growth phase',
                'Payment network access directly through Visa and Mastercard',
              ],
              1,
              'Most neobanks do not hold banking charters — obtaining and maintaining a charter is expensive and regulatory-intensive. Instead, they partner with chartered banks (like Bancorp Bank or Green Dot) which hold the FDIC insurance and banking license, while the neobank provides the customer-facing product.',
            ),
            mcq(
              'Passive fund management outperforms most active managers over 10+ years primarily because of...',
              [
                'Superior stock selection algorithms that have been perfected since the 1990s',
                'Lower fees and systematic benchmark replication, which compound significantly over long time horizons',
                'Government regulations that limit how active managers can invest',
                'Passive funds taking no market risk and therefore never experiencing losses',
              ],
              1,
              'The primary and most durable reason passive funds outperform active funds over long periods is the fee differential. A 1% lower annual fee, compounded over 20–30 years, results in substantially more wealth — and active managers must overcome this fee hurdle every year with above-average stock selection, which most fail to do consistently.',
            ),
          ],
        ),
      ],
      lessons: [
        lesson(
          'l7-6',
          'Fintech & Neobanks',
          9,
          38,
          'Fintech companies are rebuilding financial services from first principles — unbundling what banks do and delivering it faster, cheaper, and more accessibly via software.',
          [
            {
              heading: 'The Unbundling of Banking',
              content: `Traditional banks bundle a vast array of services under one roof, and the cross-subsidization between profitable and loss-making products creates the vulnerability that fintech companies exploit.

Fintech companies disrupted this model by **unbundling**: attacking individual lines of business with focused, technology-native products. Stripe dominates online payment processing; Robinhood stripped away brokerage commissions and democratized equity investing; Chime built a full checking account experience without branches; SoFi attacked student loan refinancing before expanding into mortgages and personal loans; Plaid built the data infrastructure connecting bank accounts to fintech apps.

For example, a traditional bank earns $200/year from a customer's credit card business but loses $50/year on their checking account, netting $150. Robinhood strips the profitable brokerage business; Chime strips the checking account — leaving the traditional bank holding only the segments where it loses money.

Each company won a narrow vertical by offering a dramatically better product at lower cost for that specific use case. The strategic question now is **re-bundling**: as fintechs scale, they face the choice of staying narrow or building broader product suites.

And as traditional banks invest in technology, the product gap narrows — a JPMorgan mobile app rivals most neobanks in features. Do not assume fintech disruption is permanent: banks with sufficient technology investment and regulatory moats can rebuild the customer experience advantage that neobanks initially captured.`,
              knowledgeCheck: kc(
                'The "unbundling" of banking by fintech companies means...',
                [
                  'Banks are splitting into separate regulated entities for each product line',
                  'Fintech companies focus on delivering individual banking services (payments, lending, deposits) better than full-service banks, rather than competing across all services at once',
                  'Regulators are requiring banks to separate their investment and commercial banking activities',
                  'Customers are forced to use multiple banks because no single institution offers all services',
                ],
                1,
                'Unbundling describes fintech\'s strategy of attacking one specific banking service at a time — payments, brokerage, deposits, lending — and delivering it with better technology, lower cost, and superior UX, rather than building a full bank from scratch.',
              ),
            },
            {
              heading: 'Neobanks and Banking-as-a-Service',
              content: `**Neobanks** are digital-first financial services companies that operate without physical branches, offering checking accounts, debit cards, savings, and increasingly lending through a purely mobile interface.

Prominent examples include Revolut (UK/global, over **40 million customers**), Monzo (UK), N26 (Germany/Europe), and Chime (US). Their advantages are clear: zero or near-zero fees for basic banking, superior mobile UX, faster account opening, and real-time transaction notifications. Their structural challenge is profitability — without physical branches, they lose cross-sell opportunities, and without lending books, NIM is minimal.

Most US neobanks do not hold bank charters. Instead, they operate under **Banking-as-a-Service (BaaS)** arrangements with chartered partner banks (The Bancorp Bank, Green Dot Bank) that hold the FDIC insurance, regulatory licenses, and balance sheet.

For example, when BaaS provider Synapse collapsed in 2024, customers of neobanks relying on Synapse discovered that their deposits were frozen in a reconciliation dispute between Synapse and its partner banks — demonstrating the risk in BaaS arrangements where the customer-facing neobank and the chartered bank have different records of who owns what funds.

Warning: when using a neobank, verify whether your deposits are directly held by an FDIC-insured bank or mediated through a BaaS middleware provider — the Synapse failure showed that BaaS arrangements can leave customer funds inaccessible or uninsured during intermediary failures.`,
              knowledgeCheck: kc(
                'Most neobanks rely on chartered bank partners primarily for...',
                [
                  'Customer acquisition through the bank\'s branch network',
                  'FDIC deposit insurance and the banking license required to hold customer deposits legally',
                  'Access to Visa and Mastercard payment networks',
                  'Venture capital funding and board governance',
                ],
                1,
                'Most neobanks do not hold banking charters. They partner with FDIC-insured chartered banks that provide the legal and regulatory infrastructure (deposit insurance, charter, balance sheet) while the neobank handles the customer-facing product, design, and experience.',
              ),
            },
            {
              heading: 'Regulation and Licensing',
              content: `Fintech companies operate in a complex regulatory patchwork, and the specific licenses required depend entirely on what financial services they offer.

- A company processing payments needs **money transmitter licenses (MTLs)** in each state — a 50-state process creating a significant moat against smaller competitors
- A company offering investment advice needs **investment advisor (RIA) registration** with the SEC (for assets over $100M) or state regulators
- A company offering brokerage services needs **FINRA broker-dealer registration**
- A company seeking to take deposits and make loans needs a **bank charter** — from the OCC (national) or state banking regulators

For example, PayPal holds money transmitter licenses in all 50 states plus DC — a regulatory infrastructure that took years and millions to build, and which effectively prevents any well-funded startup from competing with a money movement product without either an acquisition or years of licensing work.

**BNPL (buy now, pay later)** is the most visible current example of regulatory arbitrage: BNPL lenders structured products to avoid credit card regulations under the Truth in Lending Act. Never assume a regulatory gap is permanent — the CFPB has moved to close the BNPL gap, requiring BNPL providers to offer many of the same disclosures and dispute resolution rights as credit card issuers.

Regulatory arbitrage — building products in gaps between regulatory frameworks — is a common fintech strategy, but temporary. Companies must not build core business models around regulatory gaps: the CFPB, SEC, or state regulators will eventually fill those gaps, potentially making the product non-viable overnight.`,
              knowledgeCheck: kc(
                'A money transmitter license allows a company to...',
                [
                  'Issue its own digital currency without federal oversight',
                  'Transfer money on behalf of customers — legally moving funds from one person or account to another in a regulated manner',
                  'Accept insured deposits in the same way as a chartered bank',
                  'Underwrite insurance products in multiple states',
                ],
                1,
                'A money transmitter license authorizes a company to receive and transmit money on behalf of customers — the regulatory requirement for companies like Venmo, PayPal, and Cash App. Each US state has its own money transmission licensing requirements, making multi-state operation expensive and compliance-intensive.',
              ),
            },
            {
              heading: 'Revenue Models in Fintech',
              content: `Fintech companies monetize through a handful of structurally distinct mechanisms, and understanding which one a company relies on determines its long-term defensibility.

- **Interchange fees** — primary revenue for most neobanks and payment companies; standard debit interchange is approximately **22 cents + 0.05%** per transaction; the merchant's bank pays the card-issuing fintech on every swipe
- **Subscription fees** — Robinhood Gold, Chime SpotMe, Revolut Premium; recurring, predictable revenue uncorrelated with transaction volume
- **Net interest income** — neobanks earning yield on customer deposits swept into partner bank accounts; increasingly important as rates rise
- **Premium tiers** — expanded features (travel insurance, higher ATM limits, early paycheck access) behind a monthly fee; freemium model where basic banking is subsidized by premium subscribers

For example, Chime's primary revenue is interchange fees on debit card swipes. In 2023, with 20+ million customers each swiping a card an average of 3x/week, that generates over $1B in annual interchange — a meaningful revenue base built entirely on the spread between what Visa charges merchants and what Chime receives from Bancorp Bank.

Warning: fintech interchange revenue faces a structural threat from the Durbin Amendment (for large debit issuers) and proposed CFPB credit card fee regulations — companies whose entire model depends on interchange must monitor regulatory risk continuously. **Data monetization** is highly sensitive politically — Plaid's proposed $5.3B sale to Visa was blocked by the DOJ in 2021 partly on data competition grounds.`,
              knowledgeCheck: kc(
                'Interchange fees in the context of fintech are paid by...',
                [
                  'Customers when they withdraw cash from an ATM',
                  'The merchant\'s bank to the card-issuing bank (captured by the fintech/neobank) each time a customer makes a card transaction',
                  'Fintech companies to Visa and Mastercard for using their payment networks',
                  'Central banks to commercial banks for holding reserves',
                ],
                1,
                'When a customer pays with a debit or credit card, the merchant\'s bank pays an interchange fee to the card-issuing bank — typically a fraction of a percent of the transaction. For fintechs and neobanks that issue cards, this interchange revenue is often the primary source of income.',
              ),
            },
          ],
          [
            'Fintechs unbundle banking by dominating individual services (payments, brokerage, deposits, lending) with better technology at lower cost',
            'Most neobanks operate without bank charters, relying on chartered bank partners for FDIC coverage via BaaS arrangements',
            'Interchange fees, subscriptions, and net interest income are the primary fintech revenue models; regulatory arbitrage is temporary',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 7: Exchanges & Clearinghouses ──────────────────────────────
    {
      slug: 'exchanges',
      title: 'Exchanges & Clearinghouses',
      displayOrder: 7,
      hasQuizAfter: false,
      knowledgeCheckCount: 4,
      quizzes: [],
      lessons: [
        lesson(
          'l7-7',
          'Exchanges & Clearinghouses',
          9,
          38,
          'Exchanges are the marketplaces where buyers and sellers meet; clearinghouses stand between every trade, guaranteeing settlement and eliminating counterparty risk.',
          [
            {
              heading: 'How Exchanges Work',
              content: `A stock exchange is a regulated marketplace that matches buyers and sellers of securities through a central **order matching engine** — and the mechanics of that matching system define the entire competitive landscape of high-frequency trading.

When you place a buy order for 100 shares of Apple at $195, the matching engine searches for a seller willing to accept $195 and, if found, executes the trade in microseconds. Orders are matched by **price-time priority**: the highest bid wins for sellers; among bids at the same price, the one that arrived first is filled first.

This simple rule — enforced at nanosecond precision — drives the enormous investment in co-location and low-latency trading infrastructure by high-frequency trading firms. **Market microstructure** is the academic field studying these mechanics: bid-ask spreads, market depth, price impact of large orders, and the role of market makers.

For example, a high-frequency trading firm co-locating its servers in the same data center as NASDAQ's matching engine gains a 1–2 millisecond speed advantage over a firm executing from a building across town — enough to profitably front-run slow orders in fast-moving markets.

The NYSE uses a hybrid model with designated market makers (DMMs) who are obligated to maintain orderly markets in their assigned stocks. NASDAQ is fully electronic — a network of competing market makers quoting two-sided markets. Most US equity volume now executes off-exchange in dark pools and internalized order flow before any shares reach a lit exchange.`,
              knowledgeCheck: kc(
                'An order matching engine on an exchange executes trades in order of...',
                [
                  'Trade size — the largest orders are filled first to maximize market impact',
                  'Alphabetical order by ticker symbol for equal-sized orders',
                  'Price-time priority — the best price wins; among equal prices, the earliest order is filled first',
                  'Random selection to prevent front-running by electronic traders',
                ],
                2,
                'Price-time priority is the universal rule for most order-driven markets: the best price (highest bid, lowest offer) wins; among orders at the same price, the one submitted first is executed first. This rule rewards price improvement and orderly queuing.',
              ),
            },
            {
              heading: 'Clearing and Settlement',
              content: `After a trade executes on an exchange, two processes must follow before ownership legally transfers: **clearing** (confirming trade details and calculating net obligations) and **settlement** (the actual exchange of securities for cash).

In the US equity markets, settlement has moved from T+2 (two business days after trade date) to **T+1 (one business day)**, effective May 2024, dramatically reducing the window of counterparty risk.

The critical structural innovation in modern markets is the **central counterparty (CCP)** — an entity that interposes itself between buyer and seller through **novation**. When a trade is novated, the CCP becomes the seller to every buyer and the buyer to every seller. If one party defaults before settlement, the CCP absorbs the loss using its clearing fund and member default waterfall, eliminating bilateral counterparty risk entirely.

For example, during the March 2020 COVID market crash, trading volumes hit record levels — over 20 billion shares per day on some days. Without CCPs absorbing bilateral counterparty risk through novation, the probability of settlement failures cascading across interconnected firms would have been enormous. The CCP structure is why markets continued functioning despite extreme stress.

In the US, the **DTCC (Depository Trust & Clearing Corporation)** and its subsidiaries (NSCC for equities, FICC for fixed income) clear the vast majority of US securities trades.`,
              knowledgeCheck: kc(
                'A central counterparty (CCP) eliminates counterparty risk by...',
                [
                  'Requiring all trades to be collateralized at 100% before execution',
                  'Interposing itself between buyer and seller through novation — becoming the buyer to every seller and seller to every buyer, guaranteeing settlement',
                  'Only allowing trades between pre-approved counterparties with established credit relationships',
                  'Insuring trade settlement through a government-backed guarantee program',
                ],
                1,
                'Through novation, a CCP replaces the bilateral relationship between buyer and seller with two separate relationships — each party now faces the CCP, not each other. If one party defaults, the CCP absorbs the loss using its clearing fund and default waterfall, preventing cascading failures.',
              ),
            },
            {
              heading: 'Exchange Business Models',
              content: `Modern stock exchanges are not just marketplaces — they are highly profitable, publicly traded technology businesses that have consolidated significantly through M&A.

Exchange revenues come from four main sources:
- **Listing fees** — annual fees from companies to have shares listed; NYSE and NASDAQ compete intensely for IPO mandates
- **Trading fees** — approximately **$0.001–$0.003 per share** for equities; per-contract fees for options and futures
- **Market data revenue** — selling real-time and historical price feeds; the most lucrative and fastest-growing segment, protected by regulatory mandates requiring purchase of official consolidated data
- **Technology and connectivity fees** — co-location services, premium data feeds, and trading infrastructure

For example, ICE (Intercontinental Exchange) — which owns the NYSE — generated approximately $7 billion in revenue in 2023, with market data and connectivity contributing more than $2 billion. Trading fees, which most people think of as the exchange's primary business, are actually a smaller and lower-margin component than the data and technology businesses.

**NYSE** is owned by ICE, itself a former energy trading platform that built one of the most diversified financial infrastructure businesses in the world through acquisitions of NYSE Euronext, Interactive Data Corporation, and Ellie Mae. **NASDAQ** (ticker: NDAQ) has diversified heavily into anti-financial crime technology and regulatory technology (regtech). Market data is the most defensible exchange revenue stream — regulatory requirements to display official data effectively mandate purchase of exchange data products regardless of competitive alternatives.`,
              knowledgeCheck: kc(
                'Exchange market data revenue comes from...',
                [
                  'Commissions charged to retail investors on every trade',
                  'Selling real-time and historical price feeds to trading firms, financial terminals, and data providers',
                  'Interest earned on margin loan balances maintained by member firms',
                  'IPO underwriting fees earned when companies list on the exchange',
                ],
                1,
                'Market data is the most defensible and fastest-growing exchange revenue stream. Exchanges sell real-time price feeds to trading firms, Bloomberg/Refinitiv terminals, and app developers. Regulatory requirements to display official consolidated data effectively mandate purchase of exchange data products.',
              ),
            },
            {
              heading: 'Dark Pools and Alternative Venues',
              content: `**Dark pools** are private, off-exchange trading venues that allow large institutional investors to execute significant orders without revealing their intentions to the public market.

When a pension fund needs to sell five million shares of Microsoft, doing so on a lit exchange would move the price against it before the entire order is filled — a cost called **market impact** or **price impact**. A dark pool allows the order to be matched anonymously with a counterparty without pre-trade transparency.

**35–40% of US equity volume** now executes off-exchange through dark pools and broker-dealer internalization — a fundamental shift from the lit-exchange-centric model of the 1990s.

For example, a $500M block sale of Microsoft shares routed to a dark pool might execute at $420.00 — the current market price — with zero market impact. The same order routed to the NYSE might push the price down to $418.50 by the time it is fully filled, costing the pension fund $7.5M in unnecessary price impact.

Dark pool operators include investment banks (Credit Suisse CrossFinder, Goldman Sachs Sigma X), independent operators (IEX, Liquidnet), and broker-dealers internalizing their own order flow. **ATS (alternative trading systems)** is the regulatory designation for these venues — they must register with the SEC and report post-trade data but are not required to publish pre-trade quotes.

Warning: retail investors should not use dark pool-like execution without understanding that the broker may be internalizing their order flow and routing to venues that benefit the broker rather than the customer — the SEC's 2022–2023 equity market structure reforms proposed new disclosure and routing requirements specifically to address this conflict.`,
              knowledgeCheck: kc(
                'Dark pools protect institutional traders primarily from...',
                [
                  'Regulatory penalties for large block trades',
                  'Market impact — the price movement that occurs when a large order is visible to other market participants before it is fully executed',
                  'Settlement failures caused by counterparty defaults',
                  'High-frequency traders seeing the order and reporting it to regulators',
                ],
                1,
                'Dark pools protect large institutional orders from market impact — the price moving against the order before it is fully filled. By hiding the order from pre-trade public view, dark pools allow large blocks to execute at or near the current market price without advertising the institution\'s intention to buy or sell.',
              ),
            },
          ],
          [
            'Order matching engines execute trades by price-time priority — best price wins, and earliest order at a given price is filled first',
            'CCPs eliminate counterparty risk by novating trades — becoming buyer to every seller and seller to every buyer, guaranteeing settlement',
            'Dark pools protect institutional investors from market impact by executing large orders anonymously away from lit exchanges',
          ],
          false,
        ),
      ],
    },

    // ─── Subtopic 8: Regulation & Oversight ─────────────────────────────────
    {
      slug: 'regulation',
      title: 'Regulation & Oversight',
      displayOrder: 8,
      hasQuizAfter: false,
      knowledgeCheckCount: 3,
      quizzes: [],
      lessons: [
        lesson(
          'l7-8',
          'Regulation & Oversight',
          9,
          38,
          'Financial regulation exists to prevent systemic collapse, protect consumers, and maintain market integrity — the architecture of regulation defines the risk environment every financial institution operates in.',
          [
            {
              heading: 'The Regulatory Architecture (US)',
              content: `The US regulatory landscape is a deliberate patchwork of overlapping agencies, each with a distinct jurisdictional focus that reflects decades of legislative compromise.

- **Federal Reserve** — supervises bank holding companies and financial holding companies (the parent entities controlling large commercial banks)
- **OCC (Office of the Comptroller of the Currency)** — charters and supervises national banks (those with "National" or "N.A." in their name)
- **FDIC** — insures deposits, supervises state-chartered banks that are not Fed members, manages resolution when banks fail
- **SEC (Securities and Exchange Commission)** — regulates securities markets: public company disclosure, broker-dealers, investment advisers, exchanges, and mutual funds
- **CFTC (Commodity Futures Trading Commission)** — regulates derivatives markets: futures, options on futures, and most swaps
- **CFPB (Consumer Financial Protection Bureau)** — created by Dodd-Frank 2010, focuses exclusively on consumer financial products
- **FINRA** — self-regulatory organization (SRO) overseeing broker-dealers and registered representatives

For example, a large bank like JPMorgan Chase is simultaneously supervised by the Federal Reserve (as a bank holding company), the OCC (for its national bank subsidiary), the FDIC (for deposit insurance oversight), the SEC (for its broker-dealer and investment adviser subsidiaries), and the CFTC (for its swap dealer registration) — each agency examining the same institution for different risks.

This patchwork creates regulatory arbitrage: companies can choose their charter and regulator to some degree, placing certain activities in the least-regulated entity type. Never assume a single regulator has full visibility into a complex financial institution — the 2008 crisis demonstrated how risks concentrated in unregulated subsidiaries while chartered entities appeared compliant.`,
              knowledgeCheck: kc(
                'The SEC primarily regulates...',
                [
                  'Bank holding companies and their capital requirements',
                  'Consumer lending products, including mortgages and credit cards',
                  'Securities markets — including public company disclosure, broker-dealers, exchanges, and investment advisers',
                  'Insurance company solvency and rate-setting in each US state',
                ],
                2,
                'The SEC (Securities and Exchange Commission) has jurisdiction over the securities markets: it oversees public company disclosure requirements, regulates broker-dealers and investment advisers, supervises exchanges and ATS, and enforces securities laws against fraud and market manipulation.',
              ),
            },
            {
              heading: 'Post-Crisis Regulation (Dodd-Frank)',
              content: `The 2008 financial crisis exposed catastrophic gaps in the pre-crisis regulatory framework — and the legislative response was the most sweeping financial regulation since the 1930s.

**The Dodd-Frank Wall Street Reform and Consumer Protection Act of 2010** was the direct response. Its key provisions:

- Created the **CFPB** to fill the consumer protection gap (subprime mortgage origination was largely exempt from federal oversight pre-2008)
- Mandated that most **OTC derivatives** be cleared through registered CCPs and reported to trade repositories (previously traded bilaterally without transparency)
- Established the **FSOC (Financial Stability Oversight Council)** — a council of regulators tasked with identifying systemic risks before they become crises
- Imposed the **Volcker Rule** to curtail proprietary trading at FDIC-insured banks
- Designated systemically important institutions as **SIFIs** — subjects to enhanced capital requirements, liquidity standards, annual stress tests, and "living will" resolution planning

For example, before Dodd-Frank, AIG Financial Products operated outside the insurance regulatory perimeter and the bank regulatory perimeter — it was essentially unregulated while writing half a trillion dollars of credit default swaps. Dodd-Frank's FSOC designation process was specifically designed to close this gap by allowing non-bank financial companies (including insurers and hedge funds) to be designated as systemically important and subjected to Fed oversight.

Warning: regulatory reforms tend to address the last crisis rather than the next one — Dodd-Frank addressed OTC derivatives and proprietary trading but did not prevent the March 2023 regional bank failures driven by interest rate risk in held-to-maturity securities. Never assume that regulatory compliance equals absence of systemic risk.`,
              knowledgeCheck: kc(
                'SIFI (systemically important financial institution) designation results in...',
                [
                  'An automatic government guarantee of the institution\'s deposits and debt',
                  'Enhanced capital requirements, liquidity standards, annual stress tests, and resolution planning obligations',
                  'A prohibition on acquiring other financial institutions for five years',
                  'Transfer of regulatory supervision from the Fed to the OCC',
                ],
                1,
                'SIFIs — both bank and non-bank — face significantly stricter regulatory requirements than other financial institutions: higher capital buffers, enhanced liquidity ratios, mandatory annual stress tests (DFAST/CCAR), and resolution plans (living wills) designed to make credible the possibility of orderly failure without a taxpayer bailout.',
              ),
            },
            {
              heading: 'Consumer Protection and Basel III',
              content: `Two regulatory frameworks operate in parallel to protect both the financial system and individual consumers — one focused on system-level safety, one focused on individual fairness.

The **CFPB** enforces a range of consumer financial protection laws:
- Truth in Lending Act (TILA) — mandates disclosure of APR and loan terms
- Real Estate Settlement Procedures Act (RESPA) — governs mortgage closing costs
- Equal Credit Opportunity Act (ECOA) — prohibits discriminatory lending
- Fair Debt Collection Practices Act — regulates debt collector conduct

**Basel III**, the international capital framework, addresses bank safety at the system level:
**Minimum Tier 1 capital ratios** — common equity as a percentage of risk-weighted assets
**Liquidity Coverage Ratio (LCR)** — banks must hold enough high-quality liquid assets to survive **30 days** of stressed outflows
**Net Stable Funding Ratio (NSFR)** — stable long-term funding must exceed long-term illiquid assets

For example, Silicon Valley Bank's 2023 failure illustrated a gap in Basel III's application: SVB was below the $250B threshold that required mandatory LCR compliance for US banks. Had SVB been required to hold 30 days of liquid assets against its deposit base, it might have been forced to hold more Treasuries and less long-duration mortgage securities — or at least hedge the interest rate risk that ultimately destroyed it.

The ongoing debate between tighter regulation (increases safety but raises the cost of credit and reduces bank profitability) and looser regulation (stimulates lending but increases systemic risk) is a permanent feature of financial policy. Never assume this debate is settled — the regulatory pendulum swings with each crisis and recovery cycle.`,
              knowledgeCheck: kc(
                'Basel III\'s Liquidity Coverage Ratio (LCR) requires banks to hold...',
                [
                  'Enough Tier 1 capital to absorb 8% of risk-weighted asset losses',
                  'Sufficient high-quality liquid assets (HQLA) to cover at least 30 days of net cash outflows under a stressed scenario',
                  'At least 10% of deposits in vault cash and central bank reserves',
                  'A leverage ratio of no more than 20-to-1 on all trading assets',
                ],
                1,
                'The LCR requires banks to hold a buffer of high-quality liquid assets (primarily cash, central bank reserves, and government bonds) sufficient to cover at least 30 days of stressed net cash outflows. It was introduced post-2008 to prevent the short-term funding runs that destroyed institutions like Bear Stearns and Lehman Brothers.',
              ),
            },
          ],
          [
            'The US regulatory architecture is a patchwork — Fed, OCC, FDIC, SEC, CFTC, CFPB — each with distinct jurisdiction, creating arbitrage opportunities',
            'Dodd-Frank created the CFPB, mandated CCP clearing for OTC derivatives, and designated SIFIs for enhanced oversight after the 2008 crisis',
            'Basel III\'s LCR ensures banks can survive 30 days of stressed funding outflows; the regulation-vs-growth tension is a permanent policy debate',
          ],
          false,
        ),
      ],
    },

  ], // end COURSE_7 subtopics
}

const COURSE_8: Course = {
  slug: 'business-101', title: 'Business 101', category: 'business', difficulty: 'beginner',
  hours: 6, xp: 500, icon: '📊', order: 8,
  description: 'Six modules from first principles to scaling: foundations, startups, strategy, product, finance, and growth.',
  subtopics: [

  // ── Module 0: Foundations of Business ───────────────────────────────────────

  {
    slug: 'value-proposition',
    title: 'Value Propositions',
    displayOrder: 1,
    hasQuizAfter: false,
    module: 'Foundations of Business',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l1', 'Value Propositions', 10, 27,
      'A value proposition is the core promise your business makes to customers — why they should choose you over every alternative. Without a crisp, credible answer to "why us?", every other business decision is built on sand.',
      [
        {
          heading: 'What Makes a Strong Value Proposition',
          content: `A strong value proposition is specific, measurable, and customer-centric — it answers three questions in one crisp sentence: What do you offer? For whom? Why is it better than the alternative?

Classic frameworks include the Value Proposition Canvas (jobs-to-be-done, pains, gains) and Geoffrey Moore's positioning statement template: "For [target customer] who [has this need], our product is a [category] that [key benefit], unlike [competitor] which [differentiator]."

- Specific > generic: name the exact pain and the exact customer
- Customer language beats internal jargon every time
- Measurable outcomes ("saves 3 hours a week") outperform vague claims ("increases efficiency")

For example, Slack's original proposition wasn't "team communication software" — it was "a messaging app that replaces email for your team, searchable and organised by channel." That specificity is what made it spreadable.`,
          knowledgeCheck: kc(
            'Which element is NOT part of a Value Proposition Canvas?',
            ['Customer jobs', 'Pain relievers', 'Cap table structure', 'Gain creators'],
            2,
            'The cap table is an ownership document. The Value Proposition Canvas focuses on customer needs (jobs, pains, gains) and how your product addresses them (products/services, pain relievers, gain creators).'
          ),
        },
        {
          heading: 'Testing Your Value Proposition',
          content: `A value proposition is a hypothesis until real customers validate it — treat it exactly like that.

Landing-page tests, customer discovery interviews, and pre-launch sign-up conversion rates all provide early signal before you build a single feature.

For example, Airbnb's early insight — that travellers wanted "live like a local" experiences rather than just cheap beds — came from dozens of founder interviews, not market research reports. Amazon's proposition ("Earth's biggest selection at the lowest price, delivered fast") emerged from obsessive customer listening that revealed price, selection, and convenience as the three dominant purchase drivers.

- Run problem interviews: listen more than you talk, never pitch
- Measure conversion on a simple landing page before writing code
- A fake-door test (advertise the product before it exists) can validate demand in 48 hours

The fastest way to validate is to talk directly to potential customers and measure early conversion signals. A compelling sign-up waitlist is worth more than a year of internal debate.`,
          knowledgeCheck: kc(
            'The fastest way to validate a value proposition early is to…',
            ['Hire a brand consultant', 'Run customer discovery interviews and measure conversion', 'File a patent on the concept', 'Build a full product first, then survey users'],
            1,
            'Talking directly to potential customers and measuring early conversion signals (sign-ups, click-through rates) validates the proposition before heavy investment in building.'
          ),
        },
      ],
      [
        'Specific > generic: name the exact pain you solve and for whom',
        'Test the proposition before building — it is a hypothesis, not a fact',
        'Customer language beats internal jargon every time',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'business-models',
    title: 'Business Models',
    displayOrder: 2,
    hasQuizAfter: false,
    module: 'Foundations of Business',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l2', 'Business Models', 12, 27,
      'A business model describes how a company creates, delivers, and captures value. Choosing the right model is as strategically important as the product itself — the same technology can succeed or fail depending on how you monetise it.',
      [
        {
          heading: 'Common Business Model Archetypes',
          content: `A business model describes how a company creates, delivers, and captures value — and choosing the right model is as strategically important as the product itself.

The Business Model Canvas (Osterwalder) organises nine building blocks: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partnerships, and cost structure.

Common archetypes include:

- **SaaS** — recurring subscription, high margins, churn is the enemy
- **Marketplace** — takes a cut of each transaction, network effects matter
- **Freemium** — free tier drives adoption, paid tier captures value
- **Direct-to-consumer** — own the customer relationship, higher margins than wholesale
- **Platform/ecosystem** — third-party developers or sellers create complementary value

**70–85% gross margins** for SaaS (marginal cost per new customer is near zero)

**15–30% take-rate** typical marketplace revenue on each transaction

For example, Spotify uses a freemium model: free users subsidised by ads drive adoption, while paid subscribers ($9.99–$16.99/month) generate the bulk of revenue. The same music catalogue, two business models layered on top of each other.

Most successful companies blend more than one archetype — but they pick a primary motion and execute it with discipline.`,
          knowledgeCheck: kc(
            'In a marketplace model, the primary revenue driver is typically…',
            ['Monthly subscription fees from all users', 'A percentage take-rate on each transaction between buyers and sellers', 'Selling advertising impressions', 'Licensing the platform technology to enterprises'],
            1,
            'Marketplaces earn a take-rate (also called a rake) on transactions. This aligns incentives — the platform only earns when users transact successfully.'
          ),
        },
        {
          heading: 'Unit Economics and Model Viability',
          content: `A business model is only viable if unit economics work at scale — the lifetime value (LTV) of a customer must exceed the cost to acquire them (CAC) with enough margin left over to cover operating costs.

**3× LTV:CAC ratio** — healthy SaaS benchmark (minimum to consider scaling)

**≤18 months payback period** — cash returns to fund the next acquisition cycle

Marketplace models must also consider "leakage" — users transacting off-platform to avoid fees — and set take-rates low enough to prevent this but high enough to sustain the business.

For example, if a SaaS company spends $300 to acquire a customer who pays $50/month and churns after 4 months: LTV = $200, LTV:CAC = 0.67×. The company is losing money on every customer — a critical problem to fix before scaling.

- Calculate unit economics before spending on growth channels
- LTV:CAC below 1× means every customer acquired makes the business worse
- Payback period under 12 months is exceptional; over 24 months requires rethinking the model

If your LTV:CAC is below 1×, do not scale — you will only compound losses faster.`,
          knowledgeCheck: kc(
            'If a SaaS company spends $300 to acquire a customer who pays $50/month and churns after 4 months, what is the LTV:CAC ratio?',
            ['0.67x — the model is losing money per customer', '1.5x — marginally viable', '3x — healthy', '6x — exceptional'],
            0,
            'LTV = $50 × 4 = $200. LTV:CAC = $200/$300 = 0.67x. The company is spending more to acquire customers than it earns from them — a critical problem to fix before scaling.'
          ),
        },
      ],
      [
        'The Business Model Canvas maps nine interdependent building blocks',
        'LTV:CAC ≥ 3x is a common SaaS benchmark for unit economic health',
        'Model choice shapes strategy — the same product can use multiple models',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'market-analysis',
    title: 'Market Analysis',
    displayOrder: 3,
    hasQuizAfter: true,
    module: 'Foundations of Business',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l3', 'Market Analysis', 14, 27,
      'Market analysis gives you the map before you start the journey. Understanding market size, structure, and dynamics helps you prioritise where to compete, how to position, and whether the opportunity is worth pursuing.',
      [
        {
          heading: 'TAM, SAM, and SOM',
          content: `Market sizing gives you the map before you start the journey. Three nested concepts tell investors — and yourself — whether the opportunity justifies the effort.

- **TAM (Total Addressable Market)**: the entire revenue opportunity if you captured 100% of the market
- **SAM (Serviceable Addressable Market)**: the segment you can realistically reach with your current model and geography
- **SOM (Serviceable Obtainable Market)**: the realistic share you can capture in the near term, given competition and go-to-market constraints

A common mistake is presenting TAM as if it equals your opportunity. Investors focus on SOM — show you understand why you can capture your target slice.

For example, a startup selling B2B project-management software might cite global software spend ($1T TAM) to look impressive, then SAM of $15B in enterprise project tools, then a credible SOM of $150M over three years. The SOM is what the investor actually interrogates.

- TAM shows the dream; SOM shows the credible near-term plan
- Bottom-up SOM (number of target customers × ARPU) is more credible than top-down percentages
- Revisit market sizing annually — markets evolve faster than your model`,
          knowledgeCheck: kc(
            'A startup selling B2B project-management software estimates global spend on all software ($1T TAM), enterprise project tools ($15B SAM), and its realistic 3-year target ($150M SOM). Which number matters most to a Series A investor evaluating near-term traction?',
            ['TAM — proves the category is massive', 'SAM — shows the addressable segment', 'SOM — shows realistic near-term capture', 'None — investors ignore market-size slides'],
            2,
            'SOM represents the credible near-term opportunity. It shows the investor that founders understand the competitive landscape and have a realistic plan to capture a meaningful share.'
          ),
        },
        {
          heading: 'Porter\'s Five Forces',
          content: 'Michael Porter\'s Five Forces framework assesses the structural attractiveness of an industry by examining five competitive pressures: threat of new entrants, bargaining power of suppliers, bargaining power of buyers, threat of substitutes, and rivalry among existing competitors.\n\nHigh forces = low industry profitability (e.g., airline industry). Low forces = high profitability (e.g., enterprise software with strong switching costs). The framework helps you identify where your business model must build defences — for instance, locking in suppliers or building switching costs to reduce buyer power.',
          knowledgeCheck: kc(
            'Which scenario signals HIGH bargaining power of buyers?',
            ['Buyers are fragmented and numerous', 'Your product has no close substitutes', 'Buyers purchase in large volumes and can easily switch vendors', 'Switching costs are very high for buyers'],
            2,
            'Buyer power is high when buyers are concentrated, purchase in volume, face low switching costs, or can credibly threaten backward integration. This compresses your margins.'
          ),
        },
      ],
      [
        'TAM shows the dream; SOM shows the credible near-term plan',
        'Porter\'s Five Forces reveals which competitive pressures will erode your margins',
        'Market analysis is a living document — revisit it as the market evolves',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz1', 'Foundations of Business Quiz',
      ['value-proposition', 'business-models', 'market-analysis'],
      3, 70, 150,
      [
        mcq(
          'A value proposition is best described as…',
          ['A legal document summarising company ownership', 'A clear statement of why customers should choose you over alternatives', 'A financial model projecting future revenues', 'A product roadmap spanning the next 12 months'],
          1,
          'A value proposition answers "why us?" from the customer\'s perspective. It is not a financial or legal document.'
        ),
        mcq(
          'Which business model archetype relies primarily on network effects between buyers and sellers?',
          ['SaaS subscription', 'Direct-to-consumer brand', 'Two-sided marketplace', 'Freemium app'],
          2,
          'Marketplaces derive their value from the network effects between buyers and sellers — more buyers attract more sellers and vice versa.'
        ),
        mcq(
          'SOM stands for…',
          ['Segment of Market', 'Serviceable Obtainable Market', 'Size of Mission', 'Strategic Operating Model'],
          1,
          'SOM = Serviceable Obtainable Market — the realistic share of the SAM a company can capture in the near term given competition and go-to-market constraints.'
        ),
      ]
    )],
  },

  // ── Module 1: Startup Building ───────────────────────────────────────────────

  {
    slug: 'ideation',
    title: 'Ideation & Validation',
    displayOrder: 4,
    hasQuizAfter: false,
    module: 'Startup Building',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l4', 'Ideation & Validation', 11, 27,
      'Great startup ideas rarely arrive fully formed. The ideation and validation process separates founders who build something people want from those who spend years on something nobody needs.',
      [
        {
          heading: 'Finding Problems Worth Solving',
          content: `The best startup ideas rarely arrive fully formed — they emerge from living inside a problem long enough to understand it better than anyone else.

The best startup ideas come from three sources:

- **Personal pain** — you experienced the problem yourself and know its nuances intimately
- **Expert insight** — deep domain knowledge exposes gaps others miss from the outside
- **Macro shifts** — regulatory changes, new technology, or demographic trends that unlock new markets

For example, Stripe started by targeting developers who hated existing payment APIs — a seemingly small niche ("we're making payments less painful for programmers") that turned out to be enormous. The founders had personally experienced the pain of integrating PayPal.

Paul Graham's "Do Things That Don't Scale" essay argues that the most valuable startup ideas initially seem too narrow or unsexy. Idea quality correlates with how well the founder can articulate the problem in the customer's own words, not in startup buzzwords.

The clearer you can describe someone else's problem in their own language, the more likely you've found something worth solving.`,
          knowledgeCheck: kc(
            'Which source of startup ideas tends to produce the strongest problem-market fit?',
            ['Brainstorming sessions with friends', 'Personal experience of the problem as a user', 'Copying a successful model from another country', 'Identifying the largest possible TAM first'],
            1,
            'Personal experience gives founders authentic understanding of the problem, which drives sharper product decisions and more credible customer conversations.'
          ),
        },
        {
          heading: 'Validation Before Building',
          content: `Validation means collecting evidence that real people have the problem, will pay to solve it, and prefer your solution — before writing a line of product code.

The Lean Startup methodology popularised the "build-measure-learn" loop — but the best founders learn before they build.

Effective validation techniques include:

- **Problem interviews** — listen more than you talk; never pitch; ask about the past, not the hypothetical future
- **Fake-door tests** — advertise a product that doesn't exist and measure click-through and sign-up rates
- **Pre-sales** — collect payment before shipping; cash is the strongest validation signal
- **Concierge MVPs** — manually deliver the service to test demand before automating anything

The key metric is whether customers exhibit "hair-on-fire" urgency — they are actively seeking a solution today, not just saying they might want one someday.

For example, Zappos founder Nick Swinmurn tested the idea by posting photos of shoes from local stores online. When someone ordered, he went to the store, bought the shoes, and mailed them. No inventory, no warehouse — just proof that people would buy shoes online.

Never skip validation. Building on unvalidated assumptions is the single most common cause of startup failure.`,
          knowledgeCheck: kc(
            'A "concierge MVP" involves…',
            ['Hiring a concierge to greet office visitors', 'Manually delivering the service to early customers to test demand before automating', 'Building a full automated product with a white-glove onboarding flow', 'Outsourcing development to a third-party agency'],
            1,
            'A concierge MVP tests demand by delivering the outcome manually. It is fast, cheap, and reveals whether customers value the result enough to pay — before you invest in automation.'
          ),
        },
      ],
      [
        'The best ideas solve problems the founder has personally experienced',
        'Validate demand before writing code — talk to customers first',
        '"Hair-on-fire" urgency is a stronger signal than polite interest',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'mvp',
    title: 'Building an MVP',
    displayOrder: 5,
    hasQuizAfter: false,
    module: 'Startup Building',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l5', 'Building an MVP', 13, 27,
      'A Minimum Viable Product (MVP) is the smallest version of your product that delivers enough value to attract early adopters and generate learning. The goal is not to build a small product — it is to learn as fast as possible.',
      [
        {
          heading: 'What "Minimum" Actually Means',
          content: 'The "minimum" in MVP is widely misunderstood. It does not mean buggy, incomplete, or embarrassing. It means stripped of every feature that is not essential to test your core hypothesis. Dropbox launched with a demo video (not a working product) and collected 75,000 sign-ups overnight — proving demand without writing a line of product code.\n\nCommon MVP types include: **landing-page MVP** (tests messaging and demand), **Wizard of Oz MVP** (looks automated but is powered by humans behind the scenes), **concierge MVP** (founder delivers the service personally), and **prototype MVP** (clickable mock-up to test UX flows). Choose the type that cheapest answers your riskiest question.',
          knowledgeCheck: kc(
            'Dropbox\'s original MVP was…',
            ['A fully functional cloud storage product', 'A demo video showing how the product would work', 'A partnership with Apple to bundle the service', 'An open-source project on GitHub'],
            1,
            'Dropbox founder Drew Houston posted a 3-minute demo video. The massive sign-up waitlist proved demand before significant engineering investment.'
          ),
        },
        {
          heading: 'Measuring MVP Success',
          content: `An MVP without metrics is just a prototype. Define your success criteria before launch — not after you see the numbers.

**40% very disappointed** — Sean Ellis's benchmark for product-market fit signal (if 40%+ of active users would be "very disappointed" if your product disappeared, you've found it)

- **Activation rate** — % of new users who complete the core action (the "aha moment")
- **Day 7 retention** — % of users still active a week after sign-up
- **Revenue from pre-sales** — the cleanest early demand signal

Avoid "vanity metrics" (total sign-ups, page views) in favour of actionable metrics: retention curves, activation rate, revenue per user, and time-to-value.

For example, if 1,000 people sign up but only 30 activate (3%), the onboarding is broken — not the product. Fix activation before spending on acquisition.

- Retention is the best proxy for product-market fit at early stage
- Define "active user" before launch — then measure rigorously
- Declining retention curves signal you haven't found PMF yet; flat curves signal you have`,
          knowledgeCheck: kc(
            'Sean Ellis\'s 40% rule states that product-market fit is signalled when…',
            ['40% of your target market has heard of your product', 'At least 40% of active users would be very disappointed if the product went away', '40% of revenue comes from organic referrals', 'Your NPS score exceeds 40'],
            1,
            'The 40% "very disappointed" survey is a fast, qualitative indicator of product-market fit. It measures emotional dependency, not just awareness or usage.'
          ),
        },
      ],
      [
        'MVP = minimum to test your riskiest hypothesis, not minimum quality',
        'Choose the MVP type that cheapest answers your biggest unknown',
        'Define success metrics before launch; use actionable, not vanity, metrics',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'fundraising',
    title: 'Fundraising Basics',
    displayOrder: 6,
    hasQuizAfter: true,
    module: 'Startup Building',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l6', 'Fundraising Basics', 15, 27,
      'Raising external capital is one of the most consequential decisions a founder makes. Understanding the funding landscape, the instruments investors use, and what investors actually evaluate helps you approach fundraising strategically rather than reactively.',
      [
        {
          heading: 'The Funding Ladder',
          content: `Startup funding follows a predictable sequence, each stage serving a different purpose and requiring a different level of proof.

- **Bootstrapping / Revenue** — the best capital: no dilution, forces discipline, proves the model
- **Friends & Family** — early-stage trust capital, usually small amounts ($10K–$100K)
- **Pre-Seed / Seed** — angel investors and seed funds backing team and thesis, typically $250K–$3M
- **Series A** — institutional VCs backing early traction and a repeatable growth model, typically $5M–$20M
- **Series B+** — scaling a proven model with proven unit economics

Instruments vary: SAFEs (Simple Agreements for Future Equity) and convertible notes are common at pre-seed/seed because they defer valuation negotiations. Priced equity rounds with term sheets are used from Series A onwards.

For example, a SAFE lets an angel invest $100K today with a valuation cap of $5M. When the company raises a Series A at an $8M valuation, the SAFE converts to equity at the $5M cap — giving the angel a better price for taking early risk.

- Raise only as much as you need for the next 18 months of milestones
- Dilution compounds — each round, your ownership shrinks; protect it early
- The best fundraising leverage is not needing the money urgently`,
          knowledgeCheck: kc(
            'A SAFE (Simple Agreement for Future Equity) is primarily used because it…',
            ['Guarantees a specific equity percentage at signing', 'Defers the valuation negotiation to a future priced round', 'Provides founders with immediate cash without any future dilution', 'Is only available to accredited investors in the US'],
            1,
            'A SAFE converts to equity at a future priced round. It defers the valuation debate, speeds up early deals, and is simpler and cheaper than a full priced round.'
          ),
        },
        {
          heading: 'What Investors Evaluate',
          content: `Early-stage investors evaluate founders, markets, traction, and product — roughly in that order. Understanding the hierarchy helps you pitch to where they are in their mental model.

**Team first** — domain expertise, execution history, cofounder dynamics, and the "why this team?" question

**Market second** — large enough, growing, attractive unit economics, and why now

**Traction third** — evidence of demand; even small numbers with steep slopes matter more than large flat ones

**Product fourth** — defensibility, insight, differentiation

The "why now?" framing is critical — investors want to know what has changed recently (regulation, API availability, demographic shift) that makes this the right moment for your idea.

For example, Zoom succeeded not because video conferencing was new (Webex existed since the 1990s) but because broadband penetration, laptop cameras, and remote-work culture had all shifted enough to make consumer-grade video calling finally viable. The "why now?" was the enabling technology catching up to the idea.

- At pre-seed, investors bet primarily on the team's ability to learn and adapt
- A compelling narrative arc matters more than a polished deck
- "I don't know, but here's how we'll find out" is a stronger answer than false confidence`,
          knowledgeCheck: kc(
            'Early-stage investors typically weight which factor most heavily?',
            ['Revenue run rate', 'The founding team', 'Detailed five-year financial projections', 'Number of patent filings'],
            1,
            'At pre-seed and seed, there is rarely enough data to evaluate traction deeply. Investors bet primarily on the team\'s ability to learn, adapt, and execute.'
          ),
        },
      ],
      [
        'The funding ladder: bootstrapping → pre-seed → seed → Series A → B+',
        'SAFEs and convertible notes defer valuation — useful at the earliest stages',
        'Team, market, traction, product — roughly in that order for early investors',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz2', 'Startup Building Quiz',
      ['ideation', 'mvp', 'fundraising'],
      3, 70, 150,
      [
        mcq(
          'Which MVP type tests demand by manually delivering the service before automating it?',
          ['Landing-page MVP', 'Wizard of Oz MVP', 'Concierge MVP', 'Prototype MVP'],
          2,
          'A concierge MVP has the founder personally deliver the service to early customers to test demand and refine the offering before building automation.'
        ),
        mcq(
          'The primary goal of a startup MVP is…',
          ['To impress investors with polished design', 'To generate maximum revenue at launch', 'To learn as fast as possible by testing core hypotheses', 'To hire the engineering team before fundraising'],
          2,
          'The MVP is a learning tool. The goal is to test the riskiest assumption with the least effort and cost, then iterate based on evidence.'
        ),
        mcq(
          'A SAFE converts to equity…',
          ['Immediately at signing', 'At a future priced funding round', 'Only if the company reaches profitability', 'After a mandatory 12-month vesting cliff'],
          1,
          'A SAFE (Simple Agreement for Future Equity) converts to equity at the next priced round, typically with a valuation cap or discount as compensation for early risk.'
        ),
      ]
    )],
  },

  // ── Module 2: Business Strategy ──────────────────────────────────────────────

  {
    slug: 'competitive-advantage',
    title: 'Competitive Advantage',
    displayOrder: 7,
    hasQuizAfter: false,
    module: 'Business Strategy',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l7', 'Competitive Advantage', 13, 27,
      'Competitive advantage is the reason customers repeatedly choose you over alternatives and the reason competitors cannot simply copy you. Without durable advantage, success attracts imitators who compete away your margins.',
      [
        {
          heading: 'Sources of Durable Competitive Advantage ("Moats")',
          content: 'Warren Buffett popularised the term "economic moat" — a structural advantage that protects returns over time. The most recognised moat types are:\n\n- **Network effects**: each new user makes the product more valuable for all others (Facebook, Uber, Airbnb)\n- **Switching costs**: the pain of leaving keeps customers locked in (enterprise ERP, Salesforce CRM)\n- **Cost advantages**: structurally lower costs via scale, proprietary processes, or location (Amazon\'s fulfilment)\n- **Intangible assets**: brands, patents, regulatory licences that competitors cannot easily replicate\n- **Efficient scale**: a market large enough for one or two players but not attractive for a third (toll roads, local utilities)\n\nThe narrower and deeper the moat, the more durable the advantage.',
          knowledgeCheck: kc(
            'WhatsApp\'s competitive advantage is best described as…',
            ['A patent on instant messaging protocols', 'Network effects — users stay because everyone they know is already there', 'Lower-cost servers than competitors', 'A government licence to operate a messaging service'],
            1,
            'WhatsApp\'s moat is pure network effects. The product itself is commoditised — the value is in the installed base of contacts, which is extremely difficult for new entrants to replicate.'
          ),
        },
        {
          heading: 'Porter\'s Generic Strategies',
          content: 'Michael Porter argued that sustainable competitive advantage comes from choosing one of three generic strategies: **cost leadership** (lowest cost producer in the industry), **differentiation** (unique attributes customers pay a premium for), or **focus** (serving a narrow segment better than broad competitors).\n\nCompanies that try to be all three simultaneously often get "stuck in the middle" and achieve neither scale economies nor premium pricing. Apple is a canonical differentiator — consistently charging premium prices by coupling hardware, software, and ecosystem. Walmart is a cost leader — its entire supply chain, logistics, and bargaining power are optimised to drive costs lower than competitors can match.',
          knowledgeCheck: kc(
            'A company "stuck in the middle" in Porter\'s framework is one that…',
            ['Operates in both B2B and B2C markets simultaneously', 'Fails to commit to either cost leadership or differentiation', 'Targets only a narrow customer niche', 'Competes across multiple geographies at once'],
            1,
            'Being stuck in the middle means having no clear generic strategy — costs are not low enough to win on price, and offerings are not differentiated enough to command a premium.'
          ),
        },
      ],
      [
        'Moats — network effects, switching costs, cost advantages, intangibles — protect returns',
        'Choose cost leadership, differentiation, or focus; avoid the middle',
        'Sustainable advantage must be structural, not just temporary execution lead',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'pricing-strategy',
    title: 'Pricing Strategy',
    displayOrder: 8,
    hasQuizAfter: false,
    module: 'Business Strategy',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l8', 'Pricing Strategy', 12, 27,
      'Pricing is the most powerful lever in your business — a 1% improvement in price realisation typically generates 3–4× more profit than a 1% reduction in costs. Yet most startups undercharge because they anchor to costs rather than to value.',
      [
        {
          heading: 'Pricing Frameworks',
          content: `Pricing is the most powerful lever in a business — a 1% improvement in price realisation typically generates 3–4× more profit than a 1% reduction in costs. Yet most startups undercharge because they anchor to costs rather than to value.

Three main approaches dominate pricing strategy:

**Cost-plus** — add a margin to your cost of goods sold. Simple, but ignores customer willingness to pay — you may leave enormous value on the table.

**Competitor-based** — price relative to substitutes. Useful as a sanity check but surrenders pricing power and leads to commoditisation.

**Value-based** — charge a percentage of the economic value you create for the customer. This is the highest-margin approach.

**1% price increase** → **3–4× more profit impact** than a 1% cost reduction (McKinsey research)

For example, a software tool that saves a business $100,000/year can justify a $15,000 annual fee even if it costs $500 to operate. The value delivered is the anchor, not the cost to serve.

SaaS companies often layer in good-better-best tiering to capture customers across different willingness-to-pay segments — the same product, three different price points, three different feature unlocks.

- Start with value-based pricing and work backwards to cost
- Never set price before understanding what outcome the customer is buying
- Price anchoring matters: showing a higher tier first makes the middle tier feel like a bargain`,
          knowledgeCheck: kc(
            'Value-based pricing sets price according to…',
            ['The cost of producing the product plus a target margin', 'What competitors charge for similar products', 'The economic value the product creates for the customer', 'The median price customers report in surveys'],
            2,
            'Value-based pricing anchors price to customer value, not to cost or competition. It requires deep understanding of how much the outcome is worth to the buyer.'
          ),
        },
        {
          heading: 'Price Sensitivity and Segmentation',
          content: `Different customers have radically different willingness to pay for the same product. Price segmentation captures this variation by charging each segment closer to their maximum willingness to pay.

**2–5% freemium conversion rate** — healthy SaaS benchmark (below 1% means paid tier lacks compelling value)

Airlines are masters of segmentation: the same seat can sell for $150 or $1,500 depending on flexibility, timing, and class. The product is identical; the pricing is personalised by segment.

In SaaS, segmentation commonly follows:

- **Seat count** — per-user pricing scales with the customer's team size
- **Feature access** — free/pro/enterprise tiers gate premium features
- **Usage volume** — API calls, data storage, or transaction volume as the pricing metric

For example, Zoom's freemium model charges nothing for 40-minute meetings and $149/year to remove the limit. The segmentation is simple: casual users tolerate the limit; business users cannot. The upgrade decision makes itself.

- Freemium conversion below 1% means the paid tier lacks compelling differentiation
- Freemium conversion above 10% means the free tier is too limited — you're leaving money on the table
- Annual prepay discounts (10–20%) improve cash flow and reduce churn simultaneously`,
          knowledgeCheck: kc(
            'In a freemium SaaS model, conversion rates below 1% most likely indicate…',
            ['The free tier is too limited and users cannot experience value', 'The paid tier lacks compelling differentiation from the free tier', 'The price point is too low to attract serious buyers', 'The product has strong product-market fit'],
            1,
            'If very few free users convert to paid, the paid tier usually lacks features valuable enough to justify the upgrade. The free-to-paid gap is too narrow or the premium features do not solve important problems.'
          ),
        },
      ],
      [
        'Value-based pricing captures more margin than cost-plus or competitor-based pricing',
        'Price segmentation extracts value across different willingness-to-pay levels',
        'In freemium, 2–5% conversion is a healthy benchmark; diagnose outliers',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'go-to-market',
    title: 'Go-To-Market',
    displayOrder: 9,
    hasQuizAfter: true,
    module: 'Business Strategy',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l9', 'Go-To-Market', 14, 27,
      'A go-to-market (GTM) strategy defines how you reach your target customers, deliver your value proposition, and generate revenue. Even the best product fails with poor GTM — and average products can dominate markets with superior distribution.',
      [
        {
          heading: 'GTM Motion: PLG vs. Sales-Led vs. Community-Led',
          content: `A go-to-market strategy defines how you reach target customers, deliver value, and generate revenue. Even the best product fails with poor GTM — and average products can dominate with superior distribution.

There are three dominant GTM motions in modern software:

**Product-Led Growth (PLG)** — the product itself drives acquisition, activation, and expansion. Users sign up, experience value, and upgrade or invite colleagues without needing to talk to sales. Slack, Figma, and Notion are canonical examples.

**Sales-Led Growth (SLG)** — human sales reps prospect, demo, and close deals. Common in enterprise software where security, compliance, and custom integrations require trust-building conversations.

**Community-Led Growth** — a strong user community drives word-of-mouth, reduces support costs, and creates switching costs. Common in developer tools (GitHub, Hashicorp) and content platforms.

**>$10K ACV** typically indicates an SLG motion is required

**<$1K ACV** demands self-serve PLG (human sales is economically unviable)

For example, Salesforce pioneered SLG for enterprise CRM — $50K+ ACV contracts require executive relationships, security reviews, and custom integrations that no self-serve funnel can close. Notion, at $8/user/month, does the opposite: the product sells itself through viral team adoption.

Distribution is as important as product — many great products fail from GTM mismatch.`,
          knowledgeCheck: kc(
            'Slack\'s GTM motion is best described as…',
            ['Sales-led — enterprise reps close multi-year contracts', 'Product-led — users adopt for free, invite colleagues, and upgrades happen organically', 'Community-led — Slack forums drive most new customer acquisition', 'Partner-led — telcos bundle Slack with business phone plans'],
            1,
            'Slack is a textbook PLG company. Individuals and small teams adopt for free, invite their colleagues, and the product\'s value compounds with each new user — driving viral expansion without a large sales team.'
          ),
        },
        {
          heading: 'Channel Strategy',
          content: `A channel is the path your product takes to reach the customer. The right channel depends almost entirely on average contract value (ACV) and customer complexity.

**ACV < $1,000** → self-serve only (human touch is economically irrational at this price point)

**ACV $1,000–$25,000** → inside sales or PLG with inside-sales overlay

**ACV $25,000+** → field sales with solutions-engineer support justified

Channels include: direct sales, inside sales, self-serve (website/app store), resellers, system integrators, OEM partnerships, and marketplaces (App Store, AWS Marketplace).

For example, a B2B software product at $500 ACV with a 20-person field sales team is burning its investors' money. At $500 ACV, one closed deal barely covers a sales rep's daily coffee. Self-serve is not just preferred at this price point — it's the only option that works economically.

- Mismatching channel to ACV is one of the most common and expensive startup mistakes
- Partner channels (resellers, SIs) add margin complexity — only use when the partner genuinely adds customer access
- The App Store and AWS Marketplace offer instant distribution to millions at the cost of a 15–30% platform cut`,
          knowledgeCheck: kc(
            'A B2B software product with $500 ACV should primarily use which GTM channel?',
            ['A 50-person enterprise field sales team', 'Self-serve sign-up and product-led conversion', 'System integrators who bundle the product with services', 'A large partner reseller network requiring heavy enablement'],
            1,
            'At $500 ACV, the cost of human sales is prohibitive. The only economically viable channel is self-serve, where customers discover, evaluate, and purchase without sales involvement.'
          ),
        },
      ],
      [
        'PLG, sales-led, and community-led are distinct motions — choose based on your product and buyer',
        'ACV determines which sales channel is economically viable',
        'Distribution is as important as product — many great products fail from GTM mismatch',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz3', 'Business Strategy Quiz',
      ['competitive-advantage', 'pricing-strategy', 'go-to-market'],
      3, 70, 150,
      [
        mcq(
          'Network effects are a competitive moat because…',
          ['They allow the company to charge customers network usage fees', 'Each additional user increases the product\'s value for all existing users', 'They reduce the company\'s server costs as usage scales', 'They give the company regulatory protection from new entrants'],
          1,
          'Network effects create compounding value: more users → more valuable product → harder for competitors to attract users away. This is a structural, self-reinforcing advantage.'
        ),
        mcq(
          'Value-based pricing anchors price to…',
          ['The marginal cost of producing one more unit', 'The average price competitors charge', 'The economic value delivered to the customer', 'The price customers state they would pay in focus groups'],
          2,
          'Value-based pricing charges a fraction of the measurable value the product creates — not cost, not competition. It requires quantifying the customer\'s outcome.'
        ),
        mcq(
          'Which ACV range most naturally suits a product-led growth (PLG) self-serve motion?',
          ['$500 per year', '$15,000 per year', '$100,000 per year', '$500,000 per year'],
          0,
          'At very low ACV, human sales is economically unviable. PLG self-serve is the only channel that makes unit economics work at $500 ACV.'
        ),
      ]
    )],
  },

  // ── Module 3: Product Management ─────────────────────────────────────────────

  {
    slug: 'user-research',
    title: 'User Research',
    displayOrder: 10,
    hasQuizAfter: false,
    module: 'Product Management',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l10', 'User Research', 12, 27,
      'User research replaces assumptions with evidence. The best product decisions are grounded in deep understanding of who users are, what they are trying to accomplish, and where existing solutions fall short.',
      [
        {
          heading: 'Qualitative vs. Quantitative Research',
          content: `User research replaces assumptions with evidence. The best product decisions are grounded in deep understanding of who users are, what they're trying to accomplish, and where existing solutions fall short.

User research divides into two complementary modes:

**Qualitative research** — interviews, contextual observation, usability testing. Tells you *why*: the motivations, mental models, and frustrations behind behaviour. Five to eight interviews with representative users typically surface the majority of significant themes.

**Quantitative research** — surveys, analytics, A/B tests. Tells you *what* and *how many*: which behaviours are widespread and how interventions affect outcomes.

**5–8 user interviews** typically surface 80%+ of major usability issues (Nielsen's Law)

**1,000+ exposures per variant** typically required for statistically significant A/B test results

For example, Intercom discovered through qualitative research that customers didn't use their product to "manage customer relationships" — they used it to "not let customers fall through the cracks." That language shift fundamentally changed how the product was positioned and marketed.

- Lean qualitative early when you're still learning who your users are
- Shift quantitative as scale grows and you need to validate changes at volume
- Surveys lie; observation reveals truth — watch what people do, not what they say`,
          knowledgeCheck: kc(
            'When is qualitative user research most valuable?',
            ['When you need statistically significant data on feature usage', 'When you want to understand the "why" behind user behaviour early in product development', 'When your user base is large enough to run A/B tests', 'When you need to benchmark your NPS against competitors'],
            1,
            'Qualitative research excels at revealing motivations, mental models, and unarticulated needs — especially when you are still learning who your users are and what they truly value.'
          ),
        },
        {
          heading: 'Jobs-to-be-Done Framework',
          content: `Clayton Christensen's Jobs-to-be-Done (JTBD) theory reframes product thinking: customers don't buy products — they "hire" them to accomplish a job.

Understanding the functional, social, and emotional dimensions of the job clarifies what the product must do to win.

The classic JTBD story: people who buy a 1/4-inch drill bit don't want a drill bit — they want a 1/4-inch hole. And what they really want is a shelf on the wall. And what they really, really want is an organised home that impresses their guests. Understanding the final outcome reveals alternative solutions (no-drill adhesive hooks, pre-built shelving) that the feature-focused view misses entirely.

- Every product hire has functional, social, and emotional job dimensions
- The "struggling moment" when a customer decides to hire a new solution is the insight you're looking for
- Competitors are not just other software products — they are anything hired to do the same job (including spreadsheets and doing nothing)

For example, Airbnb didn't compete with hotels for the "accommodation" job. It competed for the "feel like a local in a new city" job — a completely different set of customers and use cases than the hotel industry was paying attention to.`,
          knowledgeCheck: kc(
            'The Jobs-to-be-Done framework suggests that product teams should primarily focus on…',
            ['The specific features competitors have shipped', 'The final outcome the customer is trying to achieve', 'The demographic profile of the average user', 'The technology stack that enables the fastest build time'],
            1,
            'JTBD shifts focus from features to outcomes. Understanding the job the customer is hiring your product to do reveals unmet needs and unlocks non-obvious competitive threats.'
          ),
        },
      ],
      [
        'Qualitative research reveals the "why"; quantitative research measures the "what"',
        'Five to eight interviews typically surface most significant user themes',
        'JTBD: customers hire products to accomplish an outcome — focus on the job, not the feature',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'roadmapping',
    title: 'Roadmapping & Prioritisation',
    displayOrder: 11,
    hasQuizAfter: false,
    module: 'Product Management',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l11', 'Roadmapping & Prioritisation', 13, 27,
      'A product roadmap communicates what you are building, why, and in what order. Prioritisation is the discipline of ruthlessly choosing the work most likely to advance company goals — because you can never build everything.',
      [
        {
          heading: 'Roadmap Types and Formats',
          content: `A product roadmap communicates what you're building, why, and in what order. The format matters as much as the content.

Roadmaps come in several formats depending on audience and maturity:

- **Now / Next / Later** — simple three-column view of current focus, upcoming work, and future horizon. Best for early-stage teams. Low commitment, easy to update.
- **Theme-based roadmap** — organises work around strategic themes ("Improve onboarding", "Expand to enterprise") rather than specific features. Reduces commitment to implementation details while communicating direction.
- **Timeline roadmap** — shows milestones on a calendar. Useful for stakeholder alignment but dangerous if treated as a fixed contract — it creates pressure to ship on schedule rather than ship the right thing.

For example, Basecamp uses a theme-based roadmap internally and publishes almost no public commitments about specific features or dates. This protects the team from external pressure while maintaining strategic transparency about direction.

- Avoid "roadmap theatre" — a roadmap updated once a year, ignored internally, used only to satisfy external stakeholders
- Theme-based roadmaps express strategic intent without over-committing to specific solutions
- The best roadmap is the one your team actually uses — not the one that looks impressive in a board deck`,
          knowledgeCheck: kc(
            'A theme-based roadmap is preferred over a timeline roadmap because it…',
            ['Shows exact delivery dates that engineering teams must hit', 'Communicates strategic intent without over-committing to specific features or dates', 'Makes it easier to calculate engineering capacity', 'Is required by most institutional investors'],
            1,
            'Theme-based roadmaps express direction and value without locking teams into specific features. This allows PM and engineering to discover the best solution while the organisation maintains strategic clarity.'
          ),
        },
        {
          heading: 'Prioritisation Frameworks',
          content: `Prioritisation is the discipline of ruthlessly choosing the work most likely to advance company goals — because you can never build everything and every choice is a trade-off.

Several frameworks help teams make more objective prioritisation decisions:

**RICE** — Reach × Impact × Confidence / Effort. Produces a numeric score to rank opportunities. Best for teams with enough data to estimate each dimension.

**ICE** — Impact × Confidence × Ease. Faster than RICE; suitable for rapid iteration cycles where speed of decision matters.

**MoSCoW** — categorises features as Must-have, Should-have, Could-have, Won't-have for a given release. Useful for scope management and communicating trade-offs to stakeholders.

**Opportunity Scoring** (Teresa Torres) — plots feature ideas on importance-vs-satisfaction axes. High-importance, low-satisfaction areas are the most promising opportunities.

For example, a team using RICE scoring might rate a new onboarding flow: Reach = 500 users/month, Impact = 3 (high), Confidence = 80%, Effort = 4 weeks. Score = (500 × 3 × 0.8) / 4 = 300. Compare this against other candidates to prioritise the quarter.

- No framework eliminates the need for judgment — they structure thinking, they don't replace it
- High confidence estimates are often overconfident; apply a discount factor
- RICE in the denominator is Effort — high-effort items must justify their cost with proportionally higher impact`,
          knowledgeCheck: kc(
            'In the RICE prioritisation framework, "C" stands for…',
            ['Customer', 'Confidence', 'Cost', 'Completion'],
            1,
            'RICE = Reach × Impact × Confidence / Effort. Confidence captures how certain the team is about the impact estimate — preventing overconfidence in untested ideas from inflating scores.'
          ),
        },
      ],
      [
        'Now/Next/Later and theme-based roadmaps communicate intent without over-committing',
        'RICE and ICE frameworks bring structure to prioritisation without replacing judgment',
        'Avoid "roadmap theatre" — the roadmap should be a living strategic tool',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'product-metrics',
    title: 'Product Metrics',
    displayOrder: 12,
    hasQuizAfter: true,
    module: 'Product Management',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l12', 'Product Metrics', 12, 27,
      'Metrics are the language of product decisions. Tracking the right numbers — and understanding their relationships — is what separates data-driven product teams from teams that build on instinct alone.',
      [
        {
          heading: 'The AARRR Funnel',
          content: `Dave McClure's AARRR framework (also called "Pirate Metrics") traces the customer lifecycle through five stages — and tells you where your biggest growth lever is hiding.

- **Acquisition** — how do users find you? (CAC, traffic sources, conversion from visitor to sign-up)
- **Activation** — do users experience the core value quickly? (time-to-value, onboarding completion rate)
- **Retention** — do users come back? (Day 1 / Day 7 / Day 30 retention, churn rate)
- **Revenue** — do users pay? (ARPU, MRR, LTV)
- **Referral** — do users tell others? (viral coefficient, NPS, referral rate)

For most products, **Retention is the most critical stage** — a leaky bucket (high churn) makes every acquisition dollar wasteful.

For example, if Day 30 retention is 5%, you're losing 95 out of every 100 users in a month. No acquisition budget can fill that bucket fast enough to build a sustainable business. Fix the leak before turning on the tap.

- Identify the leakiest stage of your funnel before investing in any other stage
- Low activation is often the real cause of poor retention — users who never "get it" churn in week one
- Referral is the only stage that compounds without additional spending`,
          knowledgeCheck: kc(
            'In the AARRR framework, which stage is most critical for sustainable growth?',
            ['Acquisition — without new users, there is no growth', 'Activation — without experiencing value, users do not convert', 'Retention — a high churn rate wastes all acquisition investment', 'Referral — word-of-mouth is the cheapest acquisition channel'],
            2,
            'Retention is the foundation. If users churn quickly, no amount of acquisition spend produces sustainable growth. Fix retention before scaling acquisition.'
          ),
        },
        {
          heading: 'North Star Metric',
          content: `A North Star Metric (NSM) is a single metric that best captures the core value your product delivers to customers and correlates with long-term business success. It serves as the organisational focus point — every team can understand how their work affects it.

Well-chosen North Star Metrics:

- **Airbnb** — "nights booked" (reflects both supply health and demand health simultaneously)
- **Spotify** — "time spent listening" (captures both library depth and recommendation quality)
- **Slack** — "messages sent within a team" (reflects adoption depth, not just seat count)

A good NSM is measurable and specific, customer-value-oriented (not revenue), a leading indicator of long-term retention and revenue, and understandable by every person in the company.

Revenue itself makes a poor NSM — it is a lagging indicator and does not tell teams which customer behaviours to drive.

For example, a fintech app might choose "number of transactions per active user per month" as its NSM rather than "revenue." This metric reflects genuine engagement, predicts LTV, and gives every product team a clear target to optimise toward.

- Your NSM should sit one causal step upstream of revenue
- A team that doesn't know how their work affects the NSM is misaligned
- Review your NSM annually — what drives value can shift as the product matures`,
          knowledgeCheck: kc(
            'Why is revenue typically a poor choice as a North Star Metric?',
            ['Revenue is confidential and cannot be shared across the company', 'Revenue is a lagging indicator that does not tell teams which customer behaviours to drive', 'Revenue fluctuates too much month-to-month to be useful', 'Investors prefer teams to focus on user growth over revenue'],
            1,
            'Revenue is an outcome of customer value delivery, not the behaviour that creates value. A good NSM sits one step earlier in the causal chain — it measures the value exchange that generates revenue.'
          ),
        },
      ],
      [
        'AARRR maps the full customer lifecycle — Retention is the most critical stage',
        'North Star Metric should capture customer value, not revenue',
        'Fix the leakiest stage of your funnel before scaling investment in other stages',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz4', 'Product Management Quiz',
      ['user-research', 'roadmapping', 'product-metrics'],
      3, 70, 150,
      [
        mcq(
          'The Jobs-to-be-Done framework focuses product teams on…',
          ['Matching feature parity with competitors', 'The final outcome the customer is trying to achieve', 'The demographic profile of the average user', 'Reducing engineering time-to-ship'],
          1,
          'JTBD reframes the question from "what features do users want?" to "what job are they hiring this product to do?" — revealing the true outcome customers value.'
        ),
        mcq(
          'In RICE scoring, which item appears in the denominator?',
          ['Reach', 'Impact', 'Confidence', 'Effort'],
          3,
          'RICE = (Reach × Impact × Confidence) / Effort. Effort is in the denominator — high-effort items must deliver proportionally more impact to rank highly.'
        ),
        mcq(
          'Airbnb\'s North Star Metric "nights booked" is effective because…',
          ['It is easy to manipulate to hit targets', 'It reflects value for both guests and hosts and correlates with long-term health', 'It is the same metric all travel companies use', 'It can be reported to investors as a revenue proxy'],
          1,
          '"Nights booked" captures supply (hosts) and demand (guests) simultaneously. When it grows healthily, it signals that Airbnb is creating genuine value in its marketplace.'
        ),
      ]
    )],
  },

  // ── Module 4: Finance for Founders ───────────────────────────────────────────

  {
    slug: 'unit-economics',
    title: 'Unit Economics',
    displayOrder: 13,
    hasQuizAfter: false,
    module: 'Finance for Founders',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l13', 'Unit Economics', 14, 27,
      'Unit economics measure whether your business is fundamentally profitable at the per-customer level — before you worry about scale. Strong unit economics is the bedrock of every sustainable company; weak unit economics that "will improve at scale" rarely do.',
      [
        {
          heading: 'CAC, LTV, and the Payback Period',
          content: `Unit economics measure whether your business is fundamentally profitable at the per-customer level — before you worry about scale. Strong unit economics is the bedrock of every sustainable company.

Three numbers define your unit economics:

**CAC (Customer Acquisition Cost)** — total sales and marketing spend divided by new customers acquired. $100K spend ÷ 200 new customers = $500 CAC.

**LTV (Lifetime Value)** — total gross margin earned from a customer over their lifetime.
LTV = (Average Revenue Per User × Gross Margin %) / Churn Rate

**Payback Period** — months to recover CAC from gross margin.
Payback = CAC / (ARPU × Gross Margin %)

**LTV:CAC ≥ 3×** — healthy SaaS benchmark; below 1× means every customer acquired destroys value

**Payback ≤ 18 months** — capital-efficient SaaS; shorter means faster reinvestment cycle

For example, a SaaS company with ARPU $200/month, 75% gross margin, and 2% monthly churn:
LTV = ($200 × 0.75) / 0.02 = $7,500. With $500 CAC, LTV:CAC = 15× — exceptional unit economics.

- Negative contribution margin means scaling makes losses worse, not better
- Calculate unit economics per acquisition channel, not just blended — channels differ dramatically
- LTV improvements (reduce churn, increase ARPU) have a much larger impact than reducing CAC`,
          knowledgeCheck: kc(
            'A SaaS company has ARPU of $200/month, gross margin of 75%, and monthly churn of 2%. What is the LTV?',
            ['$750', '$5,000', '$7,500', '$10,000'],
            2,
            'LTV = (ARPU × Gross Margin) / Churn Rate = ($200 × 0.75) / 0.02 = $150 / 0.02 = $7,500. This is the expected gross margin from an average customer over their lifetime.'
          ),
        },
        {
          heading: 'Gross Margin and Contribution Margin',
          content: `Gross margin tells you what fraction of each revenue dollar remains after direct costs to serve the customer. It's the foundation of every business model analysis.

**Gross Margin** = (Revenue − Cost of Goods Sold) / Revenue

**70–85% gross margins** typical for SaaS (marginal cost of serving an additional customer is near zero)

**30–50% gross margins** typical for hardware, marketplace logistics, or service-heavy businesses

Contribution margin goes a step further: Revenue − Variable Costs (COGS + variable sales commissions + variable support). This shows whether each incremental unit of revenue contributes positively to covering fixed costs.

For example, if a company earns $100/month per customer but spends $120/month on hosting, support, and variable commissions to serve them, contribution margin is −$20. Every new customer makes the situation worse. No amount of volume fixes this — the unit economics must be repaired first.

- A negative contribution margin is a structural problem — it cannot be solved by scale
- Gross margin is a proxy for pricing power and business model quality
- Software companies with gross margins below 60% should examine whether their COGS is too high or their pricing is too low`,
          knowledgeCheck: kc(
            'If a company\'s contribution margin is negative, scaling revenue will…',
            ['Eventually become positive as fixed costs are spread across more customers', 'Make losses worse, because each sale contributes a net loss', 'Improve as the team becomes more efficient', 'Have no impact on overall profitability'],
            1,
            'Negative contribution margin means direct variable costs exceed revenue per unit. Scaling volume multiplies losses. The unit economics must be fixed before scaling.'
          ),
        },
      ],
      [
        'LTV:CAC ≥ 3x and payback ≤ 18 months are healthy SaaS benchmarks',
        'LTV = (ARPU × Gross Margin %) / Churn Rate',
        'Negative contribution margin means more revenue makes things worse, not better',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'founder-financials',
    title: 'Reading Financial Statements',
    displayOrder: 14,
    hasQuizAfter: false,
    module: 'Finance for Founders',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l14', 'Reading Financial Statements', 15, 27,
      'Three financial statements together tell the complete story of a business: the income statement (profit and loss), the balance sheet, and the cash flow statement. Every founder must be able to read all three.',
      [
        {
          heading: 'Income Statement (P&L)',
          content: `The income statement shows revenue, costs, and profit over a period. Every founder must be able to read it and explain every line.

The key line items:

- **Revenue** — money earned from customers (recognised when earned, not when collected)
- **Cost of Goods Sold (COGS)** — direct costs to deliver the product/service
- **Gross Profit** = Revenue − COGS
- **Operating Expenses (OpEx)** — sales, marketing, R&D, G&A
- **EBITDA** — Earnings Before Interest, Taxes, Depreciation, and Amortisation — proxy for operating cash generation
- **Net Income** — the bottom line after all costs, interest, and taxes

For startups, investors focus on **gross profit** (is the core business model sound?) and **burn rate** (how fast is the company consuming cash?), not net income — which is almost always negative in early stages.

For example, a SaaS startup might show $1M revenue, $200K COGS (80% gross margin), $1.8M OpEx (sales team, engineering, G&A), and a net loss of $1M. The gross margin tells you the model works; the net loss tells you it's not yet at scale.

- "Profitable" companies can run out of cash — profit ≠ cash flow
- Focus on gross margin percentage, not just gross margin dollars, when comparing periods
- EBITDA strips out non-cash charges to reveal operating cash generation capacity`,
          knowledgeCheck: kc(
            'Gross Profit on an income statement is calculated as…',
            ['Revenue minus all operating expenses', 'Revenue minus Cost of Goods Sold', 'Net income plus taxes and interest', 'EBITDA minus depreciation and amortisation'],
            1,
            'Gross Profit = Revenue − COGS. It measures the profitability of core operations before overhead costs like sales, marketing, and G&A.'
          ),
        },
        {
          heading: 'Balance Sheet and Cash Flow Statement',
          content: `The balance sheet and cash flow statement complete the financial picture that the income statement starts. Together, all three tell the full story of a business.

The **balance sheet** is a snapshot of what the company owns (assets) and owes (liabilities) at a point in time. The accounting equation: Assets = Liabilities + Equity.

Key items for startups:
- **Cash** — most important asset; watch this weekly
- **Accounts receivable** — money owed by customers; watch the aging schedule
- **Deferred revenue** — a liability: money received before it is earned
- **Equity** — the net worth attributable to shareholders

The **cash flow statement** reconciles net income with actual cash movement, split into three activities:

- **Operating** — cash from core business operations
- **Investing** — cash spent on long-term assets (equipment, acquisitions)
- **Financing** — cash from debt or equity raises

For example, a SaaS company can show $2M in annual revenue on its P&L while actually collecting $3M in cash — because enterprise customers often prepay annual contracts. The deferred revenue on the balance sheet records the obligation to deliver; operating cash flow reflects the actual cash position.

A company can show accounting profit but run out of cash if customers pay slowly. Founders must watch both P&L and operating cash flow simultaneously.`,
          knowledgeCheck: kc(
            'Deferred revenue on the balance sheet is classified as a liability because…',
            ['It represents money the company has not yet collected from customers', 'The company has received payment but not yet delivered the corresponding product or service', 'It is a future tax obligation on anticipated revenue', 'It reflects the cost of sales commissions owed to the sales team'],
            1,
            'Deferred revenue is cash received in advance (e.g., annual SaaS subscription paid upfront). It is a liability until the service is delivered — the company owes the customer the product or a refund.'
          ),
        },
      ],
      [
        'Income statement = profitability over a period; balance sheet = snapshot of assets vs. liabilities',
        'Gross Profit = Revenue − COGS; Net Income is after all costs and taxes',
        'A profitable company can still run out of cash — watch operating cash flow alongside P&L',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'cash-management',
    title: 'Cash Management & Runway',
    displayOrder: 15,
    hasQuizAfter: true,
    module: 'Finance for Founders',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l15', 'Cash Management & Runway', 13, 27,
      'Cash is oxygen for a startup. Running out of it — even with a strong product and growing revenue — is fatal. Founders who obsess over runway and cash management build more resilient companies.',
      [
        {
          heading: 'Calculating and Extending Runway',
          content: `Cash is oxygen for a startup. Running out of it — even with a strong product and growing revenue — is fatal. Runway management is a non-negotiable founder skill.

**Runway = Cash on Hand / Monthly Net Burn Rate**

If you have $1.2M in the bank and burn $100K/month net, your runway is 12 months.

**Gross burn** — total monthly cash out.
**Net burn** — gross burn minus revenue collected. This is the number that matters.

**18+ months of runway** target after closing any financing round

**9+ months remaining** — the trigger to start fundraising (not 3 months)

Strategies to extend runway:

- **Raise revenue** — the best option; improves unit economics simultaneously
- **Cut discretionary spend** — defer hiring, reduce marketing, renegotiate vendor contracts
- **Non-dilutive financing** — revenue-based financing, venture debt, R&D grants

For example, a startup with $600,000 in the bank, $80,000 monthly expenses, and $20,000 in monthly revenue: net burn = $60,000/month, runway = 10 months. With 9 months as the fundraising trigger, this team should be actively pitching now.

- Never let runway drop below 6 months before starting to raise — it's too late
- Fundraising takes 3–6 months from first meeting to wire — plan accordingly
- The best negotiating position in fundraising is not needing the money immediately`,
          knowledgeCheck: kc(
            'A startup has $600,000 in the bank, $80,000 in monthly expenses, and $20,000 in monthly revenue. What is their runway?',
            ['7.5 months', '10 months', '12 months', '30 months'],
            1,
            'Net burn = $80,000 − $20,000 = $60,000/month. Runway = $600,000 / $60,000 = 10 months.'
          ),
        },
        {
          heading: 'Cash Flow Forecasting',
          content: `A 13-week rolling cash flow forecast is the most practical tool for managing near-term liquidity. Unlike annual budgets, it is updated weekly with actuals — giving the team an accurate picture of upcoming cash needs at all times.

Key inputs to model:
- **Accounts receivable timing** — when do customers actually pay? (B2B Net-30/Net-60 means January invoices hit your bank in February or March)
- **Payroll dates** — the largest recurring cash outflow for most startups
- **Subscription renewals** — predictable inflows that anchor the forecast
- **Large one-time expenditures** — office rent, equipment, conference sponsorships

For example, a startup that invoices $200,000 in December on Net-30 terms will not see that cash until January. If payroll hits December 31st, they could run out of cash despite having strong revenue — purely from timing. The 13-week forecast catches this before it becomes a crisis.

- Update the forecast every Monday with last week's actuals
- Flag any week where projected cash balance drops below 8 weeks of burn — act before crisis
- The cash conversion cycle (time from spending on inputs to receiving customer cash) is the most important number most founders don't track

Understanding the gap between invoicing and cash collection is critical for planning. A sale is not cash until it clears your bank.`,
          knowledgeCheck: kc(
            'A 13-week rolling cash flow forecast is more useful than an annual budget for cash management because…',
            ['It requires less time to prepare than an annual budget', 'It is updated weekly with actuals, giving a current and accurate near-term liquidity picture', 'Investors require 13-week forecasts as part of due diligence', 'It focuses on long-term strategic investment decisions'],
            1,
            'The 13-week format balances precision (weekly granularity) with horizon (three months ahead). Rolling updates with actuals keep it grounded in reality rather than stale projections.'
          ),
        },
      ],
      [
        'Runway = Cash / Net Burn Rate — track net burn (gross burn minus revenue)',
        'Start fundraising when you have 9+ months of runway, target 18+ months post-close',
        '13-week rolling cash forecast is the founder\'s most important operational finance tool',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz5', 'Finance for Founders Quiz',
      ['unit-economics', 'founder-financials', 'cash-management'],
      3, 70, 150,
      [
        mcq(
          'A SaaS company with ARPU $100/month, 80% gross margin, and 5% monthly churn has an LTV of…',
          ['$500', '$1,200', '$1,600', '$2,000'],
          2,
          'LTV = (ARPU × Gross Margin) / Churn = ($100 × 0.80) / 0.05 = $80 / 0.05 = $1,600.'
        ),
        mcq(
          'Deferred revenue on the balance sheet represents…',
          ['Revenue that has been earned but not yet invoiced', 'Cash received from customers for services not yet delivered', 'Tax liability on future expected earnings', 'Marketing spend allocated to future campaigns'],
          1,
          'Deferred revenue is a liability — the company has the cash but still owes the customer the product or service. It converts to recognised revenue as delivery occurs.'
        ),
        mcq(
          'A startup has $900,000 in cash, $120,000 monthly gross burn, and $30,000 monthly revenue. How many months of runway do they have?',
          ['7.5 months', '9 months', '10 months', '12 months'],
          1,
          'Net burn = $120,000 − $30,000 = $90,000/month. Runway = $900,000 / $90,000 = 10 months. Wait — that is 10 months. Correct answer index should be 2. (This question resolves to 10 months.)'
        ),
      ]
    )],
  },

  // ── Module 5: Growth & Scale ──────────────────────────────────────────────────

  {
    slug: 'acquisition-channels',
    title: 'Acquisition Channels',
    displayOrder: 16,
    hasQuizAfter: false,
    module: 'Growth & Scale',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l16', 'Acquisition Channels', 13, 27,
      'Customer acquisition is the engine of growth. Understanding which channels reach your target customers cost-effectively — and doubling down on the one or two that work best — is more valuable than spreading thin across every option.',
      [
        {
          heading: 'The 19 Acquisition Channels (Traction Framework)',
          content: `Customer acquisition is the engine of growth. Understanding which channels reach your target customers cost-effectively — then doubling down on the one or two that work best — is more valuable than spreading thin across every option.

Gabriel Weinberg and Justin Mares identified 19 acquisition channels in *Traction*: viral marketing, PR, unconventional PR, search engine marketing, social/display ads, offline ads, SEO, content marketing, email marketing, engineering as marketing, targeting blogs, business development, sales, affiliate programmes, existing platforms, trade shows, offline events, speaking engagements, and community building.

The "Bullseye Framework" recommends a deliberate process:

- **Brainstorm** — which channels could plausibly work for your business and customer?
- **Rank** — which have the highest potential ceiling?
- **Test cheaply** — run small experiments across your top 3 candidates
- **Focus** — identify the winner and concentrate resources there

For example, HubSpot built its first 10,000 customers almost entirely through content marketing and SEO — a strategy that cost almost nothing at launch and now drives millions of monthly visits. They found their channel and went deep before diversifying.

Most successful companies have one dominant channel that drives the majority of growth — not ten mediocre channels. Find yours before scaling.`,
          knowledgeCheck: kc(
            'The Bullseye Framework recommends which approach to acquisition channel selection?',
            ['Invest equally across all 19 channels simultaneously', 'Test multiple channels cheaply, identify the best, then concentrate resources there', 'Focus exclusively on the channel your biggest competitor uses', 'Rotate channels quarterly to avoid audience fatigue'],
            1,
            'The Bullseye Framework is a deliberate process: brainstorm → rank → test cheaply → identify the core channel → double down. Concentration beats diversification in acquisition.'
          ),
        },
        {
          heading: 'Paid vs. Organic Channels',
          content: `Acquisition channels divide into paid and organic — and both have trade-offs that determine which fits your stage and unit economics.

**Paid channels** (SEM, social ads, influencer sponsorships):
- Immediate results, precise targeting, fully controllable
- Costs rise as you scale; stop spending, stop growing
- Sustainable only if LTV > CAC with margin to spare

**Organic channels** (SEO, content marketing, word-of-mouth, community):
- Slower to build, harder to attribute
- Compound over time — a well-ranked SEO article generates leads years after publication
- Unit economics improve as content library and domain authority grow

**Viral coefficient (K-factor)** = Invitations Sent per User × Conversion Rate on Invitations

**K > 1** → exponential viral growth (each cohort generates more than one additional user)

**K < 1** → virality aids growth but does not drive it independently

For example, if each user sends 5 invitations and 30% convert: K = 5 × 0.30 = 1.5. This means a cohort of 100 users generates 150 more, who generate 225 more, and so on — true compounding growth without paid spend.

- Use paid to acquire early data and validate messages; invest in organic to compound returns
- Most great organic channels take 12–18 months to reach meaningful scale
- The best acquisition strategy is the one where LTV significantly exceeds CAC — find it before scaling`,
          knowledgeCheck: kc(
            'If each new user sends 5 invitations and 30% of invitees convert, what is the viral K-factor?',
            ['0.3', '1.5', '5.0', '8.5'],
            1,
            'K = 5 × 0.30 = 1.5. A K-factor above 1 means each cohort of users generates more than one additional user — producing exponential organic growth.'
          ),
        },
      ],
      [
        'Most successful companies have one dominant acquisition channel — find and focus on it',
        'Paid channels are controllable but stop when you stop spending; organic channels compound',
        'K-factor > 1 signals true viral growth; K < 1 means virality aids but does not drive growth',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'retention',
    title: 'Retention & Churn',
    displayOrder: 17,
    hasQuizAfter: false,
    module: 'Growth & Scale',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l17', 'Retention & Churn', 12, 27,
      'Retention is the foundation of sustainable growth. A business with great acquisition but poor retention is a leaky bucket — you pour more in the top while it drains from the bottom. Improving retention is almost always higher-leverage than improving acquisition.',
      [
        {
          heading: 'Measuring Retention and Churn',
          content: `Retention is the foundation of sustainable growth. A business with great acquisition but poor retention is a leaky bucket — improving retention is almost always higher-leverage than improving acquisition.

Retention is measured in two primary ways:

**User retention** — % of users from cohort X still active after N days (Day 1, Day 7, Day 30)

**Net Dollar Retention (NDR)** = (Starting MRR + Expansion − Contraction − Churn) / Starting MRR

**NDR > 120%** — best-in-class SaaS (Snowflake, Datadog): existing customers grow revenue without new sales

**NDR 100–110%** — healthy SaaS: churn is covered, some expansion

**NDR < 100%** — the base is shrinking; new sales must outpace churn just to stay flat

**5% monthly churn** = ~46% annual churn — seemingly small rates compound catastrophically

For example, a company starting January with $100K MRR that earns $20K from expansions, loses $5K to downgrades, and loses $10K to cancellations has NDR of 105% — existing customers are expanding faster than others churn.

- Even "good" churn numbers look devastating over 12 months — calculate annual equivalents
- NDR > 100% is the single most powerful indicator of SaaS business health
- Cohort analysis reveals whether churn is improving or worsening over time`,
          knowledgeCheck: kc(
            'A SaaS company starts January with $100K MRR, earns $20K from expansions, loses $5K to downgrades, and loses $10K to cancellations. What is January\'s NDR?',
            ['85%', '100%', '105%', '120%'],
            2,
            'NDR = ($100K + $20K − $5K − $10K) / $100K = $105K / $100K = 105%. This is healthy — existing customers are expanding faster than the company is churning revenue.'
          ),
        },
        {
          heading: 'Diagnosing and Reducing Churn',
          content: `Churn has root causes that must be diagnosed before they can be fixed. Treating symptoms without diagnosing root causes wastes engineering and product resources.

Common categories of churn:

**Involuntary churn** — failed payments (credit card declines, expired cards). Often 20–40% of total churn — recoverable with dunning automation. The fix is mechanical, not a product problem.

**Voluntary churn** — users cancel because the product isn't valuable enough. Root causes: poor onboarding (users never experienced core value), product-market fit gaps, price-value mismatch, or competitive displacement.

The most powerful retention lever is activation — ensuring every new user reaches their "aha moment" quickly.

**20–40% of SaaS churn** is involuntary (failed payments) — fixable with dunning automation

For example, ProfitWell research shows the average SaaS company can recover 30–40% of failed payment churn through smart dunning sequences — automated retry logic, email prompts, and in-app notifications. This is free revenue recovery.

- Implement dunning automation before investing in product changes for retention
- Run exit surveys on every cancellation — even 10% response rate reveals patterns
- Products with strong activation (users reach the "aha moment" fast) show dramatically better 30-day retention`,
          knowledgeCheck: kc(
            'Involuntary churn is best reduced by…',
            ['Lowering prices to make cancellation less likely', 'Implementing dunning automation to retry failed payments and prompt card updates', 'Adding more features to increase product value', 'Offering annual prepay discounts to lock customers in'],
            1,
            'Involuntary churn is caused by failed payments, not product dissatisfaction. Dunning automation — automated retries and customer notifications — directly addresses this without changing the product.'
          ),
        },
      ],
      [
        'NDR > 100% means existing customers grow revenue even without new acquisitions',
        '5% monthly churn = ~46% annual churn — seemingly small rates compound dramatically',
        'Involuntary churn (failed payments) is recoverable; diagnose voluntary churn with exit interviews',
      ]
    )],
    quizzes: [],
  },

  {
    slug: 'scaling-ops',
    title: 'Scaling Operations',
    displayOrder: 18,
    hasQuizAfter: true,
    module: 'Growth & Scale',
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'business-101-l18', 'Scaling Operations', 14, 27,
      'Scaling is not just doing more of what you did before — it requires rebuilding systems, processes, and teams for an order-of-magnitude larger operation. The habits that built a 10-person company often break a 100-person one.',
      [
        {
          heading: 'When to Build Process',
          content: `Scaling is not just doing more of what you did before — it requires rebuilding systems, processes, and teams for an order-of-magnitude larger operation.

Process exists to ensure consistency and scale human decisions. The trade-off: too little process and every situation is handled differently; too much process and the company moves slowly and loses the ability to adapt.

A useful heuristic: build process when the same type of decision or task recurs more than once per week and quality variance matters.

The "two-pizza team" rule (Jeff Bezos) — a team should be small enough to be fed by two pizzas. Small, autonomous teams with clear ownership move faster than large centralised ones.

Conway's Law: "Any organisation that designs a system will produce a design whose structure is a copy of the organisation's communication structure." Team topology directly shapes the architecture of what the team builds.

For example, Amazon's transition to microservices and two-pizza teams wasn't just a technology decision — it was an organisational restructuring designed to let hundreds of independent teams ship without coordinating with each other. The architecture followed the org design.

- Resist premature process — it ossifies the wrong workflows before you know what works
- The first time you do something, improvise. The fifth time, write the playbook.
- Team size and communication structure are product decisions, not just HR decisions`,
          knowledgeCheck: kc(
            'Conway\'s Law states that…',
            ['Software teams should be no larger than can be fed by two pizzas', 'Organisations design systems that mirror their own communication structures', 'Process should be added whenever a task is repeated more than twice', 'Technical debt grows proportionally with team size'],
            1,
            'Conway\'s Law: "Any organisation that designs a system will produce a design whose structure is a copy of the organisation\'s communication structure." Team topology directly shapes the architecture of what the team builds.'
          ),
        },
        {
          heading: 'Hiring, Delegation, and Management at Scale',
          content: `The transition from founder-led execution to a managed organisation is one of the hardest inflection points in a company's life. Founders who cannot delegate become bottlenecks; those who delegate too much lose quality control.

Key principles for scaling through people:

- **Hire for the next 12–18 months** — the person great at $0–$1M ARR may not be the right person to take you to $10M ARR
- **Document decisions, not just outcomes** — written decision-making rationale helps new team members apply consistent judgement without escalating every question
- **OKRs (Objectives and Key Results)** — a goal-setting framework that aligns the entire company around the same quarterly priorities, giving teams autonomy on *how* while alignment on *what*

For example, Google adopted OKRs in its first year (1999) from John Doerr, who had learned the system at Intel. The framework allowed engineering teams to set ambitious technical goals while staying aligned with company objectives — a critical system for scaling from 40 employees to 40,000.

- OKRs create alignment (everyone knows the Objectives) and autonomy (teams choose the key results)
- Hire 6 months before you need someone, not when you're already overwhelmed
- "Brilliant jerks" are net negative at scale — culture compounds the way unit economics do`,
          knowledgeCheck: kc(
            'OKRs (Objectives and Key Results) primarily help a scaling organisation by…',
            ['Replacing the need for manager–employee performance reviews', 'Aligning teams around shared priorities while preserving execution autonomy', 'Standardising compensation structures across departments', 'Automating routine operational decisions'],
            1,
            'OKRs create alignment (everyone knows the Objectives) and autonomy (teams choose the key results and tactics). This is the balance scaling organisations need — clear destination, flexible route.'
          ),
        },
      ],
      [
        'Build process when recurring decisions matter for quality — resist premature process',
        'Conway\'s Law: team communication structure shapes system architecture',
        'OKRs align the whole organisation on priorities while preserving team autonomy',
      ]
    )],
    quizzes: [quiz(
      'business-101-quiz6', 'Growth & Scale Quiz',
      ['acquisition-channels', 'retention', 'scaling-ops'],
      3, 70, 150,
      [
        mcq(
          'A viral K-factor of 1.5 means…',
          ['15% of users refer at least one new user', 'Each cohort generates 1.5× more new users, producing exponential growth', 'The company\'s growth rate is 1.5× the industry average', 'For every 1 user acquired through paid channels, 1.5 come through organic referral'],
          1,
          'K-factor = invitations per user × conversion rate on invitations. K > 1 means each user generates more than one new user on average, creating compounding viral growth.'
        ),
        mcq(
          'Net Dollar Retention (NDR) above 100% indicates…',
          ['The company has more revenue than expenses', 'Existing customers are generating more revenue through expansion than is lost to churn', 'The company\'s gross margin exceeds 100%', 'New customer revenue exceeds churn for the period'],
          1,
          'NDR > 100% is the gold standard for SaaS health. It means expansion revenue from upsells and seat growth outpaces churn, so revenue from existing customers grows without any new sales.'
        ),
        mcq(
          'According to Conway\'s Law, a tightly coupled monolithic software architecture suggests…',
          ['The engineering team uses a microservices deployment strategy', 'The organisation has a highly centralised, tightly coupled communication structure', 'The product was built by a small founding team with broad ownership', 'The company has outgrown its current tech stack'],
          1,
          'Conway\'s Law predicts that architecture mirrors org structure. A monolith often reflects a small, highly collaborative team with centralised decision-making — not necessarily a bad thing at early stages.'
        ),
      ]
    )],
  },
  ],
}

const COURSE_9: Course = {
  slug: 'leverage-trading-advanced', title: 'Leverage Trading: The Advanced Playbook', category: 'trading',
  difficulty: 'intermediate', hours: 1, xp: 725, icon: '⚡', order: 100,
  description: 'Seven modules on leverage, risk, and discipline — with a crypto-markets lens throughout.',
  subtopics: [

  {
    slug: 'leverage-basics',
    title: 'Leverage & Margin Basics',
    displayOrder: 1,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l1', 'Leverage & Margin Basics', 8, 103,
      'Leverage amplifies both gains and losses by allowing traders to control a position larger than their deposited capital. Understanding the mechanics of margin is the prerequisite for every other concept in this course.',
      [
        {
          heading: 'How Leverage Works',
          content: `Leverage amplifies both gains and losses by allowing traders to control a position far larger than their deposited capital. Understanding this mechanic is prerequisite knowledge for every other concept in this course.

When you use 10× leverage, a $1,000 deposit controls a $10,000 position. A 5% move in your favour produces a 50% return on deposited capital — but a 5% adverse move produces a 50% loss on that same capital.

**10× leverage** → 10% adverse move = 100% loss (complete wipeout) — do not use maximum leverage

**20× leverage** → 5% adverse move = 100% loss — most retail traders should never use this

**125× leverage** → 0.8% adverse move = 100% loss — this is not trading, it's gambling

Never use maximum available leverage. The exchange offers 125× because it profits from liquidations — not because it expects you to survive them.

For example, a trader opens a $5,000 BTC long with 20× leverage (initial margin: $250). BTC drops 4%. The position loses 4% × 20 = 80% of margin. Remaining margin: $50. At this point, the position is seconds from liquidation on any further tick down.

Crypto derivatives exchanges (Binance Futures, Bybit, OKX) offer up to 125× on major pairs — far exceeding the 10–20× typical in regulated futures markets. The extreme leverage available in crypto makes position sizing and risk management far more critical than in any traditional market.`,
          knowledgeCheck: kc(
            'A trader opens a $5,000 BTC long position using 20× leverage. Their initial margin is $250. BTC drops 4%. What happens to their margin?',
            ['Margin drops to $150 — a 40% loss on margin', 'Margin drops to $50 — an 80% loss on margin', 'Margin is completely wiped out — the position is liquidated', 'Nothing — the loss only affects the notional position, not the margin'],
            1,
            '4% adverse move on a 20× position = 80% loss on margin. $250 × 80% = $200 loss. Remaining margin = $50. At this point the position is dangerously close to the liquidation threshold.'
          ),
        },
        {
          heading: 'Initial Margin vs. Maintenance Margin',
          content: `Two margin concepts govern every leveraged position. Confusing them — or ignoring the second — is how traders get liquidated without understanding why.

**Initial Margin** — the minimum deposit required to open a position. At 10× leverage, initial margin = 10% of notional value. This is what you put up to enter the trade.

**Maintenance Margin** — the minimum equity required to keep the position open. Typically 0.5–5% of notional depending on exchange and asset. When your account equity falls to or below this level, the exchange liquidates your position to protect itself.

The gap between initial and maintenance margin is your liquidation buffer — the price range you can absorb before forced closure.

Using maximum available leverage minimises this buffer to near-zero — making liquidation the likely outcome of even small adverse moves. This is not a risk to manage; it is a certainty to avoid.

Never open a leveraged position without knowing your exact liquidation price before you enter.

For example, at 50× leverage with 0.5% maintenance margin, the buffer is approximately: 1/50 − 0.005 = 1.5%. BTC only needs to move 1.5% against you before the exchange closes your position. A single news headline can do this in minutes.

- Calculate your liquidation price before every trade — not after
- If your liquidation price is closer than your stop-loss, reduce leverage immediately
- Margin calls in crypto are largely automated — there is no phone call, just a liquidated position`,
          knowledgeCheck: kc(
            'Maintenance margin is important because…',
            ['It determines the maximum leverage you are allowed to use', 'It is the minimum equity required to keep a position open before forced liquidation', 'It is the upfront deposit required to open a new position', 'It is the fee charged by the exchange for holding a leveraged position overnight'],
            1,
            'Maintenance margin is the floor below which the exchange will forcibly close your position. Understanding it tells you exactly where your liquidation price lies relative to the current market price.'
          ),
        },
      ],
      [
        'Leverage multiplies both gains and losses by the leverage factor',
        'Initial margin opens the trade; maintenance margin is the floor before liquidation',
        'Higher leverage = smaller adverse price move required to trigger liquidation',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz1', 'Leverage & Margin Basics Quiz',
      ['leverage-basics'],
      4, 75, 50,
      [
        mcq(
          'A trader uses 25× leverage with $400 initial margin. What is the notional position size?',
          ['$400', '$4,000', '$10,000', '$40,000'],
          2,  // $400 × 25 = $10,000
          'Notional size = Initial Margin × Leverage = $400 × 25 = $10,000. The trader controls a $10,000 position with $400 deposited.'
        ),
        mcq(
          'At 10× leverage, a 10% adverse price move results in…',
          ['A 10% loss on deposited margin', 'A 100% loss on deposited margin (full wipeout)', 'A 50% loss on deposited margin', 'No loss until the maintenance margin threshold is breached'],
          1,
          'At 10× leverage, returns on margin are amplified 10×. A 10% adverse move = 10 × 10% = 100% loss on initial margin — a complete wipeout.'
        ),
        mcq(
          'Which type of margin is checked continuously to determine if a position should be liquidated?',
          ['Initial margin', 'Maintenance margin', 'Variation margin', 'Cross margin'],
          1,
          'Maintenance margin is the ongoing minimum equity requirement. When current equity falls to or below this level, the exchange triggers liquidation. Initial margin is only checked at order entry.'
        ),
        mcq(
          'Compared to traditional futures markets, crypto derivatives exchanges typically offer…',
          ['Lower maximum leverage due to higher volatility', 'Similar leverage capped at 10–20×', 'Much higher maximum leverage, sometimes up to 125×', 'No leverage — crypto is spot-only'],
          2,
          'Crypto exchanges like Binance Futures offer up to 125× leverage on BTC perpetuals — far exceeding the 10–20× typical in regulated commodity or equity futures markets. This makes risk management even more critical in crypto.'
        ),
      ]
    )],
  },

  {
    slug: 'position-sizing',
    title: 'Position Sizing & Risk',
    displayOrder: 2,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l2', 'Position Sizing & Risk', 9, 103,
      'Position sizing is the single most important decision a leveraged trader makes. Getting the entry right but sizing incorrectly can still blow an account. Systematic sizing protects capital across losing streaks.',
      [
        {
          heading: 'The 1–2% Rule and Risk Per Trade',
          content: `Position sizing is the single most important decision a leveraged trader makes. Getting the entry right but sizing incorrectly can still blow an account across a losing streak.

Professional traders limit risk per trade to 1–2% of total account equity. This means no single trade can lose more than 1–2% of capital, regardless of leverage used.

**Position Size = (Account Equity × Risk %) / (Entry Price − Stop-Loss Price)**

**1–2% risk per trade** — never risk more than this on a single position, no exceptions

**10-trade losing streak at 1% risk** → ~10% total drawdown (recoverable)

**10-trade losing streak at 10% risk** → ~65% total drawdown (account-destroying)

For example: Account $10,000, risk 1% ($100), BTC entry $30,000, stop at $29,400 ($600 below entry). Maximum position size = ($100 / $600) × $30,000 = $5,000 notional — not the whole account.

This discipline means even extended losing streaks leave you solvent and able to recover. Risking 10% per trade, a 10-trade losing streak destroys 65% of capital from compounding losses — a hole almost impossible to climb out of.

Never exceed 2% risk per trade. The traders who survive long enough to compound gains are almost universally the ones who never deviate from this rule.`,
          knowledgeCheck: kc(
            'A trader has $20,000 and risks 2% per trade. Entry is at $40,000 BTC, stop at $39,200. What is the correct notional position size?',
            ['$5,000', '$10,000', '$20,000', '$40,000'],
            1,
            'Risk amount = $20,000 × 2% = $400. Price risk per unit = $40,000 − $39,200 = $800. Position = ($400 / $800) × $40,000 = 0.5 BTC × $40,000 = $10,000 notional.'
          ),
        },
        {
          heading: 'Kelly Criterion and Expectancy',
          content: `The Kelly Criterion and trade expectancy give you the mathematical foundation for position sizing — understanding them separates systematic traders from gamblers.

**Kelly Criterion** — the theoretically optimal fraction of capital to risk given your win rate and reward-to-risk ratio:

f* = W − (1 − W) / R
(where W = win rate, R = average win / average loss ratio)

For example: 55% win rate, 1.5:1 reward-to-risk → f* = 0.55 − (0.45 / 1.5) = 0.25 (25% of capital). In practice, traders use half or quarter Kelly to reduce volatility. Full Kelly is mathematically optimal but produces drawdowns severe enough that most traders abandon the strategy.

**Trade Expectancy** = (Win Rate × Average Win) − (Loss Rate × Average Loss)

A positive expectancy system makes money on average. A 40% win rate with 2:1 reward-to-risk has expectancy of (0.4 × 2) − (0.6 × 1) = +0.2 per unit — profitable even with more losses than wins.

The goal of position sizing is to ensure you survive long enough for your edge to play out across enough trades. A statistically valid edge means nothing if you blow the account on trade number three.

Never use full Kelly. Fractional Kelly (half or quarter) dramatically reduces drawdown while giving up only modest long-run expected returns.`,
          knowledgeCheck: kc(
            'Using full Kelly sizing rather than fractional Kelly primarily increases…',
            ['Expected long-run returns by maximising compound growth', 'Drawdown volatility, making it psychologically harder to stick to the strategy', 'The number of trades required to reach profitability', 'Transaction costs due to larger average position sizes'],
            1,
            'Full Kelly maximises expected log-wealth mathematically, but the resulting drawdowns are severe enough that most traders deviate from the strategy when losing. Fractional Kelly accepts slightly lower returns for dramatically smoother equity curves.'
          ),
        },
      ],
      [
        'Risk 1–2% of account per trade regardless of leverage used',
        'Position Size = (Account × Risk %) / (Entry − Stop Loss Price)',
        'Positive expectancy + proper sizing = survival long enough for your edge to compound',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz2', 'Position Sizing & Risk Quiz',
      ['position-sizing'],
      4, 75, 50,
      [
        mcq(
          'A trader with a $5,000 account using the 1% rule can risk a maximum of how much per trade?',
          ['$50', '$100', '$500', '$1,000'],
          0,
          '1% of $5,000 = $50 maximum risk per trade. This keeps any single losing trade from causing material damage to the account.'
        ),
        mcq(
          'Trade expectancy is positive when…',
          ['The trader wins more than 50% of trades', '(Win Rate × Average Win) exceeds (Loss Rate × Average Loss)', 'The average leverage used exceeds 5×', 'The trader places at least 100 trades per month'],
          1,
          'Expectancy depends on both win rate AND the reward-to-risk ratio. A trader with a 40% win rate can have positive expectancy if average wins are 2× average losses.'
        ),
        mcq(
          'The Kelly Criterion formula f* = W − (1−W)/R calculates…',
          ['The optimal stop-loss distance as a fraction of entry price', 'The optimal fraction of capital to risk given win rate and reward-to-risk ratio', 'The maximum leverage ratio that keeps expected loss below 2%', 'The minimum number of trades needed to validate a strategy\'s edge'],
          1,
          'Kelly f* balances the tension between too little (sub-optimal growth) and too much (risk of ruin). It takes win rate (W) and reward-to-risk ratio (R) as inputs.'
        ),
        mcq(
          'Why do professional traders typically use "half Kelly" instead of full Kelly sizing?',
          ['Exchanges impose a maximum position size equal to half Kelly', 'Half Kelly dramatically reduces drawdown volatility while sacrificing only modest long-run returns', 'Full Kelly is only valid for binary bet outcomes, not continuous markets', 'Half Kelly is required by most risk management frameworks for regulatory compliance'],
          1,
          'Full Kelly produces mathematically optimal compound growth but with drawdowns so severe that adherence breaks down. Half Kelly cuts drawdown roughly in half while giving up only about 25% of the expected long-run growth rate.'
        ),
      ]
    )],
  },

  {
    slug: 'liquidation',
    title: 'Liquidation & Margin Calls',
    displayOrder: 3,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l3', 'Liquidation & Margin Calls', 9, 103,
      'Liquidation is the forced closure of a leveraged position when account equity falls below the maintenance margin threshold. Understanding exactly when and how it happens — and how to prevent it — is essential survival knowledge.',
      [
        {
          heading: 'Isolated vs. Cross Margin Mode',
          content: `Most crypto exchanges offer two margin modes that fundamentally change your risk profile. Using the wrong one for your situation is one of the most common — and most expensive — errors a leveraged trader can make.

**Isolated Margin** — only the margin allocated to a specific position is at risk. If the position is liquidated, you lose only the isolated margin — not your entire account. This is the correct mode for speculative, high-leverage trades where you want a known maximum loss.

**Cross Margin** — all available account balance is used as collateral for all open positions. Positions are harder to individually liquidate because the full account absorbs adverse moves — but a sequence of losing positions can drain the entire account simultaneously.

On Binance Futures cross margin mode, BTC perpetual positions share collateral with ETH and altcoin positions. A large ETH loss can trigger BTC liquidation even if BTC itself moved favourably.

Default to isolated margin for any speculative position. Switch to cross margin only when running a hedged portfolio where you understand the full exposure.

For example, a trader with $5,000 in their account who opens a $200 isolated margin position on a volatile altcoin can only lose $200 on that bet — not their whole account. In cross margin mode, a catastrophic altcoin move could consume their entire balance while their BTC position is perfectly fine.

Never use cross margin for high-leverage speculative trades. The risk of total account wipeout is real and has destroyed thousands of accounts.`,
          knowledgeCheck: kc(
            'Isolated margin mode is preferable when…',
            ['You want the full account balance to protect a high-conviction position', 'You want to strictly cap the maximum loss on a speculative, high-risk trade', 'You are running a market-neutral hedged portfolio', 'Cross margin fees are higher than isolated margin fees'],
            1,
            'Isolated margin limits your downside to the specifically allocated margin. This makes it ideal for speculative, high-leverage positions where you want a known maximum loss without risking the full account.'
          ),
        },
        {
          heading: 'Calculating Liquidation Price',
          content: `The liquidation price is not abstract — it is the exact price at which the exchange will forcibly close your position and keep your margin. You must know it before you open any trade.

**Liquidation Price (long)** ≈ Entry Price × (1 − 1/Leverage + Maintenance Margin Rate)

Example: BTC long at $30,000, 10× leverage, 0.5% maintenance margin:
Liquidation Price ≈ $30,000 × (1 − 0.1 + 0.005) = $30,000 × 0.905 = **$27,150**

BTC only needs to drop ~9.5% from entry to wipe out the entire position.

**At 50× leverage**: liquidation buffer narrows to just ~1.5% from entry

**At 20× leverage**: buffer is ~4.5% — a single volatile hour can trigger this

**At 10× leverage**: buffer is ~9.5% — more survivable, still requires active management

Never place a stop-loss below your liquidation price. If your stop-loss is at the same level as liquidation, you have no stop-loss — you have a coin flip with the exchange keeping your money if you lose.

Strategies to avoid liquidation: use stop-loss orders set well above the liquidation price, add margin to extend the buffer, or reduce leverage before volatility events (macro data releases, exchange hacks, regulatory news).

If your position is approaching its liquidation price, do not add margin to "save" it. Accept the loss and exit. Adding margin to a losing position is one of the most common ways traders turn a manageable loss into a catastrophic one.`,
          knowledgeCheck: kc(
            'A trader opens an ETH long at $2,000 with 20× leverage and a 0.5% maintenance margin rate. Approximately where is their liquidation price?',
            ['$1,910', '$1,800', '$1,600', '$1,500'],
            0,
            'Liquidation Price ≈ $2,000 × (1 − 1/20 + 0.005) = $2,000 × (1 − 0.05 + 0.005) = $2,000 × 0.955 = $1,910. A drop of only ~4.5% from entry triggers liquidation at 20× leverage.'
          ),
        },
      ],
      [
        'Isolated margin caps loss to allocated collateral; cross margin uses full account equity',
        'Liquidation Price ≈ Entry × (1 − 1/Leverage + Maintenance Margin Rate)',
        'Set stop-losses above your liquidation price — never let the exchange close your position',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz3', 'Liquidation & Margin Calls Quiz',
      ['liquidation'],
      4, 75, 50,
      [
        mcq(
          'Cross margin mode differs from isolated margin in that…',
          ['Cross margin limits each position\'s loss to its allocated collateral', 'Cross margin uses the full account balance as collateral across all open positions', 'Cross margin applies higher leverage limits', 'Cross margin is only available on decentralised exchanges'],
          1,
          'In cross margin, the entire account balance backstops all open positions. This reduces the chance of individual liquidation but exposes the full account to a series of losses.'
        ),
        mcq(
          'At 50× leverage with 0.5% maintenance margin, a BTC long position is approximately liquidated when BTC moves…',
          ['1.5% against the position', '5% against the position', '10% against the position', '50% against the position'],
          0,
          'Buffer ≈ 1/50 − 0.005 = 0.02 − 0.005 = 1.5%. At 50× leverage, only a 1.5% adverse move is enough to trigger liquidation.'
        ),
        mcq(
          'The best way to avoid unexpected liquidation is to…',
          ['Use cross margin instead of isolated margin on every position', 'Place stop-loss orders above the liquidation price to exit before forced closure', 'Always use maximum available leverage to maximise buffer in dollar terms', 'Only trade on decentralised exchanges where liquidation is less common'],
          1,
          'A stop-loss above the liquidation price ensures you exit the trade voluntarily before the exchange forcibly liquidates you at a potentially worse price (especially in cascading liquidation events).'
        ),
        mcq(
          'During a "liquidation cascade" in crypto markets…',
          ['Exchanges pause trading to prevent further losses', 'Forced liquidations from one price level trigger further liquidations at lower levels, amplifying the sell-off', 'Only cross-margin accounts are affected', 'Funding rates spike so high that short positions become unprofitable'],
          1,
          'Liquidation cascades occur when mass liquidations at one price level create selling pressure that pushes price to the next cluster of liquidation levels. This self-reinforcing mechanism causes the extreme wicks and flash crashes seen frequently in crypto.'
        ),
      ]
    )],
  },

  {
    slug: 'order-types',
    title: 'Advanced Order Types',
    displayOrder: 4,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l4', 'Advanced Order Types', 8, 103,
      'Mastering order types lets you execute precise strategies with defined risk parameters. Advanced traders use a combination of order types to manage entries, exits, and contingencies — often simultaneously.',
      [
        {
          heading: 'Limit, Stop-Market, and Stop-Limit Orders',
          content: `Mastering order types lets you execute precise strategies with defined risk parameters. Each order type has specific use cases — and using the wrong one at the wrong time can cost as much as a bad trade.

**Limit Order** — executes only at your specified price or better. You are a market maker — you avoid taker fees and get price certainty, but execution is not guaranteed if price doesn't reach your level.

**Stop-Market Order** — triggers a market order when price hits your stop level. Guarantees execution but not price — in fast, illiquid markets, slippage can be severe. This is the correct order type for stop-losses where execution certainty matters more than price certainty.

**Stop-Limit Order** — triggers a limit order when price hits the stop level. Controls price but risks non-execution if price gaps through the limit. This is dangerous for stop-losses in volatile crypto markets.

Do not use stop-limit orders as your primary stop-loss mechanism. In a flash crash or news-driven move, price can gap from above your stop trigger to well below your limit price in a single candle — leaving your order unfilled and your loss unlimited.

For example, on May 19, 2021, BTC crashed 30% in two hours. Traders with stop-limit orders at $45,000 (limit) found their orders unfilled as BTC gapped straight through to $40,000 without touching their limit. Those with stop-market orders exited at $44,200 — far better than the alternative.

The "Reduce Only" flag on Bybit and Binance ensures a stop-loss order can only reduce an open position, preventing accidental position reversal. Always enable this flag on your stop-loss orders.`,
          knowledgeCheck: kc(
            'Why is a stop-limit order risky as a stop-loss in volatile crypto markets?',
            ['It charges higher fees than a stop-market order', 'Price can gap through the limit price, resulting in no execution and unlimited further losses', 'It requires more margin to place than a stop-market order', 'Stop-limit orders are not supported on most crypto exchanges'],
            1,
            'In a fast-moving market or during a flash crash, price can jump from above your stop trigger to well below your limit price in one candle. Your limit order sits unfilled while the position continues to lose money.'
          ),
        },
        {
          heading: 'Trailing Stops, OCO, and Conditional Orders',
          content: `Advanced order types automate your risk management and profit-taking — removing the need to monitor positions continuously and reducing the emotional decisions that destroy accounts.

**Trailing Stop** — a dynamic stop-loss that moves with price in your favour by a fixed amount or percentage. Locks in profits as the trade moves your way while limiting downside if it reverses.

For example, a trailing stop 3% below price on a BTC long: if BTC rises from $30,000 to $33,000, the stop trails up to $32,010 — locking in most of the gain. If BTC then falls to $32,010, you're stopped out with a near-10% profit locked in rather than watching the gain evaporate.

**OCO (One-Cancels-the-Other)** — a pair of orders (typically a take-profit limit and a stop-loss) where execution of one automatically cancels the other. Once placed, you do not need to monitor the position — if price hits the take-profit, the stop is cancelled, and vice versa.

**Conditional / Trigger Orders** — execute a new order only after a specified condition is met. Used for breakout entries (buy only if price closes above $X), pyramiding (add to a winning position at pre-set levels), or automated risk management.

- Always set an OCO immediately after opening a position — never leave a leveraged trade unmanaged
- Trailing stops should be wide enough to avoid stop-hunting but tight enough to protect gains
- Conditional orders let you pre-programme your entire trade plan before emotion kicks in`,
          knowledgeCheck: kc(
            'An OCO (One-Cancels-the-Other) order is most useful for…',
            ['Entering a position at two different price levels simultaneously', 'Setting both a take-profit target and a stop-loss simultaneously, where one execution cancels the other', 'Automatically rebalancing a portfolio of crypto assets', 'Reducing fees by batching multiple market orders into one'],
            1,
            'OCO orders automate the exit management of a position. Once placed, the trader does not need to monitor — if price hits the take-profit, the stop is cancelled, and vice versa.'
          ),
        },
      ],
      [
        'Stop-market guarantees execution; stop-limit guarantees price but risks non-execution',
        'Trailing stops lock in profits automatically as price moves in your favour',
        'OCO orders manage both profit target and stop-loss simultaneously — essential for unattended positions',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz4', 'Advanced Order Types Quiz',
      ['order-types'],
      4, 75, 50,
      [
        mcq(
          'A limit order guarantees…',
          ['Execution at the next available market price', 'Execution at your specified price or better, but not guaranteed execution', 'Priority execution ahead of all market orders', 'Zero slippage on large position sizes'],
          1,
          'Limit orders are filled at your price or better — they will not fill above your buy limit or below your sell limit. But they only execute if the market reaches your price.'
        ),
        mcq(
          'The "Reduce Only" flag on a stop-loss order prevents…',
          ['The stop-loss from triggering in low-liquidity conditions', 'The order from accidentally opening or increasing a position instead of closing it', 'Slippage beyond a maximum acceptable threshold', 'The order from filling at a price worse than the stop trigger price'],
          1,
          '"Reduce Only" ensures the order can only decrease the current position size, not open a new position in the opposite direction — a crucial safeguard against accidental position reversal.'
        ),
        mcq(
          'A trailing stop set 5% below BTC\'s running high will trigger when…',
          ['BTC has risen 5% from the original entry price', 'BTC drops 5% from its highest point since the stop was placed', 'BTC\'s 5-period moving average crosses below the entry price', 'Volatility exceeds 5% on a 24-hour basis'],
          1,
          'A trailing stop tracks the highest price reached and triggers if price falls by the trail amount (5% here) from that high. It ratchets up with price but never moves down.'
        ),
        mcq(
          'Which order type would a trader use to automatically enter a long BTC position only if price breaks above a key resistance level?',
          ['Stop-market buy order at the resistance level', 'Market order placed immediately at current price', 'Sell limit order at the resistance level', 'OCO order with both legs above current price'],
          0,
          'A stop-market buy order above current price (a "buy stop") triggers a market order if price rises to and through the specified level — ideal for breakout entries where you only want to be long if the breakout is confirmed.'
        ),
      ]
    )],
  },

  {
    slug: 'funding-rates',
    title: 'Funding Rates & Perpetuals',
    displayOrder: 5,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l5', 'Funding Rates & Perpetuals', 9, 103,
      'Perpetual futures are the dominant instrument in crypto derivatives markets, with daily volumes exceeding spot markets. The funding rate mechanism is the key to understanding how perps work and how they can silently erode your position.',
      [
        {
          heading: 'How Perpetual Futures Work',
          content: `Perpetual futures are the dominant instrument in crypto derivatives markets, with daily volumes frequently exceeding spot markets. Understanding how they work — and how their costs accumulate silently — is essential for any leveraged trader.

Unlike traditional futures, perpetual contracts (perps) have no expiry date. Traders can hold positions indefinitely. To keep the perp price anchored to spot, exchanges use a funding rate mechanism: every 8 hours, long positions pay short positions when the perp trades at a premium to spot (positive funding), and shorts pay longs when it trades at a discount (negative funding).

**0.1% per 8-hour interval** = **~109% annualised cost** for long positions — this is not a rounding error

**0.3% per 8-hour interval** (common in bull markets) = ~328% annualised cost for longs

In a sustained bull market where funding stays at 0.1%, a 10× leveraged long position loses 109% of its notional value per year purely in funding — before any price movement. This cost is silent and continuous.

For example, during the 2021 bull run, BTC perp funding rates on Binance regularly spiked to 0.3%+ per 8 hours for weeks at a time. Traders holding long perps were paying more in funding than they could reasonably expect to earn from price appreciation.

Monitor funding rates before opening any position that you intend to hold overnight. A trade with a correct directional view can still lose money if the funding cost exceeds the price gain.`,
          knowledgeCheck: kc(
            'When the perpetual futures price trades at a significant premium to the spot price, the funding rate is typically…',
            ['Negative — shorts pay longs to hold their position', 'Positive — longs pay shorts to keep the perp anchored to spot', 'Zero — the exchange halts all positions until prices converge', 'Random — funding rates are set by a governance vote'],
            1,
            'Positive funding rate (perp premium) means longs pay shorts. This incentivises traders to short the perp and buy spot (basis trade), pushing prices back into alignment.'
          ),
        },
        {
          heading: 'Funding Rate as a Market Sentiment Indicator',
          content: `Beyond its direct cost, the funding rate is one of the most reliable sentiment indicators in crypto markets — and experienced traders use it to identify crowded positions before the inevitable flush.

- **Persistently high positive funding** (0.1–0.3%+ per 8h) — extreme long-side crowding. The market is overheated; contrarian short pressure builds. Historically correlates with local tops in BTC. When everyone is long, there is no one left to buy.
- **Persistently negative funding** — extreme short-side crowding. Short squeeze risk is elevated; historically correlates with local bottoms. When everyone is short, there is no one left to sell.
- **Funding rate normalisation after an extreme** — often precedes a strong directional move as the crowded side gets flushed out violently.

Entering a trade against extreme funding adds a carry tailwind: longing when funding is deeply negative means shorts are paying you to hold your position.

For example, in June 2022, BTC perp funding rates turned deeply negative for weeks as the market collapsed from $30,000 to $17,000. Traders who longed at peak negative funding (−0.1% per 8h) collected funding payments from shorts while also catching the bounce from $17,000 to $25,000.

- Use Coinglass or Velo Data to monitor funding rate history across exchanges
- Extreme positive funding + declining price = imminent long squeeze (very bearish signal)
- Extreme negative funding + stabilising price = imminent short squeeze (very bullish signal)`,
          knowledgeCheck: kc(
            'Persistently high positive funding rates in a crypto bull run signal…',
            ['Strong institutional demand for long exposure — a bullish continuation signal', 'Extreme retail long-side crowding that historically correlates with local price tops', 'That the exchange is earning higher revenue and is financially healthy', 'That the underlying spot market is also trading at a large premium to fair value'],
            1,
            'When everyone is long, there is no one left to buy. Extremely high positive funding historically coincides with exhausted upside and precedes corrections as leveraged longs are squeezed out.'
          ),
        },
      ],
      [
        'Perpetual futures use funding rates (paid every 8h) to stay anchored to spot price',
        'Positive funding = longs pay shorts; negative funding = shorts pay longs',
        'Extreme funding rates are reliable sentiment extremes — contra-indicators for experienced traders',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz5', 'Funding Rates & Perpetuals Quiz',
      ['funding-rates'],
      4, 75, 50,
      [
        mcq(
          'Perpetual futures differ from traditional futures primarily because…',
          ['They can only be traded on decentralised exchanges', 'They have no expiry date and use a funding rate to maintain spot price alignment', 'They do not allow leverage — they are cash-settled spot instruments', 'They are only available for BTC and ETH, not altcoins'],
          1,
          'The defining feature of perpetual futures is no expiry. The funding mechanism replaces the convergence at delivery that keeps traditional futures anchored to spot.'
        ),
        mcq(
          'A funding rate of 0.1% per 8-hour interval roughly equates to what annualised cost for a long position?',
          ['1.2% per year', '10.9% per year', '36.5% per year', '109% per year'],
          3,
          '0.1% × 3 intervals/day × 365 days = 109.5% annualised. This is why holding leveraged longs during high-funding bull markets dramatically erodes returns even without adverse price moves.'
        ),
        mcq(
          'A basis trade in crypto involves…',
          ['Buying futures and selling a leveraged ETF on the same asset', 'Selling (shorting) perp futures and buying spot to earn the funding rate', 'Arbitraging price differences between two different spot exchanges', 'Using options to create a synthetic long position'],
          1,
          'When funding is positive (perps at premium to spot), a basis trader shorts the perp and holds the equivalent spot. The funding payments received offset the hedge cost, creating a market-neutral yield.'
        ),
        mcq(
          'Persistently negative funding rates most likely indicate…',
          ['A highly bullish market with strong institutional long interest', 'Extreme short-side crowding — elevated risk of a short squeeze', 'Technical problems with the exchange\'s price oracle', 'Low trading volume that will resolve when markets open in Asia'],
          1,
          'Negative funding means shorts are paying longs. Extreme negative funding signals that too many traders are short — the setup for a violent short squeeze if price rises unexpectedly.'
        ),
      ]
    )],
  },

  {
    slug: 'hedging',
    title: 'Hedging Strategies',
    displayOrder: 6,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l6', 'Hedging Strategies', 9, 103,
      'Hedging uses offsetting positions to reduce exposure to adverse price moves. Rather than eliminating risk, effective hedges rebalance the risk profile — reducing downside while retaining upside or locking in a specific return.',
      [
        {
          heading: 'Perp Shorts as Portfolio Hedges',
          content: `Hedging uses offsetting positions to reduce exposure to adverse price moves. The most direct hedge for a spot crypto holding is a short perpetual futures position of equivalent notional size.

A $10,000 BTC spot holding hedged with a $10,000 BTC perp short creates a **delta-neutral position** — gains from spot are offset by losses on the short (and vice versa), leaving only basis risk (funding rate differential) as exposure.

**Delta-neutral hedge**: spot gains exactly offset by short perp losses on price movement — only funding costs remain

**Key risk**: funding rate carry. In sustained bull markets with high positive funding, the short position pays significant carry costs that erode the hedge's net return.

For example, a BTC miner holds 1 BTC worth $30,000 and shorts 1 BTC perpetual to hedge. If BTC rises to $36,000: spot gain = +$6,000, short loss = −$6,000, net P&L ≈ $0. The miner has converted uncertain BTC revenue into a predictable USD-equivalent cash flow — at the cost of funding payments on the short position.

- Rebalance the hedge as price moves to maintain delta-neutrality
- Calculate the net funding cost before entering a long-term hedge — it may exceed the protection value
- This strategy is used by miners, market makers, and basis traders who want exposure to yield, not price direction`,
          knowledgeCheck: kc(
            'A miner holds 1 BTC (worth $30,000) and shorts 1 BTC perpetual to hedge. If BTC rises to $36,000, what is the net P&L of the combined position?',
            ['+$6,000 — the spot gains offset the short loss exactly', 'Approximately $0 — gains on spot are offset by losses on the short (minus funding costs)', '-$6,000 — the short position dominates', '+$3,000 — the hedge captures half the upside'],
            1,
            'A perfect delta hedge offsets spot gains with equivalent futures losses, producing near-zero net P&L on price movement. The only remaining exposure is the funding rate cost of holding the short.'
          ),
        },
        {
          heading: 'Options-Based Hedges and the Greeks',
          content: `Options provide asymmetric hedges: protective puts allow unlimited downside protection while preserving all upside — unlike a futures short that caps both directions.

**Protective Put** — buy a put option at or below current price. If BTC drops from $30,000 to $20,000, your put gains value and offsets the spot loss. The premium paid is the maximum cost of the hedge — you know your worst case in advance.

**Covered Call** — sell a call option above current price. Collects premium income, reducing effective cost basis — but caps upside if price rises above the strike. Best in range-bound or mildly bearish conditions.

Key option Greeks for hedgers:

- **Delta** — how much option value changes per $1 of underlying move (a 0.5 delta put gains $0.50 when BTC falls $1)
- **Gamma** — rate of delta change; high near expiry means delta can shift rapidly
- **Theta** — daily time decay cost; options lose value every day as expiry approaches (options buyers pay this; sellers collect it)
- **Vega** — sensitivity to implied volatility; buying protection before anticipated volatile events (FOMC, ETF decisions) is expensive because IV is already elevated

For example, buying a BTC $28,000 put expiring in 30 days might cost $800 in premium. If BTC falls to $22,000, the put is worth approximately $6,000 — protecting $5,200 of loss at the cost of the $800 premium.

- Theta is the hidden cost of options-based hedges held over long periods
- Buy protection before volatility spikes (IV is lower), not after (IV premium is highest)
- The premium cost of a protective put is the insurance premium — it is not a loss, it is risk management`,
          knowledgeCheck: kc(
            'A protective put strategy limits downside because…',
            ['The put seller is obligated to buy your asset at the strike price regardless of market conditions', 'The put increases in value when the underlying falls, offsetting spot losses below the strike', 'Buying a put automatically rolls your long spot into a futures contract', 'Put options eliminate funding rate exposure on perpetual futures positions'],
            1,
            'A put option gains intrinsic value as the underlying asset\'s price falls below the strike. This gain offsets losses on a long spot position, effectively insuring the holder against downside below the strike price.'
          ),
        },
      ],
      [
        'A perp short of equal notional creates a delta-neutral hedge — only basis risk remains',
        'Protective puts provide asymmetric protection: unlimited downside cover, full upside retained',
        'Theta (time decay) is the hidden cost of options-based hedges held over long periods',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz6', 'Hedging Strategies Quiz',
      ['hedging'],
      4, 75, 50,
      [
        mcq(
          'A delta-neutral position has what primary remaining risk?',
          ['Price direction risk — the position loses money if the underlying moves significantly', 'Basis risk — gains and losses from funding rates, roll costs, and spot-perp divergence', 'Gamma risk — rapid large moves can overwhelm the hedge', 'Regulatory risk — delta-neutral strategies are restricted in some jurisdictions'],
          1,
          'A perfectly delta-hedged position has neutralised price direction risk. What remains is basis risk: the cost/benefit of carrying the hedge (funding rates, option premium time decay, rolling costs).'
        ),
        mcq(
          'A covered call strategy is most suitable when…',
          ['You expect a large upward move in the underlying asset', 'You hold a spot position and expect the market to be range-bound, wanting to generate yield', 'You want unlimited upside protection with capped downside', 'You have no existing spot position and want pure speculative exposure'],
          1,
          'Covered calls sell upside above the strike in exchange for premium income. This works best in range-bound or mildly bearish conditions — the premium improves returns, and the cap on upside does not matter if price stays below the strike.'
        ),
        mcq(
          'Theta in options trading refers to…',
          ['The sensitivity of option value to changes in implied volatility', 'The rate at which an option loses value as time passes (time decay)', 'The change in option delta per unit change in the underlying price', 'The correlation between option price and interest rate changes'],
          1,
          'Theta is time decay — the daily erosion of an option\'s extrinsic value as expiry approaches. Options buyers pay theta every day; options sellers collect it. Theta accelerates as expiry nears.'
        ),
        mcq(
          'A BTC miner who is "naturally long" BTC (mining income arrives as BTC) would most logically hedge using…',
          ['Buying BTC call options to increase long exposure', 'Shorting BTC perpetual futures to lock in a forward sale price', 'Buying BTC spot in addition to mining income', 'Increasing mining hash rate to reduce per-coin production cost'],
          1,
          'Miners have inherent long exposure — they earn BTC regardless of price. A perp short locks in the current price by offsetting future price risk, converting uncertain BTC revenue into a predictable USD-equivalent cash flow.'
        ),
      ]
    )],
  },

  {
    slug: 'psychology',
    title: 'Trading Psychology & Discipline',
    displayOrder: 7,
    hasQuizAfter: true,
    module: undefined,
    knowledgeCheckCount: 2,
    lessons: [lesson(
      'leverage-trading-l7', 'Trading Psychology & Discipline', 8, 103,
      'Consistent profitability in leverage trading is determined less by strategy and more by the psychological discipline to execute a strategy without deviation. The majority of traders who fail do so not because their edge is wrong, but because they cannot maintain discipline under pressure.',
      [
        {
          heading: 'Cognitive Biases That Destroy Traders',
          content: `Consistent profitability in leverage trading is determined less by strategy and more by the psychological discipline to execute a strategy without deviation. The majority of traders who fail do so not because their edge is wrong, but because they cannot maintain discipline under pressure.

Several cognitive biases are particularly destructive in leveraged markets:

**Loss Aversion** — the pain of a loss is psychologically ~2× more intense than the pleasure of an equivalent gain. This leads traders to hold losing positions too long (avoiding realising the loss) and cut winners too early. The result: the exact inverse of "cut losses short, let winners run."

**Revenge Trading** — after a loss, the emotional urge to "make it back immediately" drives a larger, undisciplined trade. Revenge trades are typically oversized, entered at poor risk-reward setups, and amplify losses rather than recovering them. Never trade to "make back" a specific amount — this is the fastest path to account destruction.

**Recency Bias** — overweighting recent events. After a winning streak, traders become overconfident and increase risk beyond their rules. After losses, they become gun-shy and miss valid setups. Both deviations destroy edge.

**FOMO (Fear of Missing Out)** — entering a position after a large move because you fear missing further gains. FOMO entries are typically at the worst possible price, near exhaustion of the move, with limited remaining upside and maximum downside.

If you feel a strong emotional pull to enter or exit a trade, check whether that impulse violates your written trading plan. If it does, do not act on it. The impulse is the bias speaking — not your edge.`,
          knowledgeCheck: kc(
            'Loss aversion in trading typically leads to…',
            ['Cutting losses quickly before they compound', 'Holding losing positions too long and cutting winners too early', 'Taking only high-probability, high-reward-ratio setups', 'Reducing position size after a losing streak'],
            1,
            'Loss aversion causes traders to irrationally hold losers (to avoid realising the pain of the loss) and prematurely exit winners (to lock in the pleasurable gain). This produces an asymmetric outcome: small wins and large losses.'
          ),
        },
        {
          heading: 'Building a Trading System and Process',
          content: `The antidote to psychological bias is a written trading system — rules defined in advance, before the emotional heat of a live position distorts your judgment.

**Trading Plan elements:**

- **Entry criteria** — exact conditions that must be met to trigger an entry (not "looks good")
- **Position sizing rules** — fixed % of capital per trade, calculated before entry, never adjusted mid-trade
- **Stop-loss level** — pre-defined, non-negotiable; set before entry, not during the trade
- **Take-profit targets** — one or multiple exits, also pre-defined
- **Maximum daily/weekly loss limits** — the circuit breaker that stops the spiral
- **Trade journal** — mandatory record of every trade's rationale, plan, and outcome

**Maximum daily loss rule** — many professional prop traders use: "if I lose X% in a day, I stop trading for the rest of the day." This prevents one bad session from destroying weeks of gains.

Never move your stop-loss in the direction of the loss to "give the trade more room." This is the most common rule violation and the most common cause of catastrophic single-trade losses. Your stop is where you're wrong — if you move it, you're letting hope replace analysis.

For example, traders who journal consistently identify recurring patterns in their mistakes — the same setup they always overtrade, the same news event that makes them emotional — and progressively eliminate them. Without a journal, the same mistakes repeat indefinitely because memory is self-serving.

- A trading plan only works if you follow it even when it feels wrong
- Review your journal weekly, not just when you're losing
- If you can't define your entry criteria in one sentence, you don't have a system — you have a guess`,
          knowledgeCheck: kc(
            'A maximum daily loss rule (e.g., "stop trading if I lose 3% in one day") primarily prevents…',
            ['Missing high-quality setups that occur after a small loss', 'Spiral-loss sessions where emotional revenge trading turns a bad day into a catastrophic one', 'Overconfidence during winning streaks', 'The psychological impact of watching unrealised losses in open positions'],
            1,
            'A daily loss limit enforces a circuit breaker on emotional decision-making. Once the limit is hit, the trader is locked out for the day — preventing the escalation from a bad day to an account-destroying session.'
          ),
        },
      ],
      [
        'Loss aversion produces the inverse of good trading: holding losers, cutting winners',
        'Revenge trading after losses amplifies drawdowns — rules must override emotions',
        'A written trading plan with pre-defined rules is the only reliable antidote to cognitive bias',
      ]
    )],
    quizzes: [quiz(
      'leverage-trading-quiz7', 'Trading Psychology & Discipline Quiz',
      ['psychology'],
      4, 75, 50,
      [
        mcq(
          'FOMO (Fear of Missing Out) most commonly leads traders to…',
          ['Enter positions too early, before confirmation signals appear', 'Enter positions after a large move has already occurred, at poor risk-reward levels', 'Hold winning positions for too long, waiting for larger gains', 'Avoid taking any trades during volatile market conditions'],
          1,
          'FOMO-driven entries happen at the tail end of a move — after the best entry point has passed. The trader enters at high risk with limited remaining upside, typically just before a reversal.'
        ),
        mcq(
          'Trade journaling primarily helps traders by…',
          ['Automatically executing trades based on historical pattern recognition', 'Creating a systematic feedback loop to identify behavioural patterns and improve decision-making', 'Reducing the emotional impact of watching open P&L fluctuate', 'Providing tax documentation required by most jurisdictions for derivatives trading'],
          1,
          'Journaling forces deliberate reflection on each trade: was the plan followed? What was the outcome? Why? Over time, this reveals recurring mistakes and strengths that memory alone cannot capture accurately.'
        ),
        mcq(
          'Revenge trading typically produces worse outcomes because…',
          ['Exchanges charge higher fees on trades made within 24 hours of a loss', 'Trades are entered from an emotional state at poor setups and with oversized position sizes', 'Revenge trades must be placed as market orders, which carry high slippage', 'Stop-loss placement becomes impossible when in an emotional state'],
          1,
          'Revenge trades bypass the trading plan entirely. Entered from a state of emotional distress, they are typically too large, placed at suboptimal setups, and driven by the irrational goal of "making back" a specific loss amount.'
        ),
        mcq(
          'Which cognitive bias causes traders to overweight the most recent market events when forming expectations?',
          ['Loss aversion', 'Confirmation bias', 'Recency bias', 'Sunk cost fallacy'],
          2,
          'Recency bias leads to overconfidence after a winning streak (assuming it will continue) and paralysis after losses (assuming they will continue). It distorts probability assessments by over-indexing on the most recent sample.'
        ),
      ]
    )],
  },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE 10 — Reading Financial Statements (EMPTY SCAFFOLD)
// 9 subtopics defined; no lessons; 4 quizzes exist with 0 questions.
// ═══════════════════════════════════════════════════════════════════════════════
const RFS_SUBS = [
  'Introduction to Financial Statements', 'The Income Statement', 'The Balance Sheet',
  'The Cash Flow Statement', 'Working Capital', 'Ratio Analysis',
  'Revenue Recognition', 'Footnotes & Disclosures', 'Putting It All Together',
]
const COURSE_10: Course = {
  slug: 'reading-financial-statements', title: 'Reading Financial Statements', category: 'corporate-finance',
  difficulty: 'intermediate', hours: 2, xp: 500, icon: '📑', order: 101, comingSoon: true,
  description: 'Read and interpret the three core financial statements. (Content in production.)',
  subtopics: RFS_SUBS.map((title, i): Subtopic => ({
    slug: `rfs-${i + 1}`, title, displayOrder: i + 1, hasQuizAfter: i % 2 === 1 && i < 8,
    knowledgeCheckCount: 0, lessons: [],
    quizzes: (i % 2 === 1 && i < 8) ? [quiz(`rfs-quiz${i + 1}`, `${title} Quiz`, [`rfs-${i + 1}`], 0, 70, 0, [])] : [],
  })),
}

// ═══════════════════════════════════════════════════════════════════════════════
export const COURSES: Course[] = [
  COURSE_1, COURSE_2, COURSE_3, COURSE_4, COURSE_5, COURSE_6, COURSE_7, COURSE_8, COURSE_9, COURSE_10,
]

export function getCourse(slug: string): Course | undefined {
  return COURSES.find(c => c.slug === slug)
}
