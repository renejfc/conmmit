// validate.ts
import { safeParse } from "valibot"
import { argsSchema } from "./config"
import type { ArgConfig, ParsedArgs } from "./parse"

export const validateArgs = <T extends ArgConfig[]>(args: ParsedArgs<T>) => {
  const result = safeParse(argsSchema, args, { abortPipeEarly: true })

  if (!result.success) return result.issues[0].message
  return false
}
