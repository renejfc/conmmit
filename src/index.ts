#!/usr/bin/env bun

import { intro, log, outro } from "@clack/prompts"
import { $ } from "bun"
import c from "picocolors"
import { commitPrompt } from "~/prompts"
import { getCommitMessage, handleNonZeroExit, tasks } from "~/utils"

console.clear()
$.nothrow()

intro(c.bold(c.bgCyan(" CONMMIT ")))

const commitResults = await commitPrompt()

await tasks([
  {
    progress: ["Committing", "Commit created!"],
    enabled: true,
    task: async ({ stop }) => {
      const { stderr, stdout, exitCode } = await $`git commit -m ${getCommitMessage({
        type: commitResults.type,
        subject: commitResults.subject,
        scope: commitResults.scope as string,
      })}`.quiet()

      const [error, output] = [stderr.toString(), stdout.toString()]

      handleNonZeroExit(() => stop(c.bold("Commit failed."), exitCode), {
        error,
        output,
        exitCode,
      })

      return () => log.info(c.italic(output))
    },
  },
])

outro("glhf! :)")
