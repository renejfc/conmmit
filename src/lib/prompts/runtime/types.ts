export type JSXSignature = {
  component: (props: unknown) => any
  props: {
    children: Array<any>
    [x: string]: any
  }
}
