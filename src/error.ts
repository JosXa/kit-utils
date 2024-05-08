// TODO: Escape markdown
import "@johnlindquist/kit"
import { isAxiosError } from "axios"
import isError from "./helpers/isError"

export async function error(err: any, title?: string): Promise<void> {
  const msg = [] as string[]

  title && msg.push(`## ${title}`)

  if (isError(err)) {
    !title && msg.push(`## ${err.name}: ${err.message}<br>`)

    // TODO: What actually is the cause and should we print it?
    // err.cause && msg.push(`_${err.cause}_<br>`)

    if (isAxiosError(err)) {
      if (err.response) {
        msg.push(`${err.response.status}: ${err.response.statusText}<br>`)
        msg.push(`${err.response.data}<br>`)
      }
    } else {
    }

    if (err.stack) {
      let stack: string

      if (title) {
        stack = err.stack
      } else {
        // Remove first line as it is just `${err.name}: ${err.message}`
        const [_, ...stackParts] = err.stack.split("\n")
        stack = stackParts.join("\n")
      }
      msg.push("```\n" + stack + "\n```")
    }
  } else {
    !title && msg.push(`## Something bad happened`)
    msg.push(`\`\`\`${typeof err === "object" ? JSON.stringify(err) : err}\`\`\``)
  }

  await div({ html: md(msg.join("\n")) })
}
