import { BasicRefs, DataField } from '../types/fields'

export const findElementsWithSameName = (
  elements: React.MutableRefObject<Map<BasicRefs, DataField>>,
  name: string
): BasicRefs[] | null => {
  const sn: BasicRefs[] = []
  elements.current.forEach((value, key) => {
    value.name === name && sn.push(key)
  })
  return sn.length ? sn : null
}
