import { childrenToArr } from "./common"
import type { JSXSignature } from "./types"

export function jsxDEV(component: JSXSignature["component"], props: JSXSignature["props"]): any {
  props.children = childrenToArr(props.children)
  return component(props)
}
