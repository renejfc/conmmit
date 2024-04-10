import { groupMultiselect, log } from "@clack/prompts"
import { $, type ShellOutput } from "bun"
import c from "picocolors"
import { cancelOnCancel } from "~/utils"

export const addPrompt = async () => {
  const options = await getOptions()

  if (options.size === 0) {
    log.warn(c.italic("No changes to add."))
    return
  }

  const results = await groupMultiselect({
    message: "Which changes would you like to add?",
    required: true,
    options: Object.fromEntries(options.entries()),
  })

  cancelOnCancel(results)

  return results as string[]
}

const getOptions = async () => {
  const [changedFilesSh, untrackedFilesSh, deletedFilesSh] = await Promise.all([
    $`git ls-files --modified --exclude-standard`.quiet(),
    $`git ls-files --others --exclude-standard`.quiet(),
    $`git ls-files --deleted --exclude-standard`.quiet(),
  ])

  const filesStrToOptions = (input: ShellOutput) =>
    input.stdout
      .toString()
      .split("\n")
      .map(fileStr => ({
        label: c.italic(fileStr),
        value: fileStr,
      }))
      .filter(str => str.value !== "")

  const changed = filesStrToOptions(changedFilesSh)
  const untracked = filesStrToOptions(untrackedFilesSh)
  const deleted = filesStrToOptions(deletedFilesSh)

  const output = new Map<string, { label: string; value: string }[]>()

  if (changed.length) output.set(c.bold("Changed Files"), changed)
  if (untracked.length) output.set(c.bold("Untracked Files"), untracked)
  if (deleted.length) output.set(c.bold("Deleted Files"), deleted)

  return output
}
