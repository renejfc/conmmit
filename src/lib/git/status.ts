import { $ } from "bun"
import c from "picocolors"

const parseLsFilesOutput = (input: string): string[] => input.split("\n").filter(Boolean)

export async function getModifiedFiles(): Promise<string[]> {
  const { stdout } = await $`git ls-files --modified --exclude-standard`.quiet()
  return parseLsFilesOutput(stdout.toString())
}

export async function getUntrackedFiles(): Promise<string[]> {
  const { stdout } = await $`git ls-files --others --exclude-standard`.quiet()
  return parseLsFilesOutput(stdout.toString())
}

export async function getDeletedFiles(): Promise<string[]> {
  const { stdout } = await $`git ls-files --deleted --exclude-standard`.quiet()
  return parseLsFilesOutput(stdout.toString())
}

const formatStatusFiles = (files: string[]): FileStatus[] =>
  files.map((file) => ({
    label: c.italic(file),
    value: file,
  }))

export async function status(): Promise<StatusOptions> {
  const [modified, untracked, deleted] = await Promise.all([
    getModifiedFiles(),
    getUntrackedFiles(),
    getDeletedFiles(),
  ])

  const output = new Map<string, FileStatus[]>()

  if (modified.length) output.set(c.bold("Changed Files"), formatStatusFiles(modified))
  if (untracked.length) output.set(c.bold("Untracked Files"), formatStatusFiles(untracked))
  if (deleted.length) output.set(c.bold("Deleted Files"), formatStatusFiles(deleted))

  return output
}

type FileStatus = {
  label: string
  value: string
}

type StatusOptions = Map<string, FileStatus[]>
