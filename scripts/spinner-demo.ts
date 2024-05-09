// Name: [kit-utils demo] Spinner
// Exclude: false

import "@johnlindquist/kit"
import { spinner } from "../src/spinners/spinner"

spinner()

for (let i = 0; i <= 20; i++) {
  await wait(300)
  setProgress(i * 5)
}
