import { intro, log, outro } from "@clack/prompts"
import * as c from "picocolors"
import { argsConfigs } from "./config"
import { showHelpMessage } from "./help"
import { parseArgs } from "./parse"
import { validateArgs } from "./validate"

export const initArgs = () => {
  const args = parseArgs(argsConfigs)
  console.log(args)
  const validationError = validateArgs(args)

  if (validationError) {
    intro(`${c.bold(c.bgCyan("CONMMIT"))}`)
    log.warn(c.dim(validationError))
    outro(`Try running ${c.bold("conmmit --help")} for more information.`)
    process.exit(1)
  }

  if (!args.help) return args
  showHelpMessage(argsConfigs)
  process.exit(0)
}
