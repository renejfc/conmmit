import { isCancel } from "@clack/core"
import { Cancel } from "./cancel"
import type { GroupFlowOptions, GroupStepOptions } from "./types"

export function Step(opts: GroupStepOptions) {
  return opts
}

export async function Flow(opts: GroupFlowOptions) {
  let results: Record<string, any> = {}

  for (const { name, render } of opts.children) {
    const result = await render(results)

    if (isCancel(result)) {
      Cancel({ message: opts.cancelMessage ?? "" })
      process.exit(0)
    }

    if (!name) continue

    results = { ...results, [name]: result }
  }

  return results
}

export const Group = {
  Flow,
  Step,
}
