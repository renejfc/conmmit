import { confirm, group, note, select, text } from "@clack/prompts"
import c from "picocolors"
import { COMMIT_TYPE, LINE_MAX_LENGTH, LINE_MIN_LENGTH } from "~/config"
import { cancelOnCancel, getCommitMessage } from "~/utils"

export const commitPrompt = async () => {
  const results = await group(
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
          message: `Type a scope ${c.italic(c.dim("(optional)"))}`,
          placeholder: `Examples: ${COMMIT_TYPE.find(t => t.name === results.type)?.exampleScopes.join(", ")}, etc...`,
        }),
      subject: () =>
        text({
          message: "Whats the subject?",
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
      onCancel: () => cancelOnCancel(),
    }
  )

  if (!results.confirmation) cancelOnCancel()

  return results
}
