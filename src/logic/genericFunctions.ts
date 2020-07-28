export const isEmpty = (o: object): boolean => {
  if (Array.isArray(o)) {
    return !o.length
  }
  return Object.keys(o).length === 0 && o.constructor === Object
}
