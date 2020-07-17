export default {
  email: (input) => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(input),
  minLen: (input, len) => input.toString().length < len
}
