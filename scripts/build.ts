import { $, file } from "bun"
import c from "picocolors"

const ENTRYPOINT = "./src/index.tsx"
const OUTDIR = "./dist"
const COMP_OUTFILE = `${OUTDIR}/conmmit`
const BUILD_OUTFILE = `${OUTDIR}/conmmit.js`
const SHOULD_COMPILE = false // not sure if shipping binaries tbh...

const build = await $`bun build --target=bun --minify ${ENTRYPOINT} --outfile ${BUILD_OUTFILE}`.quiet()

if (SHOULD_COMPILE) {
  const comp = await $`bun build --compile --minify --sourcemap ${ENTRYPOINT} --outfile ${COMP_OUTFILE}`.quiet()
  if (comp.exitCode === 0) {
    const stdout = formatStdout(comp.stdout)
    const size = fileSize(COMP_OUTFILE, "mb")

    console.log(`
  ${c.bold("--- Compilation ---")}

  ${stdout}

  File size: ${size} MB
  `)
  } else {
    console.error(`
  Compilation error:

  ${comp.stderr.toString()}
  `)
  }
}

if (build.exitCode === 0) {
  const stdout = c.dim(build.stdout.toString().trim())
  const size = fileSize(BUILD_OUTFILE, "kb")

  console.log(`
  ${c.bold("--- Build ---")}

  ${stdout}

  File size: ${size} KB
  `)
} else {
  console.error(`
  Build error:

  ${build.stderr.toString()}
  `)
}

function bytesTo(bytes: number, to: "mb" | "kb") {
  const base = 1024
  if (to === "mb") return (bytes / base ** 2).toFixed(2)
  return (bytes / base).toFixed(2)
}

function formatStdout(stdout: Buffer) {
  return c.italic(c.dim(stdout.toString().trim()))
}

function fileSize(path: string, unit: "mb" | "kb") {
  return bytesTo(file(path).size, unit)
}
