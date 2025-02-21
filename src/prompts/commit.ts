import { confirm, group, note, select, text } from "@clack/prompts"
import c from "picocolors"
import { config } from "~/lib/config"
import { cancelOnCancel } from "~/utils"

export async function commitPrompt() {
  const { commit_types, internals } = config.get()

  const results = await group(
    {
      type: () =>
        select({
          initialValue: commit_types[0].name,
          options: commit_types.map(({ name, description }) => ({
            value: name,
            label: name,
            hint: description,
          })),
          message: "Choose a commit type",
        }),
      scope: ({ results }) =>
        text({
          message: `Type a scope ${c.italic(c.dim("(optional)"))}`,
          placeholder: `Examples: ${commit_types.find((t) => t.name === results.type)?.example_scopes.join(", ")}, etc...`,
        }),
      subject: () =>
        text({
          message: "Whats the subject?",
          placeholder: `Example: "change files structure"`,
          validate: (value) => {
            if (!value) return "Subject is required"
            if (value.length < internals.lineMinLength)
              return `Subject must be at least ${c.bold(c.red(3))} characters`
            if (value.length > internals.lineMaxLength)
              return `Subject must be less than ${c.bold(c.red(internals.lineMaxLength))} characters`
          },
        }),
      showMessage: async ({ results }) =>
        note(
          c.bold(
            c.bgYellow(
              `${results.type}${results.scope ? `(${results.scope})` : ""}: ${results.subject}`
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
