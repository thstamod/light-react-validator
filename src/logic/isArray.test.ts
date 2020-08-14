import { isArray } from './isArray'

describe('isArray function', () => {
  test('is empty array', () => {
    expect(isArray([])).toBe(true)
  })
  test('is filled array', () => {
    expect(isArray([1, 2])).toBe(true)
  })
  test('is number', () => {
    expect(isArray(1)).toBe(false)
  })
  test('is boolean', () => {
    expect(isArray(false)).toBe(false)
  })
  test('is text', () => {
    expect(isArray('test')).toBe(false)
  })
  test('is isObject', () => {
    expect(isArray({})).toBe(false)
    expect(isArray({ a: [] })).toBe(false)
  })
  test('is null', () => {
    expect(isArray(null)).toBe(false)
  })
})
