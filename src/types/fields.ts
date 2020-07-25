export type DataField = {
  valid: boolean
  fieldRules?: Rules
}

export interface BasicRefs extends HTMLElement {
  name: string
  value: any
}

export type Rules = {
  rules: object
  messages: object
  customValidation: object
}
