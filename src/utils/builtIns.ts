export default {
  require: (input: string): boolean => input.trim().length > 0,
  email: (input: string): boolean =>
    /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input: string, len: number): boolean => input.toString().length < len
}
