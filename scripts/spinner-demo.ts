// Name: [kit-utils demo] Spinner
// Exclude: false

import "@johnlindquist/kit"
import { refreshable } from "../src/refreshable"
import { SPINNER_VARIANTS, startSpinner } from "../src/spinners/spinner"
import type { SpinnerVariant } from "../src/spinners/spinner"

await refreshable(async ({ refresh, signal }) => {
  const variant: SpinnerVariant = await select(
    { placeholder: "Choose a Spinner Variant", multiple: false },
    Object.keys(SPINNER_VARIANTS),
  )

  const spinner = startSpinner(
    variant,
    { position: "center" },
    {
      onSubmit() {
        spinner.stop()
        refresh()
        return preventSubmit
      },
      width: 400,
    },
  )

  spinner.message = "Preparing..."

  for (let i = 0; i <= 20; i++) {
    await wait(150)
    if (signal.aborted) {
      spinner.stop()
      return
    }
    spinner.progress = i * 5

    if (i % 5 === 0) {
      spinner.message = `Working on step ${i / 5 + 1} / 4`
    }
  }

  spinner.stop()
  refresh()
})
