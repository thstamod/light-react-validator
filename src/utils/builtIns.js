export default {
  require: (input) => input.trim().length > 0,
  email: (input) => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input, len) => input.toString().length < len
}
