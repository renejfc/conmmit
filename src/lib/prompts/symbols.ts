import type { State } from "@clack/core"
import isUnicodeSupported from "is-unicode-supported"
import color from "picocolors"

const unicode = isUnicodeSupported()
const s = (c: string, fallback: string) => (unicode ? c : fallback)

export const S = {
  STEP_ACTIVE: s("◆", "*"),
  STEP_CANCEL: s("■", "x"),
  STEP_ERROR: s("▲", "x"),
  STEP_SUBMIT: s("◇", "o"),
  BAR_START: s("┌", "T"),
  BAR: s("│", "|"),
  BAR_END: s("└", "—"),
  RADIO_ACTIVE: s("●", ">"),
  RADIO_INACTIVE: s("○", " "),
  CHECKBOX_ACTIVE: s("◻", "[•]"),
  CHECKBOX_SELECTED: s("◼", "[+]"),
  CHECKBOX_INACTIVE: s("◻", "[ ]"),
  PASSWORD_MASK: s("▪", "•"),
  BAR_H: s("─", "-"),
  CORNER_TOP_RIGHT: s("╮", "+"),
  CONNECT_LEFT: s("├", "+"),
  CORNER_BOTTOM_RIGHT: s("╯", "+"),
  INFO: s("●", "•"),
  SUCCESS: s("◆", "*"),
  WARN: s("▲", "!"),
  ERROR: s("■", "x"),
}

export const symbol = (state: State) => {
  switch (state) {
    case "initial":
    case "active":
      return color.cyan(S.STEP_ACTIVE)
    case "cancel":
      return color.red(S.STEP_CANCEL)
    case "error":
      return color.yellow(S.STEP_ERROR)
    case "submit":
      return color.green(S.STEP_SUBMIT)
  }
}
