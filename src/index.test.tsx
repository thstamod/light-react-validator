// @ts-nocheck
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
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
    const { result, waitForNextUpdate } = renderHook(() => useValidator())
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
    act(() => fireEvent.input(input, { target: { value: 'Good Day' } }))
    act(() => fireEvent.input(input, { target: { value: '' } }))
    const res = result.current.errors
    expect(res.email.require).toBe('email is required')
  })
})
