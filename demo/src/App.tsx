import React, { useRef } from 'react'
import { serialize } from './serializeForm'
import { useValidator } from 'light-react-validator'
import './main.css'

// const config = { errorOnInvalidDefault: true }
const config = {}

const App = () => {
  const rerenders = useRef(0)
  const { track, submitForm, errors, formValidity } = useValidator(config)
  console.log(`rerenders: ${rerenders.current} times`)

  const submit = submitForm((e: Event) => {
    console.log('submitted', e)
    var form = document.querySelector('form')
    console.log(serialize(form))
  })
  const showErrors = (errors: any) => {
    const e = []
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const element = errors[key]
        e.push(
          <span className='error' key={key}>
            {element}
          </span>
        )
      }
    }
    return e
  }

  return (
    <>
      <form id='form' onSubmit={(e) => submit(e)}>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            ref={(elem) =>
              track(elem, {
                rules: { required: true, email: true },
                messages: {
                  required: 'email is required',
                  email: 'is not an email'
                }
              })
            }
            name='email'
            onChange={(e) => console.log('original onChange ', e.target.value)}
            onFocus={(e) => console.log('original onfocus ', e.target.value)}
            type='email'
            id='email'
            defaultValue='test@test.gr'
          />
          {errors?.email && showErrors(errors.email)}
        </div>
        <div className='form-group'>
          <label htmlFor='free'>Required</label>
          <input
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: { required: 'free is required' }
              })
            }
            name='free'
            onChange={(e) => console.log('original onChange ', e.target.value)}
            onFocus={(e) => console.log('original onfocus ', e.target.value)}
            type='text'
            id='free'
          />
          {errors?.free && showErrors(errors.free)}
        </div>
        <div className='form-group'>
          <label>Radio buttons</label>
          <div className='d-flex'>
            <div className='radio-item'>
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
              <label className='item-label' htmlFor='huey'>
                Huey
              </label>
            </div>

            <div className='radio-item'>
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
              <label className='item-label' htmlFor='dewey'>
                Dewey
              </label>
            </div>

            <div className='radio-item'>
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
              <label className='item-label' htmlFor='louie'>
                Louie
              </label>
            </div>
          </div>
          {errors?.drone && showErrors(errors.drone)}
        </div>
        <div className='form-group'>
          <label>Single Checkbox</label>
          <div className='full'>
            <input
              type='checkbox'
              id='vehicle'
              name='vehicle'
              value='Bike'
              ref={(elem) =>
                track(elem, {
                  rules: { required: true },
                  messages: {
                    required: 'checkbox is required'
                  }
                })
              }
            />
            <label className='item-label' htmlFor='vehicle'>
              bike
            </label>
          </div>

          {errors?.vehicle && showErrors(errors.vehicle)}
        </div>
        <div className='form-group'>
          <label>Group checkboxes</label>
          <div className='full'>
            <div>
              <input
                type='checkbox'
                id='vehicle2'
                name='groupCheckbox'
                value='Car'
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
              <label className='item-label' htmlFor='vehicle2'>
                car
              </label>
            </div>
            <div>
              <input
                type='checkbox'
                id='vehicle3'
                name='groupCheckbox'
                value='Boat'
                ref={(elem) =>
                  track(elem, {
                    rules: { required: true },
                    messages: {
                      required: 'checkbox is required'
                    }
                  })
                }
              />
              <label className='item-label' htmlFor='vehicle3'>
                boat
              </label>
            </div>
          </div>

          {errors?.groupCheckbox && showErrors(errors.groupCheckbox)}
        </div>
        <div className='form-group'>
          <label htmlFor='number'>Number</label>
          <input
            ref={(elem) =>
              track(elem, {
                rules: { required: true },
                messages: {
                  required: 'number is required'
                  // email: 'is not an email'
                }
              })
            }
            name='number'
            onChange={(e) => console.log('original onChange ', e.target.value)}
            onFocus={(e) => console.log('original onfocus ', e.target.value)}
            type='number'
            id='number'
          />
          {errors?.number && showErrors(errors.number)}
        </div>

        <div className='form-group'>
          <label htmlFor='select'>Select</label>
          <select
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
          <br />
          {errors?.select && showErrors(errors.select)}
        </div>
        <div className='wrapper-button'>
          <button disabled={!formValidity} type='submit'>
            Submit
          </button>
        </div>
      </form>
      <div className='rerender-label'>
        <label>{`rerenders ${rerenders.current++} times`}</label>
      </div>
    </>
  )
}

export default App
