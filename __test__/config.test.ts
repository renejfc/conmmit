import { describe, expect, test } from "bun:test"
import { loadConfig } from "~/lib/config"

describe("Config Loading", () => {
  test("should load default config", async () => {
    const config = await loadConfig()

    expect(config).toBeDefined()
    expect(Array.isArray(config.commit_types)).toBe(true)
    expect(config.commit_types.length).toBeGreaterThan(0)
  })

  test("should validate commit type structure", async () => {
    const config = await loadConfig()
    const firstType = config.commit_types[0]

    expect(firstType).toHaveProperty("name")
    expect(firstType).toHaveProperty("description")
    expect(firstType).toHaveProperty("example_scopes")
    expect(Array.isArray(firstType.example_scopes)).toBe(true)
  })

  test("should throw on invalid config structure", async () => {
    // this is enough thanks to abortPipeEarly on validation fn
    const invalidConfig = `
      [[commit_types]]
      name = ""
    `

    const tempFile = ".temp/conmmit/temp-config.toml"
    await Bun.write(tempFile, invalidConfig)

    try {
      expect(loadConfig(tempFile)).rejects.toThrow("Invalid config")
    } finally {
      await Bun.file(tempFile).unlink()
    }
  })
})
