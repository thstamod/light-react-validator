import { isArray } from './isArray'
export const getValue = <T>(v: T, _type: string): boolean => {
  if (isArray(v)) {
    return !!((v as unknown) as React.MutableRefObject<
      HTMLInputElement
    >[]).reduce((prev, e) => {
      return e.current.checked || prev
    }, false)
  }
  if (
    ((v as unknown) as React.MutableRefObject<HTMLInputElement>).current.checked
  ) {
    return true
  }
  return false
}
