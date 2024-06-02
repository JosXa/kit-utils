// noinspection JSUnusedLocalSymbols

import "@johnlindquist/kit"
import type { DivConfig } from "@johnlindquist/kit/types/kitapp"
import isRealError from "./helpers/isError"
import { markdownEscape } from "./helpers/markdown-escape"

const mdEscape = (val?: any): string => {
  if (val === undefined || val === null) {
    return ""
  }
  return markdownEscape(String(val), ["slashes"])
}

const codeBlockEscape = (val: string): string => val?.replaceAll(/(~~~|```)/g, "")

const stringifyOrRaw = <T>(val: T): string | T => {
  try {
    return JSON.stringify(val)
  } catch (_) {
    return String(val)
  }
}

type Options = {
  noDebugger?: boolean
  divConfig?: Omit<DivConfig, "html">
}

const buildErrorMarkdown = (err: Error | unknown, title?: string) => {
  const isError = isRealError(err)

  const titlePart = title ?? (isError ? `${err.name}: ${err.message}` : "Something bad happened")
  let bodyPart: string | undefined = undefined
  let stackPart: string | undefined = undefined

  // Check if error contains an HTTP response (Axios / Fetch)
  if (err instanceof Object && "response" in err) {
    let responseData: any
    let status: undefined | unknown = undefined
    let statusText: undefined | unknown = undefined

    if (err.response instanceof Object) {
      status = "status" in err.response ? err.response.status : undefined
      statusText = "statusText" in err.response ? err.response.statusText : undefined
      if ("data" in err.response) {
        responseData = stringifyOrRaw(err.response.data)
      }
    } else {
      responseData = stringifyOrRaw(err.response)
    }

    status ??= "status" in err ? err.status : undefined
    statusText ??= "statusText" in err ? err.statusText : undefined

    if (responseData) {
      bodyPart = `${mdEscape(status)}: ${mdEscape(statusText)}

**Response data**:\n~~~\n${codeBlockEscape(responseData)}\n~~~\n<br>\n`
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
      stackPart = `~~~\n${codeBlockEscape(stack)}\n~~~`
    }
  } else if (err) {
    stackPart = "~~~\n" + codeBlockEscape(typeof err === "object" ? JSON.stringify(err) : err.toString()) + "\n~~~"
  }

  if (stackPart && bodyPart) {
    // When both are present, prefix the stack with an identifier
    stackPart = `**Call Stack**:\n${stackPart}`
  }

  const msg = [] as string[]
  msg.push(`## ${mdEscape(titlePart)}<br>`)
  bodyPart && msg.push(bodyPart)
  stackPart && msg.push(stackPart)

  return msg.join("\n")
}

export async function showError(
  err: Error | unknown,
  title?: string,
  { divConfig, noDebugger = false }: Options = {},
): Promise<void> {
  const errorMd = buildErrorMarkdown(err, title)
  const promise = div({ html: md(errorMd), ...divConfig })

  if (!noDebugger) {
    queueMicrotask(() => {
      // You can inspect your error here
      const error = err
      const errorStringified = stringifyOrRaw(err)
      debugger
    })
  }

  await promise
}
