import { groupMultiselect, log } from "@clack/prompts"
import c from "picocolors"
import { status } from "~/lib/git"
import { cancelOnCancel } from "~/utils"

export async function addPrompt() {
  const options = await status()

  if (options.size === 0) return log.warn(c.italic("No changes to add."))

  const results = await groupMultiselect({
    message: "Which changes would you like to add?",
    required: true,
    options: Object.fromEntries(options.entries()),
  })

  cancelOnCancel(results)

  return results as string[]
}
