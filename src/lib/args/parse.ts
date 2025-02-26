import { type Args, parse } from "@bomb.sh/args"

export function parseArgs<const T extends ArgConfig[]>(argConfigs: T): ParsedArgs<T> {
  const argv = process.argv.slice(2)
  console.log(argv)
  const byType = (type: ArgConfig["type"]) =>
    argConfigs.filter((cfg) => cfg.type === type).map((cfg) => cfg.long)

  return parse(argv, {
    alias: Object.fromEntries(argConfigs.map(({ short, long }) => [short, long])),
    boolean: byType("boolean"),
    string: byType("string"),
    array: byType("array"),
    default: Object.fromEntries(
      argConfigs
        .filter(({ default: defaultValue }) => defaultValue !== undefined)
        .map(({ long, default: defaultValue }) => [long, defaultValue])
    ),
  }) as ParsedArgs<T>
}

type ArgConfigTypeMap = {
  boolean: boolean
  string: string
  number: number
  array: unknown[]
}

// default values should be the same type as the type field
export type ArgConfig = {
  [T in keyof ArgConfigTypeMap]: {
    long: string
    short: string
    type: T
    default?: ArgConfigTypeMap[T]
    description: string
  }
}[keyof ArgConfigTypeMap]

export type ParsedArgs<T extends ArgConfig[]> = {
  // check each obj in the array
  [K in T[number]["long"]]: Extract<T[number], { long: K }> extends infer C extends ArgConfig
    ? // if it has a default value
      C extends { default: any }
      ? // then assign it the same type from the type field
        ArgConfigTypeMap[C["type"]]
      : // else make it optional for type safety
        ArgConfigTypeMap[C["type"]] | undefined
    : never
} & {
  _: Args["_"]
}
