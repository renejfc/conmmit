import internals from "./internals"

export async function writeDefaultConfig({
  customPath,
  override = false,
}: {
  customPath?: string
  override?: boolean
}) {
  try {
    const userConfigPath = customPath || internals.customConfigPath
    const userConfigFile = Bun.file(userConfigPath)

    if ((await userConfigFile.exists()) && !override)
      throw new Error(`Config file already exists at ${userConfigPath}`)

    const defaultConfigFile = Bun.file(new URL("./default.toml", import.meta.url).pathname)

    // not sure why BunFile.write is not working but Bun.write does...
    await Bun.write(userConfigPath, defaultConfigFile)
  } catch (error) {
    throw new Error(
      `Failed to write config: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}
