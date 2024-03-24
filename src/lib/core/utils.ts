export function getCommitMessage({ type, subject, scope }: { type: string; subject: string; scope?: string }) {
  const scopeStr = scope ? `(${scope})` : ""
  return `${type}${scopeStr}: ${subject}`
}