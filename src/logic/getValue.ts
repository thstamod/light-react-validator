import { isArray } from './isArray'
export const getValue = <T>(v: T, _type: string): [] | any | null => {
  if (isArray(v)) {
    return ((v as unknown) as React.MutableRefObject<HTMLInputElement>[])
      .filter((e) => e.current.checked)
      .map((e) => e.current.value)
  }
  if (
    ((v as unknown) as React.MutableRefObject<HTMLInputElement>).current.checked
  ) {
    return ((v as unknown) as React.MutableRefObject<HTMLInputElement>).current
      .value
  }
  return null
}
