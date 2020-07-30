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
  const formValidity = useRef(true)
  const [, rerender] = useState()

  const submitForm = (fn: Function) => (e: Event) => {
    e.preventDefault()
    const prevFormValidity = formValidity.current
    if (elements.current.size !== dirtyElements.current.size) {
      dirtyElements.current.clear()
      dirtyElements.current = elements.current
    }
    elements.current.forEach((_value: object, key: BasicRefs) => {
      fieldValidation(key)
    })
    if (formValidity.current !== prevFormValidity) {
      rerender({})
      return
    }
    fn()
  }

  useEffect(() => {
    if (config?.customValidators) {
      customValidators.current = config.customValidators
    }
  }, [])

  const fieldValidation = (ref: BasicRefs): void => {
    const prev = elements.current.get(ref)
    const { fieldRules, validators } = elements.current.get(ref)
    const { rules, messages } = fieldRules
    for (const key in validators) {
      const validator = validators[key]
      const name = hasNameAttribute(ref)
      if (rules[key] && !validator(ref?.value)) {
        errors.current[name] = {
          [key]: messages?.[key],
          ...errors.current[name]
        }
        elements.current.set(ref, { ...prev, valid: false })
      } else {
        delete errors.current?.[name]?.[key]
        if (!isEmpty(errors?.current) && isEmpty(errors?.current?.[name])) {
          isEmpty(errors.current?.[name]) && delete errors.current?.[name]
          errors.current = { ...errors.current }
          elements.current.set(ref, { ...prev, valid: true })
        }
      }
    }
    if (!elements.current.get(ref).valid && formValidity) {
      formValidity.current = false
    }
    if (prev !== elements.current.get(ref)) {
      rerender({})
    }
  }

  const detectInput = (ref: RefObject<BasicRefs>) => (e: Event) => {
    e.stopPropagation()
    if (!dirtyElements.current.has(ref.current)) {
      dirtyElements.current.set(ref.current, null)
      return
    }
    fieldValidation(ref.current!)
    if (!formValidity.current) {
      formValidity.current = true
      rerender({})
    }
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
    elements.current.set(ref.current, dataFields)
  }

  const detectTouch = (ref: RefObject<BasicRefs>) => () => {
    touchedElements.current.set(ref, null)
    ref.current &&
      ref.current.removeEventListener('focus', detectTouch(ref), true)
  }

  return {
    track: track,
    submitForm: submitForm,
    errors: errors.current,
    formValidity: formValidity.current
  }
}
