import { block } from "@clack/core"
import isUnicodeSupported from "is-unicode-supported"
import c from "picocolors"
import { cursor, erase } from "sisteransi"
import { S } from "./symbols"
import type { SpinnerFlowOptions, SpinnerStepOptions } from "./types"

function Step({ message, resolve }: SpinnerStepOptions) {
  return {
    message,
    resolve,
  }
}

async function Flow({ successMessage, children }: SpinnerFlowOptions) {
  const { isSpinnerActive, message, start, stop } = _spinner()
  const firstStepMessage = children[0].message

  start(firstStepMessage)

  for (const { message: msg, resolve } of children) {
    if (!isSpinnerActive()) return

    message(msg)
    await resolve(stop)
  }

  isSpinnerActive() && stop(successMessage)
}

export const Spinner = {
  Flow,
  Step,
}

const unicode = isUnicodeSupported()
function _spinner() {
  const frames = unicode ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"]
  const delay = unicode ? 80 : 120

  let unblock: () => void
  let loop: Timer
  let isSpinnerActive = false
  let _message = ""

  const handleExit = (code: number) => {
    const msg = code > 1 ? "Something went wrong" : "Canceled"
    if (isSpinnerActive) stop(msg, code)
  }

  const errorEventHandler = () => handleExit(2)
  const signalEventHandler = () => handleExit(1)

  const registerHooks = () => {
    // Reference: https://nodejs.org/api/process.html#event-uncaughtexception
    process.on("uncaughtExceptionMonitor", errorEventHandler)
    // Reference: https://nodejs.org/api/process.html#event-unhandledrejection
    process.on("unhandledRejection", errorEventHandler)
    // Reference Signal Events: https://nodejs.org/api/process.html#signal-events
    process.on("SIGINT", signalEventHandler)
    process.on("SIGTERM", signalEventHandler)
    process.on("exit", handleExit)
  }

  const clearHooks = () => {
    process.removeListener("uncaughtExceptionMonitor", errorEventHandler)
    process.removeListener("unhandledRejection", errorEventHandler)
    process.removeListener("SIGINT", signalEventHandler)
    process.removeListener("SIGTERM", signalEventHandler)
    process.removeListener("exit", handleExit)
  }

  const start = (msg: string): void => {
    isSpinnerActive = true
    unblock = block()
    _message = msg.replace(/\.+$/, "")

    process.stdout.write(`${c.gray(S.BAR)}\n`)

    let frameIndex = 0
    let dotsTimer = 0

    registerHooks()

    loop = setInterval(() => {
      const frame = c.magenta(frames[frameIndex])
      const loadingDots = ".".repeat(Math.floor(dotsTimer)).slice(0, 3)

      process.stdout.write(cursor.move(-999, 0))
      process.stdout.write(erase.down(1))
      process.stdout.write(`${frame}  ${_message}${loadingDots}`)

      frameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0
      dotsTimer = dotsTimer < frames.length ? dotsTimer + 0.125 : 0
    }, delay)
  }

  const stop = (msg?: string, code = 0) => {
    _message = msg ?? _message
    isSpinnerActive = false

    clearInterval(loop)

    const step = code === 0 ? c.green(S.STEP_SUBMIT) : code === 1 ? c.red(S.STEP_CANCEL) : c.red(S.STEP_ERROR)

    process.stdout.write(cursor.move(-999, 0))
    process.stdout.write(erase.down(1))
    process.stdout.write(`${step}  ${_message}\n`)

    clearHooks()
    unblock()
  }

  const message = (msg: string) => {
    _message = msg
  }

  const getSpinnerActive = () => isSpinnerActive

  return {
    start,
    stop,
    message,
    isSpinnerActive: getSpinnerActive,
  }
}
