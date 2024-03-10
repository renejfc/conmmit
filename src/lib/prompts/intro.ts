import c from "picocolors"
import { S } from "./symbols"

export function Intro({ title = "" }: { title?: string }) {
  process.stdout.write(`${c.gray(S.BAR_START)}  ${title}\n`)
}
