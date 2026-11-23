export type Operator = '+' | '−' | '×' | '÷'
type Operation = { operator: Operator; operand: number }
export type Key = Operator | `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | 'AC' | '⌫' | '%' | '±' | ',' | '='

type CalculatorState = {
  entry: string
  exactValue: number | null
  phase: 'entry' | 'waiting' | 'result' | 'error'
  pending: Operation | null
  repeat: Operation | null
  expression: string
}

export const initialState: CalculatorState = {
  entry: '0',
  exactValue: null,
  phase: 'entry',
  pending: null,
  repeat: null,
  expression: '',
}

const digitLimit = 12

export function formatEntry(entry: string) {
  if (entry.includes('e')) return entry.replace('.', ',')

  const [integer, fraction] = entry.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return fraction === undefined ? grouped : `${grouped},${fraction}`
}

function calculate(left: number, operator: Operator, right: number) {
  switch (operator) {
    case '+': return left + right
    case '−': return left - right
    case '×': return left * right
    case '÷': return left / right
  }
}

function toEntry(value: number) {
  const rounded = Number(value.toPrecision(digitLimit))
  if (!Number.isFinite(rounded)) return value.toExponential()
  if (Math.abs(rounded) >= 1e12 || (rounded !== 0 && Math.abs(rounded) < 1e-6)) {
    return rounded.toExponential()
  }
  return String(rounded)
}

export function formatNumber(value: number) {
  return formatEntry(toEntry(value))
}

function errorState(expression: string): CalculatorState {
  return { ...initialState, phase: 'error', expression }
}

export function pressKey(state: CalculatorState, key: Key): CalculatorState {
  if (key === 'AC') return initialState

  if (key === ',' || /^\d$/.test(key)) {
    const next = state.phase === 'entry' || state.phase === 'waiting' ? state : initialState
    const entry = next.phase === 'waiting' ? '0' : next.entry
    if (key === ',') {
      if (entry.includes('.') || entry.includes('e')) return next
      return { ...next, phase: 'entry', entry: `${entry}.`, exactValue: null }
    }
    if (entry === '0' || entry === '-0') {
      return { ...next, phase: 'entry', entry: entry.replace('0', key), exactValue: null }
    }
    if (entry.includes('e') || entry.replace(/\D/g, '').length >= digitLimit) return next
    return { ...next, phase: 'entry', entry: entry + key, exactValue: null }
  }

  if (state.phase === 'error') return key === '⌫' ? initialState : state

  const value = state.exactValue ?? Number(state.entry)
  const pending = state.pending

  switch (key) {
    case '⌫': {
      if (state.phase !== 'entry') return state
      const shortened = state.entry.includes('e') ? '' : state.entry.slice(0, -1)
      return { ...state, entry: shortened === '' || shortened === '-' ? '0' : shortened, exactValue: null }
    }
    case '±': {
      const entry = state.phase === 'waiting' ? '0' : state.entry
      return {
        ...state,
        entry: entry.startsWith('-') ? entry.slice(1) : `-${entry}`,
        exactValue: state.phase === 'waiting' || state.exactValue === null ? null : -value,
        phase: state.phase === 'waiting' ? 'entry' : state.phase,
        repeat: null,
        expression: '',
      }
    }
    case '%': {
      if (state.phase === 'waiting') return state
      const fraction = value / 100
      const percentage = pending?.operator === '+' || pending?.operator === '−'
        ? pending.operand * fraction
        : fraction
      if (!Number.isFinite(percentage)) return errorState(`${formatEntry(state.entry)} %`)
      return {
        ...state,
        entry: toEntry(percentage),
        exactValue: percentage,
        phase: pending ? 'entry' : 'result',
        repeat: null,
        expression: '',
      }
    }
    case '=': {
      if (state.phase === 'waiting') return state
      const operation = pending ?? state.repeat
      if (!operation) {
        return { ...state, phase: 'result', entry: toEntry(value) }
      }
      const left = pending ? operation.operand : value
      const right = pending ? value : operation.operand
      const expression = `${formatNumber(left)} ${operation.operator} ${formatNumber(right)} =`
      const result = calculate(left, operation.operator, right)
      if (!Number.isFinite(result)) return errorState(expression)
      return {
        ...initialState,
        entry: toEntry(result),
        exactValue: result,
        phase: 'result',
        expression,
        repeat: { operator: operation.operator, operand: right },
      }
    }
    case '+':
    case '−':
    case '×':
    case '÷': {
      const result = pending && state.phase === 'entry'
        ? calculate(pending.operand, pending.operator, value)
        : value
      if (!Number.isFinite(result)) {
        return errorState(pending ? `${formatNumber(pending.operand)} ${pending.operator} ${formatEntry(state.entry)}` : '')
      }
      return {
        ...initialState,
        entry: toEntry(result),
        exactValue: result,
        phase: 'waiting',
        pending: { operator: key, operand: result },
      }
    }
    default:
      return state
  }
}
