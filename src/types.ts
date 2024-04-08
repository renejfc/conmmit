type CommitTypeNames =
  | "feat"
  | "fix"
  | "docs"
  | "style"
  | "refactor"
  | "perf"
  | "test"
  | "build"
  | "ci"
  | "chore"
  | "revert"
  | "wip"

export type CommitType = {
  name: CommitTypeNames
  description: string
  exampleScopes: string[]
}
