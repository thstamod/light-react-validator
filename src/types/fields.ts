export type DataField = {
  valid: boolean
  fieldRules?: Rules
  validators?: object
  type: string | undefined
  name: string | undefined
  checked?: boolean
  group?: React.RefObject<Basic>[]
  ref: React.RefObject<Basic>
}

export type Basic = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type Rules = {
  rules: object
  messages?: object
  customValidators?: object
  options?: { [key: string]: any }
}
