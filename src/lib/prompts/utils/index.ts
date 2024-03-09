import c from "picocolors"

type LimitOptionsParams<TOption> = {
  options: TOption[]
  maxItems: number | undefined
  cursor: number
  style: (option: TOption, active: boolean) => string
}

export function limitOptions<TOption>(params: LimitOptionsParams<TOption>): string[] {
  const { cursor, options, style } = params

  // We clamp to minimum 5 because anything less doesn't make sense UX wise
  const maxItems = params.maxItems === undefined ? Number.POSITIVE_INFINITY : Math.max(params.maxItems, 5)
  let slidingWindowLocation = 0

  if (cursor >= slidingWindowLocation + maxItems - 3) {
    slidingWindowLocation = Math.max(Math.min(cursor - maxItems + 3, options.length - maxItems), 0)
  } else if (cursor < slidingWindowLocation + 2) {
    slidingWindowLocation = Math.max(cursor - 2, 0)
  }

  const shouldRenderTopEllipsis = maxItems < options.length && slidingWindowLocation > 0
  const shouldRenderBottomEllipsis = maxItems < options.length && slidingWindowLocation + maxItems < options.length

  return options.slice(slidingWindowLocation, slidingWindowLocation + maxItems).map((option, i, arr) => {
    const isTopLimit = i === 0 && shouldRenderTopEllipsis
    const isBottomLimit = i === arr.length - 1 && shouldRenderBottomEllipsis
    return isTopLimit || isBottomLimit ? c.dim("...") : style(option, i + slidingWindowLocation === cursor)
  })
}
