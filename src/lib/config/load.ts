import { TOML } from "bun"
import { safeParse } from "valibot"
import defaultConfig from "./default.toml"
import { type Config, ConfigSchema } from "./schema"

export async function loadConfig(customPath?: string): Promise<Config> {
  try {
    if (!customPath) return validateConfig(defaultConfig)

    const configFile = await Bun.file(customPath).text()
    const parsedConfig = TOML.parse(configFile)
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
