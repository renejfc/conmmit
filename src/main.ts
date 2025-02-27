#!/usr/bin/env bun
import { intro, log, outro } from "@clack/prompts"
import { $ } from "bun"
import c from "picocolors"
import { initArgs } from "~/lib/args"
import { config } from "~/lib/config"
import { add, addAll, commit } from "~/lib/git"
import { addPrompt, commitPrompt, configPrompt } from "~/prompts"
import { handleNonZeroExit, tasks } from "~/utils"

console.clear()
$.nothrow()
await config.init()
const args = initArgs()

intro(c.bold(c.bgCyan("CONMMIT")))

if (args.config) {
  await configPrompt()
  outro("Config setup complete!")
  process.exit(0)
}

const addResults = (args.add && (await addPrompt())) || []
const commitResults = await commitPrompt()

await tasks([
  {
    progress: ["Adding files", "Files added!"],
    enabled: addResults.length > 0,
    task: async ({ message, stop }) => {
      for (const file of addResults) {
        message(`Adding ${file}`)
        const { error, output, success } = await add([file])

        if (!success) {
          handleNonZeroExit(() => stop(c.bold(`Failed adding ${file}.`), 1), {
            error,
            output,
          })
        }
      }
    },
  },
  {
    progress: ["Adding all changes", "All changes added!"],
    enabled: args["add-all"],
    task: async ({ stop }) => {
      const { error, output, success } = await addAll()

      if (!success) {
        handleNonZeroExit(() => stop(c.bold("Failed adding all changes."), 1), {
          error,
          output,
        })
      }
    },
  },
  {
    progress: ["Committing", "Commit created!"],
    enabled: true,
    task: async ({ stop }) => {
      const { error, output, success } = await commit({
        type: commitResults.type,
        subject: commitResults.subject,
        scope: commitResults.scope as string,
      })

      if (!success) {
        handleNonZeroExit(() => stop(c.bold("Commit failed."), 1), { error, output })
      }

      return () => log.info(c.italic(output))
    },
  },
])

outro("glhf! :)")
