import type { Component } from "./types"

export function jsxDEV(component: Component, props: { children: Array<any>, [x: string]: any }): any {
  console.log("Parsing JSX props:", props, "\n")
  return component(props)
}
