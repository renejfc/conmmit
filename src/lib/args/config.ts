import { array, boolean, check, optional, pipe, strictObject, unknown } from "valibot"
import type { ArgConfig } from "./parse"

export const argsConfigs = [
  {
    long: "help",
    short: "h",
    type: "boolean",
    description: "Shows this help message",
  },
  {
    long: "add",
    short: "a",
    type: "boolean",
    description: "Select files to add before committing",
  },
  {
    long: "add-all",
    short: "A",
    type: "boolean",
    description: "Add all changes before committing",
  },
  {
    long: "config",
    short: "c",
    type: "boolean",
    description: "Write the config file to your home directory",
  },
] as const satisfies ArgConfig[]

export const argsSchema = pipe(
  // gotta figure this out, i might be able to make the parser work with the schema
  strictObject(
    {
      help: optional(boolean()),
      add: optional(boolean()),
      "add-all": optional(boolean()),
      config: optional(boolean()),
      _: array(unknown()),
    },
    (issue) =>
      `Unknown argument flags provided: ${(issue.input as string).length > 1 ? "--" : "-"}${issue.input}`
  ),
  check(
    (args) => args._.length <= 0,
    (issue) => `Unknown argument flags provided: ${issue.input._.join(", ")}`
  ),
  check((args) => !(args.add && args["add-all"]), "Cannot use both --add and --add-all"),
  check(
    (args) =>
      !args.help || Object.keys(args).filter((key) => key !== "help" && key !== "_").length === 0,
    "--help cannot be used with other flags"
  ),
  check(
    (args) =>
      !args.config ||
      Object.keys(args).filter((key) => key !== "config" && key !== "_").length === 0,
    "--config cannot be used with other flags"
  )
)
