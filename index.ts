// biome-ignore lint/performance/noBarrelFile: Library entrypoint
export { crudArg } from "./src/crud-arg"
export { refreshable } from "./src/refreshable"
export { withCRUDCache } from "./src/with-crud-cache"
export { error } from "./src/error"
export { startSpinner, SPINNER_VARIANTS } from "./src/spinners/spinner"
export type { SpinnerVariant } from "./src/spinners/spinner"

import "@johnlindquist/kit"

// noinspection ES6ConvertVarToLetConst
declare global {
  var ctrl: "cmd" | "ctrl"
}

global.ctrl = cmd as "cmd" | "ctrl"
