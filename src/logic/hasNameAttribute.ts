export const hasNameAttribute = (ref: HTMLInputElement) => {
  const name = ref.name
  if (name) {
    return name
  } else {
    console.warn(`the field ${ref.outerHTML} must have a unique name attribute`)
    return undefined
  }
}
