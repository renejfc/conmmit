import type { Option } from "./types";

export function SelectOption<Value>({ value, label, hint }: Option<Value>) {
  return { value, label, hint }
}