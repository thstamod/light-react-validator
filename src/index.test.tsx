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
    const { result } = renderHook(() => useValidator())
    const t = render(
      <div>
        <input
          id='email'
          name='email'
          aria-label='email'
          type='text'
          ref={(elem) =>
            result.current.track(elem, {
              rules: { require: true },
              messages: { require: 'email is required' }
            })
          }
        />
      </div>
    )
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Good Day' } })
    fireEvent.input(input, { target: { value: '' } })
    const res = result.current.errors
    expect(res.email.require).toBe('email is required')
  })
  test('error is disappeared after not empty field', () => {
    const { result } = renderHook(() => useValidator())
    const t = render(
      <div>
        <input
          id='email'
          name='email'
          aria-label='email'
          type='text'
          ref={(elem) =>
            result.current.track(elem, {
              rules: { require: true },
              messages: { require: 'email is required' }
            })
          }
        />
      </div>
    )
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Good Day' } })
    fireEvent.input(input, { target: { value: '' } })
    fireEvent.input(input, { target: { value: 'a' } })
    const res = result.current.errors
    expect(res).toEqual({})
  })
})
