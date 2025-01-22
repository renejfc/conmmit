#!/usr/bin/env bun

import { intro, log, outro } from "@clack/prompts"
import { $ } from "bun"
import c from "picocolors"
import { parseArgs } from "~/lib"
import { addPrompt, commitPrompt } from "~/prompts"
import { getCommitMessage, handleNonZeroExit, tasks } from "~/utils"

console.clear()
$.nothrow()

const args = parseArgs([
  [["add", "a"], "Choose which files to add"],
  [["add-all", "A"], "Add all changes to the commit"],
])

intro(c.bold(c.bgCyan("TEST PREVIEW COMMIT")))

const addResults = (args.get("add") && (await addPrompt())) || []
const commitResults = await commitPrompt()

await tasks([
  {
    progress: ["Adding files", "Files added!"],
    enabled: addResults.length > 0,
    task: async ({ message, stop }) => {
      for (const file of addResults) {
        message(`Adding ${file}`)

        const { stderr, stdout, exitCode } = await $`git add ${file}`.quiet()
        const [error, output] = [stderr.toString(), stdout.toString()]

        handleNonZeroExit(() => stop(c.bold(`Failed adding ${file}.`), exitCode), {
          error,
          output,
          exitCode,
        })
      }
    },
  },
  {
    progress: ["Adding all changes", "All changes added!"],
    enabled: args.get("add-all"),
    task: async ({ stop }) => {
      const { stderr, stdout, exitCode } = await $`git add -A`.quiet()
      const [error, output] = [stderr.toString(), stdout.toString()]

      handleNonZeroExit(() => stop(c.bold("Failed adding all changes."), exitCode), {
        error,
        output,
        exitCode,
      })
    },
  },
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
