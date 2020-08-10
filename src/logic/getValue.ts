import { isArray } from './isArray'
export const getValue = <T>(v: T, _type: string) => {
  if (isArray(v)) {
    ;((v as unknown) as React.MutableRefObject<HTMLInputElement>[]).reduce(
      (prev, e) => {
        return e.current.checked || prev
      },
      false
    )
  }
}
