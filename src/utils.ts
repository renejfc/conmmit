import { cancel, isCancel, log, outro, spinner } from "@clack/prompts"
import c from "picocolors"
import type { Task } from "~/types"

export const getCommitMessage = ({ type, subject, scope }: { type: string; subject: string; scope?: string }) => {
  const scopeStr = scope ? `(${scope})` : ""
  return `${type}${scopeStr}: ${subject}`
}

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

export const handleNonZeroExit = (
  callback: () => void,
  { exitCode, error, output }: { exitCode: number; error: string; output: string }
) => {
  if (exitCode === 0) return

  callback()
  if (error) log.error(c.italic(error))
  else log.info(c.italic(output))

  outro("Try again.")
  process.exit(exitCode)
}
