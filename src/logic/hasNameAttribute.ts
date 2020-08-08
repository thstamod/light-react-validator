// import { RefObject } from 'react'
import { BasicRefs } from '../types/fields'

export const hasNameAttribute = (ref: BasicRefs) => {
  const name = ref.name
  if (name) {
    return name
  } else {
    console.warn(`the field ${ref.outerHTML} must have a unique name attribute`)
    return undefined
  }
}
