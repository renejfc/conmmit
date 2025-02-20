import { afterEach, beforeAll, beforeEach, describe, expect, test } from "bun:test"
import { mkdir, rm } from "node:fs/promises"
import { join } from "node:path"
import { config, loadConfig } from "~/lib/config"
import { writeDefaultConfig } from "~/lib/config/write"

const WRITE_TEST_PATH = ".temp/conmmit"

beforeAll(() => config.init())
beforeEach(async () => await mkdir(WRITE_TEST_PATH, { recursive: true }))
afterEach(async () => await rm(WRITE_TEST_PATH, { recursive: true, force: true }))

describe("Config Loading", () => {
  test("should load default config", async () => {
    const config = await loadConfig()

    expect(config).toBeDefined()
    expect(config.commit_types).toBeArray()
    expect(config.commit_types.length).toBeGreaterThan(0)
  })

  test("should validate commit type structure", async () => {
    const config = await loadConfig()
    const firstType = config.commit_types[0]

    expect(firstType).toHaveProperty("name")
    expect(firstType).toHaveProperty("description")
    expect(firstType).toHaveProperty("example_scopes")
    expect(firstType.example_scopes).toBeArray()
  })

  test("should throw on invalid config structure", async () => {
    // this is enough thanks to abortPipeEarly on validation fn
    const invalidConfig = `
      [[commit_types]]
      name = ""
    `
    const configPath = join(WRITE_TEST_PATH, "invalid-config.toml")
    const configFile = Bun.file(configPath)
    await configFile.write(invalidConfig)

    expect(loadConfig(configPath)).rejects.toThrow()
  })

  test("should load config from custom path", async () => {
    const customConfig = `
      [[commit_types]]
      name = "custom"
      description = "Custom type"
      example_scopes = ["test"]
    `
    const configPath = join(WRITE_TEST_PATH, "custom-config.toml")
    const configFile = Bun.file(configPath)
    await configFile.write(customConfig)
    const {
      commit_types: [commit_type],
    } = await loadConfig(configPath)

    expect(commit_type).toHaveProperty("name", "custom")
    expect(commit_type).toHaveProperty("description", "Custom type")
    expect(commit_type).toHaveProperty("example_scopes", ["test"])
  })
})

describe("Config Writing", () => {
  test("should copy default config to user's filesystem", async () => {
    const configPath = join(WRITE_TEST_PATH, "config.toml")
    const userConfigFile = Bun.file(configPath)

    const defaultConfig = await loadConfig()

    await writeDefaultConfig(configPath)
    const userConfig = await loadConfig(configPath)

    expect(await userConfigFile.exists()).toBeTrue()
    expect(userConfig).toStrictEqual(defaultConfig)
  })

  test("should not overwrite existing config", async () => {
    const customConfig = `
      [[commit_types]]
      name = "custom"
      description = "Custom type"
      example_scopes = ["test"]
    `
    const configPath = join(WRITE_TEST_PATH, "config.toml")
    const configFile = Bun.file(configPath)
    await configFile.write(customConfig)

    expect(writeDefaultConfig(configPath)).rejects.toThrow()
    const content = await configFile.text()
    expect(content).toBe(customConfig)
  })
})
