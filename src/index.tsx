import { $ } from "bun"
import c from "picocolors"
import { config, getCommitMessage } from "~/lib/core"
import { Cancel, Confirm, Group, Intro, Log, Note, Outro, Select, SelectOption, Spinner, Text } from "~/lib/prompts"

const { commitType, lineMaxLength, lineMinLength } = config

console.clear()
await (<Intro title={`${c.bold(c.bgCyan("COMMIT STRUCTURE"))}`} />)

const commitResults = await (
  <Group.Flow cancelMessage="Commit cancelled.">
    <Group.Step
      name="type"
      render={() => (
        <Select message="Choose a commit type">
          {commitType.map(type => (
            <SelectOption value={type.name} hint={type.description} />
          ))}
        </Select>
      )}
    />
    <Group.Step
      name="scope"
      render={results => {
        const { type } = results
        const scopeExamples = commitType.find(t => t.name === type)?.exampleScopes.join(", ")
        const message = `Enter a scope ${c.italic(c.dim("(optional)"))}`
        const placeholder = `Example: ${scopeExamples}, etc...`

        return <Text message={message} placeholder={placeholder} />
      }}
    />
    <Group.Step
      name="subject"
      render={() => (
        <Text
          message="Enter a subject"
          placeholder="Example: change file structure"
          validate={value => {
            if (!value) return "Subject is required"
            if (value.length < lineMinLength) return `Subject must be at least ${c.bold(c.red(3))} characters`
            if (value.length > lineMaxLength)
              return `Subject must be less than ${c.bold(c.red(lineMaxLength))} characters`
          }}
        />
      )}
    />
    <Group.Step
      render={results => {
        const { type, scope, subject } = results
        const title = c.bold(c.italic("Current commit message"))
        const message = c.bold(c.bgYellow(getCommitMessage({ type, subject, scope })))

        return <Note title={title} message={message} />
      }}
    />
    <Group.Step
      name="confirmation"
      render={() => <Confirm message="Looks good? Wanna commit this?" active="Yeah" inactive="Nope" />}
    />
  </Group.Flow>
)

if (!commitResults.confirmation) {
  await (<Cancel message="Commit cancelled." />)
  process.exit(0)
}

await (
  <Spinner.Flow success={c.bold("Commit created!")}>
    <Spinner.Step
      message="Committing"
      success="Commited!"
      resolve={async stop => {
        const { exitCode, stderr, stdout } = await $`git commit -m ${getCommitMessage({
          type: commitResults.type,
          subject: commitResults.subject,
          scope: commitResults.scope,
        })}`.quiet()

        const [error, output] = [stderr.toString(), stdout.toString()]

        if (exitCode !== 0) {
          stop(c.bold("Commit failed."), exitCode)
          await (error ? <Log.Error message={c.italic(error)} /> : <Log.Info message={c.italic(output)} />)
          await (<Outro message="Try again." />)
          process.exit(exitCode)
        }

        return () => <Log.Info message={c.italic(output)} />
      }}
    />
  </Spinner.Flow>
)

await (<Outro message="glhf!" />)
