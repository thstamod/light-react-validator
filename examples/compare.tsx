// @ts-nocheck
// @ts-ignore
import React, { useRef } from 'react'
import { useValidator } from 'light-react-validator'

const Component = () => {
  const { track, errors } = useValidator()
  const freeRef = useRef()
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
    <div>
      <input
        id='text'
        name='text'
        aria-label='text'
        type='text'
        ref={(elem) =>
          track(elem, {
            rules: { required: true, sameWithFree: true },
            messages: {
              required: 'email is required',
              sameWithFree: 'they are not the same'
            },
            customValidators: {
              sameWithFree: (input, available) =>
                available.current.value === input
            },
            options: { sameWithFree: freeRef }
          })
        }
      />
      {errors?.text && showErrors(errors.text)}
      <input
        id='free'
        name='free'
        aria-label='free'
        type='free'
        defaultValue='free'
        ref={freeRef}
      />
    </div>
  )
}
