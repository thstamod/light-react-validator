import { isEmpty } from '../logic/isEmpty'
import { isArray } from '../logic/isArray'

export default {
  required: <T>(value: T): boolean => {
    if (typeof value === 'string') {
      return (value as string).trim().length > 0
    }
    if (
      value &&
      typeof value === 'object' &&
      !isEmpty((value as unknown) as object)
    ) {
      return true
    }
    return false
  },
  email: (input: string): boolean =>
    /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLength: (input: string, len: number): boolean =>
    input.toString().length < len,
  maxLength: (input: string, len: number): boolean =>
    input.toString().length > len,
  minCheckboxes: (input: any, availableOptions: any = null) => {
    if (
      typeof input === 'object' &&
      isArray(input) &&
      availableOptions &&
      typeof availableOptions === 'number'
    ) {
      return (input as []).length >= availableOptions
    }
    return false
  }
}
