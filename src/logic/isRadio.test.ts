import { isRadio } from './isRadio'

describe('isRadio function', () => {
  test('is radio input', () => {
    var input = document.createElement('input')
    input.type = 'radio'
    expect(isRadio(input)).toBe(true)
  })
  test('is text input', () => {
    var input = document.createElement('input')
    input.type = 'text'
    expect(isRadio(input)).toBe(false)
  })
  test('is checkbox input', () => {
    var input = document.createElement('input')
    input.type = 'checkbox'
    expect(isRadio(input)).toBe(false)
  })
})
