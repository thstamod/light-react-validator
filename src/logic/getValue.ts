import { isArray } from './isArray'
import { DataField } from '../types/fields'
import { isEmpty } from './isEmpty'

export const getValue = (v: DataField): [] | any | null => {
  if (v.type === 'checkbox' || v.type === 'radio') {
    if (!v.ref) {
      if (!isEmpty(v.group!) && isArray(v.group)) {
        return (v.group as React.MutableRefObject<HTMLInputElement>[])
          .filter((e) => e.current.checked)
          .map((e) => e.current.value)
      }
    } else {
      if (
        v.ref.current &&
        (v.ref as React.MutableRefObject<HTMLInputElement>).current.checked
      ) {
        return v.ref.current.value
      } else {
        return null
      }
    }
  }

  if (v.ref.current) {
    return v.ref.current.value
  }

  return null
}
