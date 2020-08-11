import { useRef, useState, useEffect, createRef, RefObject } from 'react'
import builtInValidators from './utils/builtIns'
import { Config, UseValidator } from './types/configuration'
import { DataField, Rules } from './types/fields'
import { getValidators } from './logic/checkValidators'
import { hasNameAttribute } from './logic/hasNameAttribute'
import { isRadio } from './logic/isRadio'
import { isEmpty } from './logic/isEmpty'
import { isCheckbox } from './logic/isCheckbox'
import { getValue } from './logic/getValue'

export const useValidator = (config?: Config): UseValidator => {
  const elements = useRef<Map<string, DataField>>(new Map())
  const touchedElements = useRef(new Map())
  const dirtyElements = useRef(new Map())
  const errors = useRef({})
  const customValidators = useRef(null)
  const customConfiguration = useRef<any>({})
  const triedToSubmit = useRef(false)
  const formValidity = useRef(true)
  const shouldRerender = useRef(false)
  const [, rerender] = useState()

  const submitForm = (fn: Function) => (e: Event) => {
    e.preventDefault()
    const prevFormValidity = formValidity.current
    if (elements.current.size !== dirtyElements.current.size) {
      dirtyElements.current = new Map(elements.current)
    }
    elements.current.forEach((value: DataField) => {
      fieldValidation(value)
    })
    triedToSubmit.current = true

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
    if (config?.validateFormOnSubmit) {
      customConfiguration.current.validateFormOnSubmit = true
    }
  }, [])

  useEffect(() => {
    // console.log(elements)
  })

  const fieldValidation = (elem: DataField): void => {
    // eslint-disable-next-line no-debugger
    // debugger
    let _isValid = true
    const { fieldRules, validators, name, type } =
      elements.current.get(elem.name!) || {}
    const { rules, messages } = fieldRules || {}
    if (rules && name) {
      for (const key in validators) {
        const validator = validators[key]
        // TODO: refactor. it's not working correctly
        const value =
          type === 'text'
            ? elem.ref.current?.value
            : getValue(!isEmpty(elem.group!) ? elem.group : elem.ref, type!)
        if (rules[key] && !validator(value)) {
          _isValid = false
          if (errors.current?.[name]?.[key]) continue
          shouldRerender.current = true
          if (name in errors.current) {
            errors.current[name][key] = messages?.[key]
          } else {
            errors.current[name] = {
              [key]: messages?.[key],
              ...errors.current[name]
            }
          }
          elements.current.set(name, {
            ...(elements.current.get(name) as DataField),
            valid: false
          })
        } else {
          if (!errors.current?.[name]?.[key]) continue
          shouldRerender.current = true
          delete errors.current?.[name]?.[key]
          if (!isEmpty(errors?.current) && isEmpty(errors?.current?.[name])) {
            isEmpty(errors.current?.[name]) && delete errors.current?.[name]
            errors.current = { ...errors.current }
            elements.current.set(name, {
              ...(elements.current.get(name) as DataField),
              valid: true
            })
          }
        }
      }
    }
    if (!_isValid) {
      formValidity.current = false
    }

    if (isEmpty(errors.current)) {
      shouldRerender.current = true
      formValidity.current = true
    }

    if (shouldRerender.current) {
      shouldRerender.current = false
      rerender({})
    }
  }

  const detectInput = (ref: RefObject<HTMLInputElement>) => (e: Event) => {
    e.stopPropagation()
    const name = ref.current?.name
    if (!dirtyElements.current.has(ref.current)) {
      dirtyElements.current.set(ref.current, null)
    }
    if (
      !triedToSubmit.current &&
      customConfiguration.current.validateFormOnSubmit
    )
      return
    const t = elements.current.get(name!)
    fieldValidation(t!)
  }

  const detectChange = (ref: RefObject<HTMLInputElement>) => (e: Event) => {
    e.stopPropagation()
    const name = ref.current?.name
    const t = ref.current && elements.current.get(name!)
    fieldValidation(t!)
  }

  const track = (elem: HTMLInputElement, rules?: Rules): void => {
    if (!elem) return
    const ref = createRef<HTMLInputElement>()
    ;(ref as React.MutableRefObject<HTMLInputElement>).current = elem
    const name = hasNameAttribute(ref.current!)
    const isRadioOrCheckbox = isRadio(ref.current!) || isCheckbox(ref.current!)
    if (!elements.current.has(name!)) {
      if (isRadio(ref.current!) || isCheckbox(ref.current!)) {
        ref.current && ref.current.addEventListener('change', detectChange(ref))
      } else {
        ref.current && ref.current.addEventListener('focus', detectTouch(ref))
        ref.current && ref.current.addEventListener('input', detectInput(ref))
      }
    }
    const validators = getValidators(
      customValidators.current,
      builtInValidators,
      rules
    )

    if (!name) return
    const dataFields: DataField = elements.current.get(name) || {
      valid: true,
      ...(rules && { fieldRules: rules }),
      ...(validators && { validators }),
      type: ref.current?.type,
      name: name,
      ...(isRadioOrCheckbox && { checked: false }),
      ...(isRadioOrCheckbox && { group: [] }),
      ref
    }
    if (elements.current.has(name)) {
      if (dataFields.ref && dataFields.group) {
        dataFields.group.push(dataFields.ref)
      }
      if (dataFields.group) {
        dataFields.group.push(ref)
        delete dataFields.ref
      }
    }
    elements.current.set(name, dataFields)
    // console.log(elements)
  }

  const detectTouch = (ref: RefObject<HTMLInputElement>) => () => {
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
