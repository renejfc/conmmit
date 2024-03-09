import { childrenToArr } from "./common"
import type { JSXSignature } from "./types"

export function jsx(component: JSXSignature["component"], props: JSXSignature["props"]): any {
  props.children = childrenToArr(props.children)
  return component(props)
}
