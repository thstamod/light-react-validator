export default {
  required: <T>(value: T): boolean => {
    if (typeof value === 'string') {
      return (value as string).trim().length > 0
    }
    if (value) {
      return true
    }
    return false
  },
  email: (input: string): boolean =>
    /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input: string, len: number): boolean => input.toString().length < len
}
