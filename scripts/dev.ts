import { watch } from "node:fs/promises"
import path from "node:path"
import { $ } from "bun"

const WATCH_DIR = path.join(__dirname, "../src")

const watcher = watch(WATCH_DIR, { recursive: true })
console.log(`Watching ${WATCH_DIR}`)

for await (const event of watcher) {
  console.log(`Detected ${event.eventType} in ${event.filename}`)

  const compp = await $`bun comp`.quiet()

  if (compp.exitCode === 0) console.log("Compiled")
}

process.on("SIGINT", () => {
  console.log("Closing watcher...")
  process.exit(0)
})
