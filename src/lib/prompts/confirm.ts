import { ConfirmPrompt } from "@clack/core"
import c from "picocolors"
import { S, symbol } from "./symbols"
import type { ConfirmOptions } from "./types"

export function Confirm(opts: ConfirmOptions): Promise<boolean | symbol> {
  const active = opts.active ?? "Yes"
  const inactive = opts.inactive ?? "No"

  return new ConfirmPrompt({
    active,
    inactive,
    initialValue: opts.initialValue ?? true,
    render() {
      const title = `${c.gray(S.BAR)}\n${symbol(this.state)}  ${opts.message}\n`
      const value = this.value ? active : inactive

      switch (this.state) {
        case "submit":
          return `${title}${c.gray(S.BAR)}  ${c.dim(value)}`

        case "cancel": {
          const canceledValue = c.strikethrough(c.dim(value))
          return `${title}${c.gray(S.BAR)}  ${canceledValue}\n${c.gray(S.BAR)}`
        }

        default: {
          const activeRadio = c.green(S.RADIO_ACTIVE)
          const inactiveRadio = c.dim(S.RADIO_INACTIVE)

          const activeText = this.value ? `${activeRadio} ${active}` : `${inactiveRadio} ${c.dim(active)}`
          const inactiveText = !this.value ? `${activeRadio} ${inactive}` : `${inactiveRadio} ${c.dim(inactive)}`

          return `${title}${c.cyan(S.BAR)}  ${activeText} ${c.dim("/")} ${inactiveText}\n` + `${c.cyan(S.BAR_END)}\n`
        }
      }
    },
  }).prompt() as Promise<boolean | symbol>
}
