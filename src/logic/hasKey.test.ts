import { hasKey } from './hasKey'

describe('hasKey function', () => {
  test('simple object', () => {
    const obj = { a: 1 }
    expect(hasKey(obj, 'a')).toBe(true)
  })
  test('depth0 key not exist', () => {
    const obj = { a: 1 }
    expect(hasKey(obj, 'b')).toBe(false)
  })
  test('depth1 key exists', () => {
    const obj = { a: { b: 1 } }
    expect(hasKey(obj.a, 'b')).toBe(true)
  })

  test('empty object', () => {
    const obj = {}
    expect(hasKey(obj, 'a')).toBe(false)
  })
})
