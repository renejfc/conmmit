import { PasswordPrompt } from "@clack/core"
import c from "picocolors"
import { S, symbol } from "./symbols"
import type { PasswordOptions } from "./types"

export function Password(opts: PasswordOptions) {
  return new PasswordPrompt({
    validate: opts.validate,
    mask: opts.mask ?? S.PASSWORD_MASK,
    render() {
      const title = `${c.gray(S.BAR)}\n${symbol(this.state)}  ${opts.message}\n`
      const value = this.valueWithCursor
      const masked = this.masked

      switch (this.state) {
        case "error":
          return (
            `${title.trim()}\n${c.yellow(S.BAR)}  ${masked}\n` + `${c.yellow(S.BAR_END)}  ${c.yellow(this.error)}\n`
          )

        case "submit":
          return `${title}${c.gray(S.BAR)}  ${c.dim(masked)}`

        case "cancel": {
          const canceledMasked = c.strikethrough(c.dim(masked ?? ""))
          const maskedValue = masked ? `\n${c.gray(S.BAR)}` : ""
          return `${title}${c.gray(S.BAR)}  ${canceledMasked}${maskedValue}`
        }

        default:
          return `${title}${c.cyan(S.BAR)}  ${value}\n${c.cyan(S.BAR_END)}\n`
      }
    },
  }).prompt()
}
