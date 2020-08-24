export const throwWarning = <T>(value: T) => (warning: string): T => {
  if (!value) console.warn(warning)
  return value
}
