import React from 'react'

import { useValidator } from 'light-react-validator'
import 'light-react-validator/dist/index.css'

const config = {}

const App = () => {
  console.log('rerender')
  const [track, submitForm, errors] = useValidator(config)

  console.log('ERRORS', errors)

  const submit = () => {
    console.log('submitted')
  }
  const showErrors = (errors) => {
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
            rules: { require: true },
            msgs: { require: 'email is required' }
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
        ref={(elem) => track(elem)}
        name='free'
        onChange={(e) => console.log('original onChange ', e.target.value)}
        onFocus={(e) => console.log('original onfocus ', e.target.value)}
        type='text'
        id='free'
      />
      <br />
      <label htmlFor='noatach'>no atach</label>
      <input
        type='text'
        id='noatach'
        onChange={(e) => console.log('noatach ', e.target.value)}
      />
      <br />

      <button type='submit'>submit</button>
    </form>
  )
}

export default App
