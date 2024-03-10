import c from "picocolors"
import { S } from "./symbols"

export function Outro({ message = "" }: { message?: string }) {
  process.stdout.write(`${c.gray(S.BAR)}\n${c.gray(S.BAR_END)}  ${message}\n\n`)
}
