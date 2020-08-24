export const compose = (...fns: Function[]) => <T>(x?: T) => {
  console.log(fns)
  console.log(x)
  return fns.reduceRight((v, f) => f(v), x)
}
