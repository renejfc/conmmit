import { cancel, isCancel, log, outro, spinner } from "@clack/prompts"
import c from "picocolors"
import type { CommandResult, Task } from "~/types"

export const cancelOnCancel = (value?: unknown) => {
  const cb = () => {
    cancel("Commit cancelled.")
    process.exit(0)
  }

  if (value) {
    if (isCancel(value)) cb()
    return
  }

  cb()
}

export const tasks = async (tasks: Task[]) => {
  for (const { progress, task, enabled } of tasks) {
    if (!enabled) continue

    const { start, message, stop } = spinner()
    const [title, success] = progress

    start(c.bold(title))
    const taskCb = await task({ message, stop })
    stop(c.bold(success || title))
    taskCb?.()
  }
}

export const handleNonZeroExit = (callback: () => void, { error, output }: Omit<CommandResult, "success">) => {
  callback()

  if (error) {
    log.error(c.italic(error.message))
    log.error(c.italic(error.raw))
    outro("Try again.")
    process.exit(1)
  }

  if (output) {
    log.info(c.italic(output))
    outro("Try again.")
    process.exit(0)
  }
}
