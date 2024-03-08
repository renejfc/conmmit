import type { Component } from "./types"

export function jsx(component: Component, props: { children: Array<any>, [x: string]: any }): any {
  return component(props)
}
