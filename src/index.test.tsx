import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useValidator } from '.'

afterEach(cleanup)

describe('useValidator', () => {
  test('hook returns the right types', () => {
    const { result } = renderHook(() => useValidator())
    expect(typeof result.current.track).toBe('function')
    expect(typeof result.current.submitForm).toBe('function')
    expect(typeof result.current.errors).toBe('object')
  })
  test('gets simple error', () => {
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors } = useValidator()
      gErrors = errors
      return (
        <div>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true },
                messages: { require: 'email is required' }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Good Day' } })
    fireEvent.input(input, { target: { value: '' } })
    const res = gErrors
    expect(res.email.require).toBe('email is required')
  })
  test('error is disappeared after not empty field', () => {
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors } = useValidator()
      gErrors = errors
      return (
        <div>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true },
                messages: { require: 'email is required' }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Good Day' } })
    fireEvent.input(input, { target: { value: '' } })
    fireEvent.input(input, { target: { value: 'a' } })
    const res = gErrors
    expect(res).toEqual({})
  })
})
