import { isCheckbox } from './isCheckbox'

describe('isCheckbox function', () => {
  test('is checkbox input', () => {
    var input = document.createElement('input')
    input.type = 'checkbox'
    expect(isCheckbox(input)).toBe(true)
  })
  test('is text input', () => {
    var input = document.createElement('input')
    input.type = 'text'
    expect(isCheckbox(input)).toBe(false)
  })
  test('is radio input', () => {
    var input = document.createElement('input')
    input.type = 'radio'
    expect(isCheckbox(input)).toBe(false)
  })
})
