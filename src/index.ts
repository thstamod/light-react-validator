import { useRef, useState, useEffect, createRef, RefObject } from 'react'
import builtInValidators from './utils/builtIns'
import { Config } from './types/configuration'
import { DataField, BasicRefs } from './types/fields'

export const useValidator = (config: Config) => {
  console.log('rerender useValidator')
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
    const validators = getValidators(
      fieldRules,
      customValidators.current,
      builtInValidators
    )
    const { rules, msgs } = fieldRules
    for (const key in validators) {
      const validator = validators[key]
      const name = ref.current?.name
      if (rules[key] && !validator(ref?.current.value)) {
        // errors.current[name] = [
        //   msgs?.[key],
        //   ...(errors.current[name] ? [errors.current[name]] : [])
        // ]
        errors.current[name] = { [key]: msgs?.[key], ...errors.current[name] }
        _isValid = false
      } else {
        console.log(errors.current[name])
        delete errors.current?.[name]?.[key]
        _isValid = true
      }
    }
    return _isValid
  }

  const keyup = (ref) => (e) => {
    console.log(e)
    if (!dirtyElements.current.has(ref)) {
      dirtyElements.current.set(ref, null)
      return
    }
    console.log(e)
    const v = fieldValidation(ref)
    if (validity !== v) {
      setValidity((v) => !v)
    }
  }

  const getValidators = (
    data: DataField,
    configValidators: Config | null,
    builtInValidators
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
      console.log(t)
      if (t) {
        f[key] = t
      }
    }
    return f
  }

  const checkForValidators = (
    data,
    configValidators,
    builtInValidators,
    name
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

  const track = (elem: RefObject<HTMLElement>, rules) => {
    if (!elem) return
    const ref = createRef()
    ref.current = elem
    ref.current.addEventListener('focus', partialOnFocus(ref))
    ref.current.addEventListener('input', keyup(ref))
    if (elements.current.has(ref)) return

    const dataFields: DataField = {
      valid: true,
      ...(rules && { fieldRules: rules })
    }

    elements.current.set(elem, dataFields)
  }

  // const partialOnChange = (ref) => (e) => {
  //    dirtyElements.current.set(ref)
  //   ref.current.onchange = ''
  // }

  const partialOnFocus = (ref) => () => {
    console.log('partial focus')
    touchedElements.current.set(ref, null)
    ref.current.onfocus = ''
  }

  return [track, submitForm, errors.current]
}
