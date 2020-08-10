import { Rules } from './fields'

export type Config = {
  customValidators?: any
  validateFormOnSubmit?: boolean
}

export type UseValidator = {
  track(ref: HTMLInputElement | null, rules?: Rules): void
  submitForm(fn: Function): Function
  errors: any
  formValidity: boolean
}
