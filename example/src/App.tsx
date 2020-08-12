import React from 'react'
import { serialize } from './serializeForm'
import { useValidator } from 'light-react-validator'

// const config = { validateFormOnSubmit: true }
const config = {}

const App = () => {
  console.log('rerender')
  const { track, submitForm, errors, formValidity } = useValidator(config)

  console.log('ERRORS', errors)
  console.log('FORMVALIDITY', formValidity)

  const submit = () => {
    console.log('submitted')
    var form = document.querySelector('form')
    console.log(serialize(form))
  }
  const showErrors = (errors: any) => {
    const t = []
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const element = errors[key]
        t.push(<span key={key}>{element}</span>)
      }
    }
    return t
  }

  return (
    <form id='form' onSubmit={(e) => submitForm(submit)(e)}>
      <label htmlFor='email'>email</label>
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
        type='text'
        id='email'
      />
      {errors?.email && showErrors(errors.email)}
      <br />
      <label htmlFor='free'>free</label>
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
      <br />
      <label htmlFor='noattach'>no attach</label>
      <input
        type='text'
        id='noattach'
        onChange={(e) => console.log('noattach ', e.target.value)}
      />
      <br />
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
      {errors?.drone && showErrors(errors.drone)}
      <br />
      <div>
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
        <label htmlFor='vehicle'>bike</label>
        {errors?.vehicle && showErrors(errors.vehicle)}
        <br />
        Group
        <br />
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
        <label htmlFor='vehicle2'>car</label>
        <br />
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
        <label htmlFor='vehicle3'>boat</label>
        <br />
        {errors?.groupCheckbox && showErrors(errors.groupCheckbox)}
        <br />
      </div>
      <button disabled={!formValidity} type='submit'>
        submit
      </button>
    </form>
  )
}

export default App
