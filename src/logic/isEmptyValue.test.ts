import { isEmptyValue } from './isEmptyValue'

describe('isEmptyValue function', () => {
  test('is empty array', () => {
    expect(isEmptyValue([])).toBe(true)
  })
  test('is empty object', () => {
    expect(isEmptyValue({})).toBe(true)
  })
  test('filled array', () => {
    expect(isEmptyValue([1, 2])).toBe(false)
  })
  test('filled object', () => {
    expect(isEmptyValue({ a: 1 })).toBe(false)
  })
  test('string text', () => {
    expect(isEmptyValue('string')).toBe(false)
  })
  test('number', () => {
    expect(isEmptyValue(1)).toBe(false)
  })
  test('empty string', () => {
    expect(isEmptyValue('')).toBe(true)
  })
  test('empty string with space', () => {
    expect(isEmptyValue(' ')).toBe(true)
  })
  test('0 value', () => {
    expect(isEmptyValue(0)).toBe(false)
  })
  test('null', () => {
    expect(isEmptyValue(null)).toBe(true)
  })
  test('undefined', () => {
    expect(isEmptyValue(undefined)).toBe(true)
  })
})
