import { intro, log, note } from "@clack/prompts"
import c from "picocolors"
import type { ArgConfig } from "./parse"

export const showHelpMessage = (args: ArgConfig[]) => {
  intro(`${c.bold(c.bgCyan("CONMMIT"))} - ${c.bold("Con")}ventional Co${c.bold("mmit")}s CLI`)
  log.info(`${c.bold("Usage:")}`)
  log.message("  conmmit [options]")
  note(
    args
      .map(({ short, long, description }) => `  -${short}, --${long.padEnd(10)} ${description}`)
      .join("\n"),
    `${c.bold("Options")}`
  )
}
