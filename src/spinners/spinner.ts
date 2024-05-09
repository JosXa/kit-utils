import "@johnlindquist/kit"
import type { DivConfig } from "@johnlindquist/kit/types/kitapp"
import { circle, dots, spaceX } from "./variants"

export const SPINNER_VARIANTS = {
  dots,
  spaceX,
  circle,
} as const

export type SpinnerVariant = keyof typeof SPINNER_VARIANTS

type SpinnerOptions<T extends SpinnerVariant> = {
  position?: "left" | "center" | "right"
  initialMessage?: string
} & Parameters<(typeof SPINNER_VARIANTS)[T]>[0]
type DivOptions = Omit<DivConfig, "html" | "css">

type Percent = number

type SpinnerControls = {
  set progress(value: Percent)
  set message(value: string)
  stop: () => unknown
}

export function startSpinner<T extends SpinnerVariant>(
  variant: T,
  spinnerOptions: SpinnerOptions<T> = {},
  divOptions: DivOptions = {},
): SpinnerControls {
  const { position = "center", initialMessage, ...variantOptions } = spinnerOptions

  let message = initialMessage
  let progress: null | Percent = null

  const { html, css } = SPINNER_VARIANTS[variant](variantOptions)

  const alignment = (() => {
    switch (position) {
      case "left":
        return "flex-start"
      case "center":
        return "center"
      case "right":
        return "flex-end"
    }
  })()

  div({
    html: `<div class='container'>${html.trim()}</div>`,
    css: `${css.trim()}
.container { 
  display: flex;
  justify-content: ${alignment};
  place-items: ${alignment}; 
  align-content: ${alignment};
  padding: 1.5em;
}`,
    ...divOptions,
  })

  const updateProgressInfo = () => {
    const parts: string[] = []
    if (progress !== null) {
      parts.push(`${progress}%`)
    }
    if (message) {
      parts.push(message)
    }

    setFooter(parts.join(" — "))
  }

  return {
    set progress(value: Percent) {
      progress = value
      setProgress(value)
      updateProgressInfo()
    },
    set message(value: string) {
      message = value
      updateProgressInfo()
    },
    stop() {
      setProgress(0)
    },
  }
}
