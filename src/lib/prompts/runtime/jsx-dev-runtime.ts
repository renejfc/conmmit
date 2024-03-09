import type { JSXSignature } from "./types"

export function jsxDEV(component: JSXSignature["component"], props: JSXSignature["props"]): any {
  console.log("\n", "Parsing JSX props:", props, "\n")
  return component(props)
}
