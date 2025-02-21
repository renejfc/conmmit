import { homedir } from "node:os"
import { join } from "node:path"

export default {
  lineMaxLength: 100,
  lineMinLength: 3,
  customConfigPath: join(homedir(), ".conmmit/config.toml"),
} as const
