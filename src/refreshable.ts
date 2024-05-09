import "@johnlindquist/kit"
import type { PromptConfig } from "@johnlindquist/kit"

declare global {
  // noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
  var __currentPromptConfig: PromptConfig
}

export const FORCE_REFRESH: unique symbol = Symbol.for("force-refresh")

/**
 * Repeats the given {@link prompt} callback when its `refresh` argument is called.
 *
 * This is useful when you have actions on your prompt that require you to reload the available choices, such as
 * deleting a choice, reloading the choices from some source, or in any other circumstances where reloading the
 * prompt is necessary.
 *
 * @example
 * ```ts
 * await refreshable(async (refresh) => {
 *   const res = await fetch('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5')
 *   const items = await res.json()
 *
 *   return arg(
 *     {
 *       name: 'You can get new data using Ctrl+N',
 *       actions: [{
 *         name: 'Refresh',
 *         onAction() {
 *           refresh()
 *         },
 *         shortcut: 'ctrl+n',
 *         flag: 'refresh',
 *         visible: true
 *       }],
 *     },
 *     items.map((x) => ({ name: x.toString(), value: x })),
 *   )
 * })
 * ```
 *
 * @param prompt A callback accepting loop control functions and an abort signal
 * @param refreshHint The hint to show while refreshing
 */
export async function refreshable<T>(
  prompt: (controls: {
    refresh: () => typeof FORCE_REFRESH
    resolve: (value: T) => void
    signal: AbortSignal
  }) => T | Promise<T>,
  refreshHint?: string,
): Promise<T> {
  while (true) {
    let userDefinedHint: string | undefined = undefined

    const abortController = new AbortController()

    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: Wrapped in try/catch and reject(err)
    const result = await new Promise<T | typeof FORCE_REFRESH>(async (resolve, reject) => {
      try {
        const refresh = (): typeof FORCE_REFRESH => {
          abortController.abort("Refreshing")
          refreshHint && setHint(refreshHint)
          setFlagValue(undefined) // Clears the actions sidebar, if any
          resolve(FORCE_REFRESH)
          return FORCE_REFRESH
        }

        // Start the prompt without awaiting it
        const promise = prompt({ refresh, resolve, signal: abortController.signal })

        // Use the chance to grab the user-defined hint
        const promptConfig = global.__currentPromptConfig
        userDefinedHint = promptConfig.hint

        // Finally await the user's prompt
        resolve(await promise)
      } catch (err) {
        reject(err)
      }
    })

    if (result === FORCE_REFRESH) {
      refreshHint && userDefinedHint && setHint(userDefinedHint)
      continue
    }

    return result
  }
}

/**
 * An alias of {@link refreshable}
 */
export const loop = refreshable
