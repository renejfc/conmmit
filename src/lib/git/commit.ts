import { $ } from "bun"
import type { CommandResult } from "~/types"

export const commit = async ({ type, subject, scope }: CommitOptions): Promise<CommandResult> => {
  const message = scope ? `${type}(${scope}): ${subject}` : `${type}: ${subject}`

  const { stderr, stdout, exitCode } = await $`git commit -m ${message}`.quiet()

  if (exitCode !== 0) {
    return {
      error: {
        message: "Failed to commit",
        raw: stderr.toString(),
      },
      output: stdout.toString(),
      success: false,
    }
  }

  return {
    success: true,
    output: stdout.toString(),
  }
}

type CommitOptions = {
  type: string
  subject: string
  scope?: string
}
