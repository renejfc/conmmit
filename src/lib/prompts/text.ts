import { TextPrompt } from "@clack/core"
import c from "picocolors"
import { S, symbol } from "./symbols"
import type { TextOptions } from "./types"

export function Text(opts: TextOptions) {
  return new TextPrompt({
    validate: opts.validate,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    initialValue: opts.initialValue,
    render() {
      const title = `${c.gray(S.BAR)}\n${symbol(this.state)} ${opts.message}\n`

      const placeholder = opts.placeholder
        ? c.inverse(opts.placeholder[0]) + c.dim(opts.placeholder.slice(1))
        : c.inverse(c.hidden("_"))
      
      const value = !this.value ? placeholder : this.valueWithCursor
      
      switch (this.state) {
        case "error":
          return (
            `${title.trim()}\n${c.yellow(S.BAR)}  ${value}\n` +
            `${c.yellow(S.BAR_END)}  ${c.yellow(this.error)}\n`
          )
      
        case "submit":
          return `${title}${c.gray(S.BAR)}  ${c.dim(this.value || opts.placeholder)}`
      
        case "cancel": {
          const canceledValue = c.strikethrough(c.dim(this.value ?? ""))
          const hasTrimmedValue = this.value?.trim()
          return (
            `${title}${c.gray(S.BAR)}  ${canceledValue}` +
            `${hasTrimmedValue ? `\n${c.gray(S.BAR)}` : ""}`
          )
        }
      
        default:
          return `${title}${c.cyan(S.BAR)}  ${value}\n${c.cyan(S.BAR_END)}\n`
      }      
    },
  }).prompt()
}
