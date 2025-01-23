import { readFileSync } from "node:fs"

const BOT_COMMENT_IDENTIFIER = "### 🧪 CLI Preview Build."
const COMMIT_LENGTH = 7

const generateUrls = ({ sha, owner, repo, commitUrl = null, prNumber = null }) => {
  const shortSha = sha.substring(0, COMMIT_LENGTH)
  const shortUrl = `https://pkg.pr.new/${owner}/${repo}@${prNumber ?? shortSha}`

  return {
    shortSha,
    shortUrl,
    commitUrl: commitUrl ?? `https://github.com/${owner}/${repo}/commit/${sha}`,
  }
}

const generateCommentBody = ({ sha, owner, repo, commitUrl, prNumber }) => {
  const { shortSha, shortUrl } = generateUrls({ sha, owner, repo, commitUrl, prNumber })

  return `${BOT_COMMENT_IDENTIFIER}

Try this version:
\`\`\`sh
bun add -g ${shortUrl}
\`\`\`

###### _[${shortSha}](${commitUrl})_`
}

const findBotComment = async ({ github, context, issueNumber }) => {
  const comments = await github.rest.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  })

  return comments.data.find((comment) => comment.body.includes(BOT_COMMENT_IDENTIFIER))
}

const createOrUpdateComment = async ({ github, context, body, issueNumber }) => {
  const existingComment = await findBotComment({ github, context, issueNumber })

  if (existingComment) {
    return await github.rest.issues.updateComment({
      ...context.repo,
      comment_id: existingComment.id,
      body,
    })
  }

  return github.rest.issues.createComment({
    ...context.repo,
    issue_number: issueNumber,
    body,
  })
}

const logPublishInfo = async ({ logger, output, commitUrl }) => {
  logger(`\n${"=".repeat(50)}`)
  logger("Preview Information")
  logger("=".repeat(50))
  logger("\nCLI Preview Ready:")
  logger(`- ${output.packages[0].url}`)
  logger(`\nCommit URL: ${commitUrl}`)
  logger(`\n${"=".repeat(50)}`)
}

const handlePullRequest = async ({ github, context, body }) => {
  if (!context.issue.number) return
  return await createOrUpdateComment({
    github,
    context,
    body,
    issueNumber: context.issue.number,
  })
}

const handlePush = async ({ logger, github, context, body, output, commitUrl }) => {
  const pullRequests = await github.rest.pulls.list({
    ...context.repo,
    state: "open",
    head: `${context.repo.owner}:${context.ref.replace("refs/heads/", "")}`,
  })

  if (pullRequests.data.length > 0) {
    return await createOrUpdateComment({
      github,
      context,
      body,
      issueNumber: pullRequests.data[0].number,
    })
  }

  logger("No open pull request found for this push. Logging publish information to console:")
  await logPublishInfo({ logger, output, commitUrl })
}

export async function run(github, context, core) {
  const output = JSON.parse(readFileSync("output.json", "utf8"))
  const sha = context.eventName === "pull_request" ? context.payload.pull_request.head.sha : context.payload.after
  const prNumber = context.eventName === "pull_request" ? context.payload.pull_request.number : null

  const { commitUrl } = generateUrls({
    sha,
    owner: context.repo.owner,
    repo: context.repo.repo,
    prNumber,
  })

  const body = generateCommentBody({
    sha,
    owner: context.repo.owner,
    repo: context.repo.repo,
    commitUrl,
    prNumber,
  })

  const handlers = {
    pull_request: () => handlePullRequest({ github, context, body }),
    push: () => handlePush({ logger: core.info, github, context, body, output, commitUrl }),
  }

  const handler = handlers[context.eventName]
  if (handler) await handler()
}
