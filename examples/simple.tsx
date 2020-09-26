// @ts-nocheck
// @ts-ignore
import React, { useRef } from 'react'
import { useValidator } from 'light-react-validator'

const Component = () => {
      const { track, submitForm, errors } = useValidator()
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
