import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, cleanup, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import { useValidator } from '.'
import { Config } from './types/configuration'

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
  test('show min length', () => {
    let gErrors = {}
    let gFormValidity = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, minLength: true },
                messages: {
                  required: 'free is required',
                  minLength: 'min is 2'
                },
                options: { minLength: 2 }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { minLength: 'min is 2' }
    })
    fireEvent.input(input, { target: { value: 'Ga' } })
    expect(gFormValidity).toEqual(true)
    expect(gErrors).toEqual({})
  })
  test('textArea max length and required', () => {
    let gErrors = {}
    let gFormValidity = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <textarea
            id='textarea'
            name='textarea'
            aria-label='textarea'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, maxLength: true },
                messages: {
                  required: 'textarea is required',
                  maxLength: 'max is 5'
                },
                options: { maxLength: 5 }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('textarea')
    fireEvent.input(input, { target: { value: 'G' } })
    fireEvent.input(input, { target: { value: '' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      textarea: { required: 'textarea is required' }
    })
    fireEvent.input(input, { target: { value: 'Galileo' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      textarea: { maxLength: 'max is 5' }
    })
    fireEvent.input(input, { target: { value: 'Gal' } })
    expect(gFormValidity).toEqual(true)
    expect(gErrors).toEqual({})
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

describe('useValidator radio', () => {
  test('input type radio is required on submit', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
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
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(gErrors).toEqual({ drone: { required: 'radio is required' } })
  })
  test('input type radio is required on submit same name not all required', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
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
              aria-label='dewey'
              value='dewey'
              ref={(elem) => track(elem)}
            />
            <label htmlFor='dewey'>Dewey</label>
          </div>

          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(gErrors).toEqual({ drone: { required: 'radio is required' } })
  })
  test('input type radio is submitted successfully', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <div>
            <input
              type='radio'
              id='huey'
              aria-label='huey'
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
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const radio = t.getByLabelText('Huey')
    fireEvent.click(radio)
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(true)
    expect(gErrors).toEqual({})
  })
  test('input type radio is required revalidate on resubmit', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
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
              aria-label='dewey'
              value='dewey'
              ref={(elem) => track(elem)}
            />
            <label htmlFor='dewey'>Dewey</label>
          </div>

          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(gErrors).toEqual({ drone: { required: 'radio is required' } })
    const radio = t.getByLabelText('dewey')
    fireEvent.click(radio)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(true)
    expect(gErrors).toEqual({})
  })
})

describe('useValidator checkbox', () => {
  test('input type checkbox is required and throw an error on submit', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <div>
            <input
              type='checkbox'
              id='vehicle'
              name='vehicle'
              value='Bike1'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>

          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(gErrors).toEqual({ vehicle: { required: 'checkbox is required' } })
  })
  test('input type checkbox is required and its submitted successfully', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <div>
            <input
              type='checkbox'
              id='vehicle'
              name='vehicle'
              value='Bike2'
              aria-label='checkbox'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>

          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    const checkbox = t.getByLabelText('checkbox')
    fireEvent.click(checkbox)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(true)
    expect(gErrors).toEqual({})
  })
  test('input type checkbox is required in group with min and failed when the criteria are not met', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <div>
            <input
              type='checkbox'
              id='vehicle1'
              name='vehicle'
              value='Bike31'
              aria-label='checkbox1'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true, minCheckboxes: true },
                  messages: {
                    required: 'checkbox is required',
                    minCheckboxes: 'you should check at least 2 checkboxes'
                  },
                  options: { minCheckboxes: 2 }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='vehicle2'
              name='vehicle'
              value='Bike32'
              aria-label='checkbox2'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='vehicle3'
              name='vehicle'
              value='Bike33'
              aria-label='checkbox3'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    const checkbox = t.getByLabelText('checkbox1')
    fireEvent.click(checkbox)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(false)
    expect(gErrors).toEqual({
      vehicle: {
        minCheckboxes: 'you should check at least 2 checkboxes'
      }
    })
  })
  test('input type checkbox is required in group with min success when criteria are met', () => {
    let gFormValidity = null
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <div>
            <input
              type='checkbox'
              id='vehicle1'
              name='vehicle'
              value='Bike4'
              aria-label='checkbox1'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true, minCheckboxes: true },
                  messages: {
                    required: 'checkbox is required',
                    minCheckboxes: 'you should check at least 2 checkboxes'
                  },
                  options: { minCheckboxes: 2 }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='vehicle2'
              name='vehicle'
              value='Bike4'
              aria-label='checkbox2'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='vehicle3'
              name='vehicle'
              value='Bike4'
              aria-label='checkbox3'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const submitBtn = t.getByText(/submit/i)
    const checkbox1 = t.getByLabelText('checkbox1')
    const checkbox2 = t.getByLabelText('checkbox2')
    fireEvent.click(checkbox1)
    fireEvent.click(checkbox2)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toBe(true)
    expect(gErrors).toEqual({})
  })
})

