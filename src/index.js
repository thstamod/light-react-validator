/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect, createRef } from 'react'
// import builtInValidators from './utils/builtIns'

export const useValidator = () => {
  const elements = useRef(new Map())
  const touchedElements = useRef(new Map())
  const dirtyElements = useRef(new Map())
  const errors = createRef({})

  const submitForm = (fn) => (e) => {
    e.preventDefault()
    console.log('validator formSubmit')
    fn()
  }

  const track = (elem, rules) => {
    const ref = createRef(null)
    ref.current = elem
    elements.current.set(elem, {
      touched: false,
      dirty: false,
      value: null,
      valid: true,
      rules
    })

    ref.current.onchange = partialOnChange(ref)
    ref.current.onfocus = partialOnFocus(ref)
  }

  const partialOnChange = (ref) => (e) =>
    console.log('second onChange ', e.target.value, ref)

  const partialOnFocus = (ref) => (e) => {
    touchedElements.current.set(ref)
    ref.current.onfocus = ''
    console.log('second onFocus ', e.target.value, ref)
  }

  return [track, submitForm, errors]
}
