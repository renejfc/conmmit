import { $ } from "bun"
import type { CommandResult } from "~/types"

export const add = async (files: string[]): Promise<CommandResult> => {
  for (const file of files) {
    const { stderr, stdout, exitCode } = await $`git add ${file}`.quiet()

    if (exitCode !== 0) {
      return {
        error: {
          message: `Failed adding ${file}`,
          raw: stderr.toString(),
        },
        output: stdout.toString(),
        success: false,
      }
    }
  }

  return { success: true }
}

export const addAll = async (): Promise<CommandResult> => {
  const { stderr, stdout, exitCode } = await $`git add -A`.quiet()

  if (exitCode !== 0) {
    return {
      error: {
        message: "Failed adding all changes",
        raw: stderr.toString(),
      },
      output: stdout.toString(),
      success: false,
    }
  }

  return { success: true }
}
