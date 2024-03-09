import type { JSXSignature } from "./types"

export function jsxDEV(component: JSXSignature["component"], props: JSXSignature["props"]): any {
  console.log("Parsing JSX props:", props, "\n")
  return component(props)
}
