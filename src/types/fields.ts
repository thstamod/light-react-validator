export type DataField = {
  valid: boolean
  fieldRules?: Rules
  validators?: object
  type: string | undefined
  name: string | undefined
  checked?: boolean
  group?: BasicRefs[]
}

export type BasicRefs = HTMLInputElement & {
  name: string
  value: any
}

export type Rules = {
  rules: object
  messages: object
  customValidators?: object
}
