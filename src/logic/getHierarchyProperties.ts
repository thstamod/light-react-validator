export const getHierarchyProperties = (
  inputOptions: any = null,
  globalOptions: any = null,
  key: string
) => inputOptions?.[key] || globalOptions?.[key] || undefined
