import c from "picocolors"
import { S } from "./symbols"

export function Cancel({ message = "" }: { message?: string }) {
  process.stdout.write(`${c.gray(S.BAR_END)}  ${c.red(message)}\n\n`)
}
