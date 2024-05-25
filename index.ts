// biome-ignore lint/performance/noBarrelFile: Library entrypoint
export { crudArg } from "./src/crud-arg"
export { refreshable } from "./src/refreshable"
import getAllScriptPaths from "./src/getAllScriptPaths"
export { getAllScriptPaths }
export { withCRUDCache } from "./src/with-crud-cache"
export { error } from "./src/error"
export { startSpinner, SPINNER_VARIANTS } from "./src/spinners/spinner"
export type { SpinnerVariant } from "./src/spinners/spinner"
import promptConfirm from "./src/promptConfirm"
export { promptConfirm }

import "@johnlindquist/kit"

// noinspection ES6ConvertVarToLetConst
declare global {
  var ctrl: "cmd" | "ctrl"
}

global.ctrl = cmd as "cmd" | "ctrl"
