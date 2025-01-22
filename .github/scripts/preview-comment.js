import { readFileSync } from "node:fs"

const generateCommentBody = (output, commitUrl) => {
  return `### 🧪 CLI Preview Build.

Try this version:
\`\`\`sh
bun add -g ${output.packages[0].url ?? ""}
\`\`\`

[${output.packages[0].shasum ?? ""}](${commitUrl ?? ""})`
}

const BOT_COMMENT_IDENTIFIER = generateCommentBody().split(".")

const findBotComment = async (github, context, issueNumber) => {
  const comments = await github.rest.issues.listComments({
    ...context.repo,
    issue_number: issueNumber,
  })

  return comments.data.find((comment) => comment.body.includes(BOT_COMMENT_IDENTIFIER))
}

const createOrUpdateComment = async (github, context, body, issueNumber) => {
  const existingComment = await findBotComment(github, context, issueNumber)

  if (existingComment) {
    await github.rest.issues.updateComment({
      ...context.repo,
      comment_id: existingComment.id,
      body,
    })
  } else {
    await github.rest.issues.createComment({
      ...context.repo,
      issue_number: issueNumber,
      body,
    })
  }
}

const logPublishInfo = (output, commitUrl) => {
  console.log(`\n${"=".repeat(50)}`)
  console.log("Preview Information")
  console.log("=".repeat(50))
  console.log("\nCLI Preview Ready:")
  console.log(`- ${output.packages[0].url}`)
  console.log(`\nCommit URL: ${commitUrl}`)
  console.log(`\n${"=".repeat(50)}`)
}

export async function run(github, context) {
  const output = JSON.parse(readFileSync("output.json", "utf8"))
  const sha = context.eventName === "pull_request" ? context.payload.pull_request.head.sha : context.payload.after
  const commitUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${sha}`
  const body = generateCommentBody(output, sha, commitUrl)

  if (context.eventName === "pull_request" && context.issue.number) {
    await createOrUpdateComment(github, context, body, context.issue.number)
  } else if (context.eventName === "push") {
    const pullRequests = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: "open",
      head: `${context.repo.owner}:${context.ref.replace("refs/heads/", "")}`,
    })

    if (pullRequests.data.length > 0) {
      await createOrUpdateComment(github, context, body, pullRequests.data[0].number)
    } else {
      console.log("No open pull request found for this push. Logging publish information to console:")
      logPublishInfo(output, commitUrl)
    }
  }
}
