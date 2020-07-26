export type DataField = {
  valid: boolean
  fieldRules?: Rules
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
