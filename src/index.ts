import { useRef, useState, useEffect, createRef, RefObject } from 'react'
import builtInValidators from './utils/builtIns'
import { Config, UseValidator } from './types/configuration'
import { DataField, BasicRefs, Rules } from './types/fields'

export const useValidator = (config?: Config): UseValidator => {
  const elements = useRef(new Map())
  const touchedElements = useRef(new Map())
  const dirtyElements = useRef(new Map())
  const errors = useRef({})
  const customValidators = useRef(null)
  const [validity, setValidity] = useState(true)

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

  // const beforeSubmit = () => {
  //   // TODO: run all inputs before submit
  // }

  const fieldValidation = (ref: RefObject<BasicRefs>) => {
    let _isValid = true
    const { fieldRules } = elements.current.get(ref.current)
    // eslint-disable-next-line no-debugger
    // debugger
    const validators = getValidators(
      fieldRules,
      customValidators.current,
      builtInValidators
    )
    console.log(validators)
    const { rules, messages } = fieldRules
    for (const key in validators) {
      const validator = validators[key]
      const name = ref.current!.name
      if (rules[key] && !validator(ref?.current?.value)) {
        errors.current[name] = {
          [key]: messages?.[key],
          ...errors.current[name]
        }
        _isValid = false
      } else {
        console.log(errors.current[name])
        delete errors.current?.[name]?.[key]
        _isValid = true
      }
    }
    return _isValid
  }

  const keyup = (ref: RefObject<BasicRefs>) => (e: Event) => {
    console.log(e)
    if (!dirtyElements.current.has(ref)) {
      dirtyElements.current.set(ref, null)
      return
    }
    const v = fieldValidation(ref)
    if (validity !== v) {
      setValidity((v) => !v)
    }
  }

  const getValidators = (
    data: Rules,
    configValidators: Config | null,
    builtInValidators: object
  ) => {
    if (!data) return
    const f = {}
    for (const key in data?.rules) {
      console.log(key)
      const t = checkForValidators(
        data,
        configValidators,
        builtInValidators,
        key
      )
      if (t) {
        f[key] = t
      }
    }
    return f
  }

  const checkForValidators = (
    data: Rules,
    configValidators: Config | null,
    builtInValidators: any,
    name: string
  ) => {
    if (data.customValidators?.[name]) {
      return data.customValidators[name]
    }
    if (configValidators?.[name]) {
      return configValidators[name]
    }
    if (builtInValidators[name]) {
      return builtInValidators[name]
    } else {
      throw new Error(`no validation function with mane ${name}`)
    }
  }

  const track = (elem?: BasicRefs, rules?: Rules): void => {
    if (!elem) return
    const ref = createRef<BasicRefs>()
    ;(ref as React.MutableRefObject<BasicRefs>).current = elem
    ref.current && ref.current.addEventListener('focus', partialOnFocus(ref))
    ref.current && ref.current.addEventListener('input', keyup(ref))
    if (elements.current.has(ref)) return

    const dataFields: DataField = {
      valid: true,
      ...(rules && { fieldRules: rules })
    }

    elements.current.set(elem, dataFields)
  }

  const partialOnFocus = (ref: RefObject<BasicRefs>) => () => {
    console.log('partial focus')
    touchedElements.current.set(ref, null)
    ref.current &&
      ref.current.removeEventListener('focus', partialOnFocus(ref), true)
  }

  return { track: track, submitForm: submitForm, errors: errors.current }
}
