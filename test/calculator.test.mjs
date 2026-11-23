import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatEntry, initialState, pressKey } from '../src/calculator.ts'

function type(keys) {
  return [...keys].reduce(pressKey, initialState)
}

const calculations = [
  ['12+8=', '20'],
  ['12−8=', '4'],
  ['9×8=', '72'],
  ['9÷2=', '4.5'],
  ['0,1+0,2=', '0.3'],
  ['1÷3×3=', '1'],
  ['1÷3=×3=', '1'],
  ['2+3×4=', '20'],
  ['8+×2=', '16'],
  ['8+2==', '12'],
  ['200+10%=', '220'],
  ['200−10%=', '180'],
  ['200×10%=', '20'],
  ['50%', '0.5'],
  ['3×±2=', '-6'],
  ['123⌫', '12'],
  ['1,,2', '1.2'],
  ['1234567890123', '123456789012'],
  ['5+2=9', '9'],
  ['5÷0=9', '9'],
  ['999999999999×9=', '8.99999999999e+12'],
]

for (const [keys, expected] of calculations) {
  test(`${keys} displays ${expected}`, () => {
    assert.equal(type(keys).entry, expected)
  })
}

test('division by zero shows an error and can be cleared', () => {
  const state = type('5÷0=')
  assert.equal(state.phase, 'error')
  assert.equal(state.expression, '5 ÷ 0 =')
  assert.equal(pressKey(state, 'AC'), initialState)
})

test('the display preserves Turkish separators and decimal input', () => {
  assert.equal(formatEntry(type('±1234,50').entry), '-1.234,50')
  assert.equal(formatEntry(type('1,').entry), '1,')
  assert.equal(formatEntry('1.2e+12'), '1,2e+12')
})
