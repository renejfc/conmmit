// TODO: not really the most optimal api, will refactor later
type ParsedArgsOut = [[string, string], string][]
type ParsedArgs<T extends ParsedArgsOut> = Map<T[number][0][0], boolean>

export const parseArgs = <const T extends ParsedArgsOut>(args: T): ParsedArgs<T> => {
  const LONG_PREFIX = "--"
  const SHORT_PREFIX = "-"

  const bunArgs = new Set(Bun.argv.slice(2))
  const mappedArgs = new Map<string, boolean>()

  for (const [[long, short]] of args) {
    const longPrefixed = LONG_PREFIX + long
    const shortPrefixed = SHORT_PREFIX + short

    if (!mappedArgs.has(long) && (bunArgs.has(longPrefixed) || bunArgs.has(shortPrefixed)))
      mappedArgs.set(long, true)
    else mappedArgs.set(long, false)
  }

  return mappedArgs
}
