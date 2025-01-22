import { readFileSync } from "node:fs"

const BOT_COMMENT_IDENTIFIER = "### 🧪 CLI Preview Build."
const COMMIT_LENGTH = 7

const generateUrls = ({ sha, owner, repo, commitUrl }) => {
  const shortSha = sha.substring(0, COMMIT_LENGTH)
  const shortUrl = `https://pkg.pr.new/${owner}/${repo}@${shortSha}`

  return {
    shortSha,
    shortUrl,
    commitUrl,
  }
}

const generateCommentBody = ({ sha, owner, repo, commitUrl }) => {
  const { shortSha, shortUrl } = generateUrls({ sha, owner, repo })

  return `${BOT_COMMENT_IDENTIFIER}

Try this version:
\`\`\`sh
bun add -g ${shortUrl}
\`\`\`

[${shortSha}](${commitUrl})`
}

const findBotComment = async ({ github, context, issueNumber }) => {
  const comments = await github.rest.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  })

  return comments.data.find((comment) => comment.body.includes(CONSTANTS.BOT_COMMENT_IDENTIFIER))
}

const createOrUpdateComment = async ({ github, context, body, issueNumber }) => {
  const existingComment = await findBotComment({ github, context, issueNumber })

  if (existingComment) {
    return github.rest.issues.updateComment({
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

const logPublishInfo = ({ output, commitUrl }) => {
  console.log(`\n${"=".repeat(50)}`)
  console.log("Preview Information")
  console.log("=".repeat(50))
  console.log("\nCLI Preview Ready:")
  console.log(`- ${output.packages[0].url}`)
  console.log(`\nCommit URL: ${commitUrl}`)
  console.log(`\n${"=".repeat(50)}`)
}

const handlePullRequest = async ({ github, context, body }) => {
  if (!context.issue.number) return
  return createOrUpdateComment({
    github,
    context,
    body,
    issueNumber: context.issue.number,
  })
}

const handlePush = async ({ github, context, body, output, commitUrl }) => {
  const pullRequests = await github.rest.pulls.list({
    ...context.repo,
    state: "open",
    head: `${context.repo.owner}:${context.ref.replace("refs/heads/", "")}`,
  })

  if (pullRequests.data.length > 0) {
    return createOrUpdateComment({
      github,
      context,
      body,
      issueNumber: pullRequests.data[0].number,
    })
  }

  console.log("No open pull request found for this push. Logging publish information to console:")
  logPublishInfo({ output, commitUrl })
}

export async function run(github, context) {
  const output = JSON.parse(readFileSync("output.json", "utf8"))
  const sha = context.eventName === "pull_request" ? context.payload.pull_request.head.sha : context.payload.after

  const { commitUrl } = generateUrls({
    sha,
    owner: context.repo.owner,
    repo: context.repo.repo,
  })

  const body = generateCommentBody({
    sha,
    owner: context.repo.owner,
    repo: context.repo.repo,
    commitUrl,
  })

  const handlers = {
    pull_request: () => handlePullRequest({ github, context, body }),
    push: () => handlePush({ github, context, body, output, commitUrl }),
  }

  const handler = handlers[context.eventName]
  if (handler) await handler()
}
