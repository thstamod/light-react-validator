export type DataField = {
  valid: boolean
  fieldRules?: Rules
  validators?: object
  type: string | undefined
  name: string | undefined
  checked?: boolean
  group?: React.RefObject<HTMLInputElement>[]
  ref: React.RefObject<HTMLInputElement>
}

export type BasicRef = {
  name: string
}

export type Rules = {
  rules: object
  messages: object
  customValidators?: object
  options?: { [key: string]: any }
}
