/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from 'react'
// import builtInValidators from './utils/builtIns'

export const useValidator = () => {
  const elements = useRef(new Map())
  const ref = useRef(null)
  const track = (elem, rules) => {
    console.log(elem, rules)
    console.log(elements)
    ref.current = elem
    elements.current.set(elem, {
      touched: false,
      dirty: false,
      value: null,
      valid: true,
      rules
    })
    ref.current.onchange = (e) =>
      console.log('second onChange ', e.target.value)
  }

  return [track]
}
