import { useRef, useState, useEffect, createRef, RefObject } from 'react'
import builtInValidators from './utils/builtIns'
import { Config, UseValidator } from './types/configuration'
import { DataField, BasicRefs, Rules } from './types/fields'
import { getValidators } from './logic/checkValidators'
import { hasNameAttribute } from './logic/checkers'
import { isEmpty } from './logic/genericFunctions'

export const useValidator = (config?: Config): UseValidator => {
  const elements = useRef(new Map())
  const touchedElements = useRef(new Map())
  const dirtyElements = useRef(new Map())
  const errors = useRef({})
  const customValidators = useRef(null)
  // const validity = useRef(true)
  const [, rerender] = useState()

  const submitForm = (fn: Function) => (e: Event) => {
    e.preventDefault()
    console.log('validator formSubmit')
    for (const el in elements.current) {
      fieldValidation(elements.current[el])
    }
    fn()
  }

  useEffect(() => {
    if (config?.customValidators) {
      customValidators.current = config.customValidators
    }
  }, [])

  const fieldValidation = (ref: RefObject<BasicRefs>): void => {
    const prev = elements.current.get(ref.current)
    // const shouldRerender = false
    let _isValid = true
    const { fieldRules, validators } = elements.current.get(ref.current)
    const { rules, messages } = fieldRules
    for (const key in validators) {
      const validator = validators[key]
      const name = hasNameAttribute(ref)
      if (rules[key] && !validator(ref?.current?.value)) {
        errors.current[name] = {
          [key]: messages?.[key],
          ...errors.current[name]
        }
        elements.current.set(ref.current, { ...prev, valid: false })
        _isValid = false
      } else {
        delete errors.current?.[name]?.[key]
        isEmpty(errors.current?.[name]) && delete errors.current?.[name]
        errors.current = { ...errors.current }
        elements.current.set(ref.current, { ...prev, valid: true })
        _isValid = true
      }
    }
    console.log(_isValid)
    if (prev !== elements.current.get(ref.current)) {
      // validity.current = !validity.current
      rerender({})
    }
    // return _isValid
  }

  const detectInput = (ref: RefObject<BasicRefs>) => (e: Event) => {
    e.stopPropagation()
    if (!dirtyElements.current.has(ref)) {
      dirtyElements.current.set(ref, null)
      return
    }
    fieldValidation(ref)
  }

  const track = (elem?: BasicRefs, rules?: Rules): void => {
    if (!elem) return
    const ref = createRef<BasicRefs>()
    ;(ref as React.MutableRefObject<BasicRefs>).current = elem
    if (elements.current.has(ref.current)) return
    ref.current && ref.current.addEventListener('focus', detectTouch(ref))
    ref.current && ref.current.addEventListener('input', detectInput(ref))

    const validators = getValidators(
      customValidators.current,
      builtInValidators,
      rules
    )

    const dataFields: DataField = {
      valid: true,
      ...(rules && { fieldRules: rules }),
      ...(validators && { validators })
    }
    console.log(elements)
    elements.current.set(ref.current, dataFields)
  }

  const detectTouch = (ref: RefObject<BasicRefs>) => () => {
    touchedElements.current.set(ref, null)
    ref.current &&
      ref.current.removeEventListener('focus', detectTouch(ref), true)
  }

  return { track: track, submitForm: submitForm, errors: errors.current }
}