describe('useValidator select', () => {
  test('select unselect throw an error', () => {
    let gErrors = {}
    let gFormValidity = false
    const Component = () => {
      const config = {}
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <label htmlFor='select'>Choose a car:</label>
          <select
            data-testid='select'
            name='select'
            id='cars'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'select is required'
                }
              })
            }
          >
            <option value=''>select an option</option>
            <option value='volvo'>Volvo</option>
            <option value='saab'>Saab</option>
            <option value='mercedes'>Mercedes</option>
            <option value='audi'>Audi</option>
          </select>
          <button type='submit'>submit</button>
        </div>
      )
    }

    render(<Component />)
    const select = screen.getByTestId('select')
    act(() => userEvent.selectOptions(select, 'audi'))
    expect(gFormValidity).toEqual(true)
    act(() => userEvent.selectOptions(select, ''))

    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({ select: { required: 'select is required' } })
  })
  test('select unselect throw an error on submit', () => {
    let gErrors = {}
    let gFormValidity = false
    const Component = () => {
      const config = {}
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <form onSubmit={(e) => submitForm(() => {})(e)}>
          <label htmlFor='select'>Choose a car:</label>
          <select
            data-testid='select'
            name='select'
            id='cars'
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'select is required'
                }
              })
            }
          >
            <option data-testid='select-option-default' value=''>
              select an option
            </option>
            <option value='volvo'>Volvo</option>
            <option value='saab'>Saab</option>
            <option value='mercedes'>Mercedes</option>
            <option data-testid='select-option' value='audi'>
              Audi
            </option>
          </select>
          <button type='submit'>submit</button>
        </form>
      )
    }

    const t = render(<Component />)
    const select = screen.getByTestId('select')
    const submitBtn = t.getByText(/submit/i)
    fireEvent.click(submitBtn)
    expect(gFormValidity).toEqual(false)
    act(() => userEvent.selectOptions(select, 'audi'))
    expect(gFormValidity).toEqual(true)
    act(() => userEvent.selectOptions(select, ''))
    fireEvent.click(submitBtn)

    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({ select: { required: 'select is required' } })
  })
})

describe('default values', () => {
  test('if default value is invalid rise an error', () => {
    let gErrors = {}
    let gFormValidity = false
    const Component = () => {
      const config = { errorOnInvalidDefault: true }
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
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
                  email: 'is not a valid email'
                }
              })
            }
            defaultValue='test@test.'
          />
        </div>
      )
    }

    render(<Component />)
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({ email: { email: 'is not a valid email' } })
  })
  test('2 inputs which one has default invalid value', () => {
    let gErrors = {}
    let gFormValidity = false
    const Component = () => {
      const config = { errorOnInvalidDefault: true }
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
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
                  email: 'is not a valid email'
                }
              })
            }
            defaultValue='test@test.'
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
        </div>
      )
    }

    render(<Component />)
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({ email: { email: 'is not a valid email' } })
  })
  test('2 inputs which one has default invalid value and the other is checkbox with min checks', () => {
    let gErrors = {}
    let gFormValidity = false
    const Component = () => {
      const config = { errorOnInvalidDefault: true }
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
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
                  email: 'is not a valid email'
                }
              })
            }
            defaultValue='test@test.'
          />
          <div>
            <input
              type='checkbox'
              id='vehicle1'
              name='vehicle'
              value='Bike31'
              aria-label='checkbox1'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true, minCheckboxes: true },
                  messages: {
                    required: 'checkbox is required',
                    minCheckboxes: 'you should check at least 2 checkboxes'
                  },
                  options: { minCheckboxes: 2 }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
          <div>
            <input
              type='checkbox'
              id='vehicle2'
              name='vehicle'
              value='Bike32'
              aria-label='checkbox2'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label htmlFor='vehicle'>bike</label>
          </div>
        </div>
      )
    }

    render(<Component />)
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({ email: { email: 'is not a valid email' } })
  })
})

