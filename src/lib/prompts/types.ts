export type Primitive = Readonly<string | boolean | number>

export type Option<Value> = Value extends Primitive
  ? { value: Value; label?: string; hint?: string }
  : { value: Value; label: string; hint?: string }

export type TextOptions = {
  message: string
  placeholder?: string
  defaultValue?: string
  initialValue?: string
  validate?: (value: string) => string | void
}

export type PasswordOptions = {
  message: string
  mask?: string
  validate?: (value: string) => string | void
}

export type ConfirmOptions = {
  message: string
  active?: string
  inactive?: string
  initialValue?: boolean
}

export type SelectOptions<Value> = {
  message: string
  children: Option<Value>[]
  initialValue?: Value
  maxItems?: number
}

export type MultiSelectOptions<Value> = {
  message: string
  children: Option<Value>[]
  initialValues?: Value[]
  maxItems?: number
  required?: boolean
  cursorAt?: Value
}

export type LogMessageOptions = {
  message?: string
  symbol?: string
}

export type SpinnerStepOptions = {
  message: string
  resolve: (stop: (msg?: string, code?: number) => void) => Promise<void>
}

export type SpinnerFlowOptions = {
  successMessage?: string
  children: SpinnerStepOptions[]
}

export type GroupStepOptions = {
  name?: string
  render: (results: Record<string, any>) => Promise<any>
}

export type GroupFlowOptions = {
  cancelMessage?: string
  children: GroupStepOptions[]
}
