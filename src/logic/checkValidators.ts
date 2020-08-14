import { Config } from '../types/configuration'
import { Rules } from '../types/fields'

const checkForValidators = (
  configValidators: Config | null,
  builtInValidators: any,
  name: string,
  rules?: Rules
) => {
  if (rules?.customValidators?.[name]) {
    return rules.customValidators[name]
  }
  if (configValidators?.[name]) {
    return configValidators[name]
  }
  if (builtInValidators[name]) {
    return builtInValidators[name]
  } else {
    console.warn(`no validation function with mane ${name}`)
  }
}

export const getValidators = (
  configValidators: Config | null,
  builtInValidators: object,
  rules?: Rules
) => {
  if (!rules) return
  const f = {}
  for (const key in rules?.rules) {
    const t = checkForValidators(
      configValidators,
      builtInValidators,
      key,
      rules
    )
    if (t) {
      f[key] = t
    }
  }
  return f
}
