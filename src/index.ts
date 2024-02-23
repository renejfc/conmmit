import { setTimeout } from "node:timers/promises"
import { cancel, confirm, group, intro, log, note, outro, select, spinner, text } from "@clack/prompts"
import { $ } from "bun"
import c from "picocolors"
import { LINE_MAX_LENGTH, types } from "~/config"
import type { CommitMessage } from "~/types"

const getCommitMessage = ({ type, subject, scope }: CommitMessage) => {
  const scopeStr = scope ? `(${scope})` : ""
  return `${type}${scopeStr}: ${subject}`
}

console.clear()
intro(`${c.bold(c.bgCyan(c.black("COMMIT STRUCTURE")))}`)

const results = await group(
  {
    type: () =>
      select({
        initialValue: types.list[0].name,
        // without initialValue ^ ts sets the option.value type to void idk
        // see: https://github.com/natemoo-re/clack/issues/178
        options: types.list.map(({ name, description }) => ({
          value: name,
          label: name,
          hint: description,
        })),
        message: "Choose the commit type",
      }),
    scope: ({ results }) =>
      text({
        message: `Enter the scope ${c.italic(c.dim("(optional)"))}`,
        placeholder: `Examples for type "${results.type}": ${types.list
          .find(t => t.name === results.type)
          ?.exampleScopes.join(", ")}, etc...`,
      }),
    subject: () =>
      text({
        message: "Enter the subject",
        placeholder: `Example: "change primary button color"`,
        validate: value => {
          if (!value) return "Subject is required"
          if (value.length < 3) return `Subject must be at least ${c.bold(c.red(10))} characters`
          if (value.length > LINE_MAX_LENGTH)
            return `Subject must be less than ${c.bold(c.red(LINE_MAX_LENGTH))} characters`
        },
      }),
    currentCommitMsg: ({ results }) =>
      note(
        c.bold(
          c.bgGreen(
            getCommitMessage({
              type: results.type!,
              subject: results.subject!,
              scope: results.scope as string,
            })
          )
        ),
        `${c.bold(c.italic("Current commit message"))}`
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

if (!results.confirmation) {
  cancel("Commit cancelled.")
  process.exit(0)
}

if (results.confirmation) {
  const s = spinner()
  s.start("Committing...")

  await setTimeout(1000)

  const commit = await $`git commit -m ${getCommitMessage({
    type: results.type,
    subject: results.subject,
    scope: results.scope as string,
  })}`.quiet()

  if (commit.exitCode !== 0) {
    s.stop(`${c.bold("Commit failed.")}`, commit.exitCode)
    log.message(c.italic(commit.stderr.toString()))
    outro("Please try again.")
    process.exit(0)
  }

  s.stop(c.bold("Commit created!"), 0)
  log.message(commit.stdout.toString())
  outro("Bye! :)")
}
