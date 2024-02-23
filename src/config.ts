import type { Types } from "~/types"

export const LINE_MAX_LENGTH = 100

export const types: Types = {
  description: "Select the type of change that you're committing",
  list: [
    {
      name: "feat",
      description: "A new feature",
      exampleScopes: ["api", "ui", "auth", "db"],
    },
    {
      name: "fix",
      description: "A bug fix",
      exampleScopes: ["memory", "crash", "data", "performance"],
    },
    {
      name: "wip",
      description: "Work in progress",
      exampleScopes: ["prototype", "experiment", "draft", "concept"],
    },
    {
      name: "docs",
      description: "Documentation only changes",
      exampleScopes: ["guide", "setup", "reference", "faq"],
    },
    {
      name: "style",
      description: "Code style changes (white-space, formatting, semi-colons, etc)",
      exampleScopes: ["format", "lint", "typo"],
    },
    {
      name: "refactor",
      description: "A code change that neither fixes a bug nor adds a feature",
      exampleScopes: ["cleanup", "split", "interface"],
    },
    {
      name: "perf",
      description: "A code change that improves performance",
      exampleScopes: ["query", "cache", "workers"],
    },
    {
      name: "test",
      description: "Adding missing tests or correcting existing ones",
      exampleScopes: ["unit", "integration", "e2e", "performance"],
    },
    {
      name: "build",
      description: "Changes that affect the build system or external dependencies",
      exampleScopes: ["webpack", "babel", "npm", "gradle"],
    },
    {
      name: "ci",
      description: "Changes to the CI configuration files and scripts",
      exampleScopes: ["actions", "gitlab", "jenkins", "circleci"],
    },
    {
      name: "chore",
      description: "Other changes that don't modify src or test files",
      exampleScopes: ["deps", "tooling", "workflow", "structure"],
    },
    {
      name: "revert",
      description: "Reverts a previous commit",
      exampleScopes: ["rollback"],
    },
  ],
}
