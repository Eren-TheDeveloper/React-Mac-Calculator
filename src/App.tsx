import { useEffect, useReducer } from 'react'
import { Delete } from 'lucide-react'
import { formatEntry, formatNumber, initialState, pressKey, type Key } from './calculator'

const buttons = [
  '⌫', 'AC', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '−',
  '1', '2', '3', '+',
  '±', '0', ',', '=',
] as const satisfies readonly Key[]

const labels: Partial<Record<Key, string>> = {
  '⌫': 'Son rakamı sil',
  AC: 'Tümünü temizle',
  '%': 'Yüzde',
  '÷': 'Böl',
  '×': 'Çarp',
  '−': 'Çıkar',
  '+': 'Topla',
  '±': 'İşareti değiştir',
  ',': 'Ondalık ayırıcı',
  '=': 'Eşittir',
}

const keyboard = new Map<string, Key>([
  ['Backspace', '⌫'],
  ['Delete', 'AC'],
  ['Escape', 'AC'],
  ['Enter', '='],
  ['.', ','],
  ['-', '−'],
  ['*', '×'],
  ['/', '÷'],
])

function App() {
  const [state, dispatch] = useReducer(pressKey, initialState)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'Enter' && event.target instanceof HTMLButtonElement) return

      const key = keyboard.get(event.key) ?? buttons.find((button) => button === event.key)
      if (key) {
        event.preventDefault()
        dispatch(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const display = state.phase === 'error' ? 'Hata' : formatEntry(state.entry)
  const expression = state.pending
    ? `${formatNumber(state.pending.operand)} ${state.pending.operator}`
    : state.expression

  return (
    <main className="workspace">
      <section className="calculator" aria-labelledby="calculator-title">
        <h1 id="calculator-title">Hesap Makinesi</h1>
        <div className="display">
          <p className="display-expression">{expression}</p>
          <output
            aria-label="Hesap makinesi ekranı"
            className={display.length > 12 ? 'display-value display-value--compact' : 'display-value'}
          >
            {display}
          </output>
        </div>
        <div className="keypad">
          {buttons.map((key, index) => (
            <button
              key={key}
              type="button"
              aria-label={labels[key]}
              aria-pressed={index % 4 === 3 && key !== '=' ? state.phase === 'waiting' && state.pending?.operator === key : undefined}
              className={index % 4 === 3 ? 'key key--operator' : index < 3 ? 'key key--utility' : 'key'}
              onClick={() => dispatch(key)}
            >
              {key === '⌫' ? <Delete aria-hidden="true" size={23} /> : key}
            </button>
          ))}
        </div>
      </section>
      <p className="keyboard-tip"><kbd>=</kbd> Hesapla <span aria-hidden="true">·</span> <kbd>Esc</kbd> Temizle</p>
    </main>
  )
}

export default App
