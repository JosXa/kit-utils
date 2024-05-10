import "@johnlindquist/kit"
import { isAxiosError } from "axios"
import mdEscape from "markdown-escape"
import isRealError from "./helpers/isError"

export async function error(err: unknown, title?: string): Promise<void> {
  const isError = isRealError(err)

  const titlePart = title ?? (isError ? `${err.name}: ${err.message}` : "Something bad happened")
  let bodyPart: string | undefined = undefined
  let stackPart: string | undefined = undefined

  // Determine body
  if (isAxiosError(err)) {
    if (err.response) {
      let responseData: any
      try {
        responseData = JSON.stringify(err.response.data)
      } catch {
        responseData = err.response.data
      }
      bodyPart = `${err.response.status}: ${err.response.statusText}<br>Response body: ${responseData}`
    }
  }

  // TODO: What actually is the cause and should we print it?
  // err.cause && msg.push(`_${err.cause}_<br>`)

  // Determine stack
  if (isError) {
    if (err.stack) {
      let stack: string

      if (title || !isError) {
        stack = err.stack
      } else {
        // Remove first line as it is just `${err.name}: ${err.message}`
        const [_, ...stackParts] = err.stack.split("\n")
        stack = stackParts.join("\n")
      }
      // biome-ignore lint/style/useTemplate: Makes no sense
      stackPart = "```\n" + mdEscape(stack) + "\n```"
    }
  } else if (err) {
    // biome-ignore lint/style/useTemplate: Makes no sense
    stackPart = "```\n" + mdEscape(typeof err === "object" ? JSON.stringify(err) : err.toString()) + "\n```"
  }

  const msg = [] as string[]
  msg.push(`## ${mdEscape(titlePart)}<br>`)
  bodyPart && msg.push(`${mdEscape(bodyPart)}`)
  stackPart && msg.push(stackPart)

  await div({ html: md(msg.join("\n")) })
}
