import { type InferOutput, array, maxLength, minLength, object, pipe, string } from "valibot"

export const CommitTypeSchema = object({
  name: pipe(
    string(),
    minLength(1, "Type name cannot be empty"),
    maxLength(12, "Type name cannot exceed 12 characters")
  ),
  description: pipe(
    string(),
    minLength(1, "Description cannot be empty"),
    maxLength(90, "Description cannot exceed 90 characters")
  ),
  example_scopes: pipe(
    array(
      pipe(
        string(),
        minLength(1, "Scope cannot be empty"),
        maxLength(12, "Scope cannot exceed 12 characters")
      )
    ),
    minLength(1, "At least 1 example scope is required"),
    maxLength(5, "At most 5 example scopes are allowed")
  ),
})

export const ConfigSchema = object({
  commit_types: pipe(array(CommitTypeSchema), minLength(1, "At least 1 commit type is required")),
})

export type CommitType = InferOutput<typeof CommitTypeSchema>
export type Config = InferOutput<typeof ConfigSchema>
