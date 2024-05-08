import "@johnlindquist/kit"
import { PromptConfig } from "@johnlindquist/kit"

declare global {
  // noinspection ES6ConvertVarToLetConst
  var __currentPromptConfig: PromptConfig
}

export const FORCE_REFRESH: unique symbol = Symbol.for("force-refresh")

/**
 * @summary Repeats the given {@link prompt} callback when its `refresh` argument is called.
 *
 * @hint This is useful when you have actions on your prompt that require you to reload the available choices, such as
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
 * @param prompt An async callback accepting a `refresh` function to execute your prompt
 * @param hint The hint to show while refreshing
 */
export async function refreshable<T>(
  prompt: (refresh: () => typeof FORCE_REFRESH, resolve: (value: T) => void) => T | Promise<T>,
  hint: string | undefined = "Refreshing...",
): Promise<T> {
  while (true) {
    let userDefinedHint: string | undefined = undefined

    const result = await new Promise<T | typeof FORCE_REFRESH>(async (resolve) => {
      const refresh = (): typeof FORCE_REFRESH => {
        hint && setHint(hint)
        setFlagValue(undefined) // Clears the actions sidebar, if any
        resolve(FORCE_REFRESH)
        return FORCE_REFRESH
      }

      // Start the prompt without awaiting it
      const promise = prompt(refresh, resolve)

      // Use the chance to grab the user-defined hint
      const promptConfig = global.__currentPromptConfig
      userDefinedHint = promptConfig.hint

      // Finally await the user's prompt
      resolve(await promise)
    })

    if (result === FORCE_REFRESH) {
      hint && setHint(userDefinedHint ?? "")
      continue
    }

    return result
  }
}
