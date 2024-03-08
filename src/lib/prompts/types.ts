export type TextOptions = {
  message: string
  placeholder?: string
  defaultValue?: string
  initialValue?: string
  validate?: (value: string) => string | void
}