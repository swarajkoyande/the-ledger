// Tiny safe arithmetic evaluator for calculator games.
// Formulas come from our own content (not user input) and use only field-id
// variables and + - * / ^ ( ) — so we avoid the mathjs dependency and keep the
// build self-contained. `^` is power. Unknown calculationTypes fall back to the
// explicit `formula` string; some calculationTypes imply a standard formula.

const ALLOWED = /^[\s\d.+\-*/()^a-zA-Z_]*$/

export function evaluate(formula: string, vars: Record<string, number>): number {
  if (!ALLOWED.test(formula)) return NaN
  // ^ → ** (right-assoc power). Replace variable names with their numeric values.
  let expr = formula.replace(/\^/g, '**')
  // Sort var names longest-first so e.g. `rate` isn't clobbered inside `ratePct`.
  const names = Object.keys(vars).sort((a, b) => b.length - a.length)
  for (const name of names) {
    expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), `(${vars[name]})`)
  }
  // Reject if any bare identifier survived (undefined variable).
  if (/[a-zA-Z_]/.test(expr.replace(/\*\*/g, ''))) return NaN
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${expr});`)
    const out = fn()
    return typeof out === 'number' && isFinite(out) ? out : NaN
  } catch {
    return NaN
  }
}

// Standard formulas implied by calculationType when no explicit formula string.
export function standardFormula(calculationType: string, v: Record<string, number>): number {
  switch (calculationType) {
    case 'compound-interest': {
      // Future value of a principal + recurring monthly contributions.
      const { principal = 0, monthlyContribution = 0, rate = 0, years = 0 } = v
      const r = rate / 100 / 12
      const n = years * 12
      const fvPrincipal = principal * Math.pow(1 + r, n)
      const fvContrib = r === 0 ? monthlyContribution * n : monthlyContribution * ((Math.pow(1 + r, n) - 1) / r)
      return fvPrincipal + fvContrib
    }
    case 'tax-impact': {
      // Very simplified progressive-ish estimate: taxable = salary − deduction,
      // taxed at a blended 22% to show the deduction's effect.
      const { salary = 0, deduction = 0 } = v
      const taxable = Math.max(0, salary - deduction)
      return taxable * 0.22
    }
    case 'roi': {
      const { investmentCost = 0, gainAmount = 0 } = v
      return investmentCost === 0 ? 0 : (gainAmount / investmentCost) * 100
    }
    default:
      return NaN
  }
}

export function computeResult(
  calculationType: string,
  formula: string | undefined,
  vars: Record<string, number>,
): number {
  if (formula) return evaluate(formula, vars)
  return standardFormula(calculationType, vars)
}
