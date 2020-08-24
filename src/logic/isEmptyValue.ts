import { isEmpty } from './isEmpty'

export const isEmptyValue = <T>(v: T): boolean => {
  if (typeof v === 'object' && v !== null) {
    return isEmpty((v as unknown) as object)
  }
  if (typeof v === 'number') {
    return !(v || v === 0)
  }
  if (typeof v === 'string') {
    return !v.trim()
  }
  if (v) {
    return false
  }
  return true
}
