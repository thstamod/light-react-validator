import { isEmpty } from './isEmpty'

describe('isEmpty function', () => {
  test('is empty array', () => {
    expect(isEmpty([])).toBe(true)
  })
  test('is empty object', () => {
    expect(isEmpty({})).toBe(true)
  })
  test('is NOT empty array', () => {
    expect(isEmpty([1])).toBe(false)
  })
  test('is NOT empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })
})
