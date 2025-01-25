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

export type Task = {
  progress: [string, string?]
  task: ({
    message,
    stop,
  }: {
    message: (string: string) => void
    stop: (msg: string, code?: number) => void
  }) => Promise<() => void> | Promise<void>
  enabled?: boolean
}

export type CommandResult = {
  error?: {
    message: string
    raw: string
  }
  output?: string
  success: boolean
}
