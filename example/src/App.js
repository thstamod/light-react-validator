import React from 'react'

import { useValidator } from 'light-react-validator'
import 'light-react-validator/dist/index.css'

const App = () => {
  const [track] = useValidator()

  const submit = (e) => {
    e.preventDefault()
    console.log('submitted')
  }

  return (
    <form onSubmit={(e) => submit(e)}>
      <label htmlFor='email'>email</label>
      <input
        ref={(elem) => track(elem, { require: true })}
        type='text'
        id='email'
      />
      <br />
      <label htmlFor='free'>free</label>
      <input ref={track} type='text' id='free' />
      <button type='submit'>submit</button>
    </form>
  )
}

export default App
