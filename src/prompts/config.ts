import { confirm, log, note, outro } from "@clack/prompts"
import c from "picocolors"
import { config } from "~/lib/config"
import { writeDefaultConfig } from "~/lib/config/write"
import { cancelOnCancel } from "~/utils"

export async function configPrompt() {
  const { internals } = config.get()
  const userConfigPath = internals.customConfigPath
  const userConfigFile = Bun.file(userConfigPath)
  const exists = await userConfigFile.exists()

  if (exists) {
    note(
      c.bold(c.bgYellow(`Config file found at: ${userConfigPath}`)),
      c.bold(c.italic("Config Status"))
    )

    const shouldOverride = await confirm({
      message: "Config file already exists. Do you want to override it?",
      active: "Yes",
      inactive: "No",
    })

    cancelOnCancel({ value: shouldOverride })
  }

  try {
    await writeDefaultConfig({ override: true })

    note(
      c.bold(c.green(`Config file ${exists ? "overriden" : "created"} at: ${userConfigPath}`)),
      c.bold(c.italic("Success"))
    )
  } catch (error) {
    log.error(
      c.bold(
        `Failed to ${exists ? "override" : "create"} config: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    )

    outro("Try again.")
    process.exit(1)
  }
}
