import { Rules, Basic } from './fields'

export type Config = {
  customValidators?: any
  validateFormOnSubmit?: boolean
  errorOnInvalidDefault?: boolean
  globalOptions?: any
  globalMessages?: any
}

export type UseValidator = {
  track(ref: Basic | null, rules?: Rules): void
  submitForm(fn: Function): Function
  errors: any
  formValidity: boolean
}
