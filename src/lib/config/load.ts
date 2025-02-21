import { TOML } from "bun"
import { safeParse } from "valibot"
import defaultConfig from "./default.toml"
import { type Config, ConfigSchema } from "./schema"

export async function loadConfig(customPath?: string): Promise<Config> {
  try {
    if (!customPath) return validateConfig(defaultConfig)
    const configFile = Bun.file(customPath)
    if (!(await configFile.exists())) return validateConfig(defaultConfig)
    const parsedConfig = TOML.parse(await configFile.text())
    return validateConfig(parsedConfig)
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function validateConfig(config: unknown): Config {
  const result = safeParse(ConfigSchema, config, { abortPipeEarly: true })

  if (!result.success) {
    throw new Error(`Invalid config: ${result.issues[0]?.message}`)
  }

  return result.output
}
