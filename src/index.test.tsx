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
                rules: { required: true },
                messages: { required: 'email is required' }
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
    expect(res.email.required).toBe('email is required')
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
                rules: { required: true },
                messages: { required: 'email is required' }
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
      email: { required: 'email is required', email: 'is not an email' }
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
      email: { required: 'email is required', email: 'is not an email' }
    })
    expect(gFormValidity).toBe(false)
  })
  test('after fixing errors should be able to resubmit the form (one element)', () => {
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
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
  test('after submitting the form fix an error you able to resubmit with errors', () => {
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
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'free is required'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const email = t.getByLabelText('email')

    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)

    expect(gErrors).toEqual({
      email: { email: 'is not an email', required: 'email is required' },
      free: { required: 'free is required' }
    })

    expect(gFormValidity).toBe(false)

    fireEvent.input(email, { target: { value: 'Ga@mail.com' } })
    expect(gErrors).toEqual({
      free: { required: 'free is required' }
    })
    expect(gFormValidity).toBe(false)
  })
  test('after successful submit it runs the success submit callback', () => {
    let gFormValidity = null
    const successSubmit = jest.fn()
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(successSubmit)(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'free is required'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const email = t.getByLabelText('email')
    const free = t.getByLabelText('free')
    fireEvent.input(email, { target: { value: 'Ga@mail.com' } })
    fireEvent.input(free, { target: { value: 'Ga' } })
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(true)
    expect(successSubmit).toBeCalled()
  })
  test('after unsuccessful submit it not runs the success submit callback', () => {
    let gFormValidity = null
    const successSubmit = jest.fn()
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(successSubmit)(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'free is required'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const email = t.getByLabelText('email')
    const free = t.getByLabelText('free')
    fireEvent.input(email, { target: { value: 'Ga@mail.com' } })
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(successSubmit).not.toBeCalled()
  })
  test('after unsuccessful submit, fixing the errors and it runs the success submit callback', () => {
    let gFormValidity = null
    const successSubmit = jest.fn()
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(successSubmit)(e)}>
          <input
            id='email'
            name='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'free is required'
                }
              })
            }
          />
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const email = t.getByLabelText('email')
    const free = t.getByLabelText('free')
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    fireEvent.input(email, { target: { value: 'Ga@mail.com' } })
    fireEvent.input(free, { target: { value: 'Ga' } })

    fireEvent.click(submitBtn)

    expect(successSubmit).toBeCalled()
  })

  test('should call console.worn when ref name is undefined', () => {
    process.env.NODE_ENV = 'development'
    const mockConsoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {})

    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      return (
        <div>
          <input
            id='email'
            aria-label='email'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
          />
        </div>
      )
    }

    render(<Component />)
    expect(mockConsoleWarn).toHaveBeenCalled()
  })
})

describe('useValidator form', () => {
  test('input type radio is required', () => {
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors } = useValidator()
      gErrors = errors
      return (
        <div>
          <div>
            <input
              type='radio'
              id='huey'
              name='drone'
              value='huey'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'radio is required'
                  }
                })
              }
            />
            <label htmlFor='huey'>Huey</label>
          </div>

          <div>
            <input
              type='radio'
              id='dewey'
              name='drone'
              value='dewey'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'radio is required'
                  }
                })
              }
            />
            <label htmlFor='dewey'>Dewey</label>
          </div>

          <div>
            <input
              type='radio'
              id='louie'
              name='drone'
              value='louie'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'radio is required'
                  }
                })
              }
            />
            <label htmlFor='louie'>Louie</label>
          </div>
        </div>
      )
    }

    const t = render(<Component />)
    return false
  })
})
