import { cancel, isCancel, log, outro, spinner } from "@clack/prompts"
import c from "picocolors"
import type { CommandResult, Task } from "~/types"

export function cancelOnCancel({
  value,
  message = "Cancelled",
  onBeforeExit,
  exitCode = 0,
}: {
  value?: unknown
  message?: string
  onBeforeExit?: () => void
  exitCode?: number
} = {}) {
  const handleCancel = () => {
    cancel(message)
    onBeforeExit?.()
    process.exit(exitCode)
  }

  if (!value || isCancel(value)) handleCancel()
}

export async function tasks(tasks: Task[]) {
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

export function handleNonZeroExit(
  callback: () => void,
  { error, output }: Omit<CommandResult, "success">
) {
  callback()
  // i.e when attempting to create a commit with no staged files it exits as an error but doesn't send the error via stderr but stdout...
  // check prompts, i'm assigning to raw: stderr.toString() || stdout.toString() as a workaround
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
