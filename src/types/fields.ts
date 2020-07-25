export type DataField = {
  valid: boolean
  fieldRules?: Rules
}

export interface BasicRefs extends HTMLInputElement {
  name: string
  value: any
}

export type Rules = {
  rules: object
  messages: object
  customValidators?: object
}
