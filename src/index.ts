import { useRef, useState, createRef, RefObject, useEffect } from 'react'
import builtInValidators from './builtIn/builtIns'
import { Config, UseValidator } from './types/configuration'
import { DataField, Rules, Basic } from './types/fields'
import { getValidators } from './logic/checkValidators'
import { hasNameAttribute } from './logic/hasNameAttribute'
import { isRadio } from './logic/isRadio'
import { isEmpty } from './logic/isEmpty'
import { isCheckbox } from './logic/isCheckbox'
import { getValue } from './logic/getValue'
import { isEmptyValue } from './logic/isEmptyValue'
import { getHierarchyProperties } from './logic/getHierarchyProperties'
import { throwWarning } from './logic/throwWarning'
import { hasKey } from './logic/hasKey'

export const useValidator = (config?: Config): UseValidator => {
  const elements = useRef<Map<string, DataField>>(new Map())
  const touchedElements = useRef(new Map())
  const dirtyElements = useRef(new Map())
  const errors = useRef({})
  const triedToSubmit = useRef(false)
  const formValidity = useRef(true)
  const shouldRerender = useRef(false)
  const [, rerender] = useState()

  const submitForm = (fn?: Function) => (e: Event) => {
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
    fn && fn()
  }

  useEffect(() => {
    elements.current.forEach((value: DataField) => {
      const val = getValue(value)
      if (isEmptyValue(val)) return
      fieldValidation(value)
    })
  }, [])

  const fieldValidation = (elem: DataField): void => {
    let _isValid = true
    const previousErrorState = { ...errors.current }
    const { fieldRules, validators, name } =
      elements.current.get(elem.name!) || {}
    const { rules, messages, options } = fieldRules || {}

    if (rules && name) {
      for (const key in validators) {
        const validator = validators[key]
        const availableOptions = getHierarchyProperties(
          options,
          config?.globalOptions,
          key
        )
        const value = getValue(elem)
        if (rules[key] && !validator(value, availableOptions)) {
          _isValid = false
          if (hasKey(errors.current?.[name], key)) continue
          shouldRerender.current = true
          // TODO: when message is missing rerenders multiple times
          const errorMsg = throwWarning(
            getHierarchyProperties(messages, config?.globalMessages, key)
          )(`no @ ${key} error message anywhere for ${name} input.`)
          // TODO: with below code is not working properly.
          // if (!errorMsg) return

          errors.current[name] = errors.current[name] || {}
          errors.current[name][key] = errorMsg
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

    if (isEmpty(errors.current) && !isEmpty(previousErrorState)) {
      shouldRerender.current = true
      formValidity.current = true
    }

    if (shouldRerender.current) {
      shouldRerender.current = false
      rerender({})
    }
  }

  const detectInput = (ref: RefObject<Basic>) => (e: Event) => {
    e.stopPropagation()
    const name = ref.current?.name
    if (!dirtyElements.current.has(ref.current)) {
      dirtyElements.current.set(ref.current, null)
    }
    if (!triedToSubmit.current && config?.validateFormOnSubmit) return
    const t = elements.current.get(name!)
    fieldValidation(t!)
  }

  const detectChange = (ref: RefObject<Basic>) => (e: Event) => {
    e.stopPropagation()
    if (!triedToSubmit.current && config?.validateFormOnSubmit) return
    const name = ref.current?.name
    const t = ref.current && elements.current.get(name!)
    fieldValidation(t!)
  }

  const track = (elem: Basic, rules?: Rules): void => {
    if (!elem) return

    const ref = createRef<Basic>()
    ;(ref as React.MutableRefObject<Basic>).current = elem
    const name = hasNameAttribute(ref.current!)
    if (!name) return
    const isRadioOrCheckbox = isRadio(ref.current!) || isCheckbox(ref.current!)
    const e = elements.current.get(name)
    // TODO: this needs refactoring yesterday
    if (
      !elements.current.has(name) ||
      !(e?.group && e.group.some((elem) => elem.current === ref.current))
    ) {
      if (
        isRadio(ref.current!) ||
        isCheckbox(ref.current!) ||
        ref.current?.type === 'range'
      ) {
        ref.current && ref.current.addEventListener('change', detectChange(ref))
      } else {
        ref.current && ref.current.addEventListener('focus', detectTouch(ref))
        ref.current && ref.current.addEventListener('input', detectInput(ref))
      }
    }

    const validators = getValidators(
      config?.customValidators,
      builtInValidators,
      rules
    )

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
      if (
        dataFields.group &&
        // TODO: refactor this
        !dataFields.group.some((elem) => elem.current === ref.current)
      ) {
        dataFields.group.push(ref)
        delete dataFields.ref
      }
    }
    elements.current.set(name, dataFields)
  }

  const detectTouch = (ref: RefObject<Basic>) => () => {
    touchedElements.current.set(ref.current?.name, null)
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
