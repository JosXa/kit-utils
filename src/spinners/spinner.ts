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

type DivOptions = Omit<DivConfig, "html"> & { html?: string }

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
  const { html: userHtml, css: userCSS, ...userDivOptions } = divOptions

  const { position = "center", initialMessage, ...variantOptions } = spinnerOptions

  let message = initialMessage
  let progress: null | Percent = null

  const { html: spinnerHtml, css: spinnerCss } = SPINNER_VARIANTS[variant](variantOptions)

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

  const buildHtml = () => {
    const elements = [`<div>${spinnerHtml.trim()}</div>`]

    if (userHtml) {
      elements.push(userHtml)
    }

    return `<div class="container">${elements.join("\n")}</div>`
  }

  const divArgs: DivConfig = {
    html: buildHtml(),
    css: `${spinnerCss.trim()}
.container { 
  display: flex;
  flex-direction: column;
  justify-content: ${alignment};
  place-items: ${alignment}; 
  padding: 1.5em;
  padding-bottom: 1em;
}

/* Best way I found to target the footer text's container where we show progress */
/* 2.9.x */
slot>div:has(.truncate) {
  justify-content: center;
}

/* 2.3.x */
#footer>div>div:has(.truncate) {
  justify-content: center !important;
}

${userCSS ?? ""}`,
    ignoreBlur: true,
    ...userDivOptions,
  }

  div(divArgs)

  const updateProgressInfo = () =>
    queueMicrotask(() => {
      setPanel(buildHtml())
      message && setName(message)
      progress !== null && setFooter(`${progress}%`)
    })

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
