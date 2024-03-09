import { MultiSelectPrompt } from "@clack/core"
import c from "picocolors"
import { S, symbol } from "./symbols"
import type { MultiSelectOptions, Option } from "./types"
import { limitOptions } from "./utils"

export const MultiSelect = <Value>(opts: MultiSelectOptions<Value>) => {
  const optionFormatter = (
    option: Option<Value>,
    state: "inactive" | "active" | "selected" | "active-selected" | "submitted" | "cancelled"
  ) => {
    const label = option.label ?? String(option.value)

    switch (state) {
      case "active":
        return `${c.cyan(S.CHECKBOX_ACTIVE)} ${label} ${option.hint ? c.dim(`(${option.hint})`) : ""}`

      case "selected":
        return `${c.green(S.CHECKBOX_SELECTED)} ${c.dim(label)}`

      case "cancelled":
        return `${c.strikethrough(c.dim(label))}`

      case "active-selected":
        return `${c.green(S.CHECKBOX_SELECTED)} ${label} ${option.hint ? c.dim(`(${option.hint})`) : ""}`

      case "submitted":
        return `${c.dim(label)}`

      default:
        return `${c.dim(S.CHECKBOX_INACTIVE)} ${c.dim(label)}`
    }
  }

  return new MultiSelectPrompt({
    options: opts.children,
    initialValues: opts.initialValues,
    required: opts.required ?? false,
    cursorAt: opts.cursorAt,
    validate(selected: Value[]) {
      if (this.required && selected.length === 0)
        return `Please select at least one option.\n${c.reset(
          c.dim(
            `Press ${c.gray(c.bgWhite(c.inverse(" space ")))} to select, ${c.gray(
              c.bgWhite(c.inverse(" enter "))
            )} to submit`
          )
        )}`
    },
    render() {
      const title = `${c.gray(S.BAR)}\n${symbol(this.state)}  ${opts.message}\n`

      const styleOption = (option: Option<Value>, active: boolean) => {
        const selected = this.value.includes(option.value)

        if (active && selected) {
          return optionFormatter(option, "active-selected")
        }

        if (selected) {
          return optionFormatter(option, "selected")
        }

        return optionFormatter(option, active ? "active" : "inactive")
      }

      switch (this.state) {
        case "submit": {
          const selectedLabels =
            this.options
              .filter(({ value }) => this.value.includes(value))
              .map(option => optionFormatter(option, "submitted"))
              .join(c.dim(", ")) || c.dim("none")

          return `${title}${c.gray(S.BAR)}  ${selectedLabels}`
        }

        case "cancel": {
          const canceledLabels = this.options
            .filter(({ value }) => this.value.includes(value))
            .map(option => optionFormatter(option, "cancelled"))
            .join(c.dim(", "))

          return `${title}${c.gray(S.BAR)}  ${canceledLabels.trim() ? `${canceledLabels}\n${c.gray(S.BAR)}` : ""}`
        }

        case "error": {
          const footer = this.error
            .split("\n")
            .map((ln, i) => (i === 0 ? `${c.yellow(S.BAR_END)}  ${c.yellow(ln)}` : `   ${ln}`))
            .join("\n")

          return `${title + c.yellow(S.BAR)}  ${limitOptions({
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            style: styleOption,
          }).join(`\n${c.yellow(S.BAR)}  `)}\n${footer}\n`
        }

        default: {
          return `${title}${c.cyan(S.BAR)}  ${limitOptions({
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            style: styleOption,
          }).join(`\n${c.cyan(S.BAR)}  `)}\n${c.cyan(S.BAR_END)}\n`
        }
      }
    },
  }).prompt() as Promise<Value[] | symbol>
}
