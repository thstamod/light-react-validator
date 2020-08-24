import { getHierarchyProperties } from './getHierarchyProperties'

describe('getOptions function', () => {
  test('both have same property', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 2 }
    expect(getHierarchyProperties(obj1, obj2, 'a')).toBe(1)
  })
  test('first is undefined', () => {
    const obj2 = { a: 2 }
    expect(getHierarchyProperties(undefined, obj2, 'a')).toBe(2)
  })
  test('second is undefined', () => {
    const obj1 = { a: 1 }
    expect(getHierarchyProperties(obj1, undefined, 'a')).toBe(1)
  })
  test('both are undefined', () => {
    expect(getHierarchyProperties(undefined, undefined, 'a')).toBe(undefined)
  })
})
