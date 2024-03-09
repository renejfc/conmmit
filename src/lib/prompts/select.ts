import { PasswordPrompt, SelectPrompt } from "@clack/core"
import c from "picocolors"
import { S, symbol } from "./symbols"
import type { Option, SelectOptions } from "./types"
import { limitOptions } from "./utils"

export function SelectOption<Value>({ value, label, hint }: Option<Value>) {
  return { value, label, hint }
}

export function Select<Value>(opts: SelectOptions<Value>) {
  const opt = (option: Option<Value>, state: "inactive" | "active" | "selected" | "cancelled") => {
    const label = option.label ?? String(option.value)

    switch (state) {
      case "selected":
        return `${c.dim(label)}`

      case "active": {
        const hint = option.hint ? `(${option.hint})` : ""
        return `${c.green(S.RADIO_ACTIVE)} ${label} ${c.dim(hint)}`
      }

      case "cancelled":
        return `${c.strikethrough(c.dim(label))}`

      default:
        return `${c.dim(S.RADIO_INACTIVE)} ${c.dim(label)}`
    }
  }

  return new SelectPrompt({
    options: opts.children,
    initialValue: opts.initialValue,
    render() {
      const title = `${c.gray(S.BAR)}\n${symbol(this.state)}  ${opts.message}\n`

      switch (this.state) {
        case "submit": {
          const selectedOption = this.options[this.cursor]
          return `${title}${c.gray(S.BAR)}  ${opt(selectedOption, "selected")}`
        }

        case "cancel": {
          const canceledOption = this.options[this.cursor]
          return `${title}${c.gray(S.BAR)}  ${opt(canceledOption, "cancelled")}\n${c.gray(S.BAR)}`
        }

        default: {
          const renderedOptions = limitOptions({
            cursor: this.cursor,
            options: this.options,
            maxItems: opts.maxItems,
            style: (item, active) => opt(item, active ? "active" : "inactive"),
          }).join(`\n${c.cyan(S.BAR)}  `)

          return `${title}${c.cyan(S.BAR)}  ${renderedOptions}\n${c.cyan(S.BAR_END)}\n`
        }
      }
    },
  }).prompt() as Promise<Value | symbol>
}
