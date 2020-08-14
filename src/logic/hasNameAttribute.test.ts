import { hasNameAttribute } from './hasNameAttribute'

describe('hasNameAttribute function', () => {
  test('has name', () => {
    var input = document.createElement('input')
    input.type = 'text'
    input.name = 'testName'
    expect(hasNameAttribute(input)).toBe('testName')
  })
  test('hasnt name', () => {
    var input = document.createElement('input')
    input.type = 'text'
    expect(hasNameAttribute(input)).toBe(undefined)
  })
})
