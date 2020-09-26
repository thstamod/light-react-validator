 // @ts-nocheck
// @ts-ignore
import React, { useRef } from 'react'
import { useValidator } from 'light-react-validator'

 const config: Config = {
      globalMessages: { required: 'is required' }
    }
    const Component = () => {
      const { track, submitForm, errors, formValidity } = useValidator(config)
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