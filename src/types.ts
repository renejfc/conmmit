type TypeName =
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

export type Type = {
  name: TypeName
  description: string
  exampleScopes: string[]
}

export type Types = {
  list: Type[]
  description: string
}

export type Scope = string
export type Subject = string

export type CommitMessage = {
  type: TypeName
  subject: Subject
  scope?: Scope
}
