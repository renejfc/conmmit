import internals from "./internals"
import { loadConfig } from "./load"
import type { Config } from "./schema"

const config = (() => {
  let cache: Config | undefined

  return {
    init: async (customPath?: string) => {
      if (cache) return cache
      cache = await loadConfig(customPath || internals.customConfigPath)
      return cache
    },
    get: () => {
      if (!cache) throw new Error("Config not initialized.")
      return { ...cache, internals }
    },
  }
})()

export { config, type Config, loadConfig }
