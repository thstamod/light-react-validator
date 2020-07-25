import { BasicRefs, Rules } from './fields'
export type Config = {
  customValidators?: any
}

export interface IuseValidator {
  track(ref?: BasicRefs | null, rules?: Rules): void
  submitForm(fn: Function): Function
  errors: any
}
