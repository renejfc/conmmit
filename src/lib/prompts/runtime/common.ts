export function childrenToArr(children: any): any[] {
  if (children === null) return []
  if (Array.isArray(children)) return children
  return [children]
}
