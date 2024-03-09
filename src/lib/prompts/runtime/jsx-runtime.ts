import type { JSXSignature } from "./types"

export function jsx(component: JSXSignature["component"], props: JSXSignature["props"]): any {
  return component(props)
}
