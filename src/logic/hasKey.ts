export const hasKey = (obj: object, key: string): boolean => {
  return obj && key in obj
}
