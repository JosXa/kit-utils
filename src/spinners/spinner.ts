import "@johnlindquist/kit"
import type { DivConfig } from "@johnlindquist/kit/types/kitapp"
import { circle } from "./variants"

export const SPINNER_VARIANTS = {
  circle,
} as const

export type SpinnerVariant = keyof typeof SPINNER_VARIANTS

type SpinnerOptions<T extends SpinnerVariant> = Parameters<(typeof SPINNER_VARIANTS)[T]>[0]
type DivOptions = Omit<DivConfig, "html" | "css">

export function spinner(
  variant: SpinnerVariant = "circle",
  spinnerOptions: SpinnerOptions<typeof variant> = {},
  divOptions: DivOptions = {},
) {
  const { html, css } = SPINNER_VARIANTS[variant](spinnerOptions)

  return div({
    html: `<div class='container'>${html}</div>`,
    css: `${css}\n.container { display: flex; place-items: center; justify-content: center; align-items: center; }`,
    ...divOptions,
  })
}
