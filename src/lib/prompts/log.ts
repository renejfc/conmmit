import c from "picocolors"
import { S } from "./symbols"
import type { LogMessageOptions } from "./types"

function Message({ message, symbol }: LogMessageOptions = {}) {
  const parts = [`${c.gray(S.BAR)}`]

  if (message) {
    const [firstLine, ...lines] = message.split("\n")
    parts.push(`${symbol}  ${firstLine}`, ...lines.map(ln => `${c.gray(S.BAR)}  ${ln}`))
  }

  process.stdout.write(`${parts.join("\n")}\n`)
}

function Info({ message }: { message: string }) {
  Message({ message, symbol: c.blue(S.INFO) })
}

function Success({ message }: { message: string }) {
  Message({ message, symbol: c.green(S.SUCCESS) })
}

function Step({ message }: { message: string }) {
  Message({ message, symbol: c.green(S.STEP_SUBMIT) })
}

function Warning({ message }: { message: string }) {
  Message({ message, symbol: c.yellow(S.WARN) })
}

function error({ message }: { message: string }) {
  Message({ message, symbol: c.red(S.ERROR) })
}

export const Log = {
  Message,
  Info,
  Success,
  Step,
  Warning,
  Error: error,
}