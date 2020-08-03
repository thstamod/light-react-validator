import React from 'react'
import { useValidator } from 'light-react-validator'

// const config = { validateFormOnSubmit: true }
const config = {}

const App = () => {
  console.log('rerender')
  const { track, submitForm, errors, formValidity } = useValidator(config)

  console.log('ERRORS', errors)

  const submit = () => {
    console.log('submitted')
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
    <form onSubmit={(e) => submitForm(submit)(e)}>
      <label htmlFor='email'>email</label>
      <input
        ref={(elem) =>
          track(elem, {
            rules: { require: true, email: true },
            messages: { require: 'email is required', email: 'is not an email' }
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
            rules: { require: true },
            messages: { require: 'free is required' }
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

      <button disabled={!formValidity} type='submit'>
        submit
      </button>
    </form>
  )
}

export default App
