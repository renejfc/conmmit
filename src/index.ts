#!/usr/bin/env bun

import { cancel, confirm, group, intro, log, note, outro, select, spinner, text } from "@clack/prompts"
import { $ } from "bun"
import c from "picocolors"
import { COMMIT_TYPE, LINE_MAX_LENGTH, LINE_MIN_LENGTH } from "~/config"
import { getCommitMessage } from "~/utils"

console.clear()
$.nothrow()

intro(c.bold(c.bgCyan("COMMIT STRUCTURE")))

const commitResults = await group(
  {
    type: () =>
      select({
        initialValue: COMMIT_TYPE[0].name,
        // without initialValue ^ ts sets the option.value type to void idk
        // see: https://github.com/natemoo-re/clack/issues/178
        options: COMMIT_TYPE.map(({ name, description }) => ({
          value: name,
          label: name,
          hint: description,
        })),
        message: "Choose a commit type",
      }),
    scope: ({ results }) =>
      text({
        message: `Enter a scope ${c.italic(c.dim("(optional)"))}`,
        placeholder: `Examples: ${COMMIT_TYPE.find(t => t.name === results.type)?.exampleScopes.join(", ")}, etc...`,
      }),
    subject: () =>
      text({
        message: "Enter a subject",
        placeholder: `Example: "change files structure"`,
        validate: value => {
          if (!value) return "Subject is required"
          if (value.length < LINE_MIN_LENGTH) return `Subject must be at least ${c.bold(c.red(3))} characters`
          if (value.length > LINE_MAX_LENGTH)
            return `Subject must be less than ${c.bold(c.red(LINE_MAX_LENGTH))} characters`
        },
      }),
    showMessage: ({ results }) =>
      note(
        c.bold(
          c.bgYellow(
            getCommitMessage({
              type: results.type!,
              subject: results.subject!,
              scope: results.scope as string,
            })
          )
        ),
        c.bold(c.italic("Current commit message"))
      ),
    confirmation: () =>
      confirm({
        message: "Looks good? Wanna commit this?",
        active: "Yeah",
        inactive: "Nope",
      }),
  },
  {
    onCancel: () => {
      cancel("Commit cancelled.")
      process.exit(0)
    },
  }
)

if (!commitResults.confirmation) {
  cancel("Commit cancelled.")
  process.exit(0)
}

const s = spinner()
s.start("Committing")

const commit = await $`git commit -m ${getCommitMessage({
  type: commitResults.type,
  subject: commitResults.subject,
  scope: commitResults.scope as string,
})}`.quiet()

const [error, output] = [commit.stderr.toString(), commit.stdout.toString()]

if (commit.exitCode !== 0) {
  s.stop(`${c.bold("Commit failed.")}`, commit.exitCode)

  if (error) log.error(c.italic(error))
  else log.info(c.italic(output))

  outro("Try again.")
  process.exit(0)
}

s.stop(c.bold("Commit created!"), 0)
log.info(c.italic(output))
outro("glhf! :)")
