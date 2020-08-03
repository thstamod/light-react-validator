import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { useValidator } from '.'

afterEach(cleanup)

describe('useValidator individual inputs', () => {
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
  test('one of two errors still there', () => {
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
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Ga' } })
    const res = gErrors
    expect(res).toEqual({ email: { email: 'is not an email' } })
  })
  test('show and the second error', () => {
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
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'Ga' } })
    let res = gErrors
    expect(res).toEqual({ email: { email: 'is not an email' } })
    fireEvent.input(input, { target: { value: '' } })
    res = gErrors
    expect(res).toEqual({
      email: { require: 'email is required', email: 'is not an email' }
    })
  })
})

describe('useValidator form', () => {
  test('form validity without config', () => {
    let gErrors = {}
    let gFormValidity = null
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    const submitBtn = t.getByText(/submit/i)
    fireEvent.input(input, { target: { value: 'Ga' } })
    expect(gFormValidity).toBe(false)
  })
  test('form validity with validateFormOnSubmit: true on config', () => {
    let gErrors = {}
    let gFormValidity = null
    const config = { validateFormOnSubmit: true }
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    const submitBtn = t.getByText(/submit/i)
    fireEvent.input(input, { target: { value: 'Ga' } })
    expect(gFormValidity).toBe(true)
  })
  test('show errors on submit without config', () => {
    let gErrors = {}
    let gFormValidity = null
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    const submitBtn = t.getByText(/submit/i)
    //  fireEvent.input(input, { target: { value: 'Ga' } })
    fireEvent.click(submitBtn)
    const res = gErrors
    expect(res).toEqual({
      email: { require: 'email is required', email: 'is not an email' }
    })
    expect(gFormValidity).toBe(false)
  })
  test('after fixing errors should be able to resubmit the form', () => {
    let gErrors = {}
    let gFormValidity = null
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { require: true, email: true },
                messages: {
                  require: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    const submitBtn = t.getByText(/submit/i)
    fireEvent.input(input, { target: { value: 'Ga' } })
    fireEvent.click(submitBtn)
    const res = gErrors
    expect(res).toEqual({
      email: { email: 'is not an email' }
    })
    expect(gFormValidity).toBe(false)
    fireEvent.input(input, { target: { value: 'Gaw@mail.com' } })
    expect(res).toEqual({})
    expect(gFormValidity).toBe(true)
  })
})
