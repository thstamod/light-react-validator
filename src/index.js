import { useRef, useState, useEffect } from 'react'
// import builtInValidators from './utils/builtIns'

export const useValidator = () => {
  const [state, setstate] = useState(null)
  const ref = useRef(null)
  const track = (elem, rules) => {
    ref.current = elem
    setstate(ref)
  }

  useEffect(() => {
    ref.current.onkeydown = (e) => console.log(e.target.value)
  }, [state])

  return [track]
}
