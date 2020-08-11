import { Config } from '../types/configuration'
import { Rules } from '../types/fields'

const checkForValidators = (
  configValidators: Config | null,
  builtInValidators: any,
  name: string,
  data?: Rules
) => {
  if (data?.customValidators?.[name]) {
    return data.customValidators[name]
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
  data?: Rules
) => {
  if (!data) return
  const f = {}
  for (const key in data?.rules) {
    const t = checkForValidators(configValidators, builtInValidators, key, data)
    if (t) {
      f[key] = t
    }
  }
  return f
}
