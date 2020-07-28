import { RefObject } from 'react'
import { BasicRefs } from '../types/fields'

export const hasNameAttribute = (ref: RefObject<BasicRefs>) => {
  const name = ref.current!.name
  if (name) {
    return name
  } else {
    throw new Error(
      `the field ${ref.current?.outerHTML} must have a unique name attribute`
    )
  }
}
