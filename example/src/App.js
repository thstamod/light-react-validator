import React from 'react'

import { useValidator } from 'light-react-validator'
import 'light-react-validator/dist/index.css'

const App = () => {
  const [track] = useValidator()

  console.log('rerender')
  const submit = (e) => {
    e.preventDefault()
    console.log('submitted')
  }

  return (
    <form onSubmit={(e) => submit(e)}>
      <label htmlFor='email'>email</label>
      <input
        ref={(elem) => track(elem, { require: true })}
        onChange={(e) => console.log('original onChange ', e.target.value)}
        type='text'
        id='email'
      />
      <br />
      <label htmlFor='free'>free</label>
      <input
        ref={track}
        onChange={(e) => console.log('original onChange ', e.target.value)}
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
