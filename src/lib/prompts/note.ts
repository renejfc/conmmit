import c from "picocolors"
import { S } from "./symbols"

const strip = (str: string) => str.replace(ansiRegex(), "")

export function Note({ message = "", title ="" }: { message?: string; title?: string }) {
  const lines = `\n${message}\n`.split("\n")
  const titleLen = strip(title).length

  const len =
    Math.max(
      lines.reduce((sum, ln) => {
        const line = strip(ln)
        return line.length > sum ? line.length : sum
      }, 0),
      titleLen
    ) + 2

  const msg = lines
    .map(ln => `${c.gray(S.BAR)}  ${c.dim(ln)}${" ".repeat(len - strip(ln).length)}${c.gray(S.BAR)}`)
    .join("\n")

  process.stdout.write(
    `${c.gray(S.BAR)}\n${c.green(S.STEP_SUBMIT)}  ${c.reset(title)} ${c.gray(
      S.BAR_H.repeat(Math.max(len - titleLen - 1, 1)) + S.CORNER_TOP_RIGHT
    )}\n${msg}\n${c.gray(S.CONNECT_LEFT + S.BAR_H.repeat(len + 2) + S.CORNER_BOTTOM_RIGHT)}\n`
  )
}

// Adapted from https://github.com/chalk/ansi-regex
// @see LICENSE
function ansiRegex() {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|")

  return new RegExp(pattern, "g")
}