describe('rules hierarchy', () => {
  test('config validator overrules builtIn', () => {
    const config: Config = {
      customValidators: {
        email: (input: string): boolean =>
          /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{1})+$/.test(input)
      }
    }
    let gFormValidity = false
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
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
    fireEvent.input(input, { target: { value: 'test@mail.com' } })
    expect(gErrors).toEqual({ email: { email: 'is not an email' } })
    expect(gFormValidity).toEqual(false)
    fireEvent.input(input, { target: { value: 'test@mail.c' } })
    expect(gErrors).toEqual({})
    expect(gFormValidity).toEqual(true)
  })
  test('element validator overrules builtIn and config validator', () => {
    const config: Config = {
      customValidators: {
        email: (input: string): boolean =>
          /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{1})+$/.test(input)
      }
    }
    let gFormValidity = false
    let gErrors = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
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
                },
                customValidators: {
                  email: (input: string): boolean =>
                    /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\.)+$/.test(input)
                }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('email')
    fireEvent.input(input, { target: { value: 'test@mail.com' } })
    expect(gErrors).toEqual({ email: { email: 'is not an email' } })
    expect(gFormValidity).toEqual(false)
    fireEvent.input(input, { target: { value: 'test@mail.c' } })
    expect(gErrors).toEqual({ email: { email: 'is not an email' } })
    expect(gFormValidity).toEqual(false)
    fireEvent.input(input, { target: { value: 'test@mail..' } })
    expect(gErrors).toEqual({})
    expect(gFormValidity).toEqual(true)
  })
  test('element options overrules options', () => {
    const config: Config = {
      globalOptions: { minLength: 3 }
    }
    let gErrors = {}
    let gFormValidity = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, minLength: true },
                messages: {
                  required: 'free is required',
                  minLength: 'min is 2'
                },
                options: { minLength: 2 }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { minLength: 'min is 2' }
    })
    fireEvent.input(input, { target: { value: 'Ga' } })
    expect(gFormValidity).toEqual(true)
    expect(gErrors).toEqual({})
  })
  test('element options are not present gets config options', () => {
    const config: Config = {
      globalOptions: { minLength: 3 }
    }
    let gErrors = {}
    let gFormValidity = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, minLength: true },
                messages: {
                  required: 'free is required',
                  minLength: 'min is 2'
                }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { minLength: 'min is 2' }
    })
    fireEvent.input(input, { target: { value: 'Ga' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { minLength: 'min is 2' }
    })
    fireEvent.input(input, { target: { value: 'Gal' } })
    expect(gFormValidity).toEqual(true)
    expect(gErrors).toEqual({})
  })

  test('validation failed when the option is not anywhere present', () => {
    let gErrors = {}
    let gFormValidity = {}
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator()
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true, minLength: true },
                messages: {
                  required: 'free is required',
                  minLength: 'min is 2'
                }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { minLength: 'min is 2' }
    })
  })
  test('element messages overrules config', () => {
    let gErrors = {}
    let gFormValidity = {}
    const config: Config = {
      globalMessages: { required: 'is required' }
    }
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
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
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    fireEvent.input(input, { target: { value: '' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { required: 'free is required' }
    })
  })
  test('message from global config', () => {
    let gErrors = {}
    let gFormValidity = {}
    const config: Config = {
      globalMessages: { required: 'is required' }
    }
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
      gErrors = errors
      gFormValidity = formValidity
      return (
        <div>
          <input
            id='free'
            name='free'
            aria-label='free'
            type='text'
            ref={(elem) =>
              track(elem, {
                rules: { required: true }
              })
            }
          />
        </div>
      )
    }

    const t = render(<Component />)
    const input = t.getByLabelText('free')
    fireEvent.input(input, { target: { value: 'G' } })
    fireEvent.input(input, { target: { value: '' } })
    expect(gFormValidity).toEqual(false)
    expect(gErrors).toEqual({
      free: { required: 'is required' }
    })
  })
})
